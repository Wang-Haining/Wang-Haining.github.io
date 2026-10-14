// Case 2: The Unabomber (the "statistics" generation).
// Data: derived function-word counts only (data/ch2/fw_counts.json). Method: unabom/scripts/text_level.py (lecture slide 9).
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch2",
  tab: "2",
  nav: "The Unabomber",
  title: "Case 2 · The Unabomber",
  llm: false,
  data: ["data/ch2/fw_counts.json", "data/ch2/excerpts.json"],
  intro: `**The story.** From 1978 to 1995, someone the FBI called the "Unabomber" sent 16 bombs, killing 3 people and injuring 23.
In 1995 he promised to stop if his 35,000-word essay, *Industrial Society and Its Future* (the manifesto), was published; the Washington Post printed it on September 19, 1995.
Linda Patrik and her husband David Kaczynski read it and feared it was David's brother, Ted. From February 1996 they worked with the FBI through a lawyer, handing over Ted's letters and a 1971 essay.
FBI agents compared the documents **by hand**. Ted Kaczynski was arrested at his Montana cabin on April 3, 1996, and pleaded guilty in 1998.
(Sources: the April 3, 1996 search-warrant affidavit; contemporaneous news reports.)

**Our question:** can a computer learn Ted's small-word habits from his 1971 essay, and does the manifesto show them?
We show the computer Ted's 1971 essay labelled "Ted", and 19 other anti-technology writers (Mumford, Ellul, Illich, Postman, Zerzan and others) labelled "not Ted". Then we let it score texts it has never seen.
It only counts **224 small words** (*the, of, which, nevertheless, ...*), in pieces of 1,000 words. No text is shipped, only counts.`,
  credits: `Data: derived function-word counts built from the Ted K Archive texts and an FBI-document transcription of the 1971 essay (see data notes). No impostor or post-arrest text is shipped, only counts. The two short quotations are shown for illustration with attribution. Method: \`unabom/scripts/text_level.py\`.`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · Open the box",
      md: `Welcome to your first machine-learning project. Click the round **▶** next to a code box to run it, and go from top to bottom. Every box shows what it did.

Like in Google Colab, the **last line** of a box shows its value: write a name such as \`fw[:10]\` on the last line and you see it, no \`print\` needed.

Our data are **counts only**: for every 1,000-word piece of text, how many times each of **224 small words** appears. No sentences are shipped.

**What you'll see:** what is in the box, then the first ten small words.`,
      packages: ["numpy"],
      code: String.raw`import json
import numpy as np
import lab_helpers as H                   # small display helpers written for this lab
import lab_ch2 as G                       # the Unabomber data and pictures

D = G.load()                              # all the counts
fw = D["fw"]                              # the 224 small words, in a fixed order

print(f"Ted's 1971 essay:    {len(D['t2']['n'])} pieces of 1,000 words")
print(f"other writers:       {len(D['impostors'])} texts by {len({r['author'] for r in D['impostors']})} anti-technology writers")
print(f"Ted's later essays:  {len(D['ted_post'])} texts, written 1999-2016")
print(f"the manifesto:       {len(D['u14']['n'])} pieces")
fw[:10]                                   # the last line shows its value`,
    },
    {
      id: "samples",
      title: "Step 1 · Read two short samples",
      md: `Ted's 1971 essay and the 1995 manifesto argue the same kind of thing. But many writers attacked technology in those years, so "it sounds like him" proves little.

The computer will ignore the topic and look at something writers hardly notice: their **small words**.

**What you'll see:** the opening line of each text.`,
      code: String.raw`for e in json.load(open("data/ch2/excerpts.json")):
    print(e["source"])
    print('   "' + e["text"] + '"\n')`,
    },
    {
      id: "one-piece",
      title: "Step 2 · What the computer actually sees",
      md: `This is the whole input for one piece of text: **224 numbers**, one per small word, always in the same order. No topic, no meaning, no sentences.

In machine learning, these numbers are called **features**: the measurable things the computer is allowed to look at.

**What you'll see:** the first 24 of the 224 numbers. The order follows the word list from Step 0: \`a\`, \`about\`, \`above\`, ...`,
      code: String.raw`piece = np.array(D["t2"]["counts"][0])           # Ted's 1971 essay, piece 1: 224 numbers
piece[:24]`,
    },
    {
      id: "piece-bars",
      title: "Step 3 · Draw that piece",
      md: `Numbers are easier to read as a picture. Here are the 15 small words this piece uses most.

**What you'll see:** "the", "of" and "to" lead, as in almost any English text. The differences between writers hide further down, in how often they use words like *which*, *because* or *any*.

**Try it:** change \`[0]\` to \`[3]\` to draw piece 4 instead.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`piece = np.array(D["t2"]["counts"][0])
H.show_plot(G.piece_bars(piece, fw))
int(piece.sum())                     # how many of the 1,000 words are small words`,
    },
    {
      id: "strip",
      title: "Step 4 · Ted's small-word habits",
      md: `Now compare writers. Each row is one small word. Each dot is how often a writer uses it **per 1,000 words**: 19 other writers (grey), Ted's 1971 essay (blue diamond), and the manifesto (orange star).

**What you'll see:** in some rows the diamond and the star sit together, away from the grey crowd. That is a habit Ted carried from 1971 into the manifesto.

**Try it:** put other words in the list, e.g. \`"which"\`, \`"of"\`, \`"however"\`, and run again.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`WORDS = ["because", "any", "and", "the"]
H.show_plot(G.dot_strip(D, WORDS))`,
    },
    {
      id: "table",
      title: "Step 5 · Build the training table",
      md: `Machine learning learns from examples with the right answers. We need two things:

- **X**, a table of features: one row per piece, one column per small word.
- **y**, the **labels** (the right answers): 1 for "Ted", 0 for "not Ted".

We use Ted's 1971 essay and the 29 texts by other writers. Ted's later essays and the manifesto stay out: the computer must never see them while learning.

**What you'll see:** the size of the table, rows by columns.`,
      code: String.raw`T = G.counts(D["t2"])                                   # Ted's 6 pieces
I = np.vstack([G.counts(r) for r in D["impostors"]])    # the other writers' 282 pieces

X = np.vstack([T, I])                                   # stack them: Ted first, then the others
y = np.r_[np.ones(len(T)), np.zeros(len(I))]            # 1 for each Ted piece, 0 for each other piece

print("labels of the first 10 rows:", y[:10].astype(int))
X.shape                                                 # (rows, columns)`,
    },
    {
      id: "heatmap",
      title: "Step 6 · Look at a corner of the table",
      md: `A table this big is hard to read, so here is one corner: 6 Ted pieces above the line, 6 other-writer pieces below, and 16 of the 224 columns. Darker = used more. The column **y** on the right holds the answers.

**What you'll see:** some columns already differ: look at *will*, high in every Ted row. But one column is not enough to decide. The computer's job is to combine all 224 columns into one judgement.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`H.show_plot(G.table_heatmap(X, fw, n_ted=len(T)))`,
    },
    {
      id: "shares",
      title: "Step 7 · Turn counts into shares",
      md: `Some pieces happen to contain more small words overall. To compare fairly, we divide each row by its total, so every row adds up to 1. A count of 65 "the" becomes a **share**: "the" is 12.5% of this piece's small words.

This tool is called a **Normalizer**. Tools in scikit-learn (the machine-learning library we use) all work the same way: \`fit\` looks at the data, \`transform\` changes it.

**What you'll see:** one row before and after; the shares add up to 1.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.preprocessing import Normalizer

shares = Normalizer(norm="l1").fit_transform(X)        # divide each row by its total

show = ["the", "of", "and", "which", "because", "any"]
cols = [fw.index(w) for w in show]
print("counts:", X[0, cols].astype(int))
print("shares:", shares[0, cols].round(3))
shares[0].sum()                                          # every row now adds up to 1`,
    },
    {
      id: "scale",
      title: "Step 8 · Put every word on the same scale",
      md: `"the" fills about 13% of small words; "because" fills 0.2%. Left like this, big words would drown out small ones.

So we **rescale** each column: subtract its average and divide by its usual spread. After that, 0 means "as usual", +1 means "a bit more than usual", -1 "a bit less", for every word alike. This tool is a **StandardScaler**.

**What you'll see:** top row, the raw shares of "the" and "because" across all 288 pieces (very different ranges); bottom row, the same words after rescaling, both centred on 0.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`from sklearn.preprocessing import StandardScaler

scaled = StandardScaler().fit_transform(shares)
H.show_plot(G.scale_hist(shares, scaled, fw))
{w: round(float(v), 2) for w, v in zip(show, scaled[0, cols])}     # piece 1, after rescaling`,
    },
    {
      id: "rank",
      title: "Step 9 · Who writes most like the manifesto?",
      md: `Before any training, a first look. For each writer we take the average of all their pieces (after Steps 7 and 8), which gives one **profile** of 224 numbers per writer. Then we measure how closely each profile points the same way as the manifesto's. This measure is called **cosine similarity**: 1 means the same pattern, 0 means unrelated, below 0 means opposite habits.

The manifesto is not used to make the profiles; we only compare against it.

**What you'll see:** 20 bars, one per writer. Ted's 1971 essay (blue) is far ahead of the 19 other writers, who wrote about the same topics in the same decades.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`fig, rank = G.similarity_rank(D, X, n_ted=len(T))
H.show_plot(fig)
[(name, round(sim, 2)) for name, sim in rank[:3]]      # the three closest writers, with their similarity`,
    },
    {
      id: "train",
      title: "Step 10 · Train the model",
      md: `Now the computer learns. **Logistic regression** gives every small word a **weight**. To score a piece, it multiplies each word's (rescaled) value by its weight and adds everything up: a big total means "Ted", a low total means "not Ted".

**Training** means finding the weights that make Ted's pieces score high and the others score low. \`fit\` does it in a second.

We chain the three tools (shares, rescale, logistic regression) into one **pipeline**, so new text always goes through the same steps.

**What you'll see:** the pipeline, then the model's answers for a few training pieces.`,
      code: String.raw`model = G.make_model()          # Normalizer -> StandardScaler -> LogisticRegression
model.fit(X, y)                 # learning happens here

print("answers for the first 3 Ted pieces:         ", model.predict(T[:3]).astype(int))
print("answers for the first 3 other-writer pieces:", model.predict(I[:3]).astype(int))
model`,
    },
    {
      id: "weights",
      title: "Step 11 · Look inside: which words say \"Ted\"?",
      md: `Each word got a **weight**. Blue bars push a piece toward "Ted"; grey bars push it away.

**What you'll see:** future-tense and argument words such as *will* and *be* on Ted's side; this is how a writer who argues about where society is heading sounds.

**Try it:** change \`k=12\` to \`k=20\` to see more words.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`w = model[-1].coef_[0]            # the 224 learned weights, in the order of fw
H.show_plot(G.weight_bars(w, fw, k=12))
fw[int(np.argmax(w))]             # the single most Ted-like word`,
    },
    {
      id: "one-score",
      title: "Step 12 · Score one piece it has never seen",
      md: `Ted wrote this essay in prison, decades after 1971. The model never saw it.

The model's **score** for a piece is that weighted sum. The higher, the more like Ted. A score means little alone, so we compare it with the pieces the model trained on.

**What you'll see:** this unseen piece scores far above the other writers' average and below Ted's own 1971 pieces.`,
      code: String.raw`essay = D["ted_post"][0]
P = G.counts(essay)                                      # its pieces, one row each

print(f'{essay["title"]} ({essay["year"]}), piece 1')
print(f"   training average, Ted's 1971 essay: {model.decision_function(T).mean():+.2f}")
print(f"   training average, other writers:    {model.decision_function(I).mean():+.2f}")
model.decision_function(P[:1])[0]                        # the new piece's score`,
    },
    {
      id: "inside-score",
      title: "Step 13 · Take that score apart",
      md: `A score is just many small pushes added up: for each word, weight × how much more (or less) than usual this piece uses it.

**What you'll see:** the words that pushed this piece's score up (blue) and down (grey). Adding all 224 pushes, plus a fixed starting value, gives exactly the score from Step 12.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`fig, total = G.contributions(model, P[0], fw)
H.show_plot(fig)
round(total, 2)                   # the same number as in Step 12`,
    },
    {
      id: "whole",
      title: "Step 14 · Score a whole text",
      md: `One piece can be noisy. For a whole text we score **every** piece and take the average.

**What you'll see:** the four piece scores, then the whole-text score.`,
      code: String.raw`scores = model.decision_function(P)
print("score of each piece:", scores.round(2))
scores.mean()                     # the whole-text score`,
    },
    {
      id: "alarm",
      title: "Step 15 · A fair test, and the alarm line",
      md: `How high must a score be before we say "Ted"? We ask the other writers.

There is a catch: a model gives high marks to texts it has already seen, like a student who memorized the answer key. So each other-writer text must be scored by a model trained **without** it. We split their texts into 5 groups and train 5 times, each time holding one group out. This is called **cross-validation**.

The **alarm line** is set so that only 1 in 20 of their texts crosses it.

**What you'll see:** the 5 rounds, then the alarm line.`,
      code: String.raw`groups = np.array([r["author"] + "/" + r["text"] for r in D["impostors"] for _ in r["n"]])
held = np.zeros(len(I))
for rnd, (train, test) in enumerate(G.group_folds(groups), 1):       # whole texts stay together
    m = G.make_model().fit(np.vstack([T, I[train]]), np.r_[np.ones(len(T)), np.zeros(len(train))])
    held[test] = m.decision_function(I[test])                       # scores from a model that never saw them
    print(f"round {rnd}: trained without {len(test)} pieces, then scored them")

texts = sorted(set(groups))
others = np.array([held[groups == g].mean() for g in texts])         # one score per whole text
line = float(np.quantile(others, 0.95))                               # only 1 in 20 above it
line`,
    },
    {
      id: "alarm-plot",
      title: "Step 16 · See the alarm line",
      md: `**What you'll see:** the 29 other-writer texts as a histogram (how many texts got each score), and the dashed alarm line near their top edge.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`H.show_plot(G.alarm_hist(others, line))`,
    },
    {
      id: "verdict",
      title: "Step 17 · Score Ted's later essays and the manifesto",
      md: `Now the real test. Ted's later essays are a **check**: we know he wrote them, so they should cross the line. The manifesto is the **question**.

**What you'll see:** one row per text, its score, and whether it crosses the alarm line.`,
      code: String.raw`later = np.array([model.decision_function(G.counts(r)).mean() for r in D["ted_post"]])
manifesto = float(model.decision_function(G.counts(D["u14"])).mean())

rows = [[r["title"][:52], r["year"], f"{s:+.2f}", "yes" if s > line else "no"] for r, s in zip(D["ted_post"], later)]
rows.append(["The manifesto", 1995, f"{manifesto:+.2f}", "YES" if manifesto > line else "no"])
H.show_table(["text", "year", "score", "flagged?"], rows, f"Alarm line = {line:.2f}")`,
    },
    {
      id: "plot",
      title: "Step 18 · Draw the picture",
      md: `Everything in one picture. Each dot is one **whole text**; everything right of the dashed **alarm line** is flagged as Ted. This is the figure from the lecture, and you just made it.

**What you'll see:** grey dots mostly left of the line, blue diamonds mostly right, and the orange star far right.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`r = {"others": others, "later": later, "manifesto": manifesto, "line": line}
H.show_plot(G.score_plot(r))

print(f"Other writers flagged:      {int((others > line).sum())} of {len(others)}")
print(f"Ted's later essays flagged: {int((later > line).sum())} of {len(later)}")
print("The manifesto:", "flagged" if manifesto > line else "not flagged")`,
    },
    {
      id: "threshold",
      title: "Step 19 · Move the alarm line yourself",
      md: `The alarm line is a choice. A lower line catches more of Ted's essays but also flags more innocent writers; a higher line does the opposite.

**What you'll see:** for four lines, how many of each group cross it.

**Try it:** add \`0.75\` to the list.`,
      code: String.raw`for q in [0.80, 0.90, 0.95, 1.00]:                      # 1.00 = above every other writer
    cut = np.quantile(others, q)
    print(f"line at the {int(q * 100)}th percentile ({cut:+.2f}):  "
          f"other writers {int((others > cut).sum()):2d}/29 | later essays {int((later > cut).sum())}/8 | manifesto {'yes' if manifesto > cut else 'no'}")`,
    },
    {
      id: "takeaway",
      title: "You just finished a machine-learning project",
      md: `- **Features:** you turned texts into numbers (224 small-word counts), then into shares on one scale.
- **Labels:** you gave the right answers (Ted or not).
- **Training:** logistic regression learned a weight for every word.
- **Looking inside:** you saw which words say "Ted" and how one score adds up.
- **Testing:** you scored texts the model never saw, and set an alarm line with cross-validation.
- **Decision:** it flagged Ted's later essays and the manifesto, and passed almost every other writer.

In 1996 the FBI compared these texts by hand. You did it in a few minutes. Stuck on a step, or curious why? Ask **B'lawd**, bottom right.`,
    },
  ],
});
