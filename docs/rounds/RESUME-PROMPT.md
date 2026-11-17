# Paste this into a new session at 7:00 PM (2026-11-17) to continue rounds 42 and 43

Read CLAUDE.md and the last "RESUME (2026-11-17, afternoon)" section of docs/rounds/NEXT-ROUNDS-BRIEF.md. Checkout main and git pull.

Do NOT re-run Stage A: the .compact.json files for rounds 42 and 43 already exist in scripts/clone/work/ on this machine.

1. List the unfinished slugs first:
   for s in $(cat scripts/clone/work/r4243.live.txt); do [ -f data/guides/$s.ts ] || grep -q "^$s:" scripts/clone/skip-?.txt || echo $s; done
2. Hand ONLY those unfinished slugs to ONE new Sonnet writer agent, using the writer prompt from the RESUME section (lean brief only, one spec per Write, selfcheck, finish.mjs, no generators or scripts, no padding, 3 real machines is enough, budget approved, do not stop early).
3. When it finishes, run the Finish steps from NEXT-ROUNDS-BRIEF.md: register-dynamic-guide, register-new-guides (needs ~/.nvm/versions/node/v22.23.3/bin/node), mark done + mark writer skips, audit-guides, grep for 【, both duplicate checks (top 4-word description opening must be <= 5; if higher, one Sonnet fix agent editing spec.json then finish.mjs), tsc --noEmit, next build, clone-log entry for rounds 42 and 43, local commit of data/, docs/, scripts/clone/source-index.json and the .spec.json files.
4. Give me preview links on npx next dev -p 3005. Do NOT push to main or ping IndexNow before I approve.

Note: background agents die with the session, but finished guide files are kept, so only unfinished slugs need redoing.
