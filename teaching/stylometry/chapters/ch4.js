// Case 4: Protect John Doe. Machine Zone vs. John Doe (Glassdoor v. Superior Court); the stylometry is a what-if, and the student plays the DEFENDER.
// Data: EBG corpus (Extended Brennan-Greenstadt; PSAL Anonymouth repository, AGPL-3.0), shipped in data/ch4/ebg/ (same origin as the page;
// data/ch4/ebg_manifest.json lists every file and its SHA-256, which Python checks on loading).
// data/ch4/rewrites_cache.json: retained rewrites of the 45 EBG test texts from Haining Wang's local-LLM benchmark (derived from AGPL data).
// The one attacker is 224 function words + logistic regression (lab_ch4.FW224Attacker). The earlier Riddell-Juola version is chapters/ch4_rj.js (index.html#ch4rj).
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch4",
  tab: "4",
  nav: "Protect John Doe",
  title: "Case 4 · Protect John Doe",
  llm: true,
  data: ["data/ch4/ebg_manifest.json", "data/function_words_224.json"],
  remote: { manifest: "data/ch4/ebg_manifest.json", dest: "data/ch4/ebg" },
  intro: `**What happened.** An anonymous online review titled "A Scandal" criticized the game company Machine Zone. Machine Zone sued the anonymous poster, "John Doe" (described by the court as a former employee), and tried to obtain his identity from the review website.
The California Court of Appeal (2017) ruled against forcing disclosure, because Machine Zone had not made the required showing that the review broke his confidentiality agreement.

> **Everything below is a "what if".** The court did not use stylometry. We ask: what if the company had used a computer to compare the review with its employees' writing?

**You are on John Doe's side.** You are the defender. The attacker is a small program that learned the small-word habits of **45 possible writers**. If it names John Doe first, he is exposed.
**You win** when the attacker can no longer pick John Doe, **and** the review still says the same thing.

**The plan.** First we see how exposed John Doe is: the attack with no defense is our baseline. Then we try disguises: writing differently by hand, and ready-made rewrites by language models (a translation round trip, simple English, a McCarthy-style rewrite). Last, you write your own disguise and see if it works.

**What we use.** We do not have the real review, so John Doe here is a stand-in: one of 45 volunteer writers in the **Extended Brennan-Greenstadt (EBG)** corpus. Each volunteer supplied about 15 pieces of earlier writing (roughly 500 words each).
The attacker is the same simple one as in Case 1: **224 small words + logistic regression**. The rewrites are ready-made, so you need no account.`,
  credits: `Data: the Extended Brennan-Greenstadt (EBG) corpus from the PSAL Anonymouth repository (https://github.com/psal/anonymouth, jsan_resources/corpora/amt; Copyright 2011-2013 Privacy, Security and Automation lab, Drexel University; AGPL-3.0). The files are copied unchanged into this lab's data/ch4/ebg/ folder, with the licence and notice; the page checks every file's SHA-256 against the pinned commit.
LLM rewrites: Wang (2026) local-LLM benchmark, retained outputs; they are machine rewrites of EBG texts, so they are shared under the same AGPL-3.0 terms. Strategy prompts: the same benchmark. Function-word list: derived for this lab (the 224-word list FW in unabom/scripts/verify.py, also used in Case 2). The case: Glassdoor, Inc. v. Superior Court (Machine Zone, Inc.), 9 Cal. App. 5th 623 (2017). Everything about stylometry here is hypothetical.`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · Open the box: 45 writers and one review",
      md: `Click the round **▶** next to a code box to run it, from top to bottom.

The box holds the writing of **45 candidates**. The attacker will use each person's earlier writing (**training pieces**) to learn their habits. One more text per person is kept aside, the **held-out text**: it plays the role of the anonymous review.

**What you'll see:** how many writers and pieces there are.`,
      packages: ["numpy"],
      code: String.raw`import json
import numpy as np
import lab_helpers as H                     # small display helpers written for this lab
import lab_ch4 as R                         # the EBG loader, the attacker and the plots of this case

authors, train, test, obf, _ = R.load_ebg()           # every file is checked against its SHA-256
words = H.load_fw224()                                # the 224 small words (as in Case 1)
train_texts = [t for a in authors for t in train[a]]  # the earlier writing, one text per piece
train_labels = [a for a in authors for t in train[a]] # who wrote each piece

print(len(authors), "candidates,", len(train_texts), "training pieces")
print(len(test), "held-out texts, about", round(np.mean([len(R.words(t)) for t in test.values()])), "words each")
authors[:10]`,
    },
    {
      id: "raw",
      title: "Step 1 · Read one writer's earlier writing",
      md: `This is the raw material: ordinary writing, about 500 words a piece. The attacker never reads it for its meaning. It only counts small words.

**What you'll see:** the start of one training piece by candidate \`aa\`.
**Try it:** change \`"aa"\` to another candidate from the list above.`,
      code: String.raw`who = "aa"                                  # try another candidate
piece = train[who][0]                       # the first training piece of this writer
print(len(train[who]), "pieces by", who, "| this one has", len(piece.split()), "words\n")
print(piece.strip()[:600], "...")`,
    },
    {
      id: "numbers",
      title: "Step 2 · Turn a text into 224 numbers",
      md: `A computer cannot judge a style by feel, so we turn each text into numbers. We count how often each of **224 small words** appears (*the, of, and, which, because, ...*). These words carry no topic, but every writer uses them in a personal way.
A list of numbers describing one text is called its **features**.

**What you'll see:** the 224 counts of one piece, and its ten most used small words.`,
      code: String.raw`counts = H.fw_counts(piece, words)          # 224 numbers: how often each small word appears
print("The piece becomes a list of", len(counts), "numbers:")
print(counts[:20], "...\n")
top = sorted(zip(words, counts), key=lambda p: -p[1])[:10]
print("its ten most used small words:", top)
len(counts)`,
    },
    {
      id: "habits",
      title: "Step 3 · See the small-word habits of all 45 writers",
      md: `Each dot is one writer: how often they use a small word **per 100 words**, over all their earlier writing. The dots spread out. That spread is what the attacker uses: a writer who sits far from the crowd on many words is easy to spot.

**What you'll see:** one row per word, 45 grey dots per row.
**Try it:** change the word list (for example \`"which"\`, \`"however"\`, \`"very"\`).`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`WORDS = ["the", "that", "to", "and"]          # try other small words
known = {a: R.rates(train[a], WORDS) for a in authors}      # each writer's habit: times per 100 words
H.show_plot(R.strip_plot(known, None, None, WORDS, "Every writer has small-word habits"))`,
    },
    {
      id: "xy",
      title: "Step 4 · Build X and y for the attacker",
      md: `Machine learning needs two things: a table of numbers **X** (one row per training piece, one column per small word) and the right answers **y** (who wrote each piece).
The attacker learns from them.

**What you'll see:** the size of X and the first answers in y.`,
      code: String.raw`X = np.array([H.fw_counts(t, words) for t in train_texts])   # the table: 1 row per piece
y = np.array(train_labels)                                      # the right answers: who wrote it

print("X has", X.shape[0], "rows (pieces) and", X.shape[1], "columns (small words)")
print("the first 8 answers in y:", y[:8])
X.shape`,
    },
    {
      id: "train",
      title: "Step 5 · Train the attacker",
      md: `**Training** means the computer adjusts itself until it can tell the 45 writers apart on the pieces it studies. Our attacker does three things: it turns counts into **shares** (so a long text is not "louder" than a short one), puts every word on the same scale, and fits a **logistic regression**, which gives each word a weight for each writer.
For any new text, it answers with a **probability for each of the 45 candidates**. The probabilities add up to 1.

**What you'll see:** the attacker trains in a few seconds, and its probabilities for one text.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`a1 = R.FW224Attacker(train_texts, train_labels, words)    # shares -> same scale -> logistic regression

p = a1.scores(test["aa"])                    # one probability per candidate, for the held-out text of "aa"
print("the attacker gives", len(p), "probabilities; together they add up to", round(sum(p.values()), 3))
round(p["aa"], 3)`,
    },
    {
      id: "rank",
      title: "Step 6 · What \"rank 1 among 45\" means",
      md: `Sort the 45 candidates from most to least likely. The true writer's place in that list is his **rank**. **Rank 1** means the attacker's top pick is right: the writer is **caught**. Rank 2 means he was its second pick.
If the attacker only guessed, any writer would be rank 1 with chance **1 in 45** (2.2%). Rank 1 is bad for a writer who wants to hide. A high number, like rank 40, is good.

**What you'll see:** the 45 candidates for one held-out text, best guess on the left. The true writer is the dark bar.`,
      packages: ["matplotlib"],
      code: String.raw`who = "aa"                                  # a volunteer, to practise reading the chart
scores = a1.scores(test[who])               # the attacker's probabilities for the held-out text
print("by pure luck:", f"1 in 45 = {1/45:.1%}", "| the attacker's rank for", who, "=", R.rank_of(scores, who))
H.show_plot(R.rank_bars(scores, who, R.INK, "Who does the attacker think wrote this text?", name="Writer " + who))`,
    },
    {
      id: "baseline",
      title: "Step 7 · The baseline: attack all 45 writers with no defense",
      md: `Now we run the attack on every writer's held-out text, with nobody hiding. Each square below is one writer. A dark square means the attacker named him first.
Three numbers describe the result: how many are caught at **rank 1**, how many are **within the top 5**, and the **median rank** (the middle one of the 45).

**What you'll see:** 21 of the 45 are caught. By luck it would be about 1.

> This is our baseline. Every disguise below is measured against it.`,
      packages: ["matplotlib"],
      code: String.raw`ranks_none = R.ranks_of(a1, test)           # rank of the true writer for each of the 45 held-out texts
H.show_table(["", "caught at rank 1", "within top 5", "median rank"],
             [["no defense", *R.summary(ranks_none)], ["pure luck", "1/45 (2%)", "5/45 (11%)", "23"]],
             "The attack on 45 writers who do nothing to hide")
H.show_plot(R.waffle(ranks_none, R.INK, "How many writers does the attacker catch with no defense?"))`,
    },
    {
      id: "doe",
      title: "Step 8 · Choose John Doe by a fair rule",
      md: `John Doe must be one of the writers the attacker catches, or there would be nothing to defend. To avoid cherry-picking, we use a rule: take the caught writers, sort them by the probability the attacker gave them, and pick the **middle** one.
He is an ordinary exposed writer, not the easiest and not the hardest. His square gets a black frame.

**What you'll see:** John Doe's id, and the waffle with his square marked.`,
      packages: ["matplotlib"],
      code: String.raw`doe_id, caught = R.pick_john_doe(a1, test)  # the middle one of the 21 caught writers, by probability
review = test[doe_id]                       # his held-out text plays the anonymous review
print(f"John Doe = candidate {doe_id!r}; the attacker gives him probability {dict(caught)[doe_id]:.2f}")
H.show_plot(R.waffle(ranks_none, R.GREY, "John Doe is one of the caught writers", doe=doe_id))`,
    },
    {
      id: "review",
      title: "Step 9 · Compare John Doe's review with his own habits",
      md: `This is the review that must stay anonymous. The attacker holds John Doe's earlier writing and compares. In each row below, the **diamond** is John Doe's habit in his earlier writing, the **star** is the same word in the review, and the grey dots are the other 44 writers.
When the star sits near the diamond and away from the crowd, the review gives him away.

**What you'll see:** the start of the review, then his habits on four small words.
**Try it:** change the words.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`print(f"John Doe's review has {len(review.split())} words:\n")
print(review.strip()[:450], "...")

WORDS = ["the", "that", "to", "and"]                       # try other small words
known = {a: R.rates(train[a], WORDS) for a in authors}     # every writer's habit from earlier writing
H.show_plot(R.strip_plot(known, R.rates([review], WORDS), doe_id, WORDS, "John Doe's review vs his own habits"))`,
    },
    {
      id: "exposed",
      title: "Step 10 · How exposed is John Doe? Can the attacker find him?",
      md: `Now the attacker reads the review and ranks all 45 candidates. The dark bar is John Doe.
If his bar is the tallest, the attacker names him first, and he is exposed.

**What you'll see:** a table of the attacker's top picks and the bar chart of all 45 candidates.`,
      packages: ["matplotlib"],
      code: String.raw`scores = a1.scores(review)                  # probability for each of the 45 candidates
ranked = sorted(scores, key=scores.get, reverse=True)       # best guess first
rows = [[i + 1, c, f"{scores[c]:.3f}", "<-- John Doe" if c == doe_id else ""] for i, c in enumerate(ranked[:5])]
H.show_table(["rank", "candidate", "probability", ""], rows, "The attacker's top 5 for John Doe's review")
H.show_plot(R.rank_bars(scores, doe_id, R.INK, "Can the attacker find John Doe? (no defense)"))`,
    },
    {
      id: "goals",
      title: "Step 11 · Your two goals: hide him and keep what he said",
      md: `A disguise has to do **two things at once**: (1) push John Doe down the attacker's list, and (2) leave the meaning of the review as it was. Hiding alone is easy: hand in a different text.
To see why that fails, we swap in a held-out text by another candidate. The attacker is fooled. But the new text says nothing John Doe meant.
We also count the **words kept**: the share of John Doe's words that are still in the new text. If few survive, the meaning is gone.

**What you'll see:** John Doe's rank for the swapped text, and how few of his words it keeps.`,
      code: String.raw`other = authors[0]                          # a different volunteer, to show the trick
fake = test[other]                          # hand in HIS text instead of John Doe's review
s = a1.scores(fake)
print("John Doe's rank for the swapped text:", R.rank_of(s, doe_id), "of 45   (before: 1)")
print(f"words of John Doe's review kept: {R.words_kept(review, fake):.0%}")
print("It hides him, but it no longer says what he said. That is a failed disguise.")`,
    },
    {
      id: "human",
      title: "Step 12 · Disguise 1: write differently, by hand",
      md: `The first disguise is human. Every EBG volunteer also wrote an **obfuscation**: a text where they tried to hide their own style.
They show how well people hide when they sit down and try.
Each line below is one writer: the left end is their rank with no disguise, the **blue** end is their rank after hiding by hand. John Doe's line is the thick one. A line that goes **down** the chart means the writer is harder to find.

**What you'll see:** the human obfuscation table and the slope chart.`,
      packages: ["matplotlib"],
      code: String.raw`ranks_obf = R.ranks_of(a1, obf)             # rank of the true writer for each hand-written disguise
H.show_table(["", "caught at rank 1", "within top 5", "median rank", "John Doe's rank"],
             [["no disguise", *R.summary(ranks_none), ranks_none[doe_id]],
              ["write differently, by hand", *R.summary(ranks_obf), ranks_obf[doe_id]]],
             "Hiding by hand: 45 writers, one new essay each")
H.show_plot(R.slope(ranks_none, ranks_obf, R.BLUE, "Can the attacker still find John Doe? Writing differently by hand", doe=doe_id, after_label="wrote differently by hand"))`,
    },
    {
      id: "llm",
      title: "Step 13 · Disguise 2: a language model rewrites the review",
      md: `Most people will not rewrite by hand, so John Doe asks a language model. A **strategy** is the instruction we give the model, such as "write it differently" or "use simple English". Four strategies are ready:

- **write differently** (blue): hide the author's style;
- **translation round trip** (teal): English to Chinese and back to English;
- **simple English** (purple): plain Special English;
- **McCarthy style** (orange): write like the novelist Cormac McCarthy.

Pick a strategy and a model in the menus above (the exact instruction is shown), then run the box. The rewrite is a real one, made earlier by one of four open models, so you need no account.
The word diff shows what changed: red = removed, green = added.

**What you'll see:** John Doe's rank before and after, the share of words kept, and the diff. Does the rewrite still say what he meant?`,
      controls: "llm",
      packages: ["matplotlib"],
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
print(f"words of the review kept: {R.words_kept(review, rewrite):.0%}  |  ", H.diff_stats(review, rewrite))
H.show_plot(R.rank_bars(after, doe_id, R.COLOR[strategy_id], "Can the attacker still find John Doe? After this rewrite"))
H.show_html(H.word_diff_html(review, rewrite))           # red = removed, green = added`,
    },
    {
      id: "llmall",
      title: "Step 14 · Score every ready-made rewrite",
      md: `One rewrite is one story. To judge a strategy we need all 45 writers. The ready-made set has rewrites of **all 45** held-out texts, for the 4 strategies, by 4 small open models: 4 x 4 x 45 = 720 rewrites.
This box runs the attacker on all of them and counts the writers it still catches at rank 1. For each strategy, "all four models" pools 4 x 45 = 180 rewrites.

**What you'll see:** a table, one row per strategy. It takes a few seconds.`,
      code: String.raw`from js import cache_all, cache_configs

cfgs = json.loads(await cache_configs("ch4"))              # the 4 models that made the rewrites
llm, ranks_llm, kept_llm = {}, {}, {}
for c in cfgs:
    cached = json.loads(await cache_all("ch4", c))         # all ready-made rewrites of one model
    for s, _ in R.STRATEGIES:
        llm[(s, c)] = {a: cached[f"{a}|{s}"] for a in authors}                          # one rewrite per writer
        ranks_llm[(s, c)] = R.ranks_of(a1, llm[(s, c)])                                 # rank of the true writer
        kept_llm[(s, c)] = {a: R.words_kept(test[a], t) for a, t in llm[(s, c)].items()}   # share of words kept

short = {c: cfgs[c]["model"].split("/")[-1] for c in cfgs}
rows = []
for s, label in R.STRATEGIES:
    caught = [sum(v == 1 for v in ranks_llm[(s, c)].values()) for c in cfgs]
    rows.append([label, *[f"{k}/45" for k in caught], f"{sum(caught)}/180"])
H.show_table(["strategy", *short.values(), "all four models"], rows, "Writers still caught at rank 1 (no defense: 21/45)")`,
    },
    {
      id: "s-obf",
      title: "Step 15 · Strategy 1 (blue): write differently",
      md: `The model is told to rewrite the text so that the author's style is hidden. The chart groups the 45 writers by rank: dark is no defense, blue is this strategy (all four models, scaled to 45 writers).
A good strategy moves writers **to the right**, into the high ranks.

**What you'll see:** the bars, and John Doe's rank after each of the four models.
**Try it:** change \`S\` to \`"backtranslation"\`, \`"simplification"\` or \`"imitation"\`.`,
      packages: ["matplotlib"],
      code: String.raw`S = "obfuscation"                          # the strategy: write differently
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])        # 4 models x 45 writers
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? Write differently"))`,
    },
    {
      id: "s-bt",
      title: "Step 16 · Strategy 2 (teal): a translation round trip",
      md: `The text goes to Chinese and comes back to English. The meaning mostly survives, because the translator tries to keep it. But does the style leave?

**What you'll see:** the same chart for the round trip, and John Doe's rank after each model.`,
      packages: ["matplotlib"],
      code: String.raw`S = "backtranslation"                      # the strategy: English -> Chinese -> English
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? Translation round trip"))`,
    },
    {
      id: "s-simple",
      title: "Step 17 · Strategy 3 (purple): simple English",
      md: `The model is told to rewrite the text in plain, short Special English. Short common words replace long rare ones, and sentences get simpler. That changes the small words a lot.

**What you'll see:** the same chart for simple English. Compare how many writers land in "rank 16-45".`,
      packages: ["matplotlib"],
      code: String.raw`S = "simplification"                       # the strategy: simple English
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? Simple English"))`,
    },
    {
      id: "s-mc",
      title: "Step 18 · Strategy 4 (orange): a McCarthy-style rewrite",
      md: `The model is told to rewrite the text in the style of the novelist Cormac McCarthy: short, blunt sentences with few commas. It is a style disguise, not a person you are pretending to be.

**What you'll see:** the same chart for the McCarthy-style rewrite.`,
      packages: ["matplotlib"],
      code: String.raw`S = "imitation"                            # the strategy: McCarthy style
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? McCarthy style"))`,
    },
    {
      id: "compare",
      title: "Step 19 · All disguises side by side",
      md: `Now every disguise on one chart. Each bar is the number of writers (out of 45) the attacker still names first. **Shorter is better for John Doe.** The black dots are the four single models; the hollow circle marks how many writers are still in the attacker's top 5.
The dashed line is pure luck: about 1 writer.

**What you'll see:** no disguise at 21; every strategy lower; and hiding by hand lowest of all.`,
      packages: ["matplotlib"],
      code: String.raw`rows = R.compare_rows(ranks_none, ranks_obf, ranks_llm, cfgs)     # one row per disguise
H.show_table(["disguise", "still caught at rank 1 (per 45)", "within top 5 (per 45)"],
             [[r[1], f"{r[2]:.0f}", f"{r[3]:.0f}"] for r in rows], "Writers the attacker still finds")
H.show_plot(R.strategy_compare(rows, "Can the attacker still find the writers? Every disguise"))`,
    },
    {
      id: "tradeoff",
      title: "Step 20 · The price of hiding: how much of John Doe's text survives",
      md: `A rewrite that changes more words hides more, but it also risks losing what John Doe said. Each dot below is one rewrite (720 in all). Left to right is **how many of his words survive**; top to bottom is the **attacker's rank** of the true writer (the lower down, the better hidden). The big dots are the medians.
A rewrite that keeps almost none of his words cannot say what he said.

**What you'll see:** where each strategy sits: how many words it keeps, and how well it hides.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`points = R.tradeoff_points(kept_llm, ranks_llm, cfgs)     # (words kept, rank) for every rewrite
rows = [[R.LABEL[s], f"{100 * np.median([p[0] for p in pts]):.0f}%", f"{np.median([p[1] for p in pts]):g}"] for s, pts in points.items()]
H.show_table(["strategy", "median words kept", "median rank"], rows, "The price of hiding")
H.show_plot(R.tradeoff_plot(points))`,
    },
    {
      id: "grid",
      title: "Step 21 · Where does John Doe himself end up?",
      md: `Averages hide the one case we care about. Here is **John Doe's own rank** after each of the 16 rewrites of his review (4 strategies x 4 models), with the share of his words kept. A strong colour means he is well hidden.
Then we read the best-hidden rewrite and ask the question that matters: does it still say what he said?

**What you'll see:** the grid, and the best rewrite with its word diff.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`table = R.doe_table(doe_id, kept_llm, ranks_llm, cfgs)
H.show_plot(R.doe_grid(table))

best = max(llm, key=lambda k: ranks_llm[k][doe_id])        # the rewrite that hides him best
s, c = best
print(f"The best-hidden rewrite: {R.LABEL[s]} by {short[c]}; John Doe's rank {ranks_llm[best][doe_id]}, words kept {kept_llm[best][doe_id]:.0%}")
H.show_html(H.word_diff_html(review, llm[best][doe_id]))`,
    },
    {
      id: "own",
      title: "Step 22 · Your turn: write John Doe's disguise",
      md: `Now you are the defender. Copy John Doe's review from the box below, rewrite it **by hand or with any chatbot**, paste your version into the text area, and run the box. The page ranks it with the same attacker.
Run it first with the text area empty to see the original.

> **Do not paste personal or confidential text into an online chatbot.** John Doe's review is a public research text, so it is fine to use here; your own writing may not be.

**You win** if John Doe's rank goes **up** (towards 45) **and** your text still says what he said. What the earlier steps suggest: change the small words, such as *the*, *that*, *to* and *and*, and the way sentences are built. Simple English moved him furthest. Try one change at a time and see what moves the rank.

**What you'll see:** the attacker's ranking of the 45 candidates, before and after, John Doe's rank, and the share of his words you kept.`,
      packages: ["matplotlib"],
      controls: "paste",
      code: String.raw`# my_text is whatever you pasted into the text area above (empty = just show the original).
import html
my = my_text.strip()
box = html.escape(review.strip())
H.show_html('<p><strong>John Doe\'s original review</strong> (copy it, rewrite it, paste your version above):</p>'
            '<textarea readonly rows="9" class="copybox" aria-label="John Doe\'s original review">' + box + '</textarea>'
            '<p><button type="button" class="btn small" onclick="var t=this.parentNode.previousElementSibling;t.select();'
            'try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand(\'copy\')}">Copy the review</button></p>')

before = a1.scores(review)
if not my:
    print("Nothing pasted yet: paste your rewrite into the text area above and run this box again.")
    H.show_plot(R.rank_bars(before, doe_id, R.INK, "Can the attacker find John Doe? (the original review)"))
else:
    after = a1.scores(my)
    kept = R.words_kept(review, my)
    H.show_table(["text", "P(John Doe)", "his rank of 45", "attacker's top guess"],
                 [["original review", f"{before[doe_id]:.2f}", R.rank_of(before, doe_id), R.top_guess(before)],
                  ["your rewrite", f"{after[doe_id]:.2f}", R.rank_of(after, doe_id), R.top_guess(after)]])
    print(f"John Doe's rank: {R.rank_of(before, doe_id)} -> {R.rank_of(after, doe_id)} | words of the review kept: {kept:.0%}")
    H.show_plot(R.own_plot(before, after, doe_id, kept))
    H.show_html(H.word_diff_html(review, my))`,
    },
    {
      id: "takeaway",
      title: "You just defended John Doe with a machine-learning project",
      md: `- **Features:** you turned texts into numbers (224 small-word counts).
- **Training:** you built the attacker, a logistic regression that ranks 45 candidates for any text.
- **Baseline:** with no defense it names the right writer first for 21 of 45 (luck would give about 1), and John Doe was one of them.
- **Disguises:** writing differently by hand left 2 of 45 caught. Rewrites by models left 34% caught after a translation round trip, 24% after "write differently", 16% after a McCarthy-style rewrite and 13% after simple English.
- **The price:** hiding more costs words, and words are the meaning. A winning disguise hides John Doe **and** still says what he said.
- **Your disguise:** you tested your own rewrite against the same attacker.

Stuck on a step, or curious why? Ask **B'lawd**, bottom right.`,
    },
  ],
});
