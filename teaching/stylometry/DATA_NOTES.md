# Data notes

Provenance, licensing and decisions for each chapter's data. Everything a chapter ships is in `data/chN/` (plus the shared `data/function_words_224.json`). Per-folder licences are summarised in `data/LICENSES.md`.

## Case 1 · Two translations of the Analects (`data/ch1/`)

| Source | Status | What is in this repo |
|---|---|---|
| Lionel Giles, *The Sayings of Confucius* (Wisdom of the East, 1907; the Project Gutenberg edition #46389 is the 1910 Dutton printing) | Public domain; Project Gutenberg licence | Per-chunk function-word counts **and the chunk text** (`chunks.json`), plus four held-out passages and the mystery note X (`step1_passages.json`) |
| Robert Eno, *The Analects of Confucius: An Online Teaching Translation* (v2.21, 2015), https://hdl.handle.net/2022/23420 | Copyright retained. The PDF states: "freely available for use in not for profit educational settings and for personal use. For other purposes, apart from fair use, copyright is not waived." | **Derived counts only** (function-word counts per chunk; `text` is `null`). Plus one short excerpt (Analects 17.8, about 100 words) that Haining already showed on his 2023 slide, quoted for teaching/commentary (`eno_shadows`). |

A public personal website is not clearly a "not for profit educational setting", so the lab does not redistribute Eno's text. Count vectors cannot be turned back into readable text. If Eno gives permission, rerun `tools/build_data.py --include-eno-text`.

How the chunks were made (`tools/build_data.py`):

- Giles (PG #46389) is a **thematic selection**, not the whole of the Analects in book order, so "match by book" is not possible. Both translations are cut into consecutive chunks of about 300 words (a chunk closes at the next saying or paragraph boundary once it holds 300 words; a short left-over joins the previous chunk). Result: 50 Giles chunks and 77 Eno chunks (Books I-XX, translation column only, glosses and commentary excluded).
- Giles: introduction and translator's footnotes excluded; footnote markers and italics underscores removed. Eno: only the left (translation) column of PDF pages 16-126 (`pdfminer.six`); line-break hyphens removed; Chinese characters dropped.
- Held out of training: mystery note X (Giles' own footnote 7 of the first section), Giles' six-shadows passage (17.8), Eno's 17.8, and three further Giles paragraphs.
- Function-word list: the **224-word list** `data/function_words_224.json` (words under `"words"`, plus a credit line), the same list as Case 2. It is derived for this lab: the list is `FW` in `unabom/scripts/verify.py` (the validated Chapter 2 analysis). It replaces the earlier, longer function-word list.
- Features: for every chunk and word, the number of tokens equal to that word, with the tokenizer of `unabom/scripts/verify.py` (lower-case, curly apostrophes straightened, regex `[a-z]+(?:'[a-z]+)?`; `lab_helpers.fw_tokens` / `fw_counts`). Contractions stay whole (*don't* is one token and counts for nothing in the list), so no lone `t` or `s` is a feature.
- `chunks.json` was **rebuilt** with `tools/build_data.py` from the Gutenberg text and Eno's PDF (both kept outside the lab folder). The rebuild gives the same 127 chunks (same ids, texts and word counts as before); only the `fw` counts changed. Eno's text is still not shipped (`text: null`); the counts are derived counts.
- Attacker: `Pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1, solver="lbfgs", max_iter=10000))`, as in the reproduction's `train.py` (its `multi_class="multinomial"` is omitted because newer scikit-learn removed the argument; lbfgs is multinomial by default, and for two classes it makes no difference). The old `class_weight="balanced"` was dropped.
- Reproduced numbers (native scikit-learn 1.9.1 and in the browser, Pyodide, scikit-learn 1.6): 5-fold cross-validated chunk accuracy 0.819 (127 chunks); "and" + "the" only (the same L1 proportions, two columns): 58%, below the 61% of always answering "Eno"; mystery note X: P(Giles) = 0.980.
- The 3-gram counts and old LLM-disguise steps of the earlier prototype were removed from Case 1 earlier (they moved to Case 4, which no longer uses 3-grams either).

Things to know:

- Chunk-level 5-fold accuracy is about 82% with the 224 function words but only about 58% with "and" and "the" alone (below the 61% you would get by always answering "Eno", since 77 of the 127 chunks are Eno). That is the point of Steps 4 and 5.
- With 300-word chunks, "and" vs "the" overlaps heavily between the two translators. The 2023 slide's cleanly separated scatter (DH23_s9_1.png) cannot be reproduced from these chunks; the counts printed on that slide are on a different scale from what the visible passage texts would give.

## Case 2 · The Unabomber (`data/ch2/`)

Mirrors lecture slide 9. Built by `tools/build_ch2.py` from `unabom/` (it imports `FW`, `tokens`, `chunks`, `build` from `unabom/scripts/verify.py`, so tokenisation, the 224-word function-word list and 1,000-token pieces are identical to the reference; the tail shorter than 1,000 tokens is dropped). The shipped `fw_counts.json` was trimmed from the previous build with the same counts (numpy was not available to re-run the builder); `tools/build_ch2.py` now writes the trimmed file.

| Item | Source | Shipped |
|---|---|---|
| T-2 (Ted Kaczynski, 1971 essay) | transcription of an FBI document (see `unabom/data/CORPUS_NOTES.md`) | counts per 1,000-word piece (6 pieces); one short quotation |
| U-14 (*Industrial Society and Its Future*, 1995) | typescript transcription | counts per piece (30); one short quotation |
| 19 other writers, 29 texts, 294k words (Mumford, Sale, Zerzan, Glendinning, Mander, Perlman, Illich, Berry, Postman, Goodman, Marcuse, Schumacher, Packard, Toffler, Bookchin, Shepard, Watson, Huxley, Ellul) | The Ted K Archive (AMuseWiki files), still in copyright | **counts only** (282 pieces), author name, title, year, translated flag. No text. |
| Ted's later essays: the 8 "keep" texts of `unabom/data/ted_post_selected.json` (argumentative essays on technology and revolution, 1999-2016) | The Ted K Archive | **counts only** per text, title and year. No text. |
| `totals` | derived | whole-text counts for T-2, U-14 and each of the 19 writers, for the dot strip |

Files: `fw_counts.json` (about 0.2 MB), `excerpts.json` (two short quotations, each at most 60 words, shown with attribution).

**Method** (`lab_ch2.train_and_score`, same as `unabom/scripts/text_level.py`, key `"main"` of `unabom/results/text_level_FW224_1000.json`): FW224 counts on 1,000-word pieces; pipeline `Normalizer(l1)` -> `StandardScaler` -> `LogisticRegression(C=1, class_weight="balanced", max_iter=5000)`; trained on T-2 pieces (1) against all other-writer pieces (0). Other writers' texts are scored held out by whole text in 5 folds (`lab_ch2.group_folds`, the rule of scikit-learn's `GroupKFold`, written out because the Pyodide scikit-learn breaks ties between equal-sized texts differently; groups are named `author/text` as in the reference). A text's score is the mean `decision_function` (log-odds) over its pieces. The alarm line is the 95th percentile of the 29 held-out other-writer text scores.

| Quantity | Reference | Lab (browser) |
|---|---|---|
| Alarm line (log-odds) | -4.77 | -4.77 |
| Other writers' texts over the line | 2 of 29 | 2 of 29 |
| Ted's later essays over the line | 7 of 8 | 7 of 8 |
| Manifesto | over the line (-1.88) | flagged |

Cases 1, 2 and 4 all use the same 224-word list.

## Case 3 · The Lu Xun brothers (`data/ch3/`)

Source: https://github.com/Wang-Haining/the_many_voices (local clone `/Users/haining/Desktop/github/the_many_voices`). Its README: "The corpus is designated to the public domain. All other materials are licensed under 0BSD." So `corpus.json` ships the **full Chinese texts** (31 training pieces, 30 validation pieces, 4 disputed essays) and the **English translations** of the four disputed essays (`translation/`, 0BSD). Built by `tools/build_ch3.py`.

The lab runs a port of `run.py`/`utils.py` (`lab_ch3.py`): same 31 features (27 characters and 4 bigrams), same `count_frequency` (verified on the repo's own docstring example: `[3, 1, 2]`), `StandardScaler` + L2 `LogisticRegression(C=1, tol=1e-9)`. The highlight uses a simplified orange/blue shading (Lu Xun orange, Zhou Zuoren blue) instead of matplotlib's colour maps.

The chapter is written as a 22-step first machine-learning project; `lab_ch3.py` holds its plots (rates of the 31 characters, biggest gaps, two-character scatter, PCA map, S-curve, weights, held-out check, per-essay pushes, verdict). The extra figures it prints are derived from the same model and add no new claims: the two most telling characters (之, 惟, chosen by gap over spread among training pieces), PCA shares (0.32, 0.09), and the score of 望华国篇 as a sum (+0.59 start + 3.51 pushes = +4.10, P = 0.984).

**Chinese font for plots.** Pyodide's matplotlib has no CJK font. `data/ch3/font.json` holds `{"name", "note", "b64"}`: Noto Sans SC (SIL OFL 1.1, licence in `data/ch3/FONT_LICENSE.txt`), instanced at wght 400 and subset to the 31 characters, all corpus titles, the four disputed essays' characters, ASCII and common punctuation (191 KB font, 255 KB as base64; base64 because `app.js` writes chapter data files as text). `lab_ch3.use_font()` decodes it to a temp file and registers it; each plot function runs inside `rc_context`, so other chapters' plots are unaffected. No bold weight is shipped, so the plots use no bold text. Rebuild (fontTools): download `NotoSansSC[wght].ttf`; `f = instancer.instantiateVariableFont(TTFont(src), {"wght": 400})`; `o = subset.Options(); o.hinting = False; o.layout_features = []; o.notdef_outline = True` (also drop DSIG, GPOS, GSUB, GDEF, STAT, BASE, kern); `sub = subset.Subsetter(o); sub.populate(text=T); sub.subset(f)` with T = the 31 characters + every `title` in `corpus.json` + the text of the four `test` essays + printable ASCII + `·→←—…、。，；：？！“”‘’《》（）「」×−±` + 鲁迅周作人; rename the family (name IDs 1, 4, 6) to "Noto Sans SC Lab Subset"; save, base64 the bytes into `font.json`. Source: https://github.com/google/fonts/tree/main/ofl/notosanssc. `data/LICENSES.md` still needs a row for it.

Numbers reproduced, both natively (scikit-learn 1.9) and in the browser (Pyodide, scikit-learn 1.6):

| Quantity | Published (README / paper) | Lab |
|---|---|---|
| Validation accuracy | 0.933 | 0.933 |
| Validation F1 (Lu Xun as positive class) | 0.964 | 0.964 |
| P(Lu Xun), 望华国篇 | 0.984 | 0.984 |
| P(Lu Xun), 望越篇 | 0.856 | 0.856 |
| P(Lu Xun), 尔越人毋忘先民之训 / 民国之征何在 | not in README | 0.833 / 0.595 |

All match. **Two things to know before the lecture:** (1) the validation set is 28 Lu Xun pieces and 2 Zhou Zuoren pieces (confusion matrix `[[1, 1], [1, 27]]`), so accuracy 0.933 equals the "always say Lu Xun" baseline, and F1 0.964 is for the Lu Xun class only (Zhou's F1 is 0.5). The page prints the confusion matrix and the per-brother hits ("27 of 28", "1 of 2") and draws every validation piece with the two misses ringed, but it does not state the baseline comparison. (2) The README's corpus table lists 望越篇 under Validation, but in the repository it sits in `test_*` and is scored with the other disputed essays. The texts are very short (308-750 characters).

## Case 4 · Glassdoor v. Machine Zone (`data/ch4/`, EBG corpus; legacy RJ version in `data/ch4_rj/`)

**The case text.** Glassdoor, Inc. v. Superior Court (Machine Zone, Inc.), 9 Cal. App. 5th 623 (2017); caption GLASSDOOR, INC., Petitioner, v. SUPERIOR COURT OF SANTA CLARA COUNTY, Respondent; MACHINE ZONE, INC., Real Party in Interest (Cal. Ct. App., 6th Dist., Mar. 10, 2017). Facts stated in the lab (from chapter 1 of the book, checked against the opinion): an anonymous review titled "A Scandal" criticized Machine Zone; Machine Zone sued the anonymous poster ("John Doe", described by the court as a former employee) for breach of contract and sought his identity from Glassdoor; the court held Glassdoor could assert its users' rights and directed denial of the motion to compel because the required prima facie showing was missing. The court did not use stylometry; everything after that is labelled "what if" in the page. The real review is not available, so "John Doe" is a stand-in author from EBG. No other case details are stated.

**EBG text (shipped, same origin).** Extended Brennan-Greenstadt corpus, from the PSAL Anonymouth repository, https://github.com/psal/anonymouth/tree/master/jsan_resources/corpora/amt, **AGPL-3.0** (the repository's `COPYRIGHT.txt`: JSAN, JStylo and Anonymouth are copyright 2011-2013 by the Privacy, Security and Automation lab at Drexel University and released under AGPL version 3). So that students never need GitHub, the 793 files are **copied unchanged into `data/ch4/ebg/`** (3.1 MB with the licence files), together with `COPYRIGHT_NOTICE.txt` (a summary of that COPYRIGHT.txt; the original file was not available offline and should be copied in when convenient) and `LICENSE-AGPL-3.0.txt` (the full licence text). `ebg_manifest.json` (built by `tools/build_ch4_ebg.py`) lists the files with size and SHA-256 and records the source commit `7bd8e24b661f587facf8715a1de345dffde9734e` (master head, 2013-10-16); the page loads the files from its own folder and Python checks every hash. The copies were taken from a download made for the earlier version and all 793 hashes match the manifest. (The Drexel-AMT-Corpus folder in the reproduction repository differs in 40 files and was not used.) The page footer credits the source and licence.
Layout: 45 author folders (`aa`, `b`, `bb`, ...). Per author: `<a>_NN_*.txt` pre-existing writing (about 500 words each, about 15 files; 699 files in all), `<a>_obfuscation.txt` (45), `<a>_imitation_NN.txt` (49; 45 authors, a few have two; the lab uses `_01`, and the imitation target is Cormac McCarthy), `<a>_demographics.txt` and `<a>_verification.txt` (9), the last two unused.
Split, copied from the book benchmark (`hlt/experiments/ch07/utils.py`): `<a>_01_1.txt` = the held-out test text ("the review"), the other 654 numbered files = training. So there are 45 authors, 654 training pieces, 45 test texts of 468-508 whitespace words (mean 492). Training words per author with the lab's letters-only tokenizer: mean 7,159 (range 5,849 to 10,927). The setting is the "same-topic, strong attacker" case: train and test come from the same pre-existing writing.
Encoding: the benchmark read files with `chardet`; one test text (`j_01_1.txt`) contains a UTF-8 curly apostrophe that chardet read as cp1252 (mojibake), so the benchmark's LLM rewrites for author `j` were made from the mojibake text. The lab reads UTF-8 (cp1252 only as a fallback). The other 44 test texts match the benchmark's recorded source hashes.

**Attacker** (`lab_ch4.FW224Attacker`): the same as Case 1: counts of the 224 function words (tokens of `[a-z]+(?:'[a-z]+)?` on lower-cased text) -> `Normalizer(l1)` -> `StandardScaler` -> `LogisticRegression(C=1, lbfgs)`, trained on all 654 pieces (45 classes). The earlier second attacker (character 3-grams + SVM) and the mentions of Writeprints and RoBERTa were removed from Case 4. (`FWAttacker` and `Char3Attacker` stay in `lab_ch4.py` only for the legacy `#ch4rj` page.) It is the lab's stand-in, not the book's frozen attackers. Native results, all numbers: `../assets/figs/ch4_fw224_results.json`.

**John Doe** is chosen by a rule, not by hand: among authors whose held-out text the attacker ranks first (21 of 45), sort by the probability given to the true author and take the lower middle one. Result: author `ss` (P = 0.600). The page shows the whole-population table next to him everywhere.

**`rewrites_cache.json`** (1.70 MB) holds real rewrites (the earlier placeholders were replaced). Source (marked in the file and in the page): "Wang (2026) local-LLM benchmark, retained outputs", from Tempest `/home/group/jasonclark/g91p721/hlt/artifacts/` (read-only). The benchmark's final retained set is 18 configurations (excluded: Llama-2-7B, Llama-2-13B, Qwen3-8B) x 4 strategies x (45 EBG + 21 RJ texts) = 4,752 rewrites. Shipped: EBG test texts only, for four small open-weight configurations: meta-llama/Llama-3.1-8B-Instruct, Qwen/Qwen2.5-7B-Instruct, google/gemma-2-9b-it, mistralai/Ministral-8B-Instruct-2410 (all bf16, revisions in the file) = 45 x 4 x 4 = 720 rewrites. Strategies: obfuscation, imitation of Cormac McCarthy, Special English simplification, Chinese round-trip translation (`round_trip_translation` in the benchmark, `backtranslation` in the lab). Keys: `<author>|<strategy>` -> `<config>` -> `{text, sha256, repaired}`; the join to the corpus is by text id `corpora/ebg/<a>/<a>_01_1.txt`. Sampling in the benchmark: temperature 0.7, top-p 1.0, up to 4,096 new tokens, seed 93187.
Verification (done by `tools/tempest_export_ebg_rewrites.py` on Tempest): each rewrite is the source generation record (`ch07_metric_validation_v1/generation_checkpoint.json` -> `generations.jsonl`), or the record in `ch07_retained_models_v1/<idx>/repairs.jsonl` where the retained-model audit regenerated it (6 of the 720: 5 English regenerations, 1 round trip; for each, the repair's recorded original hash equals the audit's hash). All 720 SHA-256 values equal the hashes in the benchmark's content-score records (`ch07_smart_mis_v1/<idx>.jsonl` or `content_updates.jsonl`), the 720 keys are all in `hlt/experiments/ch07/results/pareto_numeric_retained_v1.json`, and the 704 of 720 source-file hashes recorded in the generations match the pinned GitHub files (the other 16 are author `j`, see above).
**Licence:** these are machine rewrites of EBG texts, so they are derived from AGPL-3.0 data and carry the same notice (`_license` in the file). Note that `hlt/planning/PROVENANCE_MAP.md` says raw model outputs are not to be copied into Git; this lab folder is not that repository, but keep the cache out of the `hlt` repository.

Results table of the page (224 words; caught at rank 1 / within top 5 / median rank; "all four models" pools 4 x 45 = 180 rewrites): no defense 21/45, 37/45, 2; human obfuscation 2/45, 10/45, 15; human imitation 2/45, 10/45, 13; obfuscation 43/180, 95/180, 5; imitation 28/180, 82/180, 7; simplification 23/180, 81/180, 7; round trip via Chinese 61/180, 112/180, 3. Human texts are NEW essays, not rewrites of the held-out text, so they are not like-for-like with the LLM rows. Per-model rows are on the page and in `../assets/figs/ch4_fw224_results.json`.

**Page framing (defence project).** Case 4 is written from John Doe's side: baseline attack (21/45), then disguises (human obfuscation, four LLM strategies, the student's own rewrite). Human imitation of McCarthy is no longer on the page (still loaded by `load_ebg`; numbers above unchanged). "Words kept" (`lab_ch4.words_kept`: share of the original's words, with repeats, still in the new text) is the only meaning proxy; the data has no meaning score.

Other files: `prompts.json` (verbatim from `hlt/experiments/ch07/prompts.json`, checked identical; used for the live path and shown on the page).
Legacy RJ version (`#ch4rj`): see the previous notes in `tools/build_ch4_rj.py`. Riddell-Juola corpus, CC0, 20 candidates drawn with seed 0, placeholder rewrites (hand-written, marked `placeholder: true`), `data/ch4_rj/`. It is kept but is no longer the default and has no tab.

## What is NOT shipped

- Eno's translation text (Case 1): counts only.
- Any text by the 19 impostor authors or by Ted's post-arrest writing (Case 2): counts only.
- Nothing else is withheld from Case 4: the EBG corpus and the cached rewrites are shipped under AGPL-3.0 with notice (see above).
- API keys: the proxy holds them as Worker secrets.
