# Routes: where the evidence comes from

Cheapest first. Stop at the first route that answers the question.

| Target | Route | What you get |
|---|---|---|
| Anything | Docs, changelogs, engineering blogs, conference talks (GDC, Strange Loop), patents, postmortems | The intended design, often with numbers. Cite links. |
| Anything you can use | Observe: screen-record, count frames, time it, vary one input at a time | Behaviour, feel, timing curves, edge cases |
| Web app / site | `node scripts/capture_web.mjs <url> <out>`; browser devtools (Network, Performance, Sources with source maps, Application storage) | Requests and responses your browser makes, bundles, storage, render cost |
| Open source | Clone, run, read; `git log -S` on the feature's strings | The real code. Respect the licence. |
| Electron / desktop JS | Extract `app.asar` (`npx @electron/asar extract app.asar out/`), read `package.json` main, preload and IPC | Renderer to main process flow |
| Android | APK resources and manifest (`aapt dump`, `apktool d`), `jadx` for Java/Kotlin | Screens, permissions, flows |
| Game you own | Play with a frame counter; mod docs and community wikis; the game's own data files when the game ships them readable (JSON, Lua, CSV, Unity/Godot exported settings) | Tuning numbers, state machines, spawn tables |
| Native binary you're allowed to inspect | Ghidra / Hopper / IDA, or REA (`references/tools.md`) | Functions, constants, call graphs |
| Hardware | Datasheets, FCC filings, teardown photos, a multimeter or logic analyser on your own unit | Parts, signals, timing |

Rules for every route:
- Write down where each fact came from as you get it (URL, file path inside the package, timestamp in a recording).
- Prefer behaviour you measured over code you read when they disagree: the code may be dead.
- Never cross a protection layer (see "What's fair game" in SKILL.md).

## Game feel recipe (common ask)
For "why does movement / combat / a menu feel good": record at 60 fps or more, step frame by frame, and measure
startup, active and recovery frames; acceleration and deceleration curves (position per frame); input buffer
window; coyote time; camera lag; hit-stop length; screen shake amplitude and decay. Put each in the evidence table
with the frame range it came from. Rebuild with a grey capsule on a grey floor and match the curves.

## App flow recipe
For "how does onboarding / checkout / a feed work": map every screen and state as a table (state, what's shown,
what each action does, what's stored or sent). Then find the rule that picks what's next (ordering, ranking,
timing) and test it by varying one input.
