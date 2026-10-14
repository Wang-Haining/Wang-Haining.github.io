# Who wrote this? A free stylometry lab (runs in your browser)

A free, self-paced lab in four short cases (about 15-20 minutes each). Python runs inside your browser: **no account, no install, no server-side compute**.
Every code box is editable and you can add your own cells. Your code and data never leave your browser; the one exception is a question you choose to send to **B'lawd**, the lab's helper (see below).

By Haining Wang, Indiana University. Live at https://hainingwang.org/teaching/stylometry/ (chapters `#ch1` ... `#ch4`).

| URL | Case | What it does |
|---|---|---|
| `#ch1` | Two translations of Confucius's *Analects* (Giles vs Eno) | guess by reading, spelling clue, `and`/`the` scatter, then the lab's simple attacker (224 function words + logistic regression) |
| `#ch2` | The Unabomber (T-2 vs U-14) | counting small words, training a "Ted or not?" logistic regression on 224 small words, and scoring whole texts it never saw: other writers, Ted's later essays, and the manifesto, drawn against an alarm line |
| `#ch3` | The Lu Xun brothers | 31 function characters + L2 logistic regression, disputed essays, weights, highlighted passage |
| `#ch4` | Protect John Doe (a what-if on Glassdoor v. Superior Court / Machine Zone) | defense, not attribution: you are on the anonymous reviewer's side. The same simple attacker over 45 writers finds 21 at rank 1 with no disguise; then hiding by hand, four LLM rewriting strategies x four models (ready-made rewrites), and **your own disguise**, each judged on two goals: hide him, keep what he said |

Every chapter starts with a "Check that everything works" banner (green = ready; red says what failed and what to try).

## The one simple attacker (Cases 1 and 4)

Counts of 224 function words (the list in `data/function_words_224.json`; tokens matched by `[a-z]+(?:'[a-z]+)?` on lower-cased text; the same list as Case 2) -> `Normalizer(l1)` -> `StandardScaler` -> `LogisticRegression(C=1, lbfgs)`. Case 1 held-out chunk accuracy 82% (and + the only: 58%); Case 4 catches 21 of 45 writers at rank 1 with no defense. Details and every other number: `DATA_NOTES.md`.

## Folder layout (this folder is the whole site; a GitHub Pages-ready root)

```
index.html  style.css  app.js        the page, chapter tabs + hash routing, cell runner, "ready" banner
chapters/ch1.js ... ch4.js           the lab content: one entry per cell (edit these to change text or code); ch4_rj.js = legacy Case 4 (#ch4rj, no tab)
lab_helpers.py  lab_ch2.py  lab_ch3.py  lab_ch4.py   Python helpers loaded into the browser's Python
data/                                each chapter's data (loaded only when the chapter opens); data/LICENSES.md lists the licence of every folder
data/ch4/ebg/                        the 793 EBG texts (AGPL-3.0) with COPYRIGHT_NOTICE.txt and LICENSE-AGPL-3.0.txt
vendor/pyodide/                      the Python engine and packages (created by tools/vendor_pyodide.py; see "Self-hosting")
serve.py                             optional: python3 serve.py -> http://localhost:8000/
stylometry-lab.zip                   the whole site in one file (built by tools/make_zip.py)
tools/  proxy/                       build scripts; optional live-LLM Worker (not needed, not published)
LICENSE  .nojekyll  DATA_NOTES.md    MIT licence for the code; GitHub Pages marker; provenance and decisions
```

Licences: code MIT (Haining Wang, 2026); EBG texts and the LLM rewrites made from them AGPL-3.0; Riddell-Juola CC0; the Lu Xun / Zhou Zuoren corpus public domain (other materials 0BSD); Giles public domain; Eno and the Case 2 texts are shipped as derived counts only. See `data/LICENSES.md`.

## Self-hosting: everything from one origin

The page needs no GitHub, no CDN and no web font once `vendor/pyodide/` exists. All paths are relative, so the folder works from any sub-path (`/lab/`, `/teaching/stylometry/`, ...).

