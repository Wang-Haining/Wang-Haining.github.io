"""Chapter 2 helpers (Unabomber case): the dot strip, the PCA map, the Ted-likeness classifier, Burrows's Delta and General Impostors.

Same recipe as unabom/scripts/verify.py, but vectorised so it runs in a browser in a few seconds.
Input is the shipped table of function-word counts per 1,000-token chunk; no text is needed.
"""
import itertools
import json
import numpy as np

SEED = 20261011          # the seed used in unabom/results/SUMMARY.md


def load(path="data/ch2/fw_counts.json"):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def arr(block):
    """{'counts': ..., 'n': ...} -> (counts matrix, tokens per chunk)."""
    return np.array(block["counts"], float), np.array(block["n"], float)


def rel(block):
    """Function-word counts -> frequency per 1,000 words (rows = chunks)."""
    c, n = arr(block)
    return c / n[:, None] * 1000


def stack(blocks):
    return np.vstack([rel(b) for b in blocks])


def zscore(X, ref):
    """Put every word on the same scale: (value - mean) / spread, measured on the reference chunks."""
    mu, sd = ref.mean(0), ref.std(0)
    sd = np.where(sd == 0, 1, sd)
    return (X - mu) / sd


def authors(D):
    """{author_key: [text records]} for the impostors, in alphabetical order."""
    out = {}
    for rec in D["impostors"]:
        out.setdefault(rec["author"], []).append(rec)
    return out


def author_freq(texts):
    return stack(texts)


def delta_nearest(Q, profiles, ref):
    """Burrows's Delta: for each chunk in Q, find the profile with the smallest mean absolute z-score difference."""
    names = list(profiles)
    P = np.vstack([zscore(profiles[n], ref).mean(0) for n in names])
    D = np.abs(zscore(Q, ref)[:, None, :] - P[None, :, :]).mean(2)
    return [names[i] for i in D.argmin(1)]


def gi_score(q, k, imps, rng, iters=200):
    """General Impostors: in what share of random feature subsets is the suspect K closer to Q than every impostor?

    q, k: z-scored profile vectors; imps: matrix of impostor profiles (rows). Each round keeps a random half of the words.
    """
    keep = rng.random((iters, len(q))) < 0.5            # iters x words: True = word is used this round

    def cos(a, B):                                       # cosine of a with each row of B, on the kept words
        num = (keep * a) @ B.T
        den = np.sqrt((keep * a * a).sum(1))[:, None] * np.sqrt(keep @ (B * B).T) + 1e-12
        return num / den

    return float((cos(q, k[None, :])[:, 0] > cos(q, imps).max(1)).mean())


def profile(freq, ref):
    return zscore(freq, ref).mean(0)


def different_author_scores(imp_freq, t2_freq, ref, rng, iters=100):
    """GI score for every ordered pair of different impostor authors (A as questioned, B as suspect).
    The other 17 impostors and Ted's T-2 act as the impostor pool. This is the 'what does a non-match look like' yardstick."""
    prof = {a: profile(f, ref) for a, f in imp_freq.items()}
    t2p = profile(t2_freq, ref)
    out = {}
    for a, b in itertools.permutations(prof, 2):
        pool = np.vstack([prof[c] for c in prof if c not in (a, b)] + [t2p])
        out[(a, b)] = gi_score(prof[a], prof[b], pool, rng, iters)
    return out


def same_author_scores(A, imp_freq, t2_freq, ref, rng, iters=200):
    """GI score for 'known same author' pairs: for each impostor with 2+ texts, the shortest text is the questioned one and
    the author's other texts are the suspect. The other impostors and T-2 form the pool. Shows how high a true match can score."""
    out = {}
    for a, texts in A.items():
        if len(texts) < 2:
            continue
        ts = sorted(texts, key=lambda r: -r["n_chars"])
        q, k = rel(ts[-1]), stack(ts[:-1])
        pool = np.vstack([profile(f, ref) for b, f in imp_freq.items() if b != a] + [profile(t2_freq, ref)])
        out[a] = gi_score(profile(q, ref), profile(k, ref), pool, rng, iters)
    return out


