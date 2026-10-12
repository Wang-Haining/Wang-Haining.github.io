// LEGACY Case 4 (RJ version, kept but no longer the default; the default Case 4 is chapters/ch4.js on the EBG corpus).
// John Doe vs Machine Zone, a counterfactual on the Riddell-Juola (RJ) corpus.
// Data: RJ corpus (CC0), 20 candidate authors; prompts.json copied from the book's ch07 experiment; rewrites_cache.json holds PLACEHOLDERS.
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch4rj",
  dir: "ch4_rj",
  hidden: true,       // legacy Riddell-Juola version: open it with index.html#ch4rj (no tab)
  tab: "4rj",
  nav: "John Doe vs Machine Zone",
  title: "Case 4 (legacy RJ version) · Machine Zone vs. John Doe: what if the company had tried stylometry?",
  llm: true,
  data: ["data/ch4_rj/pool.json", "data/ch4_rj/function_words.json", "data/ch4_rj/population.json", "data/ch4_rj/prompts.json", "data/ch4_rj/rewrites_cache.json"],
  intro: `**Legacy version (Riddell-Juola corpus, 20 candidates).** The default Case 4 now uses the EBG corpus; see index.html#ch4.

**The story.** An anonymous Glassdoor review titled "A Scandal" criticized Machine Zone. The company sued the anonymous poster ("John Doe") for breach of contract and asked Glassdoor to identify him.
The appellate court held that Glassdoor could assert its users' rights and directed that the motion to compel be denied, because Machine Zone had not made the required prima facie showing. **No stylometry was used in the real case.** This chapter asks "what if":
suppose the company had other writing by its employees (reports, emails) and tried to match the review to a writer.

**What we use.** We do not have the real review, so we use the **Riddell-Juola corpus**, in which volunteers supplied pre-existing writing and also wrote one new essay under one instruction:
write normally, *obfuscate* (hide your style), *imitate* Cormac McCarthy, or use *Special English*. We invent a "company" of 20 employees and call one of them **John Doe**.
Then we play both sides: the attacker, and John Doe trying to hide, first by hand, then with a large language model.

**The honest twist.** A disguise is tested against *one* attacker. Always ask what a *different* attacker would see.`,
  credits: `Data: Riddell-Juola corpus (CC0), Wang, Juola and Riddell (2026) for the reproduction. Strategy prompts: the book's chapter 7 experiment. Story of the case: chapter 1 of the book (the court's decision, no stylometry reported); everything about stylometry here is hypothetical.`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · The company and the anonymous review",
      md: `The "company" has 20 employees. For each, we have **reference writing**: pieces of about 500 words from things they wrote before. Each person also wrote one *new* essay for the study (under one of four instructions).

**John Doe** is one of the 20. His anonymous "review" is one 500-word piece of his writing that we **hold back**: the attacker never sees it during training.
*We picked this John Doe on purpose*: he is the first employee in a seeded search whose review is easy to link to him, so that there is a clear "before" to defend against. Section (b) shows what is typical.`,
      packages: ["numpy"],
      code: String.raw`import json
import numpy as np
import lab_helpers as H
import lab_ch4 as R                        # two attackers, written for this lab

pool = R.load_json("data/ch4_rj/pool.json")                    # 20 candidates (Riddell-Juola corpus, CC0)
fw = R.load_json("data/ch4_rj/function_words.json")["words"]   # the function-word list (as in Case 2)
authors, doe_id = pool["authors"], pool["doe"]
doe = next(a for a in authors if a["id"] == doe_id)
review = doe["blocks"][pool["doe_heldout_block"]]           # John Doe's anonymous "review"

# Training material: everything the company has, except the review itself
hold = (doe_id, pool["doe_heldout_block"])
train_texts = [t for a in authors for i, t in enumerate(a["blocks"]) if (a["id"], i) != hold]
train_labels = [a["id"] for a in authors for i, t in enumerate(a["blocks"]) if (a["id"], i) != hold]

print(len(authors), "candidates,", len(train_texts), "reference pieces of about 500 words")
print("John Doe is candidate", doe_id, "| his review has", len(review.split()), "words:\n")
print(review[:420], "...")`,
    },
    {
      id: "attack",
      title: "Step 1 · (a) No defense: who does the attacker think wrote it?",
      md: `**Attacker 1** counts function words (as in Cases 1 and 2) and uses a logistic regression. It gives every employee a probability. The employee with the highest probability is its top guess.
What matters for John Doe is his **rank**: 1 means the attacker's top pick is him.`,
      packages: ["scikit-learn"],
      code: String.raw`a1 = R.FWAttacker(train_texts, train_labels, fw)          # trains in a second or two
scores = a1.scores(review)                                  # probability for each of the 20 employees
ranked = sorted(scores, key=scores.get, reverse=True)

rows = [[i + 1, c, f"{scores[c]:.3f}", "<-- John Doe" if c == doe_id else ""] for i, c in enumerate(ranked[:6])]
H.show_table(["rank", "employee", "probability", ""], rows, "The attacker's top 6")
print(f"John Doe's rank among 20 employees: {R.rank_of(scores, doe_id)}   (a coin toss among 20 would put him at about rank 10)")`,
    },
    {
      id: "human",
      title: "Step 2 · (b) Human strategies: what happens when people try to hide?",
      md: `In this corpus, real people did try. Each wrote one new 500-word essay after being asked to **obfuscate**, **imitate Cormac McCarthy**, or use **Special English**, or just to **write normally** (control).

First, John Doe's own try (he was in the obfuscation group). Then every employee's essay, and finally all 83 people in the whole corpus.
**Read with care:** these essays are new texts on different topics from the reference writing, so even a *normal* new essay is hard to link. Compare each strategy with *control*, not with a perfect score.`,
      code: String.raw`# John Doe's own human obfuscation essay, against the same attacker
s = a1.scores(doe["essay"])
print(f"John Doe, human obfuscation: rank {R.rank_of(s, doe_id)} of 20 | top guess = {R.top_guess(s)}\n")

# All 20 employees: rank of the true author for each one's new essay
rows = []
for a in authors:
    rows.append([a["strategy"], a["id"], R.rank_of(a1.scores(a["essay"]), a["id"])])
rows.sort()
H.show_table(["instruction", "employee", "rank of true author (1 = caught)"], rows, "20 employees, one new essay each (5 per instruction: far too few to conclude anything)")

# The whole corpus: 83 candidates, same kind of attacker (precomputed by tools/build_ch4_rj.py)
pop = R.load_json("data/ch4_rj/population.json")
rows = []
for k in ["control", "obfuscation", "imitation", "special_english"]:
    rk = np.array([e["rank"] for e in pop["essays"] if e["strategy"] == k])
    rows.append([k, len(rk), f"{np.mean(rk == 1):.0%}", f"{np.mean(rk <= 10):.0%}", int(np.median(rk))])
H.show_table(["instruction", "people", "caught at rank 1", "within top 10", "median rank"], rows, "All %d candidates (luck: 1%% at rank 1, 12%% within the top 10, median rank 42)" % pop["n_candidates"])`,
    },
    {
      id: "llm",
      title: "Step 3 · (c) LLM strategies: ask a language model to rewrite the review",
      md: `Now John Doe asks an AI model to rewrite his review. Pick a strategy (the exact prompt is shown), then run the box. The rewrite comes through the class proxy if you typed the class passcode at the top; otherwise from a **cached** rewrite.

!!Placeholder warning:!! the cached rewrites in this prototype were written by hand to test the page. They are **not** output of a model, so do not read the attacker's numbers for them as evidence about LLM defenses.
The word diff shows what changed. Does the rewrite still say what John Doe meant?`,
      controls: "llm",
      code: String.raw`# strategy_id is set by the menu above.
import json
from js import ask_llm                      # helper in app.js: asks the proxy, or reads the cache

reply = json.loads(await ask_llm("ch4_rj", doe_id, strategy_id, review))
if "error" in reply:
    raise RuntimeError(reply["error"])
rewrite = reply["text"]
rewrites = globals().get("rewrites", {})    # keep every rewrite for the next steps
rewrites[strategy_id] = rewrite
print("Rewrite source:", reply["source"], "\n")

before, after = a1.scores(review), a1.scores(rewrite)
H.show_table(["text", "P(John Doe)", "his rank of 20", "attacker's top guess"],
             [["original review", f"{before[doe_id]:.2f}", R.rank_of(before, doe_id), R.top_guess(before)],
              ["rewrite", f"{after[doe_id]:.2f}", R.rank_of(after, doe_id), R.top_guess(after)]])
print(H.diff_stats(review, rewrite))
H.show_html(H.word_diff_html(review, rewrite))           # red = removed, green = added`,
    },
    {
      id: "second",
      title: "Step 4 · (d) A second attacker, and the one-paragraph takeaway",
      md: `Everything so far was tuned against **Attacker 1** (function words). **Attacker 2** reads something else: every run of three characters (*the*, *ing*, *ent*...) with a linear support vector machine.
This box scores the original review, John Doe's own human obfuscation, and all four LLM strategies against **both** attackers.
A score is not a probability for Attacker 2, only a rank. It asks for any rewrites you have not made yet (live, this is up to five proxy calls).`,
      code: String.raw`import json
from js import ask_llm

a2 = R.Char3Attacker(train_texts, train_labels)

rewrites = globals().get("rewrites", {})
sources = {}
for k in ["obfuscation", "imitation", "simplification", "backtranslation"]:
    if k not in rewrites:
        reply = json.loads(await ask_llm("ch4_rj", doe_id, k, review))
        if "error" in reply:
            raise RuntimeError(reply["error"])
        rewrites[k] = reply["text"]; sources[k] = reply["source"]

texts = {"original review": review, "human obfuscation (own essay)": doe["essay"]}
texts.update({"LLM: " + k: v for k, v in rewrites.items()})
rows = []
for name, t in texts.items():
    s1, s2 = a1.scores(t), a2.scores(t)
    rows.append([name, R.rank_of(s1, doe_id), R.top_guess(s1), R.rank_of(s2, doe_id), R.top_guess(s2),
                 "" if name.startswith(("original", "human")) else H.diff_stats(review, t).split("%")[0] + "%"])
H.show_table(["text", "Attacker 1: Doe's rank", "top guess", "Attacker 2: Doe's rank", "top guess", "words unchanged"], rows,
             "Rank 1 = Doe is caught. The LLM rows are cached PLACEHOLDERS unless the live proxy was used.")
for k, v in sources.items():
    print(k, "->", v)`,
    },
    {
      id: "takeaway",
      title: "Takeaway",
      md: `**A disguise can fool one attacker and not another.** A rewrite that moves the function words an attacker relies on may leave other habits behind (spelling, punctuation, word choice, names and topics), and a differently built attacker still picks them up.
Meaning is the second price: look at the word diff and ask whether John Doe would still be saying what he meant. And remember the setting: 20 candidates, one chosen example, a company that somehow has everyone's writing.
Nothing here says the real Machine Zone could have unmasked anyone; it shows what the *question* looks like when you take it seriously.`,
    },
  ],
});
