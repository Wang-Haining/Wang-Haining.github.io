"""Chapter 1 helpers (two translations of the Analects): plots and small functions so the lab cells stay short.

Colours follow the lecture: Giles = blue, Eno = orange. Shared helpers live in lab_helpers.py.
"""
import re
import numpy as np

BLUE, ORANGE, TEAL, PURPLE, GREY = "#0F5C8C", "#B35F00", "#00876A", "#A9568F", "#9E978A"
INK, MUTED, CREAM = "#1F2430", "#6B6458", "#F7F5F0"


def _plt():
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    return plt


def _setup(figsize, **kw):
    """A figure and axes in the lab's look: cream paper, no top/right lines."""
    plt = _plt()
    fig, ax = plt.subplots(figsize=figsize, **kw)
    fig.patch.set_facecolor(CREAM)
    for a in (ax if isinstance(ax, np.ndarray) else [ax]):
        a.set_facecolor(CREAM)
        for s in ("top", "right"):
            a.spines[s].set_visible(False)
        a.tick_params(colors=INK, labelsize=10)
    return fig, ax


def _colour(name):
    return BLUE if name == "Giles" else ORANGE


# ------------------------------------------------------------------ reading
def sentences(text):
    """Cut a passage into sentences (a new sentence starts after . ? : or at a dash pair)."""
    return [s.strip() for s in re.split(r"(?<=[.?:])\s+|--", text) if s.strip()]


def shout_function_words(text, words, n=50):
    """The first n words of a text, with every function word in CAPITALS."""
    keep = set(words)
    out = []
    for w in text.split()[:n]:
        core = re.sub(r"[^a-z']", "", w.lower().replace("’", "'"))
        out.append(w.upper() if core in keep else w.lower())
    return " ".join(out)


# ------------------------------------------------------------------ the data set
def chunk_map(author, n_words):
    """Each translation as a row of blocks, one block per chunk; a block is as wide as the chunk is long."""
    fig, ax = _setup((9, 2.6))
    for row, name in enumerate(["Eno", "Giles"]):
        x = 0
        for n in n_words[author == name]:
            ax.barh(row, n - 30, left=x, height=0.62, color=_colour(name), edgecolor=CREAM, linewidth=0)
            x += n
        ax.text(x + 250, row, f"{int((author == name).sum())} chunks\n{x:,} words", va="center", fontsize=10.5, color=INK)
    ax.set_yticks([0, 1])
    ax.set_yticklabels(["Eno (2015)", "Giles (1907)"], fontsize=11.5)
    ax.set_xlim(0, 28500)
    ax.set_xlabel("words, from the start of the book to the end (one block = one chunk of about 300 words)", fontsize=10)
    ax.spines["left"].set_visible(False)
    ax.tick_params(axis="y", length=0)
    return fig


# ------------------------------------------------------------------ looking at the counts
def top_words(fw, counts, n_words, author, k=12):
    """The k most used function words of each translation, as % of all its words."""
    fig, axes = _setup((9.4, 4.3), ncols=2, sharex=True)
    for ax, name in zip(axes, ["Giles", "Eno"]):
        m = author == name
        share = counts[m].sum(axis=0) / n_words[m].sum() * 100
        top = np.argsort(share)[::-1][:k][::-1]
        ax.barh([fw[j] for j in top], share[top], color=_colour(name), height=0.7)
        for pos, j in enumerate(top):
            ax.text(share[j] + 0.12, pos, f"{share[j]:.1f}", va="center", fontsize=9.5, color=MUTED)
        ax.set_title(f"{name}: the {k} most used", fontsize=12, color=_colour(name), loc="left", fontweight="bold")
        ax.tick_params(axis="y", labelsize=11)
    fig.supxlabel("% of all words in the translation", fontsize=10.5, color=INK)
    fig.tight_layout()
    return fig