# ------------------------------------------------------------------ the classifier steps (Steps 1 to 4)
BLUE, ORANGE, GREY, INK = "#2F5D8A", "#B45309", "#9E978A", "#1F2430"     # Ted's essay, the manifesto, other writers, text


def per_1000(block):
    """Whole-text counts {'n', 'counts'} -> function-word frequencies per 1,000 words."""
    return np.array(block["counts"], float) / block["n"] * 1000


def dot_strip(D, words):
    """One row per word: 19 other writers (grey dots), Ted's 1971 essay (blue diamond), the manifesto (orange star)."""
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    ix = {w: i for i, w in enumerate(D["fw"])}
    T = D["totals"]
    others = np.array([per_1000(b) for b in T["authors"].values()])
    t2, u14 = per_1000(T["t2"]), per_1000(T["u14"])
    fig, axes = plt.subplots(len(words), 1, figsize=(7.5, 1.35 * len(words) + 0.9), squeeze=False)
    rng = np.random.default_rng(1)
    for ax, w in zip(axes[:, 0], words):
        j = ix[w]
        ax.scatter(others[:, j], rng.uniform(-0.18, 0.18, len(others)), s=36, color=GREY, alpha=0.9, zorder=2, label="19 other writers")
        ax.scatter([t2[j]], [0], s=110, marker="D", color=BLUE, zorder=3, label="Ted's 1971 essay")
        ax.scatter([u14[j]], [0], s=190, marker="*", color=ORANGE, zorder=4, label="The manifesto (1995)")
        lo, hi = min(others[:, j].min(), t2[j], u14[j]), max(others[:, j].max(), t2[j], u14[j])
        ax.set_xlim(lo - (hi - lo) * 0.08, hi + (hi - lo) * 0.08); ax.set_ylim(-0.5, 0.5); ax.set_yticks([])
        ax.set_ylabel('"%s"' % w, rotation=0, ha="right", va="center", fontsize=12)
        for sp in ("top", "right", "left"):
            ax.spines[sp].set_visible(False)
    axes[-1, 0].set_xlabel("times per 1,000 words (each row has its own scale)")
    h, lab = axes[0, 0].get_legend_handles_labels()
    fig.legend(h, lab, loc="upper center", ncol=3, frameon=False, fontsize=9)
    fig.tight_layout(rect=(0, 0, 1, 0.93 if len(words) > 2 else 0.88))
    return fig


def piece_counts(D, size, drop_fbi=False):
    """Counts per piece for one piece size (500 or 1,000 words): Ted's 1971 essay, the manifesto, Ted's later writings, the other writers.
    drop_fbi=True removes the passages the FBI matched. Returns (T, U, P, I, text_of_each_impostor_piece); every block is a counts matrix."""
    if size == 500:
        p = D["p500"]
        blocks = (p["t2_drop"] if drop_fbi else p["t2"], p["u14_drop"] if drop_fbi else p["u14"], p["post"], p["imp"])
    elif size == 1000:
        blocks = (D["t2_r1_first1000"] if drop_fbi else D["t2"], D["u14_r1"] if drop_fbi else D["u14"], D["post1000"], D["impostors"])
    else:
        raise ValueError("This lab ships pieces of 500 and 1,000 words only.")
    T, U, P = (np.array(b["counts"], float) for b in blocks[:3])
    imp = blocks[3]
    I = np.vstack([np.array(r["counts"], float) for r in imp])
    groups = np.array([r["author"] + "__" + r["text"] for r in imp for _ in r["n"]])
    return T, U, P, I, groups


