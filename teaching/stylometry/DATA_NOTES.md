# Data notes

Provenance, licensing and decisions for each chapter's data. Everything a chapter ships is in `data/chN/` (plus the shared `data/koppel_function_words.txt`). Per-folder licences are summarised in `data/LICENSES.md`.

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
- Function-word list: the **Koppel-512** list, `data/koppel_function_words.txt` (512 words, one per line; the file has 511 line breaks, the last line has none; ISC licence, copy of `resource/koppel_function_words.txt` in https://github.com/Wang-Haining/reproduction-and-replication-adversarial-stylometry, credit in `data/KOPPEL_LICENSE.txt`). It replaces the earlier hand-made 158-word list (`data/ch1/function_words.json`, deleted).
- Features: for every chunk and word, `len(re.findall(r"\bword\b", text.lower()))`, exactly as `vectorize_koppel512` in that repository (`lab_helpers.koppel_counts`; for words without an apostrophe it counts whole `\w+` runs, which is identical and faster; checked equal on 200 texts). Contractions are therefore split: *don't* counts for `don` and `t`, so a lone `t` or `s` is a feature. Curly apostrophes are not matched (as in the published code).
- `chunks.json` was **rebuilt** with `tools/build_data.py` from the Gutenberg text and Eno's PDF (both kept outside the lab folder). Before the change the script, run with the old list, reproduced the previous `chunks.json` exactly (127 chunks, same counts), so only the counts changed. Eno's text is still not shipped (`text: null`); the Koppel counts are derived counts.
- Attacker: `Pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1, solver="lbfgs", max_iter=10000))`, as in the reproduction's `train.py` (its `multi_class="multinomial"` is omitted because newer scikit-learn removed the argument; lbfgs is multinomial by default, and for two classes it makes no difference). The old `class_weight="balanced"` was dropped.
- Reproduced numbers (native scikit-learn 1.9.1 and in the browser, Pyodide, scikit-learn 1.6): 5-fold cross-validated chunk accuracy 0.898 (127 chunks); "and" + "the" only (the same L1 proportions, two columns): 57%, below the 61% of always answering "Eno"; mystery note X: P(Giles) = 0.997.
- The 3-gram counts and old LLM-disguise steps of the earlier prototype were removed from Case 1 earlier (they moved to Case 4, which no longer uses 3-grams either).

Things to know:

- Chunk-level 5-fold accuracy is about 90% with the 512 Koppel words but only about 57% with "and" and "the" alone (below the 61% you would get by always answering "Eno", since 77 of the 127 chunks are Eno). That is the point of Steps 4 and 5.
- With 300-word chunks, "and" vs "the" overlaps heavily between the two translators. The 2023 slide's cleanly separated scatter (DH23_s9_1.png) cannot be reproduced from these chunks; the counts printed on that slide are on a different scale from what the visible passage texts would give.

## Case 2 · The Unabomber (`data/ch2/`)

Built by `tools/build_ch2.py` from `unabom/` (it imports `FW`, `tokens`, `chunks`, `build` from `unabom/scripts/verify.py`, so tokenisation, the 224-word function-word list and 1,000-token chunking are identical to the validated analysis; the tail shorter than 1,000 tokens is dropped).

| Item | Source | Shipped |
|---|---|---|
| T-2 (Ted Kaczynski, 1971 essay) | transcription of an FBI document (see `unabom/data/CORPUS_NOTES.md`) | counts per chunk; one 21-word quotation |
| U-14 (*Industrial Society and Its Future*, 1995) | typescript transcription | counts per chunk; one 14-word quotation |
| 19 impostor authors, 29 texts, 294k words (Mumford, Sale, Zerzan, Glendinning, Mander, Perlman, Illich, Berry, Postman, Goodman, Marcuse, Schumacher, Packard, Toffler, Bookchin, Shepard, Watson, Huxley, Ellul) | The Ted K Archive (AMuseWiki files), still in copyright | **counts only**, author name, title, year, translated flag. No text. |
| Ted's post-arrest writings, 11 texts, 1999-2016 | The Ted K Archive | **counts only**, title and year. No text. |
| Reduced T-2 and U-14 (33 FBI-aligned T-2 paragraphs and the U-14 paragraphs they align to removed) | derived from the two above | counts only: reduced T-2 as its first 1,000 tokens (what the main run used) and as all 1,712 tokens (what the post-hoc check used); reduced U-14 as 22 chunks |

Files: `fw_counts.json` (196 KB; per-chunk counts and token counts), `excerpts.json` (two short quotations, each at most 60 words, shown with attribution). The context paragraph on the page is marked **[fact-check pending]**.

Case 2 deliberately keeps its own pre-registered 224-word function-word list (not Koppel-512): it is a validated, pre-registered result and is not changed. The page says so.

Numbers reproduced in the browser (FW, 1,000-token chunks, seed 20261011, same rule as `unabom/results/SUMMARY.md`; the General Impostors code is vectorised but draws the same random feature subsets):

| Quantity | SUMMARY | Lab |
|---|---|---|
| GI manifesto given T-2 / T-2 given manifesto | 1.00 / 1.00 | 1.00 / 1.00 |
| GI Ted's later writings given T-2 | 0.93 | 0.93 |
| Different-author pairs (342 ordered, 100 rounds): mean / p99 / max | 0.05 / 0.75 / 0.81 | 0.05 / 0.75 / 0.81 (exact: 0.054 / 0.746 / 0.810) |
| Same-author impostor pairs, range | 0.00-0.98 | 0.00-0.98 |
| R1, main run (T-2 first 1,000 of 1,712 tokens) | 0.83 / 0.91 | 0.83 / 0.91 |
| R1, post-hoc, 3 seeds (all 1,712 tokens), manifesto given T-2 | 0.73-0.79 | 0.77, 0.72, 0.79 (0.765, 0.725, 0.785) |
| R1, post-hoc, 3 seeds, T-2 given manifesto | 0.69-0.71 | 0.69, 0.71, 0.69 (0.690, 0.710, 0.685) |
| Different-author max under R1 | 0.79 | 0.79 |
| U-14 vs Ted-post, both directions, 3 seeds | 1.00 | 1.00 |
| Delta: share of U-14 chunks nearest T-2 | 0.43 (chance 0.05) | 0.43 (13 of 30) |
| Delta V1, held-out accuracy | 0.26 | 0.26 (14 of 53) |
| Delta under R1 | 0.00 | 0.00 |

Not reproduced: the length-matched null (K = a random 1,712-token slice of one impostor; max 0.65), because it needs arbitrary token slices and only chunk counts are shipped; the MFW-k comparison; chunk sizes 500 and 2,000. The SUMMARY's "what this supports saying" paragraph is marked DRAFT there, and appears here as "draft wording, to be approved".

## Case 3 · The Lu Xun brothers (`data/ch3/`)

Source: https://github.com/Wang-Haining/the_many_voices (local clone `/Users/haining/Desktop/github/the_many_voices`). Its README: "The corpus is designated to the public domain. All other materials are licensed under 0BSD." So `corpus.json` ships the **full Chinese texts** (31 training pieces, 30 validation pieces, 4 disputed essays) and the **English translations** of the four disputed essays (`translation/`, 0BSD). Built by `tools/build_ch3.py`.

The lab runs a port of `run.py`/`utils.py` (`lab_ch3.py`): same 31 features (27 characters and 4 bigrams), same `count_frequency` (verified on the repo's own docstring example: `[3, 1, 2]`), `StandardScaler` + L2 `LogisticRegression(C=1, tol=1e-9)`. The highlight uses a simplified red/grey shading instead of matplotlib's colour maps.

Numbers reproduced, both natively (scikit-learn 1.9) and in the browser (Pyodide, scikit-learn 1.6):

| Quantity | Published (README / paper) | Lab |
|---|---|---|
| Validation accuracy | 0.933 | 0.933 |
| Validation F1 (Lu Xun as positive class) | 0.964 | 0.964 |
| P(Lu Xun), 望华国篇 | 0.984 | 0.984 |
| P(Lu Xun), 望越篇 | 0.856 | 0.856 |
| P(Lu Xun), 尔越人毋忘先民之训 / 民国之征何在 | not in README | 0.833 / 0.595 |

All match. **Two things to know before the lecture:** (1) the validation set is 28 Lu Xun pieces and 2 Zhou Zuoren pieces (confusion matrix `[[1, 1], [1, 27]]`), so accuracy 0.933 equals the "always say Lu Xun" baseline, and F1 0.964 is for the Lu Xun class only (Zhou's F1 is 0.5). The page says this. (2) The README's corpus table lists 望越篇 under Validation, but in the repository it sits in `test_*` and is scored with the other disputed essays. The texts are very short (308-750 characters).

## Case 4 · Glassdoor v. Machine Zone (`data/ch4/`, EBG corpus; legacy RJ version in `data/ch4_rj/`)

**The case text.** Glassdoor, Inc. v. Superior Court (Machine Zone, Inc.), 9 Cal. App. 5th 623 (2017); caption GLASSDOOR, INC., Petitioner, v. SUPERIOR COURT OF SANTA CLARA COUNTY, Respondent; MACHINE ZONE, INC., Real Party in Interest (Cal. Ct. App., 6th Dist., Mar. 10, 2017). Facts stated in the lab (from chapter 1 of the book, checked against the opinion): an anonymous review titled "A Scandal" criticized Machine Zone; Machine Zone sued the anonymous poster ("John Doe", described by the court as a former employee) for breach of contract and sought his identity from Glassdoor; the court held Glassdoor could assert its users' rights and directed denial of the motion to compel because the required prima facie showing was missing. The court did not use stylometry; everything after that is labelled "what if" in the page. The real review is not available, so "John Doe" is a stand-in author from EBG. No other case details are stated.

**EBG text (shipped, same origin).** Extended Brennan-Greenstadt corpus, from the PSAL Anonymouth repository, https://github.com/psal/anonymouth/tree/master/jsan_resources/corpora/amt, **AGPL-3.0** (the repository's `COPYRIGHT.txt`: JSAN, JStylo and Anonymouth are copyright 2011-2013 by the Privacy, Security and Automation lab at Drexel University and released under AGPL version 3). So that students never need GitHub, the 793 files are **copied unchanged into `data/ch4/ebg/`** (3.1 MB with the licence files), together with `COPYRIGHT_NOTICE.txt` (a summary of that COPYRIGHT.txt; the original file was not available offline and should be copied in when convenient) and `LICENSE-AGPL-3.0.txt` (the full licence text). `ebg_manifest.json` (built by `tools/build_ch4_ebg.py`) lists the files with size and SHA-256 and records the source commit `7bd8e24b661f587facf8715a1de345dffde9734e` (master head, 2013-10-16); the page loads the files from its own folder and Python checks every hash. The copies were taken from a download made for the earlier version and all 793 hashes match the manifest. (The Drexel-AMT-Corpus folder in the reproduction repository differs in 40 files and was not used.) The page footer credits the source and licence.
Layout: 45 author folders (`aa`, `b`, `bb`, ...). Per author: `<a>_NN_*.txt` pre-existing writing (about 500 words each, about 15 files; 699 files in all), `<a>_obfuscation.txt` (45), `<a>_imitation_NN.txt` (49; 45 authors, a few have two; the lab uses `_01`, and the imitation target is Cormac McCarthy), `<a>_demographics.txt` and `<a>_verification.txt` (9), the last two unused.
Split, copied from the book benchmark (`hlt/experiments/ch07/utils.py`): `<a>_01_1.txt` = the held-out test text ("the review"), the other 654 numbered files = training. So there are 45 authors, 654 training pieces, 45 test texts of 468-508 whitespace words (mean 492). Training words per author with the lab's letters-only tokenizer: mean 7,159 (range 5,849 to 10,927). The setting is the "same-topic, strong attacker" case: train and test come from the same pre-existing writing.
Encoding: the benchmark read files with `chardet`; one test text (`j_01_1.txt`) contains a UTF-8 curly apostrophe that chardet read as cp1252 (mojibake), so the benchmark's LLM rewrites for author `j` were made from the mojibake text. The lab reads UTF-8 (cp1252 only as a fallback). The other 44 test texts match the benchmark's recorded source hashes.

**Attacker** (`lab_ch4.KoppelAttacker`): the same as Case 1: Koppel-512 counts (`\bword\b` on lower-cased text) -> `Normalizer(l1)` -> `StandardScaler` -> `LogisticRegression(C=1, lbfgs)`, trained on all 654 pieces (45 classes). The earlier second attacker (character 3-grams + SVM) and the mentions of Writeprints and RoBERTa were removed from Case 4. (`FWAttacker` and `Char3Attacker` stay in `lab_ch4.py` only for the legacy `#ch4rj` page.) It is the lab's stand-in, not the book's frozen attackers; its no-defense result, 30/45 caught at rank 1, happens to equal the book's logistic-regression baseline on the 45 EBG test texts.

**John Doe** is chosen by a rule, not by hand: among authors whose held-out text the attacker ranks first (30 of 45), sort by the probability given to the true author and take the lower middle one. Result with Koppel-512: author `i` (P = 0.582; the earlier 224-word attacker gave author `m`). The page shows the whole-population table next to him everywhere.

**`rewrites_cache.json`** (1.70 MB) holds real rewrites (the earlier placeholders were replaced). Source (marked in the file and in the page): "Wang (2026) local-LLM benchmark, retained outputs", from Tempest `/home/group/jasonclark/g91p721/hlt/artifacts/` (read-only). The benchmark's final retained set is 18 configurations (excluded: Llama-2-7B, Llama-2-13B, Qwen3-8B) x 4 strategies x (45 EBG + 21 RJ texts) = 4,752 rewrites. Shipped: EBG test texts only, for four small open-weight configurations: meta-llama/Llama-3.1-8B-Instruct, Qwen/Qwen2.5-7B-Instruct, google/gemma-2-9b-it, mistralai/Ministral-8B-Instruct-2410 (all bf16, revisions in the file) = 45 x 4 x 4 = 720 rewrites. Strategies: obfuscation, imitation of Cormac McCarthy, Special English simplification, Chinese round-trip translation (`round_trip_translation` in the benchmark, `backtranslation` in the lab). Keys: `<author>|<strategy>` -> `<config>` -> `{text, sha256, repaired}`; the join to the corpus is by text id `corpora/ebg/<a>/<a>_01_1.txt`. Sampling in the benchmark: temperature 0.7, top-p 1.0, up to 4,096 new tokens, seed 93187.
Verification (done by `tools/tempest_export_ebg_rewrites.py` on Tempest): each rewrite is the source generation record (`ch07_metric_validation_v1/generation_checkpoint.json` -> `generations.jsonl`), or the record in `ch07_retained_models_v1/<idx>/repairs.jsonl` where the retained-model audit regenerated it (6 of the 720: 5 English regenerations, 1 round trip; for each, the repair's recorded original hash equals the audit's hash). All 720 SHA-256 values equal the hashes in the benchmark's content-score records (`ch07_smart_mis_v1/<idx>.jsonl` or `content_updates.jsonl`), the 720 keys are all in `hlt/experiments/ch07/results/pareto_numeric_retained_v1.json`, and the 704 of 720 source-file hashes recorded in the generations match the pinned GitHub files (the other 16 are author `j`, see above).
**Licence:** these are machine rewrites of EBG texts, so they are derived from AGPL-3.0 data and carry the same notice (`_license` in the file). Note that `hlt/planning/PROVENANCE_MAP.md` says raw model outputs are not to be copied into Git; this lab folder is not that repository, but keep the cache out of the `hlt` repository.

Results table of the page (Koppel-512; caught at rank 1 / within top 5 / median rank; "all four models" pools 4 x 45 = 180 rewrites): no defense 30/45, 39/45, 1; human obfuscation 2/45, 12/45, 16; human imitation 4/45, 13/45, 15; obfuscation 61/180, 107/180, 3; imitation 36/180, 95/180, 5; simplification 39/180, 88/180, 6; round trip via Chinese 70/180, 123/180, 2. Human texts are NEW essays, not rewrites of the held-out text, so they are not like-for-like with the LLM rows. Per-model rows are on the page.

Other files: `prompts.json` (verbatim from `hlt/experiments/ch07/prompts.json`, checked identical; used for the live path and shown on the page).
Legacy RJ version (`#ch4rj`): see the previous notes in `tools/build_ch4_rj.py`. Riddell-Juola corpus, CC0, 20 candidates drawn with seed 0, placeholder rewrites (hand-written, marked `placeholder: true`), `data/ch4_rj/`. It is kept but is no longer the default and has no tab.

## What is NOT shipped

- Eno's translation text (Case 1): counts only.
- Any text by the 19 impostor authors or by Ted's post-arrest writing (Case 2): counts only.
- Nothing else is withheld from Case 4: the EBG corpus and the cached rewrites are shipped under AGPL-3.0 with notice (see above).
- API keys: the proxy holds them as Worker secrets.
