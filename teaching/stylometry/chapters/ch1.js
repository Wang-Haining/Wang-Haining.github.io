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
  data: ["data/ch1/chunks.json", "data/koppel_function_words.txt", "data/ch1/step1_passages.json"],
  intro: `Two professors translated the same Chinese book, Confucius's *Analects*. **Lionel Giles** was British and published his version in 1907.
**Robert Eno** is American, teaches at Indiana University, and published his in 2015. Same sayings, same meaning, two different hands.

The oldest way to name an author is to **read and notice**. A person spots a spelling, a favourite phrase, a rhythm.
This case starts there, shows where reading stops working, and then lets a computer count what a reader cannot see.`,
  credits: `Texts: Lionel Giles, *The Sayings of Confucius* (1907; Project Gutenberg #46389, public domain). Robert Eno, *The Analects of Confucius: An Online Teaching Translation* (v2.21, 2015): only derived counts are used here, plus one short excerpt quoted for teaching. See the data notes.`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · Load the data",
      md: `Everything runs **inside your browser**: no account, no installation, no server doing the maths.
Click the round **▶** on the left of a code box to run it. Run the boxes from top to bottom.

This first box loads both translations, already cut into pieces ("chunks") of about 300 words each, and a list of 512 small English words
such as *the*, *and*, *of*, *which*. These are **function words**: they carry grammar, not topic.
The list is the "Koppel-512" function-word list used in published authorship studies (it ships with the code of Haining Wang's published reproduction study; credit below).`,
      code: String.raw`# Load the lab's data (the files sit next to this web page).
import json
import lab_helpers as H            # small helper functions written for this lab

chunks = H.load_json("data/ch1/chunks.json")["chunks"]       # one record per ~300-word chunk
fw = H.load_koppel()                                          # the 512 function words (Koppel-512 list)
passages = {p["id"]: p for p in H.load_json("data/ch1/step1_passages.json")}

print(len(chunks), "chunks,", len(fw), "function words")
print("the first few function words:", fw[:12])`,
    },
    {
      id: "read",
      title: "Step 1 · Read, then guess",
      md: `Below is the same saying (*Analects* 17.8, the "six flaws") in both translations, plus a short **mystery note X**.

**Before you scroll on:** who wrote X, Giles or Eno? Type your guess in the box and write down *what in the text* made you choose it.`,
      code: String.raw`# Print the two translations of the same saying, then the mystery note X (author hidden).
for pid in ["giles_shadows", "eno_shadows", "X"]:
    p = passages[pid]
    print("---", "Mystery note X (author hidden)" if pid == "X" else p["title"])
    print(p["text"], "\n")

my_guess = "?"        # change me to "Giles" or "Eno"`,
    },
    {
      id: "spelling",
      title: "Step 2 · The clue that needs no statistics",
      md: `A careful reader would find one quickly: **spelling**. British writers write *Travelling*, *candour*, *valour*; Americans write *traveling*, *candor*, *valor*.
The code below checks which spellings appear in each text.

Was your guess right? Notice how fragile this clue is: an editor, or a spell-checker set to the other country, erases it in a second.`,
      code: String.raw`# British or American spelling?
british = {"candour", "valour", "travelling", "colour", "honour"}
american = {"candor", "valor", "traveling", "color", "honor"}
for pid in ["giles_shadows", "eno_shadows", "X"]:
    words = set(H.tokens(passages[pid]["text"]))
    print(pid.ljust(14), "| British:", sorted(words & british), "| American:", sorted(words & american))

print("\nYour guess was:", my_guess, "| X is by Giles: it is his own footnote, so he wrote it ('Travelling').")`,
    },
    {
      id: "count",
      title: "Step 3 · Count the function words",
      md: `Spelling is easy to fake. **Function words** are not: *the, and, of, which, you, if* are used almost without thinking, so a writer's habits show up in them.
Stylometry simply counts them. Every chunk becomes a row of 512 counts (how many times each function word appears, as a whole word, in the lower-cased text).
For the pictures we also turn the counts into **percentages of all words**, so chunks of different length can be compared.`,
      packages: ["numpy"],
      code: String.raw`import numpy as np
n_words = np.array([c["n_words"] for c in chunks])
author = np.array([c["author"] for c in chunks])
counts = np.array([c["fw"] for c in chunks])      # rows = chunks, columns = function words
freq = counts / n_words[:, None] * 100             # the same, as % of all words in the chunk

# Count the function words of the mystery note X in exactly the same way
x_text = passages["X"]["text"]
x_counts = np.array(H.koppel_counts(x_text, fw))
x_freq = x_counts / len(H.tokens(x_text)) * 100             # (the percentage uses all words, not only the 512)

show = ["the", "and", "of", "to", "which", "you", "if", "not"]   # change me!
cols = [fw.index(w) for w in show]
pick = list(np.where(author == "Giles")[0][:4]) + list(np.where(author == "Eno")[0][:4])
rows = [[chunks[k]["id"], author[k], n_words[k]] + list(counts[k, cols]) for k in pick]
rows.append(["X", "?", len(H.tokens(x_text))] + list(x_counts[cols]))
H.show_table(["chunk", "author", "words"] + show, rows, "Raw counts (first 4 chunks of each translator, then X)")`,
    },
    {
      id: "scatter",
      title: "Step 4 · Two words are not enough",
      md: `Each dot is one real chunk, placed by how often it uses **"and"** (across) and **"the"** (up). Blue = Giles, orange = Eno. The red star is the mystery note X.

Look at the picture. Do the two translators separate cleanly? Where does X fall? You will see the clouds **overlap**: with only two words, many chunks could belong to either man.
Try other words (replace \`"and"\` and \`"the"\` with, say, \`"which"\` and \`"you"\`).`,
      packages: ["matplotlib"],
      code: String.raw`import matplotlib
matplotlib.use("agg")                      # draw into an image instead of a window
import matplotlib.pyplot as plt

w1, w2 = "and", "the"                      # change me!
i, j = fw.index(w1), fw.index(w2)

fig, ax = plt.subplots(figsize=(6, 4.2))
for name, colour in [("Giles", "tab:blue"), ("Eno", "tab:orange")]:
    m = author == name
    ax.scatter(freq[m, i], freq[m, j], c=colour, alpha=0.7, label=name)
ax.scatter([x_freq[i]], [x_freq[j]], marker="*", s=300, c="red", label="X (mystery)")
ax.set_xlabel(f'"{w1}" (% of words)')
ax.set_ylabel(f'"{w2}" (% of words)')
ax.legend()
H.show_plot(fig)`,
    },
    {
      id: "train",
      title: "Step 5 · Let a classifier use all 512 words",
      md: `This is the one simple attacker used in this lab (Cases 1 and 4): **Koppel-512 + logistic regression**.
Count the 512 function words, turn the counts into proportions (each row sums to 1), put every word on a common scale, and let a **logistic regression** learn one weight per word from the labelled chunks.
It then turns any new text into a probability: P(Giles) and P(Eno).

The "sanity check" hides some chunks, trains on the rest, and tests on the hidden ones (5-fold cross-validation). We also run the same check with only *and* and *the* (two columns of the same proportions), so you can compare.`,
      packages: ["scikit-learn"],
      code: String.raw`from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import Normalizer, StandardScaler

y = (author == "Giles")                   # True = Giles, False = Eno
# Koppel-512 attacker: counts -> proportions (L1) -> standardise -> logistic regression (C=1)
model = make_pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1, solver="lbfgs", max_iter=10000))
model.fit(counts, y)

def p_giles(text):
    """Probability that a text is by Giles, according to the model."""
    return model.predict_proba([H.koppel_counts(text, fw)])[0, 1]

p = p_giles(passages["X"]["text"])
print(f"Mystery note X:  P(Giles) = {p:.2f}   P(Eno) = {1 - p:.2f}")

# Sanity check on chunks the model has not seen (5-fold cross-validation)
acc_all = cross_val_score(model, counts, y, cv=5).mean()
props = Normalizer(norm="l1").fit_transform(counts)            # the same proportions, then keep only "and" and "the"
two = [fw.index("and"), fw.index("the")]
two_model = make_pipeline(StandardScaler(), LogisticRegression(C=1, max_iter=10000))
acc2 = cross_val_score(two_model, props[:, two], y, cv=5).mean()
print(f'Held-out chunks, only "and" + "the":  {acc2:.0%} correct   (always answering "Eno" gives {np.mean(~y):.0%})')
print(f"Held-out chunks, all {len(fw)} function words: {acc_all:.0%} correct")`,
    },
    {
      id: "weights",
      title: "Step 6 · What did the model learn?",
      md: `A positive weight pushes a text towards Giles, a negative weight towards Eno. These are the ten strongest words on each side.
Do they match your sense of British versus American translation style? Words are habits; no single word decides, but together they add up.
(A lone *t* or *s* is what is left of a contraction such as *don't*: the Koppel rule counts it as a word of its own.)`,
      code: String.raw`coef = model[-1].coef_[0]                 # one weight per function word (the last step of the pipeline)
order = np.argsort(coef)                  # most "Eno" first ... most "Giles" last

giles_side = [(fw[k], round(coef[k], 2)) for k in order[::-1][:10]]
eno_side = [(fw[k], round(coef[k], 2)) for k in order[:10]]

rows = [[f"{a}  ({b})", f"{c}  ({d})"] for (a, b), (c, d) in zip(giles_side, eno_side)]
H.show_table(["points to Giles (weight)", "points to Eno (weight)"], rows, "Top 10 words on each side")

print("\nTakeaway: reading found one clue (spelling) that is easy to hide.")
print("Counting found a faint signal in hundreds of words nobody chooses on purpose.")`,
    },
  ],
});
