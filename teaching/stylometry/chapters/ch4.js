// Case 4: Machine Zone vs. John Doe: unmasking an anonymous reviewer. The stylometry is a what-if.
// Data: EBG corpus (Extended Brennan-Greenstadt; PSAL Anonymouth repository, AGPL-3.0), shipped in data/ch4/ebg/ (same origin as the page;
// data/ch4/ebg_manifest.json lists every file and its SHA-256, which Python checks on loading).
// data/ch4/rewrites_cache.json: retained rewrites of the 45 EBG test texts from Haining Wang's local-LLM benchmark (derived from AGPL data).
// The one attacker is Koppel-512 + logistic regression (lab_ch4.KoppelAttacker). The earlier Riddell-Juola version is chapters/ch4_rj.js (index.html#ch4rj).
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch4",
  tab: "4",
  nav: "Machine Zone vs. John Doe",
  title: "Case 4 · Machine Zone vs. John Doe: unmasking an anonymous reviewer",
  llm: true,
  data: ["data/ch4/ebg_manifest.json", "data/koppel_function_words.txt"],
  remote: { manifest: "data/ch4/ebg_manifest.json", dest: "data/ch4/ebg" },
  intro: `**What happened.** An anonymous online review titled "A Scandal" criticized the game company Machine Zone. Machine Zone sued the anonymous poster, "John Doe" (described by the court as a former employee), for breach of contract and tried to obtain his identity from the review website.
The California Court of Appeal (2017) ruled against forcing disclosure, because Machine Zone had not made the required showing that the review broke his confidentiality agreement.

> **Everything below this line is a "what if".** The court did not use stylometry, and nothing in this lab says that Machine Zone could have unmasked anyone. We ask what the question would look like if a company tried.

**What we use.** We do not have the real review, so "John Doe" here is a stand-in: one of 45 volunteer writers in the **Extended Brennan-Greenstadt (EBG)** corpus.
Each volunteer supplied pre-existing writing (about 500 words per piece), and later wrote an *obfuscation* and an *imitation* of Cormac McCarthy by hand.
We play both sides: an attacker who tries to name the writer among 45 candidates, and the writer, first unprotected, then trying to hide by hand, then asking a language model to rewrite the text (four strategies, four models; the rewrites are ready-made, so you do not need any account).
The attacker is the same simple one as in Case 1: **Koppel-512 + logistic regression**. The setting is the attacker's best case: the training texts and the held-out text come from the same pre-existing writing, so topic and genre cues are shared.

**The honest twist.** A disguise is tested against *one* attacker. Always look at all 45 writers, never at one example, and remember that a stronger attacker could do better.`,
  credits: `Data: the Extended Brennan-Greenstadt (EBG) corpus from the PSAL Anonymouth repository (https://github.com/psal/anonymouth, jsan_resources/corpora/amt; Copyright 2011-2013 Privacy, Security and Automation lab, Drexel University; AGPL-3.0). The files are copied unchanged into this lab's data/ch4/ebg/ folder, with the licence and notice; the page checks every file's SHA-256 against the pinned commit.
LLM rewrites: Wang (2026) local-LLM benchmark, retained outputs; they are machine rewrites of EBG texts, so they are shared under the same AGPL-3.0 terms. Strategy prompts: the same benchmark. Function-word list: Koppel-512 (ISC licence; data/KOPPEL_LICENSE.txt). The case: Glassdoor, Inc. v. Superior Court (Machine Zone, Inc.), 9 Cal. App. 5th 623 (2017). Everything about stylometry here is hypothetical.`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · The candidates and the held-out review",
      md: `The EBG corpus has **45 authors**. For each, the files are: about 15 pre-existing pieces of roughly 500 words (the attacker's **reference writing**), a human **obfuscation**, and a human **imitation** of Cormac McCarthy.
Each author's first piece (\`<author>_01_1.txt\`) is **held out** as the "anonymous review", and the other pieces are training material (654 training pieces in all).
The files load from this lab's own folder (about 2.5 MB); the box checks each one against a fingerprint, so you know they are the original copies.`,
      packages: ["numpy"],
      code: String.raw`import json
import numpy as np
import lab_helpers as H
import lab_ch4 as R                        # the EBG loader and the attacker, written for this lab

authors, train, test, obf, imi = R.load_ebg()               # 45 authors; every file is checked against its SHA-256
words = H.load_koppel()                                     # the 512 Koppel function words (as in Case 1)
train_texts = [t for a in authors for t in train[a]]
train_labels = [a for a in authors for t in train[a]]

per_author = [sum(len(R.words(t)) for t in train[a]) for a in authors]
print(len(authors), "authors,", len(train_texts), "training pieces;", f"{np.mean(per_author):,.0f} training words per author on average (range {min(per_author):,} to {max(per_author):,})")
print("held-out texts:", len(test), "| average length", round(np.mean([len(R.words(t)) for t in test.values()])), "words")
print("human attempts:", len(obf), "obfuscations,", len(imi), "imitations of Cormac McCarthy")`,
    },
    {
      id: "attack",
      title: "Step 1 · (a) No defense: who does the attacker think wrote it?",
      md: `The attacker is **Koppel-512 + logistic regression**: count 512 function words, turn the counts into proportions, standardise, and fit a logistic regression on the 654 reference pieces (exactly as in Case 1, now with 45 authors).
It gives each author a probability; its top guess is the highest one. What matters is the **rank** of the true author: 1 means the attacker's top pick is right.

First the whole population: all 45 held-out texts. Then one example. **How John Doe is chosen** (so the example is not cherry-picked): among the authors whose held-out text is ranked first, sort them by the probability the attacker gave the true author and take the middle one (the lower middle when the count is even).`,
      packages: ["scikit-learn"],
      code: String.raw`a1 = R.KoppelAttacker(train_texts, train_labels, words)    # trains in a few seconds
ranks_none = R.ranks_of(a1, test)                           # rank of the true author, for all 45 held-out texts
H.show_table(["condition", "caught at rank 1", "within top 5", "median rank of true author"],
             [["no defense (45 held-out texts)", *R.summary(ranks_none)]],
             "Koppel-512 + logistic regression against all 45 authors (by luck: 2% at rank 1, 11% within top 5, median rank 23)")

doe_id, caught = R.pick_john_doe(a1, test)                  # the transparent rule described above
review = test[doe_id]
print(f"{len(caught)} of 45 authors are caught at rank 1; John Doe = candidate {doe_id!r}, the middle one by probability.\n")

scores = a1.scores(review)
ranked = sorted(scores, key=scores.get, reverse=True)
rows = [[i + 1, c, f"{scores[c]:.3f}", "<-- John Doe" if c == doe_id else ""] for i, c in enumerate(ranked[:6])]
H.show_table(["rank", "candidate", "probability", ""], rows, "The attacker's top 6 for John Doe's review")
print(f"John Doe's rank among 45: {R.rank_of(scores, doe_id)}   | his review has {len(review.split())} words:\n")
print(review.strip()[:420], "...")`,
    },
    {
      id: "human",
      title: "Step 2 · (b) Human strategies: what happens when people try to hide?",
      md: `Each EBG author also wrote, by hand, an **obfuscation** (try to hide your style) and an **imitation** of Cormac McCarthy.
**Careful:** these are *new* essays the volunteers wrote for the study, not rewrites of the held-out review. So this is not a like-for-like comparison with the LLM rewrites in the next steps, which rewrite the very same text.
The table gives the same three numbers as before over all 45 authors, plus John Doe's own rank, so one example is never the whole story.`,
      code: String.raw`ranks_obf = R.ranks_of(a1, obf)
ranks_imi = R.ranks_of(a1, imi)
rows = [["no defense", *R.summary(ranks_none), ranks_none[doe_id]],
        ["human obfuscation", *R.summary(ranks_obf), ranks_obf[doe_id]],
        ["human imitation (McCarthy)", *R.summary(ranks_imi), ranks_imi[doe_id]]]
H.show_table(["text", "caught at rank 1", "within top 5", "median rank", "John Doe's rank"], rows,
             "Koppel-512 + logistic regression, 45 authors, one text each (by luck: 2% at rank 1, 11% within top 5, median rank 23)")
s = a1.scores(obf[doe_id])
print(f"John Doe's own obfuscation: rank {R.rank_of(s, doe_id)} of 45 | the attacker's top guess is {R.top_guess(s)!r}")`,
    },
    {
      id: "llm",
      title: "Step 3 · (c) LLM strategies: one rewrite, before and after",
      md: `Now John Doe asks a language model to rewrite his held-out review. Pick a **strategy** (the exact prompt is shown) and a **model** from the menus, then run the box.
The rewrite is a real one, made earlier by one of four open models (one sample per text and strategy), so you do not need an account or an internet connection to a chatbot.

The word diff shows what changed (red = removed, green = added). Does the rewrite still say what John Doe meant?`,
      controls: "llm",
      code: String.raw`# strategy_id and cache_config are set by the menus above.
import json
from js import ask_llm                      # helper in app.js: reads the ready-made rewrites

reply = json.loads(await ask_llm("ch4", doe_id, strategy_id, review, cache_config))
if "error" in reply:
    raise RuntimeError(reply["error"])
rewrite = reply["text"]
print("Rewrite source:", reply["source"], "\n")

before, after = a1.scores(review), a1.scores(rewrite)
H.show_table(["text", "P(John Doe)", "his rank of 45", "attacker's top guess"],
             [["original review", f"{before[doe_id]:.2f}", R.rank_of(before, doe_id), R.top_guess(before)],
              ["rewrite", f"{after[doe_id]:.2f}", R.rank_of(after, doe_id), R.top_guess(after)]])
print(H.diff_stats(review, rewrite))
H.show_html(H.word_diff_html(review, rewrite))           # red = removed, green = added`,
    },
    {
      id: "llmall",
      title: "Step 4 · All 45 authors, all four strategies, four models",
      md: `One rewrite of one text proves little. The ready-made set has rewrites of **all 45** held-out texts, for four strategies (**obfuscation**, **imitation** of Cormac McCarthy, **simplification** into Special English, and a **round trip** English to Chinese to English) by four small open models.
This box scores them all with the same attacker. Compare every row with the *no defense* row, and look at the whole 45, not only at John Doe.
Each "all four models" row pools the 4 x 45 = 180 rewrites of one strategy; the last column gives John Doe's rank (for the pooled rows: one rank per model).`,
      code: String.raw`from js import cache_all, cache_configs

cfgs = json.loads(await cache_configs("ch4"))                # 4 model configurations
strategies = [("obfuscation", "obfuscation"), ("imitation", "imitation (McCarthy)"),
              ("simplification", "simplification (Special English)"), ("backtranslation", "round trip via Chinese")]
llm = {}                                                    # (configuration, strategy) -> {author: rewrite of that author's held-out text}
for c in cfgs:
    cached = json.loads(await cache_all("ch4", c))
    for s, _ in strategies:
        llm[(c, s)] = {a: cached[f"{a}|{s}"] for a in authors}

def short(c):
    return cfgs[c]["model"].split("/")[-1]

rows = [["(none)", "no defense", *R.summary(ranks_none), ranks_none[doe_id]],
        ["(a person, a NEW essay)", "human obfuscation", *R.summary(ranks_obf), ranks_obf[doe_id]],
        ["(a person, a NEW essay)", "human imitation", *R.summary(ranks_imi), ranks_imi[doe_id]]]
for s, label in strategies:
    per_model = []
    for c in cfgs:
        rk = R.ranks_of(a1, llm[(c, s)])
        per_model.append(rk)
        rows.append([short(c), label, *R.summary(rk), rk[doe_id]])
    rows.append(["ALL FOUR MODELS", label, *R.summary(R.pooled(per_model)), ", ".join(str(rk[doe_id]) for rk in per_model)])
H.show_table(["who rewrote", "strategy", "caught at rank 1", "within top 5", "median rank", "John Doe's rank"], rows,
             "Koppel-512 + logistic regression, all 45 authors (by luck: 2% at rank 1, 11% within top 5, median rank 23)")`,
    },
    {
      id: "own",
      title: "Step 5 · Try your own disguise",
      md: `Now you play John Doe. Copy his review from the box below, rewrite it **with any chatbot or by hand**, paste your version into the text area, and run the box: the page ranks it with the same attacker (rank among the 45 authors, and the probability it gives to the true author).
Run it first with the text area empty to see the original.

> **Do not paste personal or confidential text into an online chatbot.** John Doe's review is a public research text, so it is fine to use here; your own writing may not be.

A good disguise pushes John Doe's rank down; a good *rewrite* also keeps the meaning. Try one change at a time (for example: shorter sentences, a different register, no contractions) and see what moves the rank.`,
      controls: "paste",
      code: String.raw`# my_text is whatever you pasted into the text area above (empty = just show the original).
import html
my = my_text.strip()
box = html.escape(review.strip())
H.show_html('<p><strong>John Doe\'s original review</strong> (copy it, rewrite it, paste your version above):</p>'
            '<textarea readonly rows="9" class="copybox" aria-label="John Doe\'s original review">' + box + '</textarea>'
            '<p><button type="button" class="btn small" onclick="var t=this.parentNode.previousElementSibling;t.select();'
            'try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand(\'copy\')}">Copy the review</button></p>')

if not my:
    print("Nothing pasted yet: paste your rewrite into the text area above and run this box again.")
else:
    ranked, (rank, prob) = R.rank_among(a1, my, doe_id)
    o_ranked, (o_rank, o_prob) = R.rank_among(a1, review, doe_id)
    H.show_table(["text", "P(John Doe)", "his rank of 45", "attacker's top guess"],
                 [["original review", f"{o_prob:.2f}", o_rank, o_ranked[0][0]],
                  ["your rewrite", f"{prob:.2f}", rank, ranked[0][0]]])
    H.show_table(["rank", "candidate", "probability", ""],
                 [[i + 1, c, f"{p:.3f}", "<-- John Doe" if c == doe_id else ""] for i, (c, p) in enumerate(ranked[:5])],
                 "The attacker's top 5 for your rewrite")
    print(H.diff_stats(review, my))
    if len(R.words(my)) < 150:
        print("Note: your text is short (under 150 words); the attacker is less reliable on short texts.")
    H.show_html(H.word_diff_html(review, my))`,
    },
    {
      id: "takeaway",
      title: "Takeaway",
      md: `**In plain English.** Without any defense this simple attacker names the right writer first for two of every three people (30 of 45). Every LLM strategy lowers that, but none makes the writer disappear: a quick rewrite by a small model still leaves roughly one writer in five (imitation, simplification) to one in three or more (obfuscation, round trip through Chinese) caught at rank 1, and about half or more of the writers are still among the attacker's top five.
The round trip through Chinese is the one that leaves the most writers caught (39% of the 180 rewrites). The human obfuscations and imitations fool this attacker most, but those are new essays, not rewrites of the same text, so they are not a fair match for the LLM rows.
Meaning is the second price: look at the word diff and ask whether John Doe would still be saying what he meant.

And remember the setting. 45 candidates, a company that somehow has everyone's writing, texts from the same pre-existing source, and one simple attacker of our own. A disguise that beats this attacker is not proof that it beats a stronger one.
In the real case the court did not need any of this: it held that Machine Zone had not made the required prima facie showing. Nothing here says the real Machine Zone could have unmasked anyone; it shows what the *question* looks like when you take it seriously.`,
    },
  ],
});
