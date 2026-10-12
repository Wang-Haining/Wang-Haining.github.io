# Stylometry lab (browser-only prototype, four cases)

A Colab-style "click the play button to run the next step" lab. Python (Pyodide) runs in the student's browser; there is no server-side compute and no account.
The only networked piece is the optional LLM step in Case 4, which goes through a Cloudflare Worker proxy (or falls back to cached rewrites).

One page, four case chapters, each openable by URL and runnable on its own:

| URL | Case | Generation | What it does |
|---|---|---|---|
| `index.html#ch1` | Case 1 · Two translations of Confucius's *Analects* (Giles vs Eno) | human reader | guess by reading, spelling clue, `and`/`the` scatter overlaps, 158 function words + logistic regression |
| `index.html#ch2` | Case 2 · The Unabomber (T-2 vs U-14) | statistics | Burrows's Delta and its failed validity check, General Impostors with calibration, Ted's later texts, topic-leak test |
| `index.html#ch3` | Case 3 · The Lu Xun brothers | our own method, other language | 31 function characters + L2 logistic regression, disputed essays, weights, highlighted passage |
| `index.html#ch4` | Case 4 · Glassdoor v. Superior Court (Machine Zone): unmasking an anonymous reviewer (what-if) | LLM era | 45 EBG authors: attacker without defense, human obfuscation and imitation, LLM strategies (cached real rewrites, or live via proxy), second attacker |
| `index.html#ch4rj` | legacy RJ version of Case 4 (no tab) | | the earlier 20-author Riddell-Juola version with placeholder rewrites |

Every chapter says at the top that all code boxes are editable, and every chapter has a **+ Add a code cell** button after each cell (and at the end). A student's own cell runs in the chapter's Python session, so it sees the names defined above it; it has a **Delete cell** button. Students' own cells are kept only in that browser's `localStorage` (nothing goes to any server; if storage is blocked they simply are not remembered).

```
lab/
  index.html  style.css  app.js          the page, chapter tabs + hash routing, the cell runner, the LLM helper
  chapters/ch1.js ... ch4.js             the lab content: one entry per cell (edit these to change text or code); ch4_rj.js = legacy RJ Case 4
  lab_helpers.py                         shared helpers (tables, plots, diffs, tokenizer)
  lab_ch2.py  lab_ch3.py  lab_ch4.py     per-chapter helpers (Delta + General Impostors; Chinese feature counts; EBG loader + two attackers)
  data/ch1 ... data/ch4/                 each chapter's data (loaded only when that chapter opens); data/ch4_rj/ = legacy RJ data
                                         (Case 4's EBG texts are NOT in the folder: the page downloads them from GitHub, see DATA_NOTES.md)
  proxy/                                 worker.js, wrangler.toml, README.md (Cloudflare Worker, NOT deployed)
  tools/build_data.py                    rebuild Chapter 1 data from Giles (Gutenberg) and Eno (PDF)
  tools/build_ch2.py  build_ch3.py       rebuild Chapters 2 and 3 data from the source folders
  tools/build_ch4_ebg.py                 rebuild data/ch4/ebg_manifest.json (file names + SHA-256 of the EBG files at the pinned commit)
  tools/tempest_export_ebg_rewrites.py   READ-ONLY export of the retained rewrites on Tempest (run with ssh ... python3 - < script)
  tools/make_ebg_cache.py                turn that export into data/ch4/rewrites_cache.json
  tools/build_ch4_rj.py  make_cache.py   legacy RJ Case 4: rebuild its data / fill its placeholder cache through OpenRouter (not run)
  DATA_NOTES.md                          provenance, licensing, decisions, per chapter
```

Python boots once. Each chapter has its own data files and its own Python namespace, so opening `#ch3` directly never needs anything from `#ch1`; switching tabs keeps each chapter's outputs.

## Run locally

```bash
cd lab
python3 -m http.server 8000
# open http://localhost:8000/#ch1   (or #ch2, #ch3, #ch4)
```

Open it through a web server, not by double-clicking `index.html` (browsers block `fetch` from `file://`). You need internet access: Pyodide and its packages load from `cdn.jsdelivr.net`
(pinned to Pyodide v0.27.7, Python 3.12, NumPy 2.0, scikit-learn 1.6, matplotlib 3.8).

## Sizes (what a student downloads)

Shared: Python core about 7 MB over the wire (wasm 3 MB + stdlib 2.3 MB), plus the page code (about 90 KB, uncompressed).
Per chapter, data files only (uncompressed JSON; GitHub Pages sends them gzipped, the gzip size is in brackets):

| Chapter | Data | Packages downloaded when a step first needs them (rough, first time only) |
|---|---|---|
| 1 Two translations | 142 KB (44 KB) | NumPy about 3 MB, matplotlib about 9 MB, scikit-learn + SciPy about 20 MB |
| 2 The Unabomber | 196 KB (46 KB) | NumPy, matplotlib (no scikit-learn) |
| 3 The Lu Xun brothers | 183 KB (89 KB) | NumPy, scikit-learn + SciPy |
| 4 Glassdoor v. Machine Zone | shipped: 1.8 MB (manifest 102 KB, rewrites cache 1.70 MB, function words 2 KB, prompts 3 KB); plus **2.35 MB of EBG text downloaded from raw.githubusercontent.com** (793 small files) | NumPy, scikit-learn + SciPy |

