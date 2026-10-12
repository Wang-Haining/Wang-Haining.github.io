// Case 3: Lu Xun or Zhou Zuoren? (our own method, applied to classical Chinese).
// Data: the_many_voices corpus (public domain) and its English translations (0BSD). Numbers reproduce the paper's README.
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch3",
  tab: "3",
  nav: "The Lu Xun brothers",
  title: "Case 3 · The Lu Xun brothers",
  llm: false,
  data: ["data/ch3/corpus.json"],
  intro: `**The story.** Lu Xun (1881-1936) and his younger brother Zhou Zuoren (1885-1967) both wrote early essays in dense classical Chinese, years before they became famous in modern Chinese.
Four disputed essays from that period appeared under the pen name **Du Ying** (or Du), and scholars have argued about which brother wrote them, or whether both did.

**Our method** (Xie, Li and Wang, 2024) is the same idea as Case 1, in another language. English has *the* and *of*; classical Chinese has small function characters such as
**之** (of, him, it), **而** (and, yet), **矣** (a sentence-ending particle), **惟** (only). We count 31 of them, train a logistic regression on essays whose author is known,
and ask what it says about the disputed four. Chinese is not split into words, so the features are characters and a few two-character words.

This is the lecturer's own study, so every number below can be checked against the published repository.`,
  credits: `Texts and English translations: the_many_voices (corpus dedicated to the public domain, other materials 0BSD). Method: Xie Xin, Li Jiangqiong and Haining Wang, *The many voices of Du Ying: revisiting the disputed writings of Lu Xun and Zhou Zuoren*, Digital Scholarship in the Humanities 40(1), 2024.`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · Load the essays and look at a passage",
      md: `The corpus is small, so all of it ships with this page: 8 training works (cut into 31 pieces), 7 validation works (30 pieces), and the 4 disputed essays.
Below: the opening of one training essay by each brother, and the opening of a disputed essay with an English gloss from the repository's translation.

Can you see anything? Probably not, and that is the point: a reader of classical Chinese could argue for either brother.`,
      packages: ["numpy"],
      code: String.raw`import re
import numpy as np
import lab_helpers as H
import lab_ch3 as Z                         # the 31 characters and the counting code, ported from the paper's repository

corpus = H.load_json("data/ch3/corpus.json")
docs, translation = corpus["docs"], corpus["translations"]
train = [d for d in docs if d["split"] == "train"]
val = [d for d in docs if d["split"] == "val"]
test = [d for d in docs if d["split"] == "test"]        # the four disputed essays
print(f"train: {len(train)} pieces | validation: {len(val)} pieces | disputed essays: {len(test)}")
print("train characters  Lu Xun:", sum(Z.length(d["text"]) for d in train if d["author"] == "lx"),
      "| Zhou Zuoren:", sum(Z.length(d["text"]) for d in train if d["author"] == "zzr"))

lx = next(d for d in train if d["author"] == "lx")
zzr = next(d for d in train if d["author"] == "zzr")
print("\nLu Xun, training piece:      ", lx["text"][:90].replace("\n", " "), "...")
print("Zhou Zuoren, training piece: ", zzr["text"][:90].replace("\n", " "), "...")
d = next(d for d in test if d["title"] == "望华国篇")
print("\nDisputed essay 望华国篇:", d["text"][:90].replace("\n", " "), "...")
print("English gloss (from the repository):", " ".join(translation["望华国篇"].split("\n")[1].split()[:40]), "...")`,
    },
    {
      id: "count",
      title: "Step 1 · Count the 31 characters",
      md: `Here are all 31 features. For each one, how often does it occur **per 1,000 characters** in the training essays of each brother?
If one brother always writes **之** more often than the other, that is a clue, a weak one on its own.

Then count the same characters in a disputed essay yourself.`,
      code: String.raw`def per_thousand(author):
    text = "".join(d["text"] for d in train if d["author"] == author)
    counts = Z.count_frequency(Z.GRAMS, text)
    return [c / Z.length(text) * 1000 for c in counts]

lx_rate, zzr_rate = per_thousand("lx"), per_thousand("zzr")
order = np.argsort(-(np.array(lx_rate) - np.array(zzr_rate)))          # biggest Lu Xun-over-Zhou gap first
rows = [[Z.GRAMS[k], f"{lx_rate[k]:.1f}", f"{zzr_rate[k]:.1f}"] for k in order]
H.show_table(["character", "Lu Xun (per 1,000)", "Zhou Zuoren (per 1,000)"], rows, "All 31 features, sorted by how much more Lu Xun uses them")

essay = next(d for d in test if d["title"] == "望华国篇")["text"]       # change me: any title in the list "test"
shown = ["之", "而", "矣", "惟", "于"]
print("\n望华国篇,", Z.length(essay), "characters. Counts:", dict(zip(shown, [Z.count_frequency(Z.GRAMS, essay)[Z.GRAMS.index(g)] for g in shown])))`,
    },
    {
      id: "train",
      title: "Step 2 · Train, and check on essays the model has not seen",
      md: `We turn each piece into 31 numbers (occurrences per character), put them on a common scale, and fit an **L2 logistic regression**. Lu Xun is "1", Zhou Zuoren is "0".

Then the **validation** pieces, which the model never saw during training. Read the numbers with care: look at *who* is in the validation set.`,
      packages: ["scikit-learn"],
      code: String.raw`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix

X_train, y_train = Z.features([d["text"] for d in train]), [int(d["author"] == "lx") for d in train]
X_val, y_val = Z.features([d["text"] for d in val]), [int(d["author"] == "lx") for d in val]
X_test = Z.features([d["text"] for d in test])

clf = Pipeline([("scale", StandardScaler()),
                ("lr", LogisticRegression(penalty="l2", C=1.0, solver="lbfgs", tol=1e-9, max_iter=10**6))])
clf.fit(X_train, y_train)

pred = clf.predict(X_val)
print(f"validation accuracy = {accuracy_score(y_val, pred):.3f}   (published: 0.933)")
print(f"F1 for Lu Xun       = {f1_score(y_val, pred):.3f}   (published: 0.964)")
print("confusion matrix (rows = truth Zhou, Lu Xun; columns = predicted Zhou, Lu Xun):")
print(confusion_matrix(y_val, pred))
print(f"\nBut the validation set has {sum(y_val)} Lu Xun pieces and only {len(y_val) - sum(y_val)} Zhou Zuoren pieces.")
print(f"A 'model' that always says Lu Xun would score {sum(y_val) / len(y_val):.3f}. Always compare with the dumb baseline.")`,
    },
    {
      id: "predict",
      title: "Step 3 · What does the model say about the four disputed essays?",
      md: `Now the question that motivated the study. For each disputed essay, the model gives **P(Lu Xun)**. The English title comes from the repository's translation.

Look at the essay lengths. These are very short texts (300 to 750 characters), so expect uncertainty: a number near 0.5 means "cannot tell".`,
      code: String.raw`probs = clf.predict_proba(X_test)[:, 1]                 # probability of Lu Xun
published = {"望华国篇": 0.984, "望越篇": 0.856}            # numbers quoted in the repository README
rows = []
for d, p in sorted(zip(test, probs), key=lambda t: -t[1]):
    title_en = translation[d["title"]].split("\n")[0]
    rows.append([d["title"], title_en, Z.length(d["text"]), f"{p:.3f}", published.get(d["title"], "-")])
H.show_table(["essay", "English title", "characters", "P(Lu Xun)", "published"], rows, "Disputed essays")
print("All four land on the Lu Xun side, but 民国之征何在 is close to a coin flip, and 'Lu Xun' was one of only two choices offered.")`,
    },
    {
      id: "weights",
      title: "Step 4 · What did the model learn?",
      md: `Positive weight = the character pushes a text towards Lu Xun; negative = towards Zhou Zuoren. Because the features were put on a common scale,
the weights are comparable. Notice that no single character decides: the verdict is a sum of many small pushes.`,
      code: String.raw`weights = clf.named_steps["lr"].coef_[0]
order = np.argsort(-weights)
rows = [[Z.GRAMS[k], f"{weights[k]:+.3f}", "Lu Xun" if weights[k] > 0 else "Zhou Zuoren"] for k in order]
H.show_table(["character", "weight", "favours"], rows, "Weights of the 31 features (strongest Lu Xun first)")
print("intercept:", round(float(clf.named_steps["lr"].intercept_[0]), 3))`,
    },
    {
      id: "highlight",
      title: "Step 5 · See it in the text",
      md: `Every feature character in the essay is marked: **red favours Lu Xun, grey favours Zhou Zuoren**; the darker the shade, the larger the weight.
The English gloss below is the repository's translation of the whole essay. Change the title in the code to look at another essay.`,
      code: String.raw`title = "望华国篇"                                        # change me: 尔越人毋忘先民之训, 望越篇, 民国之征何在
d = next(d for d in test if d["title"] == title)
print(f"{title}: P(Lu Xun) = {probs[test.index(d)]:.3f}")
H.show_html('<p class="legend"><span style="background:rgba(214,39,40,.8)">favours Lu Xun</span> <span style="background:rgba(90,90,90,.5)">favours Zhou Zuoren</span></p>')
H.show_html(Z.highlight_html(d["text"], Z.GRAMS, weights))
H.show_html('<div class="gloss">' + translation[title].replace("&", "&amp;").replace("<", "&lt;").replace("\n", "<br>") + "</div>")`,
    },
    {
      id: "takeaway",
      title: "Takeaway",
      md: `The same recipe as Case 1 (count small grammatical habits, fit a regression, read the weights) works in another language and another century, and the weights stay readable for a humanities audience.
But **a classifier answers the question you ask**: it was trained on two candidates only, so it must pick one of them even if the essays were written by someone else, or together.
The numbers can be reproduced from the shared repository; that is the standard we want from digital humanities. And the validation set is small and lopsided: 0.933 is no better than always guessing Lu Xun.`,
    },
  ],
});
