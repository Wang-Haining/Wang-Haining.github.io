"""Chapter 2 helpers (Unabomber case): the dot strip, and the "Ted or not?" model that scores whole texts.

Same recipe as unabom/scripts/text_level.py. Input is the shipped table of function-word counts per 1,000-word piece; no text is needed.
"""
import json
import numpy as np

BLUE, ORANGE, GREY, INK, TEAL = "#0F5C8C", "#B35F00", "#9E978A", "#1F2430", "#00876A"   # Ted, the manifesto, other writers, text, highlights (lecture palette)
CREAM, MUTED, CRIM = "#F7F5F0", "#6B6458", "#1F2430"                      # page background, quiet text, the alarm line


def load(path="data/ch2/fw_counts.json"):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def counts(block):
    """{'counts': ..., 'n': ...} -> matrix of function-word counts, one row per 1,000-word piece."""
    return np.array(block["counts"], float)


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


def make_model():
    """Shares of words -> one scale per word -> logistic regression."""
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import Normalizer, StandardScaler
    from sklearn.linear_model import LogisticRegression
    return make_pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1.0, max_iter=5000, class_weight="balanced"))


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


def train_and_score(D):
    """Train "Ted or not?" on Ted's 1971 essay (1) against the other writers' pieces (0), then score whole texts.
    A text's score = the average log-odds of its 1,000-word pieces.
    Other writers' texts are scored by a model that never saw them (5 folds, split by whole text).
    Returns the three groups of scores and the alarm line (the 95th percentile of the other writers' scores)."""
    T = counts(D["t2"])
    imp = D["impostors"]
    I = np.vstack([counts(r) for r in imp])
    groups = np.array([r["author"] + "/" + r["text"] for r in imp for _ in r["n"]])
    held = np.zeros(len(I))
    for train, test in group_folds(groups):
        m = make_model().fit(np.vstack([T, I[train]]), np.r_[np.ones(len(T)), np.zeros(len(train))])
        held[test] = m.decision_function(I[test])
    texts = sorted(set(groups))
    others = np.array([held[groups == g].mean() for g in texts])
    m = make_model().fit(np.vstack([T, I]), np.r_[np.ones(len(T)), np.zeros(len(I))])
    later = np.array([m.decision_function(counts(r)).mean() for r in D["ted_post"]])
    manifesto = float(m.decision_function(counts(D["u14"])).mean())
    return {"others": others, "later": later, "manifesto": manifesto, "line": float(np.quantile(others, 0.95))}


def score_plot(r):
    """Three rows, one dot per whole text. Everything right of the dashed line is flagged as Ted."""
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    th = r["line"]
    rows = [(r["others"], "Other writers", "texts it never saw", GREY, "o", 45, True),
            (r["later"], "Ted's later essays", "known Ted: a check", BLUE, "D", 90, True),
            (np.array([r["manifesto"]]), "The manifesto", "the question", ORANGE, "*", 330, True)]
    n = len(rows)
    fig = plt.figure(figsize=(9.6, 1.35 * n + 0.9), dpi=100); fig.patch.set_facecolor(CREAM)
    ax = fig.add_axes([0.30, 0.19, 0.46, 0.76]); ax.set_facecolor(CREAM)
    allv = np.concatenate([x[0] for x in rows])
    xmin, xmax = allv.min() - .5, allv.max() + .5
    ax.set_xlim(xmin, xmax); ax.set_ylim(-.55, n - 1 + .85)
    ax.axvspan(th, xmax, color="#ECE7DD", zorder=0); ax.axvline(th, color=CRIM, lw=2.5, ls="--", zorder=1)
    rng = np.random.default_rng(3)
    for (v, lab, role, col, mk, sz, _), yy in zip(rows, range(n - 1, -1, -1)):
        jit = rng.uniform(-.28, .28, len(v)) if len(v) > 1 else np.zeros(1)
        ax.scatter(v, yy + jit, s=sz, color=col, marker=mk, edgecolors="white", linewidths=.8, alpha=.9 if col == GREY else 1, zorder=3)
        ylab = ax.transData.transform((0, yy))[1] / fig.bbox.height
        fig.text(0.285, ylab + .018, lab, ha="right", va="center", fontsize=11.5, fontweight="bold", color=INK)
        fig.text(0.285, ylab - .036, role, ha="right", va="center", fontsize=8.5, color=MUTED)
        k = int((v > th).sum())
        txt = ("flagged" if k else "not flagged") if len(v) == 1 else "%d of %d flagged" % (k, len(v))
        fig.text(0.78, ylab, txt, ha="left", va="center", fontsize=11.5, fontweight="bold", color=MUTED if col == GREY else col)
    ax.text(th + 0.12, n - 1 + .62, "flagged as Ted  →", color=CRIM, fontsize=12, fontweight="bold", va="center")
    ax.set_yticks([]); ax.set_xticks([])
    ax.set_xlabel("Computer's score:   less like Ted  ←            →  more like Ted", fontsize=10, color=INK)
    for k in ("top", "right", "left"):
        ax.spines[k].set_visible(False)
    return fig


