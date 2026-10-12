# Licences of the data (per folder)

The lab's **code** is MIT (see `../LICENSE`). The data below keeps its own licence.

| Folder / file | What it is | Licence |
|---|---|---|
| `function_words_224.json` | The 224-word function-word list used in Cases 1, 2 and 4 (derived for this lab; the list is `FW` in `unabom/scripts/verify.py`) | MIT (part of the lab) |
| `ch1/` | Per-chunk 224-function-word counts of Lionel Giles (1907, public domain; Project Gutenberg #46389) and Robert Eno (2015; **counts only**, no text) translations of the *Analects*; Giles passages; one short Eno excerpt | Giles: public domain. Eno: derived counts only; one short quotation for teaching |
| `ch2/` | Function-word counts (no text) built from The Ted K Archive texts and an FBI-document transcription; two short quotations | Counts only; quotations with attribution |
| `ch3/` | The Lu Xun / Zhou Zuoren corpus and English translations (the_many_voices) | Corpus dedicated to the public domain; other materials 0BSD |
| `ch4/ebg/` | Extended Brennan-Greenstadt (EBG) corpus, 793 files, copied unchanged from the PSAL Anonymouth repository | **AGPL-3.0**, Copyright 2011-2013 Privacy, Security and Automation lab, Drexel University (`ch4/ebg/COPYRIGHT_NOTICE.txt`, `ch4/ebg/LICENSE-AGPL-3.0.txt`) |
| `ch4/rewrites_cache.json` | 720 machine rewrites of EBG texts (four open models, four strategies) | AGPL-3.0 (derived from EBG) |
| `ch4/prompts.json`, `ch4/ebg_manifest.json` | Prompts; file names and SHA-256 values | MIT (part of the lab) |
| `ch4_rj/` | Riddell-Juola corpus (legacy page `#ch4rj`), placeholder rewrites | CC0 1.0 (corpus); placeholder rewrites are hand-written |

Python engine (Pyodide and its packages, in `../vendor/pyodide/` once vendored): see `../vendor/README.md`.
