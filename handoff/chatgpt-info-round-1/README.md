# ChatGPT handoff pack, info round 1 (10 articles)

## What to give ChatGPT

Paste `00-PROMPT.txt` as the message, and attach these three files:

| Attach | Why |
|---|---|
| `01-BRIEF.md` | Rules, voice, file format, image rules, internal linking, self-check |
| `02-TOPICS.md` | The 10 slugs, keywords and the verified real URLs each may link to |
| `03-EXAMPLE-ARTICLE.ts` | A finished article from the site, the quality floor for depth and tone. Format reference only, the writer delivers HTML |

Use a model with web browsing on, or the research step cannot happen. 10 articles of 3,000 words will not fit in one reply, so the prompt tells it to finish the article it is on, print `PAUSED AFTER ARTICLE N`, and wait for `continue from article N+1`. Never let it shorten an article to fit.

## What comes back per article

1. A `<slug>.html` code block: a `<!--meta ... -->` block followed by the article body. Plain HTML, so it is readable as-is and the writer cannot break the TypeScript.
2. An image manifest table: filename, image or File page URL, source page URL, author, license, platform.
3. A four-line delivery report.

## Intake, on our side

```bash
cd /home/admin1/Downloads/AGENT/projects/machinefanatic

# 1. save the two blocks it returned
#    -> handoff/chatgpt-info-round-1/in/<slug>.html
#    -> handoff/chatgpt-info-round-1/in/<slug>-images.tsv

# 2. fetch the photos
node scripts/info/fetch-images.mjs handoff/chatgpt-info-round-1/in/<slug>-images.tsv
#    resolves Commons File pages, downloads, resizes to 1400px, writes webp into
#    public/images/articles/, and prints each photo's real width and height

# 3. build the TypeScript module from the HTML
node scripts/info/build-article.mjs handoff/chatgpt-info-round-1/in/<slug>.html \
                                     handoff/chatgpt-info-round-1/in/<slug>-images.tsv
#    writes data/legacy/<slug>.ts, escapes backticks and ${, fills imageCredits and
#    relatedLinks, and prints the word count and meta lengths

# 4. register the article
#    add to data/legacy-registry.ts:  "<slug>": () => import("./legacy/<slug>"),

# 4. validate
node scripts/info/check-links.mjs <slug>        # must print PASS

# 5. add the reverse links from the money pages down to the article
node scripts/info/link-back.mjs <slug>

# 6. build
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=6144 npx next build   # grep "Compiled successfully" and "Finished TypeScript"
```

`check-links.mjs` catches what ChatGPT gets wrong most often: dead internal links, missing image files, en and em dashes, dollar figures, testing claims, metaTitle and metaDescription length, duplicate H2 ids, a missing FAQ or bottom line, word count under 2,800, and a missing registry entry. Run it before you read the prose, so the prose review is the only thing left to do by hand.

Do not push to `main` until the 10 are reviewed. Branch `info-round-1`.