# ---- extra pictures for the step-by-step chapter ------------------------------------------------------------------

def _plt():
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    plt.rcParams.update({"font.size": 10.5, "axes.spines.top": False, "axes.spines.right": False,
                         "axes.titleweight": "bold", "axes.titlesize": 12, "axes.titlelocation": "left"})
    return plt


def piece_bars(piece, fw, k=15):
    """The k most used small words in one 1,000-word piece."""
    plt = _plt()
    top = np.argsort(piece)[::-1][:k][::-1]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    ax.barh([fw[j] for j in top], piece[top], color=BLUE)
    for i, j in enumerate(top):
        ax.text(piece[j] + 0.6, i, str(int(piece[j])), va="center", fontsize=9, color=MUTED)
    ax.set_xlabel("times in this 1,000-word piece")
    ax.set_title("One piece of Ted's 1971 essay, as the computer sees it")
    return fig


def table_heatmap(X, fw, n_ted, words=("the", "of", "and", "to", "a", "in", "that", "is", "which", "it", "be", "will", "not", "as", "because", "any"), k=6):
    """A corner of the training table: k Ted pieces and k other-writer pieces, a few columns, with the label column y."""
    plt = _plt()
    rows = list(range(k)) + list(range(n_ted, n_ted + k))
    cols = [fw.index(w) for w in words]
    M = X[np.ix_(rows, cols)]
    fig, (ax, ay) = plt.subplots(1, 2, figsize=(9.6, 4.6), gridspec_kw={"width_ratios": [len(cols), 1.4], "wspace": 0.05})
    ax.imshow(M, cmap="Blues", aspect="auto")
    for i in range(M.shape[0]):
        for j in range(M.shape[1]):
            ax.text(j, i, int(M[i, j]), ha="center", va="center", fontsize=8, color="white" if M[i, j] > M.max() * 0.55 else INK)
    ax.set_xticks(range(len(cols))); ax.set_xticklabels(words, rotation=55, ha="right")
    ax.set_yticks(range(len(rows))); ax.set_yticklabels([f"Ted 1971 · piece {i + 1}" for i in range(k)] + [f"other writer · piece {i + 1}" for i in range(k)], fontsize=9)
    ax.axhline(k - 0.5, color=INK, lw=1.5)
    ax.set_title("X: one row per piece, one column per small word (16 of 224 shown)")
    ay.imshow(np.r_[np.ones(k), np.zeros(k)][:, None], cmap=matplotlib_cmap(), aspect="auto", vmin=0, vmax=1)
    for i in range(2 * k):
        ay.text(0, i, "1" if i < k else "0", ha="center", va="center", fontsize=10, fontweight="bold", color="white" if i < k else INK)
    ay.set_xticks([0]); ay.set_xticklabels(["y"], fontweight="bold"); ay.set_yticks([])
    for sp in ay.spines.values():
        sp.set_visible(False)
    return fig


def matplotlib_cmap():
    from matplotlib.colors import ListedColormap
    return ListedColormap(["#ECE7DD", BLUE])


def scale_hist(shares, scaled, fw, words=("the", "because")):
    """Before and after rescaling: each word's values across all pieces."""
    plt = _plt()
    fig, axes = plt.subplots(2, len(words), figsize=(9.6, 5.2))
    for c, w in enumerate(words):
        j = fw.index(w)
        axes[0, c].hist(shares[:, j], bins=30, color=GREY)
        axes[0, c].set_title(f'"{w}" as a share of all small words')
        axes[1, c].hist(scaled[:, j], bins=30, color=TEAL)
        axes[1, c].axvline(0, color=INK, lw=1.2, ls="--")
        axes[1, c].set_title(f'"{w}" after rescaling: 0 = usual')
        axes[1, c].set_xlim(-4, 4)
    for ax in axes.ravel():
        ax.set_yticks([])
    axes[1, 0].set_xlabel("below usual  ←   0   →  above usual"); axes[1, 1].set_xlabel("below usual  ←   0   →  above usual")
    fig.tight_layout()
    return fig