def rate_dots(fw, per1000, author, words):
    """One row per word: how often Giles (blue) and Eno (orange) use it per 1,000 words.
    Big dot = the average chunk; thin bar = where the middle half of the chunks lie."""
    order = sorted(words, key=lambda w: -per1000[:, fw.index(w)].mean())
    fig, ax = _setup((8, 0.55 * len(order) + 1.6))
    for r, w in enumerate(order[::-1]):
        j = fw.index(w)
        vals = {}
        for name, off in (("Giles", 0.13), ("Eno", -0.13)):
            v = per1000[author == name, j]
            lo, hi = np.percentile(v, [25, 75])
            vals[name] = v.mean()
            ax.plot([lo, hi], [r + off] * 2, color=_colour(name), lw=3.2, alpha=0.35, solid_capstyle="round")
            ax.scatter([vals[name]], [r + off], s=85, color=_colour(name), zorder=3, edgecolors="white", linewidths=0.8)
        ax.plot([vals["Giles"], vals["Eno"]], [r + 0.13, r - 0.13], color=GREY, lw=1, zorder=1)
    ax.set_yticks(range(len(order)))
    ax.set_yticklabels(order[::-1], fontsize=12)
    ax.set_ylim(-0.7, len(order) - 0.3)
    ax.set_xlabel("times per 1,000 words  (dot = average chunk, bar = middle half of the chunks)", fontsize=10)
    ax.scatter([], [], s=85, color=BLUE, label="Giles")
    ax.scatter([], [], s=85, color=ORANGE, label="Eno")
    ax.legend(frameon=False, fontsize=10.5, loc="lower right")
    ax.spines["left"].set_visible(False)
    ax.tick_params(axis="y", length=0)
    return fig


def scatter_two(per1000, author, i, j, name_x, name_y, x_point=None):
    """Every chunk as a dot placed by two words. Big squares = the average of each translator."""
    fig, ax = _setup((6.8, 5))
    for name in ("Giles", "Eno"):
        m = author == name
        ax.scatter(per1000[m, i], per1000[m, j], s=42, color=_colour(name), alpha=0.65, edgecolors="white", linewidths=0.5, label=f"{name} chunks")
    for name in ("Giles", "Eno"):
        m = author == name
        ax.scatter([per1000[m, i].mean()], [per1000[m, j].mean()], s=190, marker="s", color=_colour(name), edgecolors=INK, linewidths=1.6, zorder=4)
        up = name == "Giles"
        ax.annotate(f"average {name}", (per1000[m, i].mean(), per1000[m, j].mean()), xytext=(14, -22) if up else (-14, 14), textcoords="offset points",
                    ha="left" if up else "right", fontsize=10, color=INK, fontweight="bold")
    if x_point is not None:
        ax.scatter([x_point[0]], [x_point[1]], s=420, marker="*", color=TEAL, edgecolors="white", linewidths=1, zorder=5, label="mystery note X")
    ax.set_xlabel(f'"{name_x}"  (times per 1,000 words)', fontsize=11)
    ax.set_ylabel(f'"{name_y}"  (times per 1,000 words)', fontsize=11)
    ax.legend(frameon=False, fontsize=10, loc="upper right")
    return fig


def pca_map(Z, author):
    """Squash the 224 numbers of every chunk into 2 so we can draw all chunks on one flat map (PCA)."""
    from sklearn.decomposition import PCA
    pca = PCA(n_components=2)
    P = pca.fit_transform(Z)
    share = pca.explained_variance_ratio_ * 100
    fig, ax = _setup((7, 5.4))
    for name in ("Giles", "Eno"):
        m = author == name
        ax.scatter(P[m, 0], P[m, 1], s=48, color=_colour(name), alpha=0.7, edgecolors="white", linewidths=0.5, label=f"{name} chunks")
    for name in ("Giles", "Eno"):
        m = author == name
        cx, cy = P[m, 0].mean(), P[m, 1].mean()
        ax.scatter([cx], [cy], s=230, marker="s", color=_colour(name), edgecolors=INK, linewidths=1.6, zorder=4)
        up = name == "Giles"
        ax.annotate(f"average {name}", (cx, cy), xytext=(-14, 14) if up else (14, -22), textcoords="offset points",
                    ha="right" if up else "left", fontsize=10, color=INK, fontweight="bold")
    ax.axhline(0, color=GREY, lw=0.6, zorder=0)
    ax.axvline(0, color=GREY, lw=0.6, zorder=0)
    ax.set_xlabel(f"map direction 1  ({share[0]:.0f}% of the differences between chunks)", fontsize=10.5)
    ax.set_ylabel(f"map direction 2  ({share[1]:.0f}%)", fontsize=10.5)
    ax.legend(frameon=False, fontsize=10, loc="best")
    return fig


