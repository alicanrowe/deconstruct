#!/usr/bin/env node
// One-pass evidence capture of a public web page for the deconstruct skill.
// usage: node capture_web.mjs <url> <out_dir> [--wait 3000]
// Writes: desktop.png, phone.png, network.json, assets.json, summary.json (storage/cookie NAMES only, never values).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

// require() honours NODE_PATH and global installs, unlike a bare ESM import
const { chromium } = createRequire(import.meta.url)('playwright');

const [url, out, ...rest] = process.argv.slice(2);
if (!url || !out) {
  console.error('usage: node capture_web.mjs <url> <out_dir> [--wait 3000]');
  process.exit(2);
}
const wi = rest.indexOf('--wait');
const wait = wi >= 0 ? Number(rest[wi + 1]) : 3000;
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

async function pass(name, viewport, isMobile) {
  const ctx = await browser.newContext({ viewport, isMobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const reqs = [];
  const t0 = Date.now();
  page.on('requestfinished', async (r) => {
    const res = await r.response();
    const timing = r.timing();
    let size = null;
    try { size = (await r.sizes()).responseBodySize; } catch {}
    reqs.push({
      method: r.method(), url: r.url(), type: r.resourceType(),
      status: res ? res.status() : null, size,
      started_ms: Math.round(timing.startTime - t0) > 0 ? Math.round(timing.startTime - t0) : null,
      duration_ms: timing.responseEnd >= 0 ? Math.round(timing.responseEnd) : null,
    });
  });
  page.on('requestfailed', (r) => reqs.push({ method: r.method(), url: r.url(), type: r.resourceType(), failed: r.failure()?.errorText }));
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(wait);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
  const info = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const keys = (s) => { try { return Object.keys(s); } catch { return []; } };
    return {
      title: document.title,
      dom_nodes: document.getElementsByTagName('*').length,
      scripts: [...document.scripts].map((s) => s.src || `(inline, ${s.textContent.length} chars)`),
      stylesheets: [...document.styleSheets].map((s) => s.href || '(inline)'),
      local_storage_keys: keys(localStorage),
      session_storage_keys: keys(sessionStorage),
      frameworks: {
        react: !!document.querySelector('[data-reactroot], #__next') || !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
        next: !!window.__NEXT_DATA__, nuxt: !!window.__NUXT__, vue: !!window.__VUE__,
        svelte: !!document.querySelector('[class*="svelte-"]'), three: !!window.THREE,
      },
      timing_ms: nav ? {
        dom_content_loaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd),
        transfer_bytes: nav.transferSize,
      } : null,
    };
  });
  const cookies = (await ctx.cookies()).map((c) => ({ name: c.name, domain: c.domain }));
  await ctx.close();
  return { reqs, info, cookies };
}

const desk = await pass('desktop', { width: 1440, height: 900 }, false);
const phone = await pass('phone', { width: 390, height: 844 }, true);
await browser.close();

fs.writeFileSync(path.join(out, 'network.json'), JSON.stringify({ desktop: desk.reqs, phone: phone.reqs }, null, 1));
const byType = {};
for (const r of desk.reqs) {
  const t = (byType[r.type] ||= { count: 0, bytes: 0 });
  t.count++; t.bytes += r.size || 0;
}
const hosts = [...new Set(desk.reqs.map((r) => { try { return new URL(r.url).host; } catch { return '?'; } }))];
fs.writeFileSync(path.join(out, 'assets.json'), JSON.stringify({ scripts: desk.info.scripts, stylesheets: desk.info.stylesheets }, null, 1));
const summary = {
  url, captured_at: new Date().toISOString(),
  ...desk.info, scripts: desk.info.scripts.length, stylesheets: desk.info.stylesheets.length,
  cookie_names: desk.cookies, requests_by_type: byType, hosts,
  phone_dom_nodes: phone.info.dom_nodes, phone_requests: phone.reqs.length,
};
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(summary, null, 1));
console.log(JSON.stringify({ out, requests: desk.reqs.length, hosts: hosts.length, dom_nodes: desk.info.dom_nodes, timing_ms: desk.info.timing_ms }));
