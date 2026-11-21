# Deconstruct

A Claude skill for learning how apps, websites and games work by taking one feature apart: gather evidence from
what the product actually does, explain the mechanism with that evidence and its unknowns, rebuild a small
grey-box study of it, check the study against the original, then turn the lesson into an original design.

It follows the evidence-first method of [REA](https://github.com/morluto/rea) and can use REA's tools, but works
without them. It does not make clones: the rebuild is a study with placeholder art, and the design you keep has to
move away from the source.

- `SKILL.md`: the steps and the rules
- `references/routes.md`: where evidence comes from, per kind of target
- `references/tools.md`: the capture script, REA, other tools
- `scripts/capture_web.mjs`: one-pass capture of a public web page (screens, network, scripts, storage keys)
- `templates/report.md`: the report layout
