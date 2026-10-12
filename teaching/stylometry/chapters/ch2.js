// Case 2: The Unabomber (the "statistics" generation).
// Data: derived function-word counts only (data/ch2/fw_counts.json). Analysis reproduces unabom/results/SUMMARY.md.
window.LAB_CHAPTERS = window.LAB_CHAPTERS || [];
window.LAB_CHAPTERS.push({
  id: "ch2",
  tab: "2",
  nav: "The Unabomber",
  title: "Case 2 · The Unabomber",
  llm: false,
  data: ["data/ch2/fw_counts.json", "data/ch2/excerpts.json"],
  intro: `**The story.** From 1978 to 1995, someone the FBI called the "Unabomber" sent 16 bombs, killing 3 people and injuring 23.
In 1995 he promised to stop if his 35,000-word essay, *Industrial Society and Its Future*, was published; the Washington Post printed it on September 19, 1995, with the New York Times sharing the cost.
Linda Patrik and her husband David Kaczynski read it and feared it was David's brother, Ted. From February 1996 they worked with the FBI through a lawyer, handing over Ted's letters and a 1971 essay.
FBI agents compared the documents **by hand** and listed over 160 similarities; by the FBI's count, 35 of the 1971 essay's 47 paragraphs match the manifesto by subject.
Ted Kaczynski was arrested at his Montana cabin on April 3, 1996, and pleaded guilty in 1998. No statistical stylometry was used, and no court ever tested the linguistic comparison.
(Sources: the April 3, 1996 search-warrant affidavit; contemporaneous news reports. Not the TV series.)

**The question for statistics** is harder than it sounds. Two texts that make the *same argument* will look alike whoever wrote them. So we do not ask "are these similar?"
We ask: **is the manifesto closer to the 1971 essay than writers who argue the same kind of thing?** This is called *verification*, and the competing writers are called *impostors*.

**Our names:** T-2 = Kaczynski's 1971 essay (about 6,300 words). U-14 = the 1995 manifesto (about 30,500 words). Impostors = 19 other writers on technology and society,
such as Mumford, Ellul, Illich, Postman, Zerzan (about 294,000 words). We use only **function-word counts** per 1,000-word chunk; no impostor text is shipped.
The results here come from a pre-registered analysis (seed 20261011) and are reproduced step by step below.`,
  credits: `Data: derived function-word counts built from the Ted K Archive texts and an FBI-document transcription of T-2 (see data notes). No impostor or post-arrest text is shipped, only counts. The two short quotations are shown for illustration with attribution. Analysis plan and results: \`unabom/PREREG.md\`, \`unabom/results/SUMMARY.md\`.`,
  cells: [
    {
      id: "setup",
      title: "Step 0 · Load the counts and read two short samples",
      md: `The table has, for every 1,000-word chunk of every text, how many times each of **224 function words** appears (*the, of, which, nevertheless, ...*). We turn counts into frequencies per 1,000 words.

First, two short samples. Do they sound alike? They should: they argue the same thing. That is exactly why "sounds alike" proves little here.`,
      packages: ["numpy"],
      code: String.raw`import json
import numpy as np
import lab_helpers as H
import lab_ch2 as G                       # Delta and General Impostors, written for this lab

D = G.load()                              # counts per 1,000-word chunk; no raw text
fw = D["fw"]
by_author = G.authors(D)                  # 19 impostor authors -> their texts
freq = {a: G.stack(texts) for a, texts in by_author.items()}   # chunks x words, per 1,000 words
t2, u14 = G.rel(D["t2"]), G.rel(D["u14"])  # Ted's 1971 essay and the 1995 manifesto
post = G.stack(D["ted_post"])             # Ted's later writings (1999-2016), the "same author" check
ref = np.vstack([t2] + list(freq.values()))   # the yardstick that puts every word on one scale

for e in json.load(open("data/ch2/excerpts.json")):
    print(e["source"]); print('   "' + e["text"] + '"\n')

rows = [[texts[0]["name"], len(texts), f'{min(t["year"] for t in texts)}-{max(t["year"] for t in texts)}', len(freq[a])] for a, texts in by_author.items()]
H.show_table(["impostor author", "texts", "years", "1,000-word chunks"], rows, "The 19 impostors")
print(f"T-2: {len(t2)} chunks | U-14: {len(u14)} chunks | Ted's later writings: {len(post)} chunks | {len(fw)} function words")`,
    },
    {
      id: "delta",
      title: "Step 1 · Burrows's Delta: which profile is each manifesto chunk nearest?",
      md: `The classic tool is **Burrows's Delta**. Build a profile for every candidate (T-2 and each of the 19 impostors): the average of their word frequencies, each word measured in "standard units".
Then take each 1,000-word chunk of the manifesto and find the **nearest profile**. If the manifesto were written by the T-2 author, most chunks should land on T-2.

With 20 candidates, landing on T-2 by luck would happen about 5% of the time.`,
      code: String.raw`profiles = dict(freq)
profiles["TED T-2"] = t2

nearest = G.delta_nearest(u14, profiles, ref)       # one nearest profile per manifesto chunk
from collections import Counter
tally = Counter(nearest).most_common()

rows = [[name, n, f"{n / len(u14):.0%}"] for name, n in tally[:6]]
H.show_table(["nearest profile", "manifesto chunks", "share"], rows, "Where do the 30 manifesto chunks land?")
share = nearest.count("TED T-2") / len(nearest)
print(f"Share of manifesto chunks nearest to T-2: {share:.2f}   (luck would give {1 / len(profiles):.2f})")`,
    },
    {
      id: "validity",
      title: "Step 2 · The sobering check: can Delta even tell the impostors apart?",
      md: `Before trusting that 43%, test the ruler. Take impostors who have two or more texts. Hide one text, and ask Delta to assign its chunks to the right author among all 20 candidates.
If the method cannot do that, a result for Ted means nothing. The plan said the accuracy had to reach **0.70**.`,
      code: String.raw`hits = total = 0
for a, texts in by_author.items():
    if len(texts) < 2:
        continue
    texts = sorted(texts, key=lambda r: -r["n_chars"])   # longest first
    held, rest = G.rel(texts[-1]), G.stack(texts[:-1])    # hide the shortest text
    prof = {b: f for b, f in freq.items() if b != a}
    prof[a] = rest                                        # the author's profile without the hidden text
    prof["TED T-2"] = t2
    got = G.delta_nearest(held, prof, ref)
    hits += got.count(a); total += len(got)

print(f"Held-out chunks given to the right author: {hits} of {total} = {hits / total:.2f}")
print("Required by the plan: 0.70.  Chance with 20 candidates: 0.05.")
print("So the 43% above is NOT interpreted: this ruler does not separate these writers.")`,
    },
    {
      id: "gi",
      title: "Step 3 · General Impostors: a line-up with many random witnesses",
      md: `**General Impostors** asks a sharper question. Imagine a police line-up: the questioned text (the manifesto), the suspect (T-2), and 19 impostors.
Repeat 200 times: pick a random **half of the function words**, and ask whether the suspect is closer to the manifesto than *every* impostor.
The **score** is the share of rounds the suspect wins. A score of 1.00 means the suspect won every round.

A score alone is meaningless, so we calibrate it: we also score **every pair of different impostor authors** (342 ordered pairs). That shows what a "no match" looks like.`,
      packages: ["numpy", "matplotlib"],
      code: String.raw`import matplotlib
matplotlib.use("agg")
import matplotlib.pyplot as plt

rng = np.random.default_rng(G.SEED)               # same seed as the report
pool = np.vstack([G.profile(f, ref) for f in freq.values()])   # the 19 impostors
p_t2, p_u14, p_post = (G.profile(x, ref) for x in (t2, u14, post))
gi_u_given_t2 = G.gi_score(p_u14, p_t2, pool, rng, iters=200)
gi_t2_given_u = G.gi_score(p_t2, p_u14, pool, rng, iters=200)
gi_post_given_t2 = G.gi_score(p_post, p_t2, pool, rng, iters=200)

# Calibration: different authors (100 rounds each, as in the report)
diff = np.array(list(G.different_author_scores(freq, t2, ref, np.random.default_rng(G.SEED), iters=100).values()))
print(f"different-author pairs: n={len(diff)}  mean={diff.mean():.2f}  99th percentile={np.quantile(diff, .99):.2f}  max={diff.max():.2f}")
print(f"GI: manifesto given T-2   = {gi_u_given_t2:.2f}")
print(f"GI: T-2 given manifesto   = {gi_t2_given_u:.2f}")
print(f"GI: Ted's later writings given T-2 (same author, 25+ years apart) = {gi_post_given_t2:.2f}")

fig, ax = plt.subplots(figsize=(6.4, 3.6))
ax.hist(diff, bins=np.linspace(0, 1, 21), color="0.7", label="two different authors (342 pairs)")
for v, c, lab in [(gi_u_given_t2, "crimson", "manifesto vs T-2"), (gi_post_given_t2, "tab:blue", "Ted's later texts vs T-2")]:
    ax.axvline(v, color=c, lw=2.5, label=f"{lab}: {v:.2f}")
ax.set_xlabel("General Impostors score"); ax.set_ylabel("number of pairs"); ax.legend(fontsize=8)
H.show_plot(fig)`,
    },
    {
      id: "same",
      title: "Step 4 · How high can a true match score? And Ted's later writings",
      md: `Two more yardsticks. First, **known same-author pairs** among the impostors (one text against the same writer's other texts): they should score high, but General Impostors is cautious, and some true pairs score **0.00**. So a high score carries information; a low one would not.

Second, the cleanest test of "is it Ted, without help from the draft?": the manifesto against his **later writings** (1999-2016, no overlap with the manifesto, quotations of it removed).`,
      code: String.raw`same = G.same_author_scores(by_author, freq, t2, ref, rng, iters=200)    # continues the same random stream as Step 3
print("same-author impostor pairs:", {a: round(v, 2) for a, v in same.items()})
print(f"range: {min(same.values()):.2f} to {max(same.values()):.2f}  (true matches can score low)\n")

for seed in (1, 2, 3):                       # post-hoc check, three seeds
    r = np.random.default_rng(seed)
    a = G.gi_score(p_u14, p_post, pool, r, iters=200)
    b = G.gi_score(p_post, p_u14, pool, r, iters=200)
    print(f"seed {seed}: manifesto given Ted's later texts = {a:.2f} | later texts given manifesto = {b:.2f}")
print("Caveat: Ted's later texts share his anti-technology vocabulary, but only function words are used here.")`,
    },
    {
      id: "leak",
      title: "Step 5 · The topic-leak test: remove every paragraph the FBI matched",
      md: `The worry: T-2 and the manifesto share *content and phrasing*, and function words can ride along with content. So **delete every T-2 paragraph the FBI aligned (33 of 56)
and the manifesto paragraphs they match**, and score again. T-2 shrinks from 6,331 to **1,712 words**, written 24 years before the manifesto.

We run it two ways: the report's main run (first 1,000 words of what is left), and a post-hoc check that keeps all 1,712 words, with three random seeds. One seed is not enough.`,
      code: String.raw`t2r_first = G.rel(D["t2_r1_first1000"])      # reduced T-2, first 1,000 words (main run)
t2r_all = G.rel(D["t2_r1_all"])              # reduced T-2, all 1,712 words (post-hoc)
u14r = G.rel(D["u14_r1"])                    # reduced manifesto: 22 chunks
ref_r = np.vstack([t2r_first] + list(freq.values()))
pool_r = np.vstack([G.profile(f, ref_r) for f in freq.values()])

# main run, same seed as the report
r = np.random.default_rng(G.SEED)
a = G.gi_score(G.profile(u14r, ref_r), G.profile(t2r_first, ref_r), pool_r, r, iters=200)
b = G.gi_score(G.profile(t2r_first, ref_r), G.profile(u14r, ref_r), pool_r, r, iters=200)
print(f"main run : manifesto given T-2 = {a:.2f} | T-2 given manifesto = {b:.2f}")

# post-hoc: all 1,712 words of T-2, three seeds (yardstick built from the full T-2, as in the check)
pool_f = np.vstack([G.profile(f, ref) for f in freq.values()])
for seed in (1, 2, 3):
    r = np.random.default_rng(seed)
    a = G.gi_score(G.profile(u14r, ref), G.profile(t2r_all, ref), pool_f, r, iters=200)
    b = G.gi_score(G.profile(t2r_all, ref), G.profile(u14r, ref), pool_f, r, iters=200)
    print(f"seed {seed}   : manifesto given T-2 = {a:.2f} | T-2 given manifesto = {b:.2f}")

# how high do two DIFFERENT authors score under the same removal? (the report's calibration continues one random stream)
rr = np.random.default_rng(G.SEED)
G.different_author_scores(freq, t2, ref, rr, iters=100)                       # first pass (all text), as in the report
dr = np.array(list(G.different_author_scores(freq, t2r_first, ref_r, rr, iters=100).values()))
print(f"different-author pairs under the removal: mean={dr.mean():.2f}  99th percentile={np.quantile(dr, .99):.2f}  max={dr.max():.2f}")

# Delta again: with a one-chunk T-2 profile it is underpowered
prof = dict(freq); prof["TED T-2"] = t2r_first
near = G.delta_nearest(u14r, prof, ref_r)
print(f"Delta after removal: share nearest to T-2 = {near.count('TED T-2') / len(near):.2f} (one-chunk profile: underpowered)")`,
    },
    {
      id: "takeaway",
      title: "Takeaway",
      md: `**What we can say** *(draft wording, to be approved)*: measured against 19 other anti-technology writers, the manifesto's function words match Kaczynski's 1971 essay more closely than any two different writers in our set match each other.
The match weakens but holds after we remove every passage the FBI matched, and it is perfect against his later prison writings (a known same author, with no draft overlap).

**What we cannot say.** Delta, the simpler method, could not even tell the impostors apart (accuracy 0.26), so its 43% means nothing: a method that fails its own check stays silent.
Only one calibrated method carries the result. The impostor pool is limited to what one archive hosts, texts come from different sources (an FBI transcription, typescripts, scanned books),
four authors are translated or non-native, and a high score is not a probability of guilt. The FBI's own case did not rest on this kind of analysis.`,
    },
  ],
});
