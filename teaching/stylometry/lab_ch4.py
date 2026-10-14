"""Chapter 4 helpers (Glassdoor v. Machine Zone, a what-if): the EBG loader, the 224-function-word attacker and a few small utilities.

The attacker (FW224Attacker) counts the 224 function words of Chapter 2 in a text and uses a logistic regression
(Normalizer l1 -> StandardScaler -> LogisticRegression C=1).
It gives every candidate a probability; the candidate with the highest one is the attacker's top guess.
(FWAttacker and Char3Attacker below are only used by the legacy Riddell-Juola page, index.html#ch4rj.)
scikit-learn / numpy are imported inside the functions, so this file loads even before they are downloaded.
"""
import hashlib
import json
import re
from statistics import median

TOK = re.compile(r"[a-z]+(?:'[a-z]+)?")


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def words(text):
    """Lower-case words (letters and inner apostrophes), the same tokenizer as Chapter 2."""
    return TOK.findall(text.lower().replace("’", "'"))


def fw_matrix(texts, fw):
    """Rows = texts, columns = function words, values = occurrences per 100 words."""
    import numpy as np
    idx = {w: i for i, w in enumerate(fw)}
    M = np.zeros((len(texts), len(fw)))
    for r, t in enumerate(texts):
        toks = words(t)
        for w in toks:
            if w in idx:
                M[r, idx[w]] += 1
        M[r] *= 100 / max(len(toks), 1)
    return M


class FW224Attacker:
    """The lab's one simple attacker: 224 function-word counts + logistic regression."""
    title = "224 function words + logistic regression"

    def __init__(self, texts, labels, words):
        import numpy as np
        from sklearn.linear_model import LogisticRegression
        from sklearn.pipeline import make_pipeline
        from sklearn.preprocessing import Normalizer, StandardScaler
        import lab_helpers as H
        self.words, self.H = words, H
        X = np.array([H.fw_counts(t, words) for t in texts])
        # multinomial (softmax) for 45 authors is scikit-learn's default with lbfgs
        self.model = make_pipeline(Normalizer(norm="l1"), StandardScaler(),
                                   LogisticRegression(C=1, solver="lbfgs", max_iter=10000)).fit(X, labels)
        self.classes_ = self.model[-1].classes_

    def scores(self, text):
        p = self.model.predict_proba([self.H.fw_counts(text, self.words)])[0]
        return dict(zip(self.classes_, p))


class FWAttacker:
    """Attacker 1: function-word frequencies + logistic regression (probabilities add up to 1)."""
    title = "Attacker 1 (function words + logistic regression)"

    def __init__(self, texts, labels, fw):
        from sklearn.linear_model import LogisticRegression
        from sklearn.preprocessing import StandardScaler
        self.fw = fw
        X = fw_matrix(texts, fw)
        self.sc = StandardScaler().fit(X)
        self.model = LogisticRegression(C=0.1, max_iter=2000).fit(self.sc.transform(X), labels)

    def scores(self, text):
        p = self.model.predict_proba(self.sc.transform(fw_matrix([text], self.fw)))[0]
        return dict(zip(self.model.classes_, p))


class Char3Attacker:
    """Attacker 2: every run of three characters (the, ing, ...) + a linear support vector machine."""
    title = "Attacker 2 (character 3-grams + SVM)"

    def __init__(self, texts, labels):
        from sklearn.feature_extraction.text import CountVectorizer
        from sklearn.preprocessing import normalize
        from sklearn.svm import LinearSVC
        self.cv = CountVectorizer(analyzer="char", ngram_range=(3, 3), max_features=1500)
        self.norm = normalize
        self.model = LinearSVC(C=10, max_iter=20000).fit(normalize(self.cv.fit_transform(texts).astype(float)), labels)

    def scores(self, text):
        s = self.model.decision_function(self.norm(self.cv.transform([text]).astype(float)))[0]
        return dict(zip(self.model.classes_, s))


def rank_of(scores, who):
    """1 = the attacker's top guess is `who`; 2 = `who` is second; ..."""
    return 1 + sum(1 for a, s in scores.items() if s > scores[who])


def top_guess(scores):
    return str(max(scores, key=scores.get))


# ---------------------------------------------------------------- EBG corpus (downloaded by the page, checked here)
def _decode(raw):
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252", errors="replace")


