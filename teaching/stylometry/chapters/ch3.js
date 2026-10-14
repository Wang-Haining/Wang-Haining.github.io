// Case 3: Lu Xun or Zhou Zuoren? (our own method, applied to classical Chinese), written as a first machine-learning project.
// Data: the_many_voices corpus (public domain) and its English translations (0BSD); data/ch3/font.json is a small Chinese font for the plots. Numbers reproduce the paper's README.
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch3",
  tab: "3",
  nav: "The Lu Xun brothers",
  title: "Case 3 · The Lu Xun brothers",
  llm: false,
  data: ["data/ch3/corpus.json", "data/ch3/font.json"],
  intro: `**The story.** Lu Xun (the pen name of Zhou Shuren, 1881-1936) and his younger brother Zhou Zuoren (1885-1967) became two of the best-known Chinese writers of the twentieth century.
In 1907-08 they were young men in Tokyo, writing essays together in **classical Chinese**: the dense old written language of scholars, with no spaces between words and many tiny grammar words.
Some of those essays were published under shared or uncertain names. Four of them appeared under the pen name **Du Ying** (or Du), and scholars have argued about which brother wrote them, or whether both did.

**Our question:** can a computer learn each brother's small-word habits from essays he certainly wrote, and then say which habits the disputed four show?
English has *of*, *and*, *not*. Classical Chinese has **之** ("of"), **而** ("and, yet"), **矣** (a sentence-ending particle), **惟** ("only"), and many more.
We count 31 of these small characters and short words. This is your first machine-learning project, and it follows the method of Xie, Li and Wang (2024), the same idea as Case 1 in another language.

You do not need to read Chinese. Every character comes with its English meaning.`,
  credits: `Texts and English translations: the_many_voices (corpus dedicated to the public domain, other materials 0BSD). Method: Xie Xin, Li Jiangqiong and Haining Wang, *The many voices of Du Ying: revisiting the disputed writings of Lu Xun and Zhou Zuoren*, Digital Scholarship in the Humanities 40(1), 2024. Chinese font in the plots: a small subset of Noto Sans SC (SIL Open Font License 1.1, see data/ch3/FONT_LICENSE.txt).`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · Open the box",
      md: `Click the round **▶** next to a code box to run it, from top to bottom. Every box prints what it did.

The essays we are certain about are cut into **pieces** of about 1,000 characters, so the computer gets many examples to learn from.
Some pieces are **certain**: we know which brother wrote them. We use 31 of them to **train** the model (to teach it), and keep 30 back as a **validation** set (to test it later on pieces it has never seen).
The last group is the **disputed** essays, the question we care about: 4 essays.

**What you'll see:** how many pieces are in each group, and how many characters each brother has in the training set.`,
      packages: ["numpy"],
      code: String.raw`import numpy as np
import lab_helpers as H                   # small display helpers written for this lab
import lab_ch3 as Z                       # the 31 characters, the counting code and the plots

corpus = H.load_json("data/ch3/corpus.json")
docs, translation = corpus["docs"], corpus["translations"]
train = [d for d in docs if d["split"] == "train"]      # certain: used to teach the model
val = [d for d in docs if d["split"] == "val"]          # certain: kept back to test the model
test = [d for d in docs if d["split"] == "test"]        # the four disputed essays

print(f"train: {len(train)} pieces | validation: {len(val)} pieces | disputed essays: {len(test)}")
print("train characters  Lu Xun:", sum(Z.length(d["text"]) for d in train if d["author"] == "lx"),
      "| Zhou Zuoren:", sum(Z.length(d["text"]) for d in train if d["author"] == "zzr"))`,
    },
    {
      id: "read",
      title: "Step 1 · Read one piece from each brother",
      md: `Here is the opening of a certain piece by each brother, in orange (Lu Xun) and blue (Zhou Zuoren), and the opening of one disputed essay with an English translation.

Can you tell them apart? A scholar who reads classical Chinese could argue for either brother. A computer will look at something a reader does not notice.

**What you'll see:** three short Chinese passages, and the start of the English translation of the disputed one.

**Try it:** change the \`[0]\` to \`[5]\` to read another piece by the same brother.`,
      code: String.raw`lx = [d for d in train if d["author"] == "lx"][0]           # a certain Lu Xun piece
zzr = [d for d in train if d["author"] == "zzr"][0]         # a certain Zhou Zuoren piece
disputed = next(d for d in test if d["title"] == "望华国篇")    # one disputed essay

H.show_html(Z.passage_html("Lu Xun (certain)", lx["text"][:90].replace("\n", "") + " ...", Z.ORANGE))
H.show_html(Z.passage_html("Zhou Zuoren (certain)", zzr["text"][:90].replace("\n", "") + " ...", Z.BLUE))
H.show_html(Z.passage_html("Disputed: 望华国篇", disputed["text"][:90].replace("\n", "") + " ...", Z.INK))
H.show_html(Z.gloss_html("English translation: " + " ".join(translation["望华国篇"].split("\n")[1].split()[:40]) + " ..."))`,
    },
    {
      id: "chars",
      title: "Step 2 · Meet the 31 small characters",
      md: `A **function character** is a tiny grammar word. It carries no topic. It holds the sentence together, the way *of*, *and*, *not*, *only* do in English.
Every writer leans on a favourite handful without noticing, and that is a fingerprint.

The study picked 31 characters and short words that help tell the brothers apart: 27 single characters and 4 two-character words. Each has a rough English meaning below.

**What you'll see:** a table of the 31, with their meanings.`,
      code: String.raw`rows = []
for g in Z.GRAMS:
    kind = "one character" if len(g) == 1 else "two-character word"
    rows.append([g, Z.GLOSS[g], kind])
H.show_table(["character", "rough English meaning", "kind"], rows, "The 31 features")`,
    },
    {
      id: "spot",
      title: "Step 3 · Spot them in a passage",
      md: `Here is the opening of the Lu Xun piece again. This time every one of the 31 characters is marked in green.

The marked characters are not the "important" words. They are the glue, and they are everywhere. That is why a writer cannot hide them.

**What you'll see:** the passage with the glue characters marked, and how many there are. Hover over a marked character to see its English meaning.

**Try it:** change \`lx\` to \`zzr\` to mark the same characters in the Zhou Zuoren piece.`,
      code: String.raw`text = lx["text"][:140].replace("\n", "")          # the first 140 characters

H.show_html(Z.legend_html(weighted=False))
H.show_html(Z.highlight_html(text, Z.GRAMS))
n_marked = sum(Z.count_frequency(Z.GRAMS, text))      # how many marked characters
print(f"{n_marked} of the {Z.length(text)} characters in this passage are among the 31")`,
    },
    {
      id: "count",
      title: "Step 4 · Count, and why \"per 1,000\"",
      md: `To turn a text into numbers, we **count** how many times each of the 31 appears. Here is a disputed essay, with five of the counts.
(A short character is never counted twice: the **是** inside **于是** counts only as 于是.)

A long essay has more of everything, so raw counts are unfair. We divide by the length and report **how many per 1,000 characters**. Now a long essay and a short one can be compared.

**What you'll see:** counts for 望华国篇, then the same character, 之 ("of"), counted in a long and a short essay.

**Try it:** change \`title\` to 民国之征何在 and run again.`,
      code: String.raw`title = "望华国篇"                                                          # change me: 尔越人毋忘先民之训, 望越篇, 民国之征何在
essay = next(d for d in test if d["title"] == title)["text"]
shown = ["之", "而", "矣", "惟", "于"]
counts = Z.count_frequency(Z.GRAMS, essay)                                # one count for each of the 31
print(title + ",", Z.length(essay), "characters. Counts:", dict(zip(shown, [counts[Z.GRAMS.index(g)] for g in shown])))

short = next(d for d in test if d["title"] == "尔越人毋忘先民之训")["text"]   # a shorter essay
for name, t in [(title, essay), ("尔越人毋忘先民之训", short)]:
    n = Z.count_frequency(Z.GRAMS, t)[Z.GRAMS.index("之")]
    print(f"{name}: 之 appears {n} times in {Z.length(t)} characters = {n / Z.length(t) * 1000:.1f} per 1,000")`,
    },
    {
      id: "perbrother",
      title: "Step 5 · Count for each brother",
      md: `Now we count over everything each brother certainly wrote (the training pieces), per 1,000 characters.
If one brother always writes **之** more often than the other, that is a clue, a weak one on its own. With 31 characters we get 31 clues.

**What you'll see:** a table sorted from the characters Lu Xun uses much more than his brother (top) to the ones Zhou Zuoren uses more (bottom).`,
      code: String.raw`def per_thousand(author):
    text = "".join(d["text"] for d in train if d["author"] == author)    # all the training text of one brother
    return Z.rates_per_1000(text)

lx_rate, zzr_rate = per_thousand("lx"), per_thousand("zzr")
order = np.argsort(-(np.array(lx_rate) - np.array(zzr_rate)))          # biggest Lu Xun-over-Zhou gap first
rows = [[Z.GRAMS[k], f"{lx_rate[k]:.1f}", f"{zzr_rate[k]:.1f}"] for k in order]
H.show_table(["character", "Lu Xun (per 1,000)", "Zhou Zuoren (per 1,000)"], rows, "All 31 features, sorted by how much more Lu Xun uses them")`,
    },
    {
      id: "rates",
      title: "Step 6 · Draw the 31 rates",
      md: `A table of 62 numbers is hard to take in. A picture is not. Each row is one character with its English meaning; the orange bar is Lu Xun, the blue bar is Zhou Zuoren.

**What you'll see:** rows where the orange bar is much longer or shorter than the blue bar. Those are the characters that tell the brothers apart.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`H.show_plot(Z.rates_plot(lx_rate, zzr_rate))`,
    },
    {
      id: "gaps",
      title: "Step 7 · The biggest differences",
      md: `Now we draw only the gap between the brothers: Lu Xun's rate minus Zhou Zuoren's. Bars to the right (orange) are characters Lu Xun uses more; bars to the left (blue) are characters Zhou Zuoren uses more.

**What you'll see:** the 12 biggest gaps, with the longest bars at the top and bottom.

**Try it:** change \`k=12\` to \`k=6\` for just the six biggest gaps.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`H.show_plot(Z.gap_plot(lx_rate, zzr_rate, k=12))`,
    },
    {
      id: "xy",
      title: "Step 8 · Build X and y",
      md: `Machine learning needs two things. A table of numbers **X**: one row per piece, one column per character. These are called the **features**.
And the right answers **y**: one label per piece, 1 for Lu Xun and 0 for Zhou Zuoren. These are called the **labels**.

Each number in X is a count divided by the piece's length (0.012 means 12 per 1,000). It is a coincidence that there are 31 pieces and 31 characters: rows are pieces, columns are characters. Everything the computer will ever know about a piece is its row of 31 numbers.

**What you'll see:** the size of each table, one row of numbers, and the first twelve labels.`,
      code: String.raw`X_train = np.array(Z.features([d["text"] for d in train]))      # features: one row per piece, 31 columns
y_train = np.array([int(d["author"] == "lx") for d in train])    # labels: 1 = Lu Xun, 0 = Zhou Zuoren
X_val = np.array(Z.features([d["text"] for d in val]))
y_val = np.array([int(d["author"] == "lx") for d in val])
X_test = np.array(Z.features([d["text"] for d in test]))         # the disputed essays have no labels
names = [d["title"] for d in test]

print("X_train has", X_train.shape[0], "rows (pieces) and", X_train.shape[1], "columns (characters)")
print("the first piece, first 5 columns", Z.GRAMS[:5], "per 1,000:", (X_train[0][:5] * 1000).round(1))
print("the first twelve answers (1 = Lu Xun, 0 = Zhou Zuoren):")
y_train[:12]`,
    },
    {
      id: "scatter",
      title: "Step 9 · Two characters, every piece",
      md: `With 31 columns we cannot draw a picture, so we start with two. The code picks the two characters whose averages differ most between the brothers.
Each dot is one training piece. Its position says how often the piece uses each of the two characters. The stars are each brother's average. The numbered black discs are the four disputed essays (listed under the plot); they did not help pick the two characters.

**What you'll see:** orange and blue dots that already sit in somewhat different places, and also overlap, with the four disputed essays among them. Two characters are a start, not an answer.

**Try it:** replace the first line with \`a, b = Z.GRAMS.index("而"), Z.GRAMS.index("矣")\` to compare other characters.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`a, b = Z.most_telling(X_train, y_train)          # indices of the two most telling characters
print("the two most telling characters:", Z.GRAMS[a], f"({Z.GLOSS[Z.GRAMS[a]]})", "and", Z.GRAMS[b], f"({Z.GLOSS[Z.GRAMS[b]]})")
H.show_plot(Z.two_char_plot(X_train, y_train, a, b, X_test, names))`,
    },
    {
      id: "scale",
      title: "Step 10 · Put every character on the same scale",
      md: `Some characters are common (之) and some are rare (惟). Rare ones would barely count. So we rescale every column: 0 means "as usual for these pieces", +1 means "a bit more than usual", -1 "a bit less".
The tool that does it is called a **StandardScaler**. It learns each column's average and spread from the training pieces only.

**What you'll see:** the average and spread of two characters before and after rescaling, and one piece in the new units.`,
      packages: ["scikit-learn", "numpy"],
      code: String.raw`from sklearn.preprocessing import StandardScaler

scaler = StandardScaler().fit(X_train)              # learns each column's average and spread
S_train = scaler.transform(X_train)                 # the same table, rescaled

for g in ["之", "惟"]:
    j = Z.GRAMS.index(g)
    print(f"{g}: before, average {X_train[:, j].mean() * 1000:.1f} per 1,000, spread {X_train[:, j].std() * 1000:.1f}"
          f"   |   after, average {S_train[:, j].mean():.1f}, spread {S_train[:, j].std():.1f}")
print("first piece after rescaling:", {g: round(float(S_train[0][Z.GRAMS.index(g)]), 2) for g in ["之", "惟", "而"]})`,
    },
    {
      id: "pca",
      title: "Step 11 · A map of all the pieces",
      md: `Can we see all 31 columns at once? **PCA** squashes 31 numbers into 2, keeping as much of the difference between pieces as it can. The result is a map: pieces that use the characters alike sit close together.
The map is not told who wrote what. We only colour the dots afterwards: orange for Lu Xun, blue for Zhou Zuoren.

**What you'll see:** an orange cloud and a blue cloud with a gap between them, then the share of the variation each map direction keeps. The model's job is to find that dividing line across all 31 columns.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`from sklearn.decomposition import PCA

pca = PCA(n_components=2).fit(S_train)              # finds the two directions with the most variation
H.show_plot(Z.pca_map(pca, S_train, y_train))
pca.explained_variance_ratio_.round(2)              # the share of the variation each map direction keeps`,
    },
    {
      id: "train",
      title: "Step 12 · Train the model",
      md: `Now the computer learns. **Logistic regression** gives each of the 31 characters a **weight**. For a piece, it multiplies each rescaled number by its weight and adds them up; the total is the piece's **score**.
Training means finding the weights that give Lu Xun's training pieces high scores and Zhou Zuoren's low scores. The **L2** setting is a gentle brake that stops any one weight from growing too big.
We put the rescaling and the regression into one **pipeline**.

**What you'll see:** the model's answers for three Lu Xun pieces and three Zhou Zuoren pieces, next to the true answers.`,
      packages: ["numpy", "scikit-learn"],
      code: String.raw`from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

clf = Pipeline([("scale", StandardScaler()),
                ("lr", LogisticRegression(penalty="l2", C=1.0, solver="lbfgs", tol=1e-9, max_iter=10**6))])
clf.fit(X_train, y_train)                            # learning happens here

some = [0, 1, 2, 17, 18, 19]                         # three Lu Xun pieces, then three Zhou Zuoren pieces
print("true answers:       ", y_train[some])
print("the model's answers:")
clf.predict(X_train[some])`,
    },
    {
      id: "prob",
      title: "Step 13 · From a score to a probability",
      md: `A score is hard to read, so it is turned into a **probability** with an S-shaped curve: **P(Lu Xun)**. A score of 0 gives 50%, "no lean either way". A high score gives a number near 1, a very negative score gives a number near 0.
Probability here means how strongly the model leans, from 0 (Zhou Zuoren) to 1 (Lu Xun).

**What you'll see:** the score and probability of two training pieces, and a curve with all 31 training pieces sitting on it.`,
      packages: ["matplotlib", "numpy", "scikit-learn"],
      code: String.raw`scores = clf.decision_function(X_train)            # one score per training piece
p_train = clf.predict_proba(X_train)[:, 1]         # the same pieces as probabilities of Lu Xun

print(f"piece 0 (Lu Xun):       score {scores[0]:+.2f}  ->  P(Lu Xun) = {p_train[0]:.3f}")
print(f"piece 17 (Zhou Zuoren): score {scores[17]:+.2f}  ->  P(Lu Xun) = {p_train[17]:.3f}")
H.show_plot(Z.score_curve(scores, y_train))`,
    },
    {
      id: "weights",
      title: "Step 14 · Look inside: what did it learn?",
      md: `Each character now has a weight. A positive weight (orange) pushes a piece towards Lu Xun; a negative weight (blue) pushes it towards Zhou Zuoren. Because every column was rescaled, the weights are comparable.
No single character decides. The verdict is a sum of many small pushes.

**What you'll see:** all 31 weights as bars, then the single most Lu Xun-like character.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`weights = clf.named_steps["lr"].coef_[0]          # the 31 learned weights
H.show_plot(Z.weights_plot(weights))
Z.GRAMS[int(np.argmax(weights))]                 # the single most Lu Xun-like character`,
    },
    {
      id: "check",
      title: "Step 15 · A check on pieces it has never seen",
      md: `Before we trust the model on the disputed essays, we test it on the 30 validation pieces. We know who wrote them, and the model never saw them, so they are **held out**. This is a **check**: if the model cannot name the author when we know the answer, it cannot be trusted when we do not.
**Accuracy** is the share of pieces it got right. The **confusion matrix** counts the hits and misses for each brother.

**What you'll see:** the model's accuracy and, for each brother, how many of his pieces it got right.`,
      packages: ["scikit-learn", "numpy"],
      code: String.raw`from sklearn.metrics import accuracy_score, f1_score, confusion_matrix

pred = clf.predict(X_val)                            # the model's answers for the held-out pieces
print(f"validation accuracy = {accuracy_score(y_val, pred):.3f}   (published: 0.933)")
print(f"F1 for Lu Xun       = {f1_score(y_val, pred):.3f}   (published: 0.964)")
cm = confusion_matrix(y_val, pred)
print("confusion matrix (rows = truth Zhou, Lu Xun; columns = predicted Zhou, Lu Xun):")
print(cm)
print(f"Lu Xun pieces right: {cm[1, 1]} of {cm[1].sum()}   |   Zhou Zuoren pieces right: {cm[0, 0]} of {cm[0].sum()}")`,
    },
    {
      id: "checkplot",
      title: "Step 16 · Draw the check",
      md: `Each dot is one held-out piece, placed by the model's P(Lu Xun). The top row holds the pieces Lu Xun really wrote, the bottom row the ones Zhou Zuoren really wrote. A dot on the correct side of the dashed 50% line is a hit; a ringed dot is a miss.

**What you'll see:** 27 of the 28 orange dots on the Lu Xun side, and 1 of the 2 blue dots on the Zhou Zuoren side. The two misses are ringed.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`p_val = clf.predict_proba(X_val)[:, 1]                # P(Lu Xun) for every validation piece
H.show_plot(Z.check_plot(p_val, y_val))`,
    },
    {
      id: "predict",
      title: "Step 17 · Now the question: the four disputed essays",
      md: `Now the question that started the study. We give the model the four disputed essays, whose authors nobody can confirm, and read off its **P(Lu Xun)** for each.
The English title comes from the repository's translation. The last column shows the numbers quoted in the paper's repository, which our run reproduces.

**What you'll see:** four essays, sorted from the one the model leans towards Lu Xun most to the one it leans least.`,
      code: String.raw`probs = clf.predict_proba(X_test)[:, 1]                 # probability of Lu Xun
published = {"望华国篇": 0.984, "望越篇": 0.856}            # numbers quoted in the repository README
rows = []
for d, p in sorted(zip(test, probs), key=lambda t: -t[1]):
    title_en = translation[d["title"]].split("\n")[0]
    rows.append([d["title"], title_en, Z.length(d["text"]), f"{p:.3f}", published.get(d["title"], "-")])
H.show_table(["essay", "English title", "characters", "P(Lu Xun)", "published"], rows, "Disputed essays")`,
    },
    {
      id: "map2",
      title: "Step 18 · Put the disputed essays on the map",
      md: `Back to the map from Step 11. We add the held-out pieces (hollow triangles) and the four disputed essays (black discs, numbered 1 to 4 and listed under the map), each placed with the same squashing and rescaling.

**What you'll see:** whether each numbered disc lands among the orange pieces, among the blue pieces, or in between.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`S_val = scaler.transform(X_val)                       # the same rescaling as for training
S_test = scaler.transform(X_test)
H.show_plot(Z.pca_map(pca, S_train, y_train, S_val, y_val, S_test, names))`,
    },
    {
      id: "highlight",
      title: "Step 19 · See it in the text",
      md: `Back to the text. Every feature character in the essay is marked: **orange favours Lu Xun, blue favours Zhou Zuoren**; the darker the shade, the larger the weight. Below it is the English translation of the whole essay.

**What you'll see:** an essay full of marks of both colours; the model adds them all up.

**Try it:** change the title to 望越篇, 尔越人毋忘先民之训 or 民国之征何在.`,
      packages: ["numpy"],
      code: String.raw`title = "望华国篇"                                        # change me: 尔越人毋忘先民之训, 望越篇, 民国之征何在
d = next(d for d in test if d["title"] == title)
print(f"{title}: P(Lu Xun) = {probs[test.index(d)]:.3f}")
H.show_html(Z.legend_html(weighted=True))
H.show_html(Z.highlight_html(d["text"], Z.GRAMS, weights))
H.show_html(Z.gloss_html(translation[title]))`,
    },
    {
      id: "push",
      title: "Step 20 · What pushed the verdict?",
      md: `The score of an essay is a plain sum: a starting point, plus one push per character. Each push is the character's weight times how unusual the character is in this essay.
Add them all and you get the score the model reports.

**What you'll see:** the sum worked out in numbers, the eight biggest pushes in the essay from Step 19 as bars, and all 31 pushes as numbers.`,
      packages: ["numpy", "scikit-learn", "matplotlib"],
      code: String.raw`i = names.index(title)                               # the essay chosen in Step 19
lr = clf.named_steps["lr"]
pushes = lr.coef_[0] * S_test[i]                     # weight x how unusual, one push per character
start = lr.intercept_[0]                             # the starting point

print(f"starting point {start:+.2f} + the 31 pushes {pushes.sum():+.2f} = score {start + pushes.sum():+.2f}")
print(f"the model's own score: {clf.decision_function(X_test[i:i + 1])[0]:+.2f}  ->  P(Lu Xun) = {probs[i]:.3f}")
H.show_plot(Z.push_plot(pushes, title))
pushes.round(2)                                      # all 31 pushes`,
    },
    {
      id: "final",
      title: "Step 21 · Draw the verdict",
      md: `The big picture. One row per disputed essay: the bar is split into the model's P(Zhou Zuoren) in blue and P(Lu Xun) in orange. The dashed line at 50% is "no lean either way".

**What you'll see:** all four essays on the same scale, from the strongest lean to the weakest.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`order = np.argsort(-probs)                              # strongest Lu Xun lean first
titles_zh = [test[k]["title"] for k in order]
titles_en = [translation[test[k]["title"]].split("\n")[0] for k in order]
H.show_plot(Z.verdict_plot(titles_zh, titles_en, probs[order]))`,
    },
    {
      id: "takeaway",
      title: "You just finished a machine-learning project",
      md: `- **Features:** you turned essays into numbers (31 small-character rates).
- **Labels:** you gave the right answers (Lu Xun or Zhou Zuoren) for pieces you were certain about.
- **Training:** logistic regression learned a weight for every character.
- **Testing:** you checked it on 30 held-out pieces before using it.
- **Decision:** it leans towards Lu Xun on all four disputed essays, from 0.984 for 望华国篇 down to 0.595 for 民国之征何在.

The same recipe as Case 1 (count small habits, fit a regression, read the weights) works in another language and another century.

Stuck on a step, or curious why? Ask **B'lawd**, bottom right.`,
    },
  ],
});