def group_folds(groups, k=5):
    """Split pieces into k folds so that all pieces of one text stay together (same rule as scikit-learn's GroupKFold:
    biggest texts first, each into the lightest fold; written out here so every scikit-learn version gives the same folds)."""
    names, which = np.unique(groups, return_inverse=True)
    size = np.bincount(which)
    load, fold_of = np.zeros(k), np.zeros(len(names), int)
    for g in np.argsort(size, kind="stable")[::-1]:
        fold_of[g] = load.argmin()
        load[fold_of[g]] += size[g]
    return [(np.where(fold_of[which] != f)[0], np.where(fold_of[which] == f)[0]) for f in range(k)]


def ted_likeness(D, size=1000, drop_fbi=False, words=None):
    """Train 'Ted or not?' on Ted's 1971 essay vs the 19 other writers, then score three groups of pieces.
    Other writers' pieces are scored HELD OUT: the model never saw that whole text (5-fold, grouped by text).
    Returns the scores (probabilities of 'Ted') and the share of other writers' pieces that the median manifesto / later-Ted piece outscores."""
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import Normalizer, StandardScaler
    from sklearn.linear_model import LogisticRegression
    T, U, P, I, groups = piece_counts(D, size, drop_fbi)
    if words is not None:                                     # keep only the chosen function words
        cols = [D["fw"].index(w) for w in words]
        T, U, P, I = T[:, cols], U[:, cols], P[:, cols], I[:, cols]

    def model():                                              # shares of words -> one scale per word -> logistic regression
        return make_pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1.0, max_iter=5000, class_weight="balanced"))

    held = np.zeros(len(I))
    for train, test in group_folds(groups):
        m = model().fit(np.vstack([T, I[train]]), np.r_[np.ones(len(T)), np.zeros(len(train))])
        held[test] = m.predict_proba(I[test])[:, 1]
    m = model().fit(np.vstack([T, I]), np.r_[np.ones(len(T)), np.zeros(len(I))])
    pu, pp = m.predict_proba(U)[:, 1], m.predict_proba(P)[:, 1]
    return {"held": held, "manifesto": pu, "later": pp, "n_ted": len(T), "size": size,
            "beats_manifesto": float((held < np.median(pu)).mean() * 100), "beats_later": float((held < np.median(pp)).mean() * 100)}


def likeness_plot(r):
    """The Ted-likeness dot plot: one dot per 1,000-word (or 500-word) piece; the black tick is each row's median."""
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    lg = lambda p: np.log(np.clip(p, 1e-6, 1 - 1e-6) / (1 - np.clip(p, 1e-6, 1 - 1e-6)))
    rows = [(r["held"], 2, GREY, "o", 30, "other writers\n(held out)"), (r["later"], 1, BLUE, "D", 50, "Ted's later\nwritings"),
            (r["manifesto"], 0, ORANGE, "*", 130, "the manifesto")]
    fig, ax = plt.subplots(figsize=(7.5, 3.8))
    rng = np.random.default_rng(3)
    for p, y, c, mk, s, lab in rows:
        v = lg(p)
        ax.scatter(v, y + rng.uniform(-0.25, 0.25, len(v)), s=s, color=c, marker=mk, alpha=0.85 if c == GREY else 1, zorder=3)
        ax.plot([np.median(v)] * 2, [y - 0.35, y + 0.35], color=INK, lw=2, zorder=4)
    ax.set_yticks([2, 1, 0]); ax.set_yticklabels([x[5] for x in rows], fontsize=10)
    ax.set_xticks([]); ax.set_xlabel("computer's score:  less like Ted   <-    ->   more like Ted")
    for sp in ("top", "right", "left"):
        ax.spines[sp].set_visible(False)
    ax.set_ylim(-1.7, 2.5)
    ax.text(np.median(lg(r["manifesto"])), -0.55, "typical manifesto piece beats %.1f%%\nof other writers' pieces" % r["beats_manifesto"],
            ha="center", va="top", fontsize=10, color=ORANGE, fontweight="bold")
    return fig