def load_ebg(manifest="data/ch4/ebg_manifest.json", root="data/ch4/ebg"):
    """Read the EBG files the page downloaded and check each one against the SHA-256 in the manifest.

    Returns (authors, train, test, obf, imi):
      train[a] = list of the author's pre-existing texts (~500 words each); test[a] = held-out text <a>_01_1.txt;
      obf[a] = the author's own attempt to obfuscate; imi[a] = the author's attempt to imitate Cormac McCarthy (first file).
    """
    man = load_json(manifest)
    train, test, obf, imi = {}, {}, {}, {}
    for f in man["files"]:
        with open(f"{root}/{f['p']}", "rb") as fh:
            raw = fh.read()
        if hashlib.sha256(raw).hexdigest() != f["sha256"]:
            raise ValueError(f"{f['p']} does not match the pinned commit (SHA-256 differs)")
        a, text = f["p"].split("/")[0], _decode(raw)
        if f["role"] == "train":
            train.setdefault(a, []).append(text)
        elif f["role"] == "test":
            test[a] = text
        elif f["role"] == "obfuscation":
            obf[a] = text
        elif f["role"] == "imitation" and f["p"].endswith("_imitation_01.txt"):
            imi[a] = text
    return sorted(train), train, test, obf, imi


def ranks_all(attacker, rewrites):
    """{author: rank of the true author} for a dict {author: text}; same as ranks_of."""
    return ranks_of(attacker, rewrites)


def ranks_of(attacker, texts):
    """{author: rank of the true author} for a dict {author: text} (1 = the attacker's top guess is the true author)."""
    return {a: rank_of(attacker.scores(t), a) for a, t in texts.items()}


def summary(ranks):
    """(caught at rank 1, within top 5, median rank) as table cells, for a dict of ranks."""
    r = list(ranks.values())
    n = len(r)
    k1, k5 = sum(x == 1 for x in r), sum(x <= 5 for x in r)
    return [f"{k1}/{n} ({k1 / n:.0%})", f"{k5}/{n} ({k5 / n:.0%})", f"{median(r):g}"]


