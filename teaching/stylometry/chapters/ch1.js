// Case 1: Two translations of the Analects, by two professors (the "human reader" generation).
// Each cell: md = short explanation (tiny Markdown), code = the Python the student can read, edit and run,
// packages = Pyodide packages downloaded the first time the cell runs.
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch1",
  tab: "1",
  nav: "Two translations",
  title: "Case 1 · Two translations of Confucius's *Analects*",
  llm: false,
  data: ["data/ch1/chunks.json", "data/function_words_224.json", "data/ch1/step1_passages.json"],
  intro: `Two professors translated the same Chinese book, Confucius's *Analects*. **Lionel Giles** was British and published his version in 1907.
**Robert Eno** is American, teaches at Indiana University, and published his in 2015. Same sayings, same meaning, two different hands.

The oldest way to name an author is to **read and notice**: a spelling, a favourite phrase, a rhythm.
We start there, then let a computer count what a reader cannot see.`,
  credits: `Texts: Lionel Giles, *The Sayings of Confucius* (1907; Project Gutenberg #46389, public domain). Robert Eno, *The Analects of Confucius: An Online Teaching Translation* (v2.21, 2015): only derived counts are used here, plus one short excerpt quoted for teaching. Function-word list: derived for this lab (the 224-word list FW in unabom/scripts/verify.py). See the data notes.`,
  cells: [    {
      id: "setup",
      title: "Step 0 · Open the box",
      md: `Everything runs **inside your browser**: no account, no installation, no server doing the maths.
Click the round **▶** on the left of a code box to run it. Run the boxes from top to bottom; each one builds on the one before.

The first box loads two things. One is both translations, already cut into pieces called **chunks** (about 300 words each). The other is a list of 224 small English words such as *the*, *and*, *of*, *which*. Those are **function words**: they carry grammar, not topic.

**What you'll see:** the number of chunks, the number of function words, and the first twelve words of the list.`,
      packages: ["numpy"],
      code: String.raw`# Load the lab's data (the files sit next to this web page).
import json
import numpy as np                  # numbers and tables of numbers
import lab_helpers as H             # small helper functions written for this lab
import lab_ch1 as G                 # this case's plots

chunks = H.load_json("data/ch1/chunks.json")["chunks"]       # one record per ~300-word chunk
fw = H.load_fw224()                                           # the 224 function words
passages = {p["id"]: p for p in H.load_json("data/ch1/step1_passages.json")}   # a few short passages to read

print(len(chunks), "chunks,", len(fw), "function words")
fw[:12]`,
    },
    {
      id: "read",
      title: "Step 1 · Read the same saying twice",
      md: `Here is one saying of Confucius (*Analects* 17.8) in both translations, six lines each, side by side. The meaning is the same. The wording is not.

Read down the two columns. Which phrases does each translator come back to again and again?`,
      code: String.raw`# Cut each passage into sentences, then put sentence k of Giles next to sentence k of Eno.
giles = passages["giles_shadows"]["text"]
eno = passages["eno_shadows"]["text"]
g, e = G.sentences(giles), G.sentences(eno)

rows = [[k + 1, a, b] for k, (a, b) in enumerate(zip(g[4:], e[1:]))]
H.show_table(["#", "Giles (1907)", "Eno (2015)"], rows, "Analects 17.8: six pairs, two hands")`,
    },
    {
      id: "guess",
      title: "Step 2 · Read, then guess",
      md: `Below is a short **mystery note X**. One of our two professors wrote it. **Before you scroll on:** who was it, Giles or Eno?

Type your guess in the last line, then write down *what in the text* made you choose it. A guess with a reason is the start of every authorship study.

**Try it:** change \`"?"\` to \`"Giles"\` or \`"Eno"\`.`,
      code: String.raw`# Print the mystery note X (the author is hidden).
print(passages["X"]["text"])

my_guess = "?"        # change me to "Giles" or "Eno"`,
    },
    {
      id: "spelling",
      title: "Step 3 · The clue that needs no statistics",
      md: `A careful reader finds one clue fast: **spelling**. British writers write *candour*, *valour*, *travelling*; Americans write *candor*, *valor*, *traveling*.
The code checks which spellings appear in each passage.

Was your guess right? This works here, but only until someone writes a note in the other spelling. Next we look for habits a writer cannot see in themselves.`,
      code: String.raw`# British or American spelling? Look at the words of each passage.
british = {"candour", "valour", "travelling", "colour", "honour"}
american = {"candor", "valor", "traveling", "color", "honor"}
for pid in ["giles_shadows", "eno_shadows", "X"]:
    words = set(H.tokens(passages[pid]["text"]))
    print(pid.ljust(14), "| British:", sorted(words & british), "| American:", sorted(words & american))

print("\nYour guess was:", my_guess)
print("The answer: X is by Giles. It is his own footnote, and he wrote 'Travelling'.")`,
    },
    {
      id: "chunks",
      title: "Step 4 · Cut the books into chunks",
      md: `A computer cannot read a whole book and say "this feels like Giles". So we cut each translation into **chunks** of about 300 words and treat each chunk as one small example.
Giles gives 50 chunks, Eno gives 77: 127 chunks in all, and we know who wrote every one. That known author is called the **label**.

Each block in the picture is one chunk, as wide as the chunk is long.

**What you'll see:** two rows of blocks, blue for Giles, orange for Eno.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`n_words = np.array([c["n_words"] for c in chunks])      # how many words in each chunk
author = np.array([c["author"] for c in chunks])        # the label of each chunk: "Giles" or "Eno"
counts = np.array([c["fw"] for c in chunks])            # 127 rows (chunks) x 224 columns (function words)

print("first five chunks:", [c["id"] for c in chunks[:5]], "by", author[:5].tolist())
H.show_plot(G.chunk_map(author, n_words))`,
    },
    {
      id: "function-words",
      title: "Step 5 · Meet the function words",
      md: `Words come in two kinds. **Topic words** (*government*, *virtue*, *grave*) tell you what a text is about. **Function words** (*the*, *and*, *of*, *which*, *you*, *not*) hold the sentence together. We use them without thinking, so each writer's habits leak out through them.

Below, the first 50 words of one Giles chunk, with every function word in CAPITALS. For Eno we keep only the counts, which is all the computer needs.

**What you'll see:** a paragraph with about half its words shouting, and one line with the share.`,
      code: String.raw`sample = chunks[0]["text"]                       # chunk G01, by Giles
print(G.shout_function_words(sample, fw))        # function words in CAPITALS

share = counts.sum(axis=1) / n_words             # per chunk: function words / all words
f"On average {share.mean():.0%} of a chunk's words are function words"`,
    },
    {
      id: "count",
      title: "Step 6 · Count them",
      md: `Counting is all stylometry does at first. For every chunk and every function word we count how many times the word appears. One chunk becomes **a row of 224 numbers**.

The table shows eight words for the first four chunks of each translator. Compare the rows: do the numbers look alike inside a translator?

**Try it:** change the words in \`show\` to others from the list.`,
      code: String.raw`print("counts has", counts.shape[0], "rows (chunks) and", counts.shape[1], "columns (function words)")

show = ["the", "and", "of", "to", "which", "you", "if", "not"]    # change me!
cols = [fw.index(w) for w in show]                                # where each word sits in the list
pick = list(np.where(author == "Giles")[0][:4]) + list(np.where(author == "Eno")[0][:4])
rows = [[chunks[k]["id"], author[k], n_words[k]] + list(counts[k, cols]) for k in pick]
H.show_table(["chunk", "author", "words"] + show, rows, "Raw counts: first 4 chunks of each translator")`,
    },
    {
      id: "top-words",
      title: "Step 7 · The most used words in each translation",
      md: `Add up the counts over a whole translation and you get its favourite words. The bars show how many of every 100 words each function word takes.

**What you'll see:** the same small words lead in both translations (that is simply English), but the order and the heights differ. Giles puts *of* second and uses *he* and *his* a lot; Eno puts *to* second and keeps *not* in his top eight.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`H.show_plot(G.top_words(fw, counts, n_words, author, k=12))`,
    },
    {
      id: "rates",
      title: "Step 8 · Same words, side by side",
      md: `Chunks are not all the same length, so we compare **per 1,000 words**. Each row is one word. The blue dot is how often Giles uses it in an average chunk, the orange dot how often Eno does, and the thin bars show where the middle half of each translator's chunks lie.

**What you'll see:** some words sit almost on top of each other (*you*, *and*), others pull apart: Giles leans on *of* and *which*, Eno on *not*, *if* and *the*. No word separates them cleanly, because the bars overlap. Each one only tilts the odds.

**Try it:** put other words from the list into \`WORDS\`, such as \`"shall"\`, \`"he"\`, \`"is"\`.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`per1000 = counts / n_words[:, None] * 1000        # each count as "times per 1,000 words"

WORDS = ["the", "and", "of", "to", "which", "you", "if", "not"]    # change me!
H.show_plot(G.rate_dots(fw, per1000, author, WORDS))`,
    },
    {
      id: "scatter",
      title: "Step 9 · One dot per chunk",
      md: `Now every chunk becomes a single dot, placed by **two** numbers: how often it uses *and* (across) and *the* (up). Each such number is a **feature**. The large squares mark each translator's average. The green star is the mystery note X.

**What you'll see:** the two clouds overlap a lot. Two words give a hint, not an answer. Try to picture one straight line that splits blue from orange.

**Try it:** replace \`"and"\` and \`"the"\` with \`"which"\` and \`"you"\`.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`w1, w2 = "and", "the"                      # change me!
i, j = fw.index(w1), fw.index(w2)

# Count the function words of the mystery note X in exactly the same way as the chunks
x_text = passages["X"]["text"]
x_counts = np.array(H.fw_counts(x_text, fw))
x_per1000 = x_counts / len(H.fw_tokens(x_text)) * 1000

H.show_plot(G.scatter_two(per1000, author, i, j, w1, w2, x_point=(x_per1000[i], x_per1000[j])))`,
    },
    {
      id: "table",
      title: "Step 10 · Build the table X and the answers y",
      md: `Machine learning needs two things. First a table of numbers, called **X**: one row per example, one column per **feature** (here, a function word). Second the right answers, called **y**, one per row: the **label**. We write 1 for Giles and 0 for Eno.

**What you'll see:** the shape of X (rows, columns) and a stretch of y where the 1s turn into 0s, where the Giles chunks end and Eno's begin.`,
      code: String.raw`X = counts                                   # the table of features: 127 chunks x 224 words
y = (author == "Giles").astype(int)          # the answers: 1 = Giles, 0 = Eno

print("X has", X.shape[0], "rows and", X.shape[1], "columns")
print("Giles chunks:", y.sum(), "| Eno chunks:", (y == 0).sum())
y[45:55]                                     # five last Giles answers, then five first Eno answers`,
    },
    {
      id: "shares",
      title: "Step 11 · Turn counts into shares",
      md: `A longer chunk has bigger counts for every word, which is not a habit, only length. So we divide each row by its total: every row becomes **shares** that add up to 1. In scikit-learn this step is called a *Normalizer*.

**What you'll see:** the same chunk as counts and then as shares, and the total of a row of shares.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.preprocessing import Normalizer

shares = Normalizer(norm="l1").fit_transform(X)       # each row now adds up to 1

show = ["the", "of", "and", "which", "you", "not"]
cols = [fw.index(w) for w in show]
print("words:             ", show)
print("chunk 1, counts:   ", X[0, cols])
print("chunk 1, shares:   ", shares[0, cols].round(3))
print("a row of shares adds up to", round(shares[0].sum(), 3))`,
    },
    {
      id: "scale",
      title: "Step 12 · Put every word on the same scale",
      md: `*The* is huge and *which* is tiny. Left alone, the big words would drown the small ones. So we rescale each column: **0 means "as usual", +1 means "a bit more than usual", -1 "a bit less"**. This is a *StandardScaler*.

**What you'll see:** for two words, the average and spread before and after, then the first chunk in the new units.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.preprocessing import StandardScaler

scaled = StandardScaler().fit_transform(shares)       # every column: average 0, spread 1

for w in ["the", "which"]:
    k = fw.index(w)
    print(f'"{w}":  before  average {shares[:, k].mean():.4f}, spread {shares[:, k].std():.4f}'
          f'   |   after  average {scaled[:, k].mean():.1f}, spread {scaled[:, k].std():.1f}')
print()
print("chunk 1 after rescaling:", {w: round(float(v), 2) for w, v in zip(show, scaled[0, cols])})`,
    },
    {
      id: "train",
      title: "Step 13 · Train the model",
      md: `Now the computer learns. **Logistic regression** gives each of the 224 words a **weight**, then adds up weight × value over all words to make a score for a chunk. Training means searching for the weights that make the score right for as many labelled chunks as possible.

The three steps (shares, rescale, logistic regression) go into one **pipeline**, so that new texts get the same treatment.

**What you'll see:** the pipeline, and its answers for ten chunks it has just studied.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

model = make_pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1, solver="lbfgs", max_iter=10000))
model.fit(X, y)                                       # learning happens here

print(model)
print("truth:    ", y[45:55])
print("its guess:", model.predict(X[45:55]))`,
    },
    {
      id: "weights",
      title: "Step 14 · Look inside: which words matter?",
      md: `Training left behind 224 weights, one per word. A **positive weight** pushes a chunk towards Giles, a **negative weight** towards Eno. The bigger the weight, the stronger the push.

No single word decides. The model adds all 224 pushes together.

**What you'll see:** the ten strongest words on each side. *Which* and *of* push hardest towards Giles; *not*, *someone* and *does* push hardest towards Eno.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`coef = model[-1].coef_[0]                 # the 224 weights (the last step of the pipeline)
order = np.argsort(coef)                  # most "Eno" first ... most "Giles" last

print("strongest for Eno:  ", [fw[k] for k in order[:5]])
print("strongest for Giles:", [fw[k] for k in order[::-1][:5]])
H.show_plot(G.weights_bars(fw, coef, k=10))`,
    },
    {
      id: "holdout",
      title: "Step 15 · Hold some chunks back",
      md: `The ten guesses above were on chunks the model **studied**. That is like a student who gets the exam questions in advance. To measure real skill we must test on chunks the model has **never seen**: held-out chunks.

So we split the 127 chunks into 5 piles. In round 1 the model trains on 4 piles and is tested on the fifth.

**What you'll see:** a near-perfect score on chunks it studied and a lower, honest score on the hidden ones. The honest one is what counts.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.base import clone
from sklearn.model_selection import StratifiedKFold

splits = list(StratifiedKFold(n_splits=5).split(X, y))   # 5 piles of chunks
train_idx, test_idx = splits[0]                            # round 1: pile 1 is hidden

round1 = clone(model).fit(X[train_idx], y[train_idx])      # a fresh model that never sees pile 1
print("trained on", len(train_idx), "chunks, hidden", len(test_idx), "chunks")
print(f"right on the chunks it studied:     {round1.score(X[train_idx], y[train_idx]):.0%}")
print(f"right on the hidden chunks (round 1): {round1.score(X[test_idx], y[test_idx]):.0%}")`,
    },
    {
      id: "five-rounds",
      title: "Step 16 · Five rounds, one honest score",
      md: `Do the same with each pile in turn. After 5 rounds **every chunk has been hidden once**, and we have one guess for each, made by a model that never saw it. This is **cross-validation**.

**Accuracy** is the share of guesses that are right. To read it you need two yardsticks: a **coin flip** gets 50%, and **always answering "Eno"** gets 61%, because 77 of the 127 chunks are Eno's.

**What you'll see:** the score of each round and the final accuracy.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.model_selection import cross_val_predict, cross_val_score

rounds = cross_val_score(model, X, y, cv=5)                                   # accuracy of each round
p_held = cross_val_predict(model, X, y, cv=5, method="predict_proba")[:, 1]   # P(Giles) for every chunk, from the round that hid it
guess = (p_held > 0.5).astype(int)                                            # more than 50% Giles -> say Giles

print("accuracy in each round:", (rounds * 100).round().astype(int), "%")
print(f"{(guess == y).sum()} of {len(y)} hidden chunks guessed right")
f"Held-out accuracy with all {len(fw)} words: {(guess == y).mean():.0%}   (coin flip 50%, always 'Eno' {np.mean(y == 0):.0%})"`,
    },
    {
      id: "confusion",
      title: "Step 17 · Right and wrong, in four boxes",
      md: `A guess can go four ways. The model says Giles and it is Giles (right), says Eno and it is Eno (right), says Giles but it is Eno (wrong), or says Eno but it is Giles (wrong). Counting the four gives a **confusion matrix**.

**What you'll see:** the green tiles on the diagonal are the right guesses, the grey tiles are the mistakes.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`H.show_plot(G.confusion_plot(y, guess))`,
    },
    {
      id: "probabilities",
      title: "Step 18 · How sure was each guess?",
      md: `The model does not only say a name. It gives a **probability**: "I am 90% sure this is Giles". Above 50% it says Giles, below 50% it says Eno; that cut-off is the **threshold**, the dashed line.

Each dot is one hidden chunk, in the row of its true author. Ringed dots are mistakes.

**What you'll see:** blue dots gather on the right, orange dots on the left. The ringed dots are the mistakes: they landed on the wrong side of the line.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`wrong = np.where(guess != y)[0]                          # the chunks it got wrong
worst = wrong[np.argsort(-np.abs(p_held[wrong] - 0.5))][:4]   # the four it was most sure about
for k in worst:
    print(f'{chunks[k]["id"]}: really {author[k]}, but the model gave P(Giles) = {p_held[k]:.2f}')

H.show_plot(G.prob_strip(p_held, y))`,
    },
    {
      id: "two-words",
      title: "Step 19 · Now try with just two words",
      md: `Back to *and* and *the*. Give the same kind of model only these two features and test it the same way: 5 rounds, hidden chunks.

**What you'll see:** a score *below* "always answer Eno". Two words are not enough; the extra 222 are what makes the model work.

**Try it:** change \`"and"\` and \`"the"\` to two other words.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.model_selection import cross_val_score

two = [fw.index("and"), fw.index("the")]               # change me!
shares = X / X.sum(axis=1, keepdims=True)              # the same shares as before, from all 224 words
two_model = make_pipeline(StandardScaler(), LogisticRegression(C=1, max_iter=10000))

acc2 = cross_val_score(two_model, shares[:, two], y, cv=5).mean()
print(f"Only 'and' + 'the':   {acc2:.0%} right on hidden chunks")
print(f"Always answer 'Eno':  {np.mean(y == 0):.0%}")
print(f"All {len(fw)} words:        {(guess == y).mean():.0%}")`,
    },
    {
      id: "curve",
      title: "Step 20 · Add words one by one",
      md: `What happens in between? We start with *the* and *and*, then let the model look at more and more function words (the most used first), and measure the accuracy on hidden chunks each time.

**What you'll see:** a line that climbs as words are added, from 58% with two words to 82% with all 224. The purple dot is the 2-word model, the blue dot is the full model.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`order = G.word_order(X, fw)                  # "the", "and", then the rest, most used first
sizes = [2, 10, 50, 100, 224]                # how many words the model may look at

accs = []
for n in sizes:
    accs.append(G.cv_accuracy(X, y, order[:n]))
    print(f"{n:>3} words: {accs[-1]:.0%}")

H.show_plot(G.accuracy_curve(sizes, accs, np.mean(y == 0)))`,
    },
    {
      id: "mystery",
      title: "Step 21 · Back to the mystery note X",
      md: `Finally the question we began with. The note X is not among the 127 chunks, so the model has never seen it. We count its function words, feed the 224 numbers to the trained model, and read off the probability.

**What you'll see:** the strip from Step 18 with the green star for X.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`p_x = model.predict_proba([x_counts])[0, 1]           # x_counts: the 224 counts of X from Step 9
print(f"Mystery note X:  P(Giles) = {p_x:.2f}    P(Eno) = {1 - p_x:.2f}")
print("The model says:", "Giles" if p_x > 0.5 else "Eno")

H.show_plot(G.prob_strip(p_held, y, x_p=p_x))`,
    },
    {
      id: "takeaway",
      title: "You just finished a machine-learning project",
      md: `- **Data:** you cut two books into 127 chunks and counted 224 small words in each.
- **Features and labels:** the counts are the features (table **X**), the translator is the label (answers **y**).
- **Training:** logistic regression learned one weight per word.
- **Testing:** you hid chunks, scored the model on what it never saw, and read the result against a coin flip and "always Eno".
- **Decision:** 224 words reach 82%, *and* + *the* alone 58%, and the mystery note X goes to Giles.

Stuck on a step, or curious why? Ask **B'lawd**, bottom right.`,
    },
  ],
});