def pca_map(X, T, U, n_ted):
    """Every piece as one dot on a 2-D map of all 224 small words (PCA). Grey: other writers; blue: Ted 1971; orange: the manifesto."""
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import Normalizer, StandardScaler
    from sklearn.decomposition import PCA
    plt = _plt()
    pre = make_pipeline(Normalizer(norm="l1"), StandardScaler()).fit(X)
    pca = PCA(2).fit(pre.transform(X))
    Zi, Zt, Zu = (pca.transform(pre.transform(M)) for M in (X[n_ted:], T, U))
    fig, ax = plt.subplots(figsize=(7.6, 5.6))
    ax.scatter(Zi[:, 0], Zi[:, 1], s=22, color=GREY, alpha=0.6, label="other writers (282 pieces)")
    ax.scatter(Zu[:, 0], Zu[:, 1], s=110, marker="*", color=ORANGE, edgecolors="white", linewidths=0.5, label="the manifesto (30 pieces)")
    ax.scatter(Zt[:, 0], Zt[:, 1], s=70, marker="D", color=BLUE, edgecolors="white", linewidths=0.6, label="Ted's 1971 essay (6 pieces)")
    ax.set_xlabel("map direction 1"); ax.set_ylabel("map direction 2"); ax.set_xticks([]); ax.set_yticks([])
    ax.set_title("All 224 small words, squeezed onto one map")
    ax.legend(frameon=False, loc="lower right", fontsize=9)
    return fig


def weight_bars(w, fw, k=12):
    """The k strongest words on each side of the model."""
    plt = _plt()
    order = np.argsort(w)
    idx = list(order[:k]) + list(order[-k:])
    fig, ax = plt.subplots(figsize=(7.6, 6.4))
    vals = w[idx]
    ax.barh(range(len(idx)), vals, color=[BLUE if v > 0 else GREY for v in vals])
    ax.set_yticks(range(len(idx))); ax.set_yticklabels([fw[j] for j in idx])
    ax.axvline(0, color=INK, lw=1)
    ax.set_xlabel("weight:   ← says \"not Ted\"        says \"Ted\" →")
    ax.set_title("What the model learned: the strongest small words")
    return fig


def contributions(model, row, fw, k=8):
    """How one piece's score is added up: weight x (rescaled) value for each word; the biggest pushes either way."""
    plt = _plt()
    z = model[:-1].transform(row[None, :])[0]
    w = model[-1].coef_[0]
    c = w * z
    order = np.argsort(c)
    idx = list(order[:k]) + list(order[-k:])
    fig, ax = plt.subplots(figsize=(7.6, 5.4))
    ax.barh(range(len(idx)), c[idx], color=[BLUE if v > 0 else GREY for v in c[idx]])
    ax.set_yticks(range(len(idx))); ax.set_yticklabels([fw[j] for j in idx])
    ax.axvline(0, color=INK, lw=1)
    ax.set_xlabel("push on the score:   ← less like Ted      more like Ted →")
    ax.set_title("Inside one score: which words pushed it up or down")
    return fig, float(c.sum() + model[-1].intercept_[0])


def alarm_hist(others, line):
    """The other writers' whole-text scores (from models that never saw them), with the alarm line."""
    plt = _plt()
    fig, ax = plt.subplots(figsize=(8.0, 3.6))
    ax.hist(others, bins=14, color=GREY, edgecolor="white")
    ax.axvline(line, color=INK, lw=2.2, ls="--")
    ax.text(line + 0.1, ax.get_ylim()[1] * 0.92, "alarm line", fontweight="bold", color=INK)
    ax.set_xlabel("score of a whole text:   less like Ted ←   → more like Ted"); ax.set_ylabel("number of texts")
    ax.set_title("29 texts by other writers, each scored by a model that never saw it")
    return fig


def similarity_rank(D, X, n_ted):
    """Who writes most like the manifesto? Each writer's average profile (shares, rescaled) against the manifesto's
    (cosine similarity). Returns the figure and the ranking [(name, similarity), ...], most alike first."""
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import Normalizer, StandardScaler
    plt = _plt()
    pre = make_pipeline(Normalizer(norm="l1"), StandardScaler()).fit(X)
    u = pre.transform(counts(D["u14"])).mean(0)
    cos = lambda a: float(a @ u / np.linalg.norm(a) / np.linalg.norm(u))
    by = {}
    for r in D["impostors"]:
        by.setdefault(r["name"], []).append(counts(r))
    rank = [("Ted Kaczynski (1971 essay)", cos(pre.transform(X[:n_ted]).mean(0)))]
    rank += [(name, cos(pre.transform(np.vstack(rows)).mean(0))) for name, rows in by.items()]
    rank.sort(key=lambda t: -t[1])
    fig, ax = plt.subplots(figsize=(8.2, 6.4))
    names, vals = [n for n, _ in rank][::-1], [v for _, v in rank][::-1]
    ted = [n.startswith("Ted") for n in names]
    ax.barh(range(len(vals)), vals, color=[BLUE if t else GREY for t in ted], height=0.72)
    ax.set_yticks(range(len(vals))); ax.set_yticklabels(names)
    for lab, t in zip(ax.get_yticklabels(), ted):
        if t: lab.set_color(BLUE); lab.set_fontweight("bold")
    ax.axvline(0, color=INK, lw=1)
    ax.set_xticks([])
    ax.set_xlabel("←  less like the manifesto            more like the manifesto  →")
    ax.set_title("Who writes most like the manifesto?")
    ax.spines["left"].set_visible(False)
    return fig, rank