def pick_john_doe(attacker, test):
    """Transparent rule: among the authors whose held-out text the attacker ranks first, sort by the probability it gave the true author
    and take the middle one (the lower of the two middle ones when the count is even). Returns (john_doe, the sorted list of (author, probability))."""
    sc = {a: attacker.scores(t) for a, t in test.items()}
    caught = sorted(((a, sc[a][a]) for a in test if rank_of(sc[a], a) == 1), key=lambda x: x[1])
    return caught[(len(caught) - 1) // 2][0], caught


def pooled(rank_dicts):
    """Pool several {author: rank} dicts (e.g. the same strategy by four models) into one dict {(i, author): rank}."""
    out = {}
    for i, d in enumerate(rank_dicts):
        for a, r in d.items():
            out[(i, a)] = r
    return out


def rank_among(attacker, text, who=None):
    """Rank every candidate for `text`. Returns (list of (candidate, probability) from most to least likely, rank and probability of `who`)."""
    sc = attacker.scores(text)
    order = sorted(sc, key=sc.get, reverse=True)
    return [(c, sc[c]) for c in order], (rank_of(sc, who), sc[who]) if who is not None else None


# ================================================================ Case 4 as a defence project: John Doe's side
# Colours (lecture palette): translation = TEAL, write differently = BLUE, simple English = PURPLE, McCarthy style = ORANGE, no disguise = INK / GREY.
BLUE, ORANGE, TEAL, PURPLE = "#0F5C8C", "#B35F00", "#00876A", "#A9568F"
GREY, INK, MUTED, CREAM, PALE = "#9E978A", "#1F2430", "#6B6458", "#F7F5F0", "#E4DFD3"

STRATEGIES = [("obfuscation", "Write differently (model)"), ("backtranslation", "Translation round trip"),
              ("simplification", "Simple English"), ("imitation", "McCarthy style")]
COLOR = {"none": INK, "human": BLUE, "obfuscation": BLUE, "backtranslation": TEAL, "simplification": PURPLE, "imitation": ORANGE}
LABEL = dict(STRATEGIES, none="No disguise", human="Write differently (by hand)")
CHANCE = 1                       # by luck, 1 writer in 45 is named first: 1 of 45 (2.2%)


def _plt():
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    return plt


def _axes(figsize, ax=None):
    """A cream figure with one clean axis (no top / right spine)."""
    plt = _plt()
    fig, ax = plt.subplots(figsize=figsize, dpi=100)
    fig.patch.set_facecolor(CREAM)
    ax.set_facecolor(CREAM)
    for k in ("top", "right"):
        ax.spines[k].set_visible(False)
    for k in ("left", "bottom"):
        ax.spines[k].set_color(MUTED)
    ax.tick_params(colors=INK, labelsize=10)
    return fig, ax


def _clean(ax):
    ax.set_facecolor(CREAM)
    for k in ("top", "right"):
        ax.spines[k].set_visible(False)
    for k in ("left", "bottom"):
        ax.spines[k].set_color(MUTED)
    ax.tick_params(colors=INK, labelsize=10)


def words_kept(original, new):
    """Share of the original's words that are still in the new text (0 to 1). Words are counted with their repeats."""
    from collections import Counter
    a, b = Counter(words(original)), Counter(words(new))
    return sum(min(n, b[w]) for w, n in a.items()) / max(sum(a.values()), 1)


def rates(texts, ws):
    """How often each word in `ws` appears per 100 words, over all the given texts together."""
    from collections import Counter
    c, n = Counter(), 0
    for t in texts:
        tk = words(t)
        c.update(tk)
        n += len(tk)
    return {w: 100 * c[w] / max(n, 1) for w in ws}


def strip_plot(known, review_rates, doe, ws, title):
    """One row per small word: every writer (grey dot). With `doe`: the other 44 writers, John Doe's known writing (diamond), his review (star)."""
    plt = _plt()
    import numpy as np
    n = len(ws)
    fig, axes = plt.subplots(n, 1, figsize=(8, 1.3 * n + 1.1), dpi=100, squeeze=False)
    fig.patch.set_facecolor(CREAM)
    rng = np.random.default_rng(2)
    for ax, w in zip(axes[:, 0], ws):
        _clean(ax)
        others = [known[a][w] for a in known if a != doe]
        ax.scatter(others, rng.uniform(-0.2, 0.2, len(others)), s=34, color=GREY, alpha=0.85, zorder=2, label="44 other writers" if doe else "45 writers")
        vals = list(others)
        if doe:
            ax.scatter([known[doe][w]], [0], s=120, marker="D", color=INK, zorder=3, label="John Doe's known writing")
            ax.scatter([review_rates[w]], [0], s=260, marker="*", color=INK, edgecolors=CREAM, linewidths=1, zorder=4, label="John Doe's review")
            vals += [known[doe][w], review_rates[w]]
        pad = (max(vals) - min(vals)) * 0.07
        ax.set_xlim(min(vals) - pad, max(vals) + pad)
        ax.set_ylim(-0.5, 0.5)
        ax.set_yticks([])
        ax.spines["left"].set_visible(False)
        ax.set_ylabel('"%s"' % w, rotation=0, ha="right", va="center", fontsize=13, color=INK)
    axes[-1, 0].set_xlabel("times per 100 words (each row has its own scale)", fontsize=10, color=INK)
    h, lab = axes[0, 0].get_legend_handles_labels()
    fig.suptitle(title, y=1.0, fontsize=13, fontweight="bold", color=INK)
    fig.legend(h, lab, loc="upper center", bbox_to_anchor=(0.5, 0.965), ncol=3, frameon=False, fontsize=10)
    fig.tight_layout(rect=(0, 0, 1, 0.86))
    return fig


def rank_bars(scores, who, color, title, ax=None, name="John Doe"):
    """The attacker's probability for each of the 45 candidates, best first. `who` is highlighted."""
    own = ax is None
    if own:
        fig, ax = _axes((9, 4))
    else:
        fig = ax.figure
        _clean(ax)
    order = sorted(scores, key=scores.get, reverse=True)
    vals = [scores[c] for c in order]
    cols = [color if c == who else GREY for c in order]
    ax.bar(range(1, len(order) + 1), vals, color=cols, width=0.8, zorder=2)
    r = order.index(who) + 1
    ax.set_xlim(0, len(order) + 1)
    top = max(vals)
    ax.set_ylim(0, top * 1.28)
    text = "%s: rank %d of %d" % (name, r, len(order))
    if scores[who] > 0.5 * top:
        ax.annotate(text, xy=(r, scores[who]), xytext=(r + 5, top * 1.12), fontsize=11.5, fontweight="bold", color=color,
                    arrowprops=dict(arrowstyle="-", color=color, lw=1.5), ha="left", va="center")
    else:                                    # a tiny bar: mark it with a triangle so it can be found
        ax.scatter([r], [scores[who] + top * 0.04], marker="v", s=120, color=color, zorder=4)
        ax.annotate(text, xy=(r, scores[who] + top * 0.08), xytext=(min(max(r, 10), 36), top * 0.4), fontsize=11.5, fontweight="bold",
                    color=color, arrowprops=dict(arrowstyle="-", color=color, lw=1.5), ha="center", va="bottom")
    ax.set_xlabel("the 45 candidates, from the attacker's best guess (1) to its last (45)", fontsize=10, color=INK)
    ax.set_ylabel("how likely the attacker thinks\nit is this writer", fontsize=10, color=INK)
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    if own:
        fig.tight_layout()
    return fig


def waffle(ranks, color, title, doe=None, ax=None):
    """45 squares, one per writer. Coloured = the attacker names this writer first (caught). Pale = not caught."""
    own = ax is None
    if own:
        fig, ax = _axes((8, 3.4))
    else:
        fig = ax.figure
    cols, rows = 15, 3
    names = sorted(ranks, key=lambda a: (ranks[a], a))
    for i, a in enumerate(names):
        x, y = i % cols, rows - 1 - i // cols
        hit = ranks[a] == 1
        ax.add_patch(_plt().Rectangle((x + 0.06, y + 0.06), 0.88, 0.88, facecolor=color if hit else PALE, edgecolor=INK if a == doe else "none", lw=2.5, zorder=2))
    k = sum(1 for v in ranks.values() if v == 1)
    ax.set_xlim(-0.1, cols + 0.1)
    ax.set_ylim(-0.1, rows + 0.1)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    ax.text(cols / 2, -0.55, "%d of %d writers caught at rank 1   (pure luck: about %d)" % (k, len(ranks), CHANCE),
            ha="center", va="top", fontsize=11.5, color=color if color != GREY else INK, fontweight="bold")
    if own:
        fig.tight_layout()
    return fig


def slope(before, after, color, title, doe=None, after_label="after the disguise"):
    """Each writer's rank before and after: a line per writer. John Doe's line is thick. Rank 1 is at the top."""
    plt = _plt()
    fig, ax = _axes((6.4, 5.2))
    for a in before:
        isd = a == doe
        ax.plot([0, 1], [before[a], after[a]], color=color if isd else GREY, lw=3.5 if isd else 1, alpha=1 if isd else 0.55, zorder=3 if isd else 2)
    ax.scatter([0] * len(before), [before[a] for a in before], s=14, color=INK, zorder=4)
    ax.scatter([1] * len(before), [after[a] for a in before], s=14, color=color, zorder=4)
    ax.set_yscale("log")
    ax.set_ylim(48, 0.8)
    ax.set_yticks([1, 2, 5, 10, 20, 45])
    ax.set_yticklabels(["1  (named first)", "2", "5", "10", "20", "45  (named last)"])
    ax.minorticks_off()
    ax.set_xlim(-0.25, 1.25)
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["no disguise", after_label], fontsize=11)
    ax.set_ylabel("rank of the true writer\n(1 = the attacker names him first)", fontsize=10, color=INK)
    if doe is not None:
        ax.annotate("John Doe: %d → %d" % (before[doe], after[doe]), xy=(1, after[doe]), xytext=(1.04, after[doe] * (0.85 if after[doe] > 3 else 1.5)),
                    fontsize=11, fontweight="bold", color=color, va="center")
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def bucket_bars(before, after, color, name, title):
    """How the 45 writers spread over rank groups: no disguise (grey) vs one strategy (colour). `after` may pool several models;
    counts are scaled to 'per 45 writers'."""
    import numpy as np
    groups = [("rank 1\n(caught)", 1, 1), ("rank 2-5", 2, 5), ("rank 6-15", 6, 15), ("rank 16-45\n(well hidden)", 16, 45)]

    def count(d):
        v = np.array(list(d.values()))
        return [45 * float(((v >= lo) & (v <= hi)).sum()) / len(v) for _, lo, hi in groups]

    b, a = count(before), count(after)
    fig, ax = _axes((8, 4))
    x = np.arange(len(groups))
    ax.bar(x - 0.2, b, 0.38, color=INK, label="no disguise", zorder=2)
    ax.bar(x + 0.2, a, 0.38, color=color, label=name, zorder=2)
    for xi, v in zip(x - 0.2, b):
        ax.text(xi, v + 0.5, "%.0f" % v, ha="center", fontsize=10.5, color=INK)
    for xi, v in zip(x + 0.2, a):
        ax.text(xi, v + 0.5, "%.0f" % v, ha="center", fontsize=10.5, color=color, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels([g[0] for g in groups], fontsize=10.5)
    ax.set_ylabel("writers (out of 45)", fontsize=10, color=INK)
    ax.set_ylim(0, max(b + a) * 1.2)
    ax.legend(frameon=False, fontsize=10.5, loc="upper right")
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def strategy_compare(rows, title="Can the attacker still find the writers?"):
    """rows = [(key, label, caught_per_45, top5_per_45, [caught_per_45 for each model] or None)].
    A bar per strategy: writers still caught at rank 1 (out of 45). Black dots = single models. Hollow circle = within the top 5."""
    fig, ax = _axes((9, 0.62 * len(rows) + 1.6))
    ys = list(range(len(rows)))[::-1]
    for y, (key, label, k1, k5, per) in zip(ys, rows):
        ax.barh(y, k1, height=0.6, color=COLOR[key], hatch="///" if key == "human" else None, edgecolor=CREAM if key == "human" else COLOR[key], zorder=2)
        ax.text(max([k1] + (per or [])) + 0.9, y, "%.0f" % k1, va="center", fontsize=11.5, fontweight="bold", color=COLOR[key])
        if per:
            ax.scatter(per, [y] * len(per), s=26, color=INK, zorder=4)
        ax.scatter([k5], [y], s=70, facecolors="none", edgecolors=INK, linewidths=1.6, zorder=3)
    ax.axvline(CHANCE, color=INK, ls="--", lw=1.2, zorder=1)
    ax.text(CHANCE + 0.5, len(rows) - 0.35, "pure luck: 1", fontsize=10, color=INK, va="center")
    ax.set_yticks(ys)
    ax.set_yticklabels([r[1] for r in rows], fontsize=11)
    ax.set_xlim(0, 47)
    ax.set_ylim(-0.6, len(rows) - 0.1)
    ax.set_xlabel("writers still named first by the attacker (out of 45)\nbar = all models together; black dots = single models; hollow circle = writer within its top 5", fontsize=10, color=INK)
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def tradeoff_plot(points, title="How much of John Doe's text survives, and how well it hides him"):
    """points = {strategy: [(share of John Doe's words kept, rank of the true writer), ...]} for rewrites of all 45 writers.
    Rank on a log scale (1 at the top = caught). Big marker = the median of the strategy."""
    import numpy as np
    fig, ax = _axes((8.6, 5))
    rng = np.random.default_rng(4)
    for key, pts in points.items():
        x = np.array([p[0] for p in pts]) * 100
        y = np.array([p[1] for p in pts], float) * np.exp(rng.uniform(-0.07, 0.07, len(pts)))
        ax.scatter(x, y, s=16, color=COLOR[key], alpha=0.35, edgecolors="none", zorder=2)
    for key, pts in points.items():
        mx, my = np.median([p[0] for p in pts]) * 100, np.median([p[1] for p in pts])
        ax.scatter([mx], [my], s=210, color=COLOR[key], edgecolors=INK, linewidths=1.6, zorder=4, label=LABEL[key])
    ax.set_yscale("log")
    ax.set_yticks([1, 2, 5, 10, 20, 45])
    ax.set_yticklabels(["1", "2", "5", "10", "20", "45"])
    ax.minorticks_off()
    ax.axhspan(0.8, 1.5, color=PALE, zorder=0)
    ax.text(99, 1.0, "caught", fontsize=10, color=MUTED, ha="right", va="center")
    ax.set_xlim(0, 100)
    ax.set_xlabel("words of John Doe's text that survive (%)    ←  rewritten more        kept more  →", fontsize=10, color=INK)
    ax.set_ylabel("rank of the true writer\n(1 = named first; lower down = better hidden)", fontsize=10, color=INK)
    ax.set_ylim(52, 0.8)
    ax.legend(frameon=False, fontsize=10, loc="upper center", bbox_to_anchor=(0.5, -0.16), ncol=4)
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def doe_grid(table, doe_name="John Doe"):
    """table[strategy][model] = (rank, words kept). One cell per rewrite; the stronger the colour, the better John Doe is hidden."""
    import numpy as np
    plt = _plt()
    models = list(next(iter(table.values())))
    fig, ax = _axes((8.4, 4))
    ax.axis("off")
    ncol = len(models)
    for i, (key, label) in enumerate(STRATEGIES):
        y = len(STRATEGIES) - 1 - i
        ax.text(-0.15, y + 0.5, label, ha="right", va="center", fontsize=11.5, fontweight="bold", color=COLOR[key])
        for j, m in enumerate(models):
            rank, kept = table[key][m]
            strength = min(1.0, (rank - 1) / 24.0)
            face = (1 - strength) * np.array(_rgb(PALE)) + strength * np.array(_rgb(COLOR[key]))
            ax.add_patch(plt.Rectangle((j + 0.04, y + 0.06), 0.92, 0.88, facecolor=tuple(face), edgecolor="none"))
            ink = "white" if strength > 0.55 else INK
            ax.text(j + 0.5, y + 0.58, "rank %d" % rank, ha="center", va="center", fontsize=13, fontweight="bold", color=ink)
            ax.text(j + 0.5, y + 0.28, "%d%% words kept" % round(100 * kept), ha="center", va="center", fontsize=9.5, color=ink)
    for j, m in enumerate(models):
        ax.text(j + 0.5, len(STRATEGIES) + 0.15, m, ha="center", va="bottom", fontsize=10.5, color=INK)
    ax.set_xlim(-0.1, ncol)
    ax.set_ylim(0, len(STRATEGIES) + 0.7)
    ax.set_title("Where does %s rank after each rewrite?" % doe_name, fontsize=13, fontweight="bold", color=INK, loc="left", y=1.02)
    ax.text(0, -0.15, "stronger colour = better hidden;  rank 1 = the attacker still names him first", fontsize=10, color=MUTED, va="top")
    fig.subplots_adjust(left=0.22, right=0.98, top=0.88, bottom=0.1)
    return fig


def _rgb(h):
    return [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]


def own_plot(before, after, who, kept=None):
    """Side by side: the attacker's ranking of the 45 candidates for the original review and for your rewrite."""
    plt = _plt()
    fig, axes = plt.subplots(1, 2, figsize=(11, 4), dpi=100, sharey=True)
    fig.patch.set_facecolor(CREAM)
    rank_bars(before, who, INK, "Original review", ax=axes[0])
    rank_bars(after, who, BLUE, "Your rewrite" + ("  (%d%% of the words kept)" % round(100 * kept) if kept is not None else ""), ax=axes[1])
    axes[1].set_ylabel("")
    fig.suptitle("Can the attacker still find John Doe?", y=1.02, fontsize=14, fontweight="bold", color=INK)
    fig.tight_layout()
    return fig


def compare_rows(none, human, ranks_llm, cfgs):
    """Rows for strategy_compare: (key, label, caught at rank 1 per 45, within top 5 per 45, caught per 45 for each model)."""
    def k(d, n):
        v = list(d.values())
        return 45 * sum(x <= n for x in v) / len(v)
    rows = [("none", LABEL["none"], k(none, 1), k(none, 5), None), ("human", LABEL["human"], k(human, 1), k(human, 5), None)]
    for s, label in STRATEGIES:
        per = [ranks_llm[(s, c)] for c in cfgs]
        pool = pooled(per)
        rows.append((s, label, k(pool, 1), k(pool, 5), [k(d, 1) for d in per]))
    return rows


def tradeoff_points(kept_llm, ranks_llm, cfgs):
    """{strategy: [(share of words kept, rank of the true writer) for every rewrite by every model]}."""
    return {s: [(kept_llm[(s, c)][a], ranks_llm[(s, c)][a]) for c in cfgs for a in ranks_llm[(s, c)]] for s, _ in STRATEGIES}


def doe_table(doe, kept_llm, ranks_llm, cfgs):
    """{strategy: {model: (John Doe's rank, share of his words kept)}} for the grid."""
    return {s: {cfgs[c]["model"].split("/")[-1].replace("-Instruct", "").replace("-it", ""): (ranks_llm[(s, c)][doe], kept_llm[(s, c)][doe]) for c in cfgs} for s, _ in STRATEGIES}
