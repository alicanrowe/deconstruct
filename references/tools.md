# Tools

## Built in (no install)
- `scripts/capture_web.mjs`: one-pass capture of a public web page with Playwright: full-page screenshots at
  phone and desktop widths, every network request (method, URL, status, type, size, timing), the scripts and
  stylesheets loaded, localStorage/sessionStorage key names (not values), cookie names (not values), DOM node
  count and a timing summary. Usage: `node scripts/capture_web.mjs <url> <out_dir> [--wait 3000]`.
  In a Claude cloud container Playwright and Chromium are already installed; elsewhere `npm i playwright` and
  `npx playwright install chromium` once.
- Browser devtools for anything interactive: Performance panel for frame cost, Sources with source maps for
  readable code, Event Listeners for what a click triggers.

## REA (optional, for binaries and packaged apps)
github.com/morluto/rea, MIT, npm package `rea-agents`. An MCP server plus CLI that inspects native binaries,
Electron/JavaScript apps, .NET assemblies, APKs and web pages, and returns evidence records with their limits
and unknowns. Get it only from the official repo, rea.tools or the `rea-agents` npm package.

- Agent setup: `npx rea-agents setup` from a trusted folder outside the target, then restart the agent.
- No setup, JavaScript or Electron tree: `npx -y rea-agents@latest analyze-javascript-application /abs/path --json`
- Native analysis needs an engine you already have (Ghidra, Hopper, IDA).
- Its evidence IDs go straight into the report's evidence table.

## Other common tools
`@electron/asar` (extract), `apktool` and `jadx` (Android), Ghidra (native), `ffmpeg -i clip.mp4 -vf
"select=between(n\,100\,160)" -vsync 0 f%03d.png` (frame-step a recording), `mitmproxy` for your own app's
traffic on your own device.