# ------------------------------------------------------------------ inside the model
def weights_bars(fw, coef, k=10):
    """The k strongest words towards Giles (blue, right) and towards Eno (orange, left)."""
    order = np.argsort(coef)
    pick = list(order[:k]) + list(order[-k:])
    fig, ax = _setup((7.2, 0.33 * len(pick) + 1.4))
    vals = coef[pick]
    ax.barh([fw[j] for j in pick], vals, color=[BLUE if v > 0 else ORANGE for v in vals], height=0.72)
    ax.axvline(0, color=INK, lw=0.9)
    ax.set_xlabel("weight the model learned for the word", fontsize=10.5)
    lim = np.abs(vals).max() * 1.15
    ax.set_xlim(-lim, lim)
    ax.text(lim * 0.97, 0.01, "towards Giles  →", ha="right", va="bottom", fontsize=11, color=BLUE, fontweight="bold", transform=ax.get_xaxis_transform())
    ax.text(-lim * 0.97, 0.01, "←  towards Eno", ha="left", va="bottom", fontsize=11, color=ORANGE, fontweight="bold", transform=ax.get_xaxis_transform())
    ax.tick_params(axis="y", labelsize=11, length=0)
    ax.spines["left"].set_visible(False)
    return fig


# ------------------------------------------------------------------ testing
def confusion_plot(y, guess):
    """The four ways a guess can go: tiles show how many held-out chunks fall in each."""
    plt = _plt()
    fig, ax = _setup((5.6, 4.6))
    ax.spines["left"].set_visible(False)
    ax.spines["bottom"].set_visible(False)
    labels = ["Giles", "Eno"]
    truth = [1, 0]
    for r, t in enumerate(truth):
        row_total = int((y == t).sum())
        for c, g in enumerate(truth):
            n = int(((y == t) & (guess == g)).sum())
            ok = t == g
            ax.add_patch(plt.Rectangle((c, 1 - r), 0.94, 0.94, color=TEAL if ok else GREY, alpha=0.9 if ok else 0.45))
            ax.text(c + 0.47, 1 - r + 0.55, str(n), ha="center", va="center", fontsize=30, fontweight="bold", color="white" if ok else INK)
            ax.text(c + 0.47, 1 - r + 0.2, f"{n / row_total:.0%} of {row_total} {labels[r]} chunks", ha="center", va="center", fontsize=9.5, color="white" if ok else INK)
    ax.set_xlim(-0.05, 2)
    ax.set_ylim(-0.05, 2)
    ax.set_xticks([0.47, 1.47])
    ax.set_xticklabels([f"the model said\n{n}" for n in labels], fontsize=11, color=INK)
    ax.set_yticks([1.47, 0.47])
    ax.set_yticklabels([f"really\n{n}" for n in labels], fontsize=11, color=INK)
    ax.xaxis.tick_top()
    ax.tick_params(length=0)
    right = int(((y == 1) & (guess == 1)).sum() + ((y == 0) & (guess == 0)).sum())
    ax.set_xlabel(f"{right} of {len(y)} guesses right  =  {right / len(y):.0%} accuracy", fontsize=12, fontweight="bold", color=INK, labelpad=10)
    return fig


