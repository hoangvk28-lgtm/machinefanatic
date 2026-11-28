# Playbook: batch content writing with AI sub-agents (portable)

Rules proven on MachineFanatic rounds 1 to 57 (2026-11). Copy this file into another project and paste the "CLAUDE.md block" at the end into that project's CLAUDE.md. Replace the bracketed names with that project's files.

## 1. Who does what
- **Coordinator (main session):** picks topics, dedupes, runs the zero-token data scripts, spawns writers, registers and builds, commits, pushes only after the owner approves.
- **Writers (sub-agents):** cheapest capable model (Sonnet). They read one lean brief, write one spec per topic, run one check script, fix and stop. They never register, build, commit or push.

## 2. Before any writer starts (zero AI tokens)
1. `git pull` so another machine's finished topics are not written twice.
2. Near-duplicate check of every candidate against what is already published: a normalized key (drop the prefix, singularize, drop stop words, split digit+unit, sort words) plus a manual pass for synonyms (small/mini/compact, quiet/quietest, large/big) and word-order twins. Never add a topic that targets the keyword of a live page.
3. Fetch the source data and compact it, then a prefilter script that skips topics with too few real items (MachineFanatic: fewer than 3 real on-topic products). The coordinator skips weak topics; a writer discovering it costs ~40k tokens.
4. Research once per topic cluster into `docs/research/<cluster>.md`; later topics in the cluster reuse it with no web search.

## 3. Agent split
| Topics in the round | Writers |
|---|---|
| up to 25 | 1 agent |
| 26 to 50 | 2 agents in parallel, about 25 each |
| over 50 | waves of 2 agents, about 25 each |
- Never 3+ agents at once, never agents of 5 to 10 topics: each startup costs ~10 to 15k tokens.
- Split by cluster, not alphabetically. Sibling topics of one product (price caps, sizes, qualifiers) stay with one agent so lineups and sentences stay distinct.
- Each agent writes skips to its own file (skip-a / skip-b) so they never edit the same file.
- Resume a writer that stopped early with a message while its context is small (under ~150k). Once it reports a very large context, hand the remaining list to a fresh agent and paste the previous writer's lessons into its prompt.

## 4. The lean brief (the biggest saving)
- One short file holds every rule a writer needs. Writers read only that file, not the project's CLAUDE.md or long runbooks.
- Give **per-section word budgets that sum to about 10% above the minimum length**. MachineFanatic's brief once summed to ~2,700 words against a 3,000 floor, so every article needed 6 to 10 padding edits; that alone roughly doubled the cost per article.
- Give a **tool-call budget**: summaries of a whole cluster in one read, ONE Write, ONE check, at most ONE combined fix edit (~5 calls per article). No re-reading research or a spec just written.
- List the check script's common failures up front so the first draft avoids them.
- One command for the writer to run after writing (fill data, self-check, build, audit) that prints only short FIX lines.

## 5. Writer prompt template
```
You are the writer for <project> round <N>. cd to the repo root before any script.
Read ONLY <lean brief>. Your list, in order: <list file> (<count> topics, grouped by cluster).
Per topic: read the summary (<summary script> for the whole cluster at once), reuse <research files>, NO web search,
write the spec in ONE Write following the word budgets, run <finish script> once, at most one combined fix Edit.
Skip a topic with fewer than <min> real on-topic items: append "<slug>: <reason>" to <skip file>.
Lessons from earlier writers: <paste>.
Do NOT register, build or use git. Your context is summarized automatically, so do not stop because of token count.
Final report: finished, skipped with reasons, remaining.
```

## 6. Finish (coordinator)
Register, mark done and skips, run the audit, run the duplicate check again (slugs and product lineups between siblings), type check, build (grep for real success lines, not the exit code), write the log entry, commit locally, show preview links, push only after approval.

## 7. Measuring cost honestly
An agent's raw token total includes cached context re-reads, which are billed at about a tenth of the price. Report tool calls per article and words per first draft next to the raw total, not just "tokens per article".

## CLAUDE.md block (paste into another project)
```
## Rule: AI writer batches
- Writers are Sonnet sub-agents. Max ~25 articles per agent; 26-50 = 2 agents in parallel; >50 = waves of 2. Never 3+ at once or agents of 5-10 articles.
- Split by topic cluster; sibling topics of one product stay with one agent. Separate skip files per agent.
- Coordinator does dedupe vs published, data fetch, prefilter and research per cluster BEFORE spawning writers; writers never register, build or git.
- Writers read only the lean brief. It must carry per-section word budgets summing to ~10% above the minimum length and a ~5-tool-calls-per-article budget.
- Resume a stopped writer while its context is under ~150k; otherwise hand the rest to a fresh agent with the lessons pasted in.
- Push only after the owner approves the local preview.
```
