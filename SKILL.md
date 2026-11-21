---
name: deconstruct
description: Use when someone wants to learn how an existing app, website, game, plugin or device feature works by taking it apart. Picks one feature, gathers evidence from what the product actually does and ships, explains the mechanism with that evidence and its unknowns, rebuilds a small working study of the mechanism, checks it against the original, then turns the lesson into an original design. Never produces a clone of a specific existing game or app.
---

# Deconstruct

Learn how great products work the way you learn a watch: open it, find the gears that do the job, then put a
small version back together and see if it ticks the same way. The rebuild is what proves you understood it.
Reading alone gives you a story; a working copy that matches the original's behaviour gives you knowledge.

The method comes from software reverse engineering (evidence first, every claim tied to something you saw, the
unknowns written down, the reconstruction tested against the original). It works on anything with behaviour:
apps, web pages, games, browser extensions, desktop tools, hardware you can poke.

How it differs from neighbours:
- **teardown** (the built-in skill) builds an animated 3D take-apart of a *physical machine* for show. Use it for
  engines, gear trains, linkages. Use this skill for *software and interaction*: how a feature behaves and why.
- **REA** (github.com/morluto/rea, MIT) is a tool suite (MCP server + CLI) for binary, Electron, Android and web
  inspection. This skill is the method around it and works without it; when REA is installed, use its tools for
  the evidence step (see `references/tools.md`).

## The output
One folder per target, `deconstruct-<target>-<feature>/`:
1. `REPORT.md` from `templates/report.md`: the question, the feature map, how it works, an evidence table, unknowns,
   what to take and what to leave.
2. `study/`: the smallest working rebuild of the *mechanism*, with placeholder art and neutral names.
3. `CHECK.md`: the side-by-side cases that show the study behaves like the original (and where it doesn't).
4. `ORIGINAL.md`: the design that comes out of it, pushed away from the source on purpose (step 7).

## Steps
1. **Name one feature and one question.** "How does the feed decide what's next", "how does the dash feel so
   snappy", "how does search stay instant offline". Not "how does the whole app work". Write the question at the
   top of the report. If the person names only a product, ask which part made them want to look, or pick the one
   that's most distinctive and say so.
2. **Check you may look.** See "What's fair game" below. Note in the report what the target is and why it's fair.
3. **Route the target.** Pick the cheapest evidence source that can answer the question
   (`references/routes.md`): published docs, talks and patents first, then observed behaviour, then what the
   client ships (web bundles, source maps, Electron `app.asar`, APK resources, game data files), then binaries.
4. **Gather evidence.** Observe before you read code. Record inputs and outputs: what you did, what happened,
   timings, network calls, stored state. For web targets run `node scripts/capture_web.mjs <url> <out_dir>` to
   save screenshots, the network log, loaded scripts, storage keys and DOM size in one pass. Measure with numbers
   (ms, px, frames, counts), not adjectives. Each fact gets an ID (E1, E2...) in the evidence table with where it
   came from.
5. **Explain the mechanism.** Write how it works as a chain: input, state, rule, output. Every link cites
   evidence IDs. What you inferred but didn't see goes in Unknowns with how you'd confirm it. Draw the data flow
   or state machine when it has more than three parts (use the owner's brand theme for any visual, when they have one).
6. **Rebuild a study and check it.** Build the smallest thing that reproduces the mechanism: one HTML page, one
   script, one scene. Grey boxes, placeholder names, your own code. Then test it against the original with the
   same inputs (`CHECK.md`): same timing curve, same ordering, same edge cases. When it disagrees, the explanation
   is wrong somewhere; go back to step 4. Stop when the cases match or the remaining gap is listed as an unknown.
7. **Make it yours.** Write `ORIGINAL.md`: the principle you learned in one sentence, then a design that uses it
   for a different purpose, look, theme and name. Change at least the setting, the art direction and the core
   fantasy or use case; keep only the principle. Run the owner's taste guide over it (the design-taste skill, when there is one) before showing anything.
8. **Report.** Lead with the answer to the question, then the evidence that proves it, then the study link.

## What's fair game
- **Yes:** your own apps and builds; open-source code (respect its licence; credit it if you reuse code);
  public web pages and the code they send to your own browser; apps and games you own, observed by using them;
  published docs, talks, papers, patents, postmortems, modding docs and the developers' own write-ups.
- **No:** breaking DRM, encryption, anti-cheat, licence checks, paywalls or logins; using anyone's credentials but
  your own; hammering or scraping servers beyond normal use; touching live multiplayer or other players; pulling
  API keys, secrets or other people's data out of a client; reversing something whose terms you agreed forbid it
  when the law doesn't allow it anyway. When unsure, stay with observed behaviour and public sources.
- **Never ship a clone.** No copying a specific game's or app's name, characters, art, music, levels, text, UI
  look or code. The study uses grey boxes and stays a study. The thing you build to keep is `ORIGINAL.md`'s design.

## Excuses that don't count
| The excuse | What to do instead |
|---|---|
| "I know how this works already, I'll write it up" | Then the evidence table fills fast. Every claim still gets an ID. |
| "The study looks right" | Looking right isn't matching. Run the same inputs through both and compare numbers. |
| "I'll skip the rebuild, the explanation is clear" | The rebuild is the test of the explanation. Build the smallest one. |
| "It's only a study, real art makes it nicer" | Real art makes it a clone. Grey boxes and placeholder names. |
| "Closer to the original is a better tribute" | Keep the principle, change the rest. Step 7 is not optional. |
| "The data is right there in the client, may as well read it" | Secrets, keys and other people's data stay untouched. Note that they exist, move on. |
| "The whole app is the question" | Pick one feature. A second feature gets its own folder. |
| "REA isn't installed so I can't do this" | Observation and shipped web code answer most questions. Use `references/routes.md`. |

## Keep this skill improving
When a deconstruction teaches a lesson (a route that worked, a trap, a check that caught a wrong explanation),
add it dated to `references/lessons.md`, add a row to the excuses table when a shortcut caused a miss, and publish
with the skills publish script. No private data and no names of private targets.