def prob_strip(p_giles, y, x_p=None):
    """Each held-out chunk is a dot at the probability the model gave to Giles.
    Top row: chunks really by Giles. Bottom row: really by Eno. Ringed dots are mistakes."""
    fig, ax = _setup((9.4, 3.9 if x_p is None else 4.9))
    rows = [("Really Giles", 1, BLUE), ("Really Eno", 0, ORANGE)]
    top = len(rows) + (1 if x_p is not None else 0)
    ax.axvspan(0.5, 1, color="#ECE7DD", zorder=0)
    ax.axvline(0.5, color=INK, lw=2, ls="--", zorder=1)
    rng = np.random.default_rng(4)
    for k, (label, t, col) in enumerate(rows):
        yy = top - 1 - k
        m = y == t
        p = p_giles[m]
        jit = rng.uniform(-0.27, 0.27, m.sum())
        wrong = (p > 0.5) != (t == 1)
        ax.scatter(p, yy + jit, s=55, color=col, alpha=0.78, edgecolors="white", linewidths=0.6, zorder=3)
        ax.scatter(p[wrong], (yy + jit)[wrong], s=150, facecolors="none", edgecolors=INK, linewidths=1.6, zorder=4)
        ax.text(-0.045, yy, label, ha="right", va="center", fontsize=11.5, fontweight="bold", color=col)
        ax.text(1.045, yy, f"{int(wrong.sum())} of {m.sum()} wrong", ha="left", va="center", fontsize=10.5, color=MUTED)
    if x_p is not None:
        ax.scatter([x_p], [0], s=520, marker="*", color=TEAL, edgecolors="white", linewidths=1, zorder=5)
        ax.text(-0.045, 0, "Mystery note X", ha="right", va="center", fontsize=11.5, fontweight="bold", color=TEAL)
        ax.text(1.045, 0, f"P(Giles) = {x_p:.2f}", ha="left", va="center", fontsize=10.5, color=TEAL, fontweight="bold")
        ax.set_ylim(-0.7, top - 0.2)
    else:
        ax.set_ylim(-0.6, top - 0.3)
    ax.text(0.5 + 0.015, ax.get_ylim()[1] - 0.04, "model says Giles  →", va="top", fontsize=11, color=BLUE, fontweight="bold")
    ax.text(0.5 - 0.015, ax.get_ylim()[1] - 0.04, "←  model says Eno", va="top", ha="right", fontsize=11, color=ORANGE, fontweight="bold")
    ax.set_xlim(-0.025, 1.025)
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.set_xlabel("probability the model gave to Giles  (0 = sure it is Eno, 1 = sure it is Giles)", fontsize=10.5)
    return fig


# ------------------------------------------------------------------ how many words?
def word_order(counts, fw):
    """Words in the order we add them: 'the' and 'and' first, then the rest, most used first."""
    first = [fw.index("the"), fw.index("and")]
    rest = [int(j) for j in np.argsort(-counts.sum(axis=0)) if int(j) not in first]
    return first + rest


def cv_accuracy(counts, y, cols):
    """Held-out accuracy (5 rounds) of a model that only looks at the given word columns.
    Counts become shares of all 224 words first, exactly as in the full model."""
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import cross_val_score
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import StandardScaler
    shares = counts / counts.sum(axis=1, keepdims=True)
    model = make_pipeline(StandardScaler(), LogisticRegression(C=1, solver="lbfgs", max_iter=10000))
    return cross_val_score(model, shares[:, list(cols)], y, cv=5).mean()


def accuracy_curve(sizes, accs, always_eno):
    """Held-out accuracy as the model is given more and more words."""
    fig, ax = _setup((8, 4.6))
    ax.axhspan(0.4, 0.5, color="#ECE7DD", zorder=0)
    ax.axhline(0.5, color=GREY, lw=1.4, ls=":")
    ax.axhline(always_eno, color=GREY, lw=1.4, ls="--")
    ax.text(sizes[0] * 1.05, 0.5 - 0.004, "coin flip: 50%", fontsize=10, color=MUTED, va="top")
    ax.text(sizes[0] * 1.05, always_eno + 0.006, f"always answer \"Eno\": {always_eno:.0%}", fontsize=10, color=MUTED, va="bottom")
    ax.plot(sizes, accs, color=INK, lw=1.4, zorder=2)
    cols = [BLUE if s >= 224 else PURPLE if s == 2 else TEAL for s in sizes]
    ax.scatter(sizes, accs, s=75, color=cols, zorder=3, edgecolors="white", linewidths=0.8)
    for s, a in zip(sizes, accs):
        if s in (2, 224):
            ax.annotate(f"{s} words\n{a:.0%}", (s, a), xytext=(0, -38 if s == 2 else 14), textcoords="offset points", ha="center",
                        fontsize=11, fontweight="bold", color=PURPLE if s == 2 else BLUE)
    ax.set_xscale("log")
    ax.set_xticks(sizes)
    ax.set_xticklabels([str(v) for v in sizes])
    ax.minorticks_off()
    ax.set_ylim(0.4, 0.92)
    ax.set_yticks([0.4, 0.5, 0.6, 0.7, 0.8, 0.9])
    ax.set_yticklabels(["40%", "50%", "60%", "70%", "80%", "90%"])
    ax.set_xlabel("how many function words the model may look at", fontsize=10.5)
    ax.set_ylabel("right on chunks it never saw", fontsize=10.5)
    return fig