Package sizes are from the earlier prototype's measurements and were not re-measured. A student who opens one chapter only downloads that chapter's data and packages. Packages are cached by the browser, so a second chapter that uses the same ones is quick.
Advise students to open the page before class on good Wi-Fi.

## Timings and checks (dev browser, warm cache)

Every chapter was opened by URL on a fresh page load (localStorage cleared) and run with "Run all", then a student cell was added, run and deleted, with no console errors (2026-10-11, built-in browser pane: Ch1, Ch2, Ch3, Ch4 and the legacy #ch4rj). Earlier timings (before the Case 4 rewrite): Ch1 about 13 s (mostly package downloads), Ch2 about 8 s, Ch3 about 9 s. Case 4 was not re-timed; it trains two attackers on 654 pieces and scores about 1,500 texts, and runs in well under a minute on a warm cache.
Ch2 and Ch3 numbers match the source reports (see DATA_NOTES.md).

## Deploy under the personal site (Pelican on GitHub Pages)

The lab is plain static files with relative paths, so it can live at any sub-path such as `/lab/`.

1. Copy the folder into Pelican's static content, e.g. `content/lab/` (you may leave out `tools/` and `proxy/`; neither holds secrets).
2. In `pelicanconf.py` add the folder to the static paths and map it to the output location, for example:
   ```python
   STATIC_PATHS = ['images', 'lab']
   ```
   With the folder at `content/lab/`, Pelican copies it to `output/lab/` unchanged, so the page is at `output/lab/index.html`. Check that the theme does not also generate a page at `/lab/`.
3. Check that `lab/data/*/*.json`, `lab/chapters/*.js` and `lab/lab_*.py` are published (GitHub Pages serves all of them; a `_`-prefixed folder would be skipped by Jekyll, so keep the names as they are or add a `.nojekyll` file at the site root).
4. Open `https://<your-site>/lab/#ch1` ... `#ch4` and run all cells once before the lecture.
5. If the site sets a strict Content-Security-Policy, allow `cdn.jsdelivr.net` for scripts and `connect-src` for your Worker URL; Pyodide also needs `'wasm-unsafe-eval'`.

Not needed: `tools/`, `proxy/`, `DATA_NOTES.md` (keep `DATA_NOTES.md` if you want the footer link to work).

## Case 4 downloads the EBG corpus at run time

The page fetches 793 files (about 2.35 MB) from `raw.githubusercontent.com/psal/anonymouth/7bd8e24b661f587facf8715a1de345dffde9734e/...` (pinned commit; `Access-Control-Allow-Origin: *` was checked), ten at a time with retries, and `lab_ch4.load_ebg()` checks each file's SHA-256 against `data/ch4/ebg_manifest.json`. Students therefore need access to GitHub; if it is blocked the Step 0 box says which file failed and can be re-run. A strict Content-Security-Policy must also allow `connect-src https://raw.githubusercontent.com`.

## LLM proxy (Case 4 only)

The offline cache needs no proxy (it holds real rewrites by four local models; see DATA_NOTES.md). The live path is optional. See `proxy/README.md`. Short version: `npx wrangler secret put OPENROUTER_API_KEY` and `CLASS_PASSCODE`, `npx wrangler deploy`, then set `PROXY_URL` at the top of `app.js` and put the same model IDs in `PROXY_MODELS`.
The Worker's limits were raised for this version (input up to 6,000 characters, `max_tokens` up to 1,600) because Case 4 rewrites a 500-word text; back-translation is two calls (English to Chinese, Chinese to English).
The page never contains the API key. With no `PROXY_URL`, no passcode, or an unreachable/rejecting proxy, Case 4 uses `data/ch4/rewrites_cache.json`.
**Every entry in that cache is currently a hand-written placeholder** (labelled in the page). To create real cached rewrites: `export OPENROUTER_API_KEY=...; python3 tools/make_cache.py --chapter ch4` (5 calls; not run yet).
The live path was tested only against a local mock server (no real model was called).

## Rebuilding the data

```bash
python3 -m venv .venv && .venv/bin/pip install pdfminer.six scikit-learn numpy
# Case 1: download the sources yourself (do not commit eno.pdf)
curl -L -o giles.txt https://www.gutenberg.org/cache/epub/46389/pg46389.txt
# download Eno's PDF from https://hdl.handle.net/2022/23420 as eno.pdf
.venv/bin/python tools/build_data.py --giles giles.txt --eno eno.pdf
# Case 2: needs the validated analysis folder (scripts/verify.py, data/)
.venv/bin/python tools/build_ch2.py /path/to/unabom
# Case 3
.venv/bin/python tools/build_ch3.py /path/to/the_many_voices
# Case 4 (also needs data/ch2/fw_counts.json for the function-word list)
.venv/bin/python tools/build_ch4.py /path/to/defending-against-authorship-attribution-corpus
```

## Known limits of the prototype

- Pyodide runs on the page's main thread: the page freezes for a second or two while a cell computes or a package loads.
- Code cells are plain textareas (no syntax highlighting). Cells share one Python session per chapter; run them in order ("Run all up to here" helps after edits).
- Case 2, Step 4 continues the random stream of Step 3 (that is how the report's same-author range is reproduced); run Step 3 right before it.
- Passcodes are held only in the tab's `sessionStorage`.