1. `python3 tools/vendor_pyodide.py` (once, with internet): copies Pyodide v0.27.7 and numpy, scipy, scikit-learn, matplotlib and their dependencies into `vendor/pyodide/` (checks every SHA-256).
2. `python3 tools/make_zip.py` writes `stylometry-lab.zip` (refuses to write it if it would exceed 95 MB, GitHub Pages' limit is 100 MB per file).
3. Publish the folder (the live site excludes `tools/`, `proxy/`, `.gitignore`).

`app.js` has three settings at the top: `PYODIDE_LOCAL` (`vendor/pyodide/`), `PYODIDE_CDN`, and `PYODIDE_CDN_FALLBACK` (default `true`: if the local copy is missing, use the jsDelivr CDN; set it to `false` for a strictly same-origin lab). **Status of this copy: `vendor/pyodide/` has not been created yet**, so the page currently falls back to the CDN.

**For instructors:** click "Download the whole lab (.zip)" on the page, unzip, and put the folder on any web server (or run `python3 serve.py` inside it if you have Python).
**Offline use, honestly:** opening `index.html` by double-click (`file://`) does not work in most browsers (they block `fetch` and WebAssembly there). The website is the supported route. `serve.py` is a convenience for people who already have Python 3; it is not a fool-proof offline route, because Windows and macOS do not install Python by default.

Sizes: the page code and data are about 6 MB (Case 4's 793 text files are 3.1 MB); the Python engine plus packages add roughly 55-70 MB once vendored (browsers cache them). Run `du -sh vendor/` after vendoring.

## Run locally

```bash
cd lab
python3 serve.py            # or: python3 -m http.server 8000
# open http://localhost:8000/#ch1   (or #ch2, #ch3, #ch4)
```

## B'lawd, the lab's helper

`blawd/blawd-chat.js` adds a pixel cat in the bottom-right corner. It answers questions about the lecture and the lab through `https://api.hainingwang.org/lab` (the `/lab` route of the site's Cloudflare Worker, `ask-haining-worker/src/lab.ts`; model Claude Haiku). Its knowledge is `blawd/knowledge.md`, built by `python3 tools/build_blawd_knowledge.py` from the lecture slides (with speaker notes), every chapter, the helper modules and DATA_NOTES.md; the Worker's `npm run build:knowledge` copies it in. The Worker only answers pages served from hainingwang.org, so on a self-hosted copy or on localhost the chat says it can't reach B'lawd; set `data-endpoint` on the script tag to point it at your own server, or delete the tag.

## Optional: live LLM proxy (instructors only, off by default)

Case 4 uses ready-made rewrites. A live path exists in `app.js` behind `PROXY_URL` (empty = the passcode box and every live control stay hidden). See `proxy/README.md` (Cloudflare Worker; not deployed, never called by default).

## Rebuilding the data

```bash
python3 -m venv .venv && .venv/bin/pip install pdfminer.six scikit-learn numpy
# Case 1: giles.txt from https://www.gutenberg.org/cache/epub/46389/pg46389.txt ; Eno's PDF from https://hdl.handle.net/2022/23420 (do not commit it)
.venv/bin/python tools/build_data.py --giles giles.txt --eno eno.pdf
.venv/bin/python tools/build_ch2.py /path/to/unabom        # Case 2
.venv/bin/python tools/build_ch3.py /path/to/the_many_voices  # Case 3
.venv/bin/python tools/build_ch4_ebg.py --local /path/to/anonymouth/jsan_resources/corpora/amt   # Case 4 manifest
```

## Known limits

- Pyodide runs on the page's main thread: the page freezes for a second or two while a cell computes or a package loads.
- Code cells are plain textareas. Cells share one Python session per chapter; run them in order ("Run all up to here" helps after edits).
- The attacker is a deliberately simple stand-in; a stronger attacker could do better against every disguise.
- The legacy `#ch4rj` page (20 authors, placeholder rewrites) is kept but has no tab.
