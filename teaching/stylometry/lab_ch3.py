"""Chapter 3 helpers (Lu Xun or Zhou Zuoren?): count 31 Chinese function characters, highlight them, and draw the plots.

Counting ported from the_many_voices/utils.py and run.py (Xie, Li and Wang, DSH 2024, 0BSD licence).
Plots need a Chinese font, which the browser's Python does not have: data/ch3/font.json holds a small subset of Noto Sans SC
(SIL Open Font License 1.1, see data/ch3/FONT_LICENSE.txt) and every plot function loads it first.
"""
import re

BLUE, ORANGE, TEAL, GREY, INK = "#0F5C8C", "#B35F00", "#00876A", "#9E978A", "#1F2430"      # Zhou Zuoren, Lu Xun, highlight, other, text
MUTED, CREAM = "#6B6458", "#F7F5F0"                                                         # quiet text, page background

# 27 single characters and 4 two-character words chosen by recursive feature elimination in the paper.
GRAMS = ['诚', '于', '乃', '光', '原', '各', '必', '惟', '不', '随', '本',
         '全', '但', '徒', '别', '是', '为', '何', '多', '夫', '则', '之',
         '焉', '皆', '而', '矣', '及', '自然', '进而', '足以', '于是']

# Rough English meanings, for readers who do not know classical Chinese (one or two words each).
GLOSS = {'诚': 'truly', '于': 'in, at', '乃': 'then', '光': 'light', '原': 'originally', '各': 'each', '必': 'must', '惟': 'only',
         '不': 'not', '随': 'follow', '本': 'root, this', '全': 'wholly', '但': 'only, but', '徒': 'merely', '别': 'other',
         '是': 'this', '为': 'be, for', '何': 'what', '多': 'many', '夫': 'as for', '则': 'so, then', '之': 'of',
         '焉': 'there', '皆': 'all', '而': 'and, yet', '矣': '(ends a clause)', '及': 'and, reach', '自然': 'naturally',
         '进而': 'furthermore', '足以': 'enough to', '于是': 'thereupon'}


def label(g):
    """A character with its English meaning, for axes: '之  of'."""
    return "%s  %s" % (g, GLOSS[g])


# ------------------------------------------------------------------ counting
def length(text):
    """Length in characters, ignoring white space and masked quotations such as [MASK]."""
    return len(re.sub(r"\s+", "", re.sub(r"\[([A-Za-z ]+)\]", "", text)))


def count_frequency(grams, doc):
    """How often each gram occurs. A short gram is not counted again inside a longer gram on the list:
    the 是 inside 于是 counts once, as 于是, not also as 是."""
    raw = {g: len(re.findall(g, doc)) for g in grams}
    out = {}
    max_n = max(len(g) for g in grams)
    for n in range(max_n, 0, -1):                      # longest grams first
        longer = {g: c for g, c in out.items() if len(g) > n}
        for g in [g for g in grams if len(g) == n]:
            deduct = 0
            for lg, c in longer.items():
                if g in lg:
                    deduct += c * len(re.findall(g, lg))
            out[g] = raw[g] - deduct
    return [out[g] for g in grams]


def features(texts, grams=GRAMS):
    """Rows = texts; columns = how often each gram occurs per character of text."""
    return [[c / length(t) for c in count_frequency(grams, t)] for t in texts]


def rates_per_1000(text, grams=GRAMS):
    """How often each gram occurs per 1,000 characters of the text."""
    return [c / length(text) * 1000 for c in count_frequency(grams, text)]


def most_telling(X, y, k=2):
    """The k columns whose averages differ most between the two brothers, measured against how much the pieces vary
    (gap divided by spread). y = 1 for Lu Xun, 0 for Zhou Zuoren."""
    import numpy as np
    X, y = np.array(X, float), np.array(y)
    a, b = X[y == 1], X[y == 0]
    spread = np.sqrt((a.var(axis=0) + b.var(axis=0)) / 2) + 1e-12
    return [int(i) for i in np.argsort(-np.abs(a.mean(axis=0) - b.mean(axis=0)) / spread)[:k]]


# ------------------------------------------------------------------ HTML for the page
_esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def passage_html(who, text, color):
    """A block of Chinese text with the writer's name above it in his colour."""
    return ('<div class="hl" style="border-left:5px solid %s"><p style="margin:0 0 4px;font-size:.8rem;font-weight:600;color:%s">%s</p><p>%s</p></div>'
            % (color, color, _esc(who), _esc(text).replace("\n", "</p><p>")))


def gloss_html(text):
    """The English translation, as a quiet block under the Chinese."""
    return '<div class="gloss">%s</div>' % _esc(text).replace("\n", "<br>")


def legend_html(weighted=True):
    """Colour key for highlight_html."""
    if weighted:
        return ('<p class="legend"><span style="background:rgba(179,95,0,.55)">favours Lu Xun</span> '
                '<span style="background:rgba(15,92,140,.5)">favours Zhou Zuoren</span> (darker = a bigger weight)</p>')
    return '<p class="legend"><span style="background:rgba(0,135,106,.3)">function character</span></p>'


def highlight_html(text, grams, weights=None):
    """The text with every feature marked. Without weights: all the same teal. With weights: orange favours Lu Xun
    (weight > 0), blue favours Zhou Zuoren (weight < 0); the darker the shade, the larger the weight. Hover for the English meaning."""
    w = dict(zip(grams, weights)) if weights is not None else None
    top = max(abs(x) for x in weights) if weights is not None else 1
    pattern = re.compile("|".join(re.escape(g) for g in sorted(grams, key=lambda g: -len(g))))

    def mark(m):
        g = m.group(0)
        tip = GLOSS.get(g, "")
        if w is None:
            return '<mark title="%s" style="background:rgba(0,135,106,.3)">%s</mark>' % (tip, g)
        a = 0.2 + 0.6 * abs(w[g]) / top
        rgb = "179,95,0" if w[g] > 0 else "15,92,140"
        return '<mark title="%s" style="background:rgba(%s,%.2f)">%s</mark>' % (tip, rgb, a, g)

    out, pos = [], 0
    for m in pattern.finditer(text):
        out.append(_esc(text[pos:m.start()]))
        out.append(mark(m))
        pos = m.end()
    out.append(_esc(text[pos:]))
    body = "".join(out).replace("\n", "</p><p>")
    return '<div class="hl"><p>%s</p></div>' % body


# ------------------------------------------------------------------ plots
_font_name = None


def use_font():
    """Make the bundled Chinese font known to matplotlib (once) and return its family name."""
    global _font_name
    if _font_name is None:
        import base64, json, os, tempfile
        from matplotlib import font_manager
        with open("data/ch3/font.json", encoding="utf-8") as f:
            info = json.load(f)
        path = os.path.join(tempfile.gettempdir(), "lab_ch3_font.ttf")
        with open(path, "wb") as f:
            f.write(base64.b64decode(info["b64"]))
        font_manager.fontManager.addfont(path)
        _font_name = info["name"]
    return _font_name


def _plt():
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    return plt


def _style():
    return {"font.family": [use_font(), "DejaVu Sans"], "font.size": 11, "axes.edgecolor": MUTED, "axes.labelcolor": INK,
            "xtick.color": INK, "ytick.color": INK, "text.color": INK, "figure.facecolor": CREAM, "axes.facecolor": CREAM,
            "axes.spines.top": False, "axes.spines.right": False, "legend.frameon": False, "savefig.facecolor": CREAM}


def _glosses(ax, grams):
    ax.set_yticks(range(len(grams)))
    ax.set_yticklabels([label(g) for g in grams], fontsize=11)


def rates_plot(lx_rate, zzr_rate):
    """The 31 characters, two bars each: how often per 1,000 characters Lu Xun (orange) and Zhou Zuoren (blue) write them."""
    import numpy as np
    plt = _plt()
    order = np.argsort(-(np.array(lx_rate) - np.array(zzr_rate)))
    g = [GRAMS[k] for k in order]
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 9.2))
        y = np.arange(len(g))
        ax.barh(y - 0.2, [lx_rate[k] for k in order], height=0.4, color=ORANGE, label="Lu Xun")
        ax.barh(y + 0.2, [zzr_rate[k] for k in order], height=0.4, color=BLUE, label="Zhou Zuoren")
        _glosses(ax, g)
        ax.invert_yaxis()
        ax.set_xlabel("times per 1,000 characters")
        ax.legend(loc="lower right", fontsize=12)
        ax.set_title("How often each brother uses the 31 characters", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def gap_plot(lx_rate, zzr_rate, k=12):
    """The k biggest gaps (Lu Xun minus Zhou Zuoren, per 1,000 characters), as bars from a middle line."""
    import numpy as np
    plt = _plt()
    gap = np.array(lx_rate) - np.array(zzr_rate)
    pick = sorted(np.argsort(-np.abs(gap))[:k], key=lambda i: -gap[i])
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 5.6))
        ax.barh(range(k), [gap[i] for i in pick], color=[ORANGE if gap[i] > 0 else BLUE for i in pick], height=0.7)
        _glosses(ax, [GRAMS[i] for i in pick])
        ax.invert_yaxis()
        ax.axvline(0, color=INK, lw=1)
        m = max(abs(gap[pick])) * 1.15
        ax.set_xlim(-m, m)
        ax.text(m * 0.97, -0.95, "Lu Xun uses it more  →", ha="right", va="center", color=ORANGE, fontsize=12)
        ax.text(-m * 0.97, -0.95, "←  Zhou Zuoren uses it more", ha="left", va="center", color=BLUE, fontsize=12)
        ax.set_ylim(k - 0.4, -1.4)
        ax.set_xlabel("difference in times per 1,000 characters")
        ax.set_title("The %d biggest differences" % k, loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def two_char_plot(X, y, a, b, X_test=None, names=None):
    """Each piece as one dot, placed by how often it uses character a (across) and character b (up), per 1,000 characters.
    Orange = Lu Xun, blue = Zhou Zuoren, stars = each brother's average, numbered black discs = disputed essays."""
    import numpy as np
    plt = _plt()
    X, y = np.array(X, float) * 1000, np.array(y)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(7.2, 6.0 if X_test is not None else 5.6))
        for v, col, name in [(1, ORANGE, "Lu Xun pieces"), (0, BLUE, "Zhou Zuoren pieces")]:
            ax.scatter(X[y == v, a], X[y == v, b], s=85, color=col, edgecolors="white", linewidths=1, alpha=.92, label=name, zorder=3)
            ax.scatter(X[y == v, a].mean(), X[y == v, b].mean(), s=330, marker="*", color=col, edgecolors=INK, linewidths=1.2, zorder=4)
        if X_test is not None:
            T = np.array(X_test, float) * 1000
            ax.scatter(T[:, a], T[:, b], s=330, color=INK, edgecolors="white", linewidths=1.2, label="disputed essays (numbered)", zorder=5)
            for i, (tx, ty) in enumerate(zip(T[:, a], T[:, b]), 1):
                ax.text(tx, ty, str(i), ha="center", va="center", color="white", fontsize=10.5, zorder=6)
            fig.text(0.5, 0.005, "   ".join("%d = %s" % (i, nm) for i, nm in enumerate(names, 1)), ha="center", va="bottom", fontsize=11)
        ax.set_xlabel("%s (%s) per 1,000 characters" % (GRAMS[a], GLOSS[GRAMS[a]]), fontsize=12)
        ax.set_ylabel("%s (%s) per 1,000 characters" % (GRAMS[b], GLOSS[GRAMS[b]]), fontsize=12)
        ax.legend(loc="upper left", fontsize=11)
        ax.set_title("Each dot is one piece (stars = the averages)", loc="left", fontsize=13)
        ax.grid(color="#E6E1D6", lw=.8, zorder=0)
        fig.tight_layout(rect=(0, 0.04 if X_test is not None else 0, 1, 1))
    return fig


def pca_map(pca, P_train, y_train, P_val=None, y_val=None, P_test=None, names=None):
    """The 31 numbers of each piece squashed to 2 (PCA, already fitted). Dots = training pieces, triangles = validation pieces,
    numbered black discs = disputed essays; orange = Lu Xun, blue = Zhou Zuoren."""
    import numpy as np
    plt = _plt()
    A, yt = pca.transform(P_train), np.array(y_train)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(7.8, 6.6))
        for v, col, name in [(1, ORANGE, "Lu Xun (training)"), (0, BLUE, "Zhou Zuoren (training)")]:
            ax.scatter(A[yt == v, 0], A[yt == v, 1], s=80, color=col, edgecolors="white", linewidths=1, alpha=.92, label=name, zorder=3)
        if P_val is not None:
            B, yv = pca.transform(P_val), np.array(y_val)
            for v, col, name in [(1, ORANGE, "Lu Xun (validation)"), (0, BLUE, "Zhou Zuoren (validation)")]:
                ax.scatter(B[yv == v, 0], B[yv == v, 1], s=75, marker="^", facecolors="none", edgecolors=col, linewidths=1.6, label=name, zorder=3)
        if P_test is not None:
            C = pca.transform(P_test)
            ax.scatter(C[:, 0], C[:, 1], s=420, color=INK, edgecolors="white", linewidths=1.2, label="disputed essays (numbered)", zorder=5)
            for i, (cx, cy) in enumerate(C, 1):
                ax.text(cx, cy, str(i), ha="center", va="center", color="white", fontsize=11, zorder=6)
            fig.text(0.5, 0.005, "   ".join("%d = %s" % (i, nm) for i, nm in enumerate(names, 1)), ha="center", va="bottom", fontsize=11.5)
        ev = pca.explained_variance_ratio_
        ax.set_xlabel("map direction 1  (holds %.0f%% of the differences)" % (100 * ev[0]), fontsize=11)
        ax.set_ylabel("map direction 2  (%.0f%%)" % (100 * ev[1]), fontsize=11)
        ax.grid(color="#E6E1D6", lw=.8, zorder=0)
        ax.set_title("A map of the pieces: similar pieces sit close together", loc="left", fontsize=13)
        h, lab = ax.get_legend_handles_labels()
        ax.legend(h, lab, loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=2, fontsize=10)
        fig.tight_layout(rect=(0, 0.04 if P_test is not None else 0, 1, 1))
    return fig


def score_curve(scores, y):
    """The S-curve that turns a score into a probability, with the training pieces sitting on it."""
    import numpy as np
    plt = _plt()
    scores, y = np.array(scores), np.array(y)
    m = max(6.0, float(np.abs(scores).max()) + 1)
    s = np.linspace(-m, m, 300)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(7.6, 4.8))
        ax.plot(s, 1 / (1 + np.exp(-s)), color=INK, lw=2.2, zorder=2)
        ax.axhline(0.5, color=MUTED, ls="--", lw=1.2)
        ax.axvline(0, color=MUTED, ls="--", lw=1.2)
        for v, col, name in [(1, ORANGE, "Lu Xun training pieces"), (0, BLUE, "Zhou Zuoren training pieces")]:
            ax.scatter(scores[y == v], 1 / (1 + np.exp(-scores[y == v])), s=75, color=col, edgecolors="white", linewidths=1, label=name, zorder=3)
        ax.text(-m * 0.97, 0.53, "50%: no lean either way", color=MUTED, fontsize=11)
        ax.set_xlabel("the model's score  (negative = Zhou Zuoren side, positive = Lu Xun side)")
        ax.set_ylabel("P(Lu Xun)")
        ax.set_xlim(-m, m)
        ax.set_ylim(-0.03, 1.03)
        ax.legend(loc="center right", fontsize=11, bbox_to_anchor=(1.0, 0.3))
        ax.set_title("From score to probability", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def weights_plot(weights):
    """All 31 weights as bars from a middle line, strongest Lu Xun side first. Orange = pushes towards Lu Xun, blue = towards Zhou Zuoren."""
    import numpy as np
    plt = _plt()
    order = np.argsort(-np.array(weights))
    w = [weights[k] for k in order]
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 9))
        ax.barh(range(len(w)), w, color=[ORANGE if x > 0 else BLUE for x in w], height=0.72)
        _glosses(ax, [GRAMS[k] for k in order])
        ax.invert_yaxis()
        ax.axvline(0, color=INK, lw=1)
        m = max(abs(x) for x in w) * 1.12
        ax.set_xlim(-m, m)
        ax.text(m * 0.98, -1.1, "pushes towards Lu Xun  →", ha="right", va="center", color=ORANGE, fontsize=12)
        ax.text(-m * 0.98, -1.1, "←  pushes towards Zhou Zuoren", ha="left", va="center", color=BLUE, fontsize=12)
        ax.set_ylim(len(w) - 0.4, -1.7)
        ax.set_xlabel("weight the model learned")
        ax.set_title("What the model learned about each character", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def check_plot(p_val, y_val):
    """The held-out check: one dot per validation piece, placed by the model's P(Lu Xun). Top row = pieces really by Lu Xun,
    bottom row = pieces really by Zhou Zuoren. Dots on the wrong side of the 50% line are ringed."""
    import numpy as np
    plt = _plt()
    p, y = np.array(p_val), np.array(y_val)
    rng = np.random.default_rng(4)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8.4, 4.2))
        ax.axvspan(0, 0.5, color="#E3EAF0", zorder=0)
        ax.axvspan(0.5, 1, color="#F1E7D8", zorder=0)
        for v, row, col in [(1, 1, ORANGE), (0, 0, BLUE)]:
            m = y == v
            yy = row + rng.uniform(-0.2, 0.2, m.sum())
            ax.scatter(p[m], yy, s=90, color=col, edgecolors="white", linewidths=1, zorder=3)
            wrong = (p[m] > 0.5) != (v == 1)
            ax.scatter(p[m][wrong], yy[wrong], s=330, facecolors="none", edgecolors=INK, linewidths=2, zorder=4)
            right = int((~wrong).sum())
            ax.text(1.04, row, "%d of %d right" % (right, m.sum()), va="center", fontsize=12, color=col, clip_on=False)
        ax.axvline(0.5, color=INK, ls="--", lw=1.6)
        ax.text(0.25, 1.62, "model says Zhou Zuoren", ha="center", color=BLUE, fontsize=11.5)
        ax.text(0.75, 1.62, "model says Lu Xun", ha="center", color=ORANGE, fontsize=11.5)
        ax.set_yticks([0, 1])
        ax.set_yticklabels(["really\nZhou Zuoren", "really\nLu Xun"], fontsize=11.5)
        ax.set_xlim(0, 1.02)
        ax.set_ylim(-0.5, 1.75)
        ax.set_xlabel("the model's P(Lu Xun) for each piece it had never seen")
        ax.spines["left"].set_visible(False)
        ax.tick_params(axis="y", length=0)
        ax.set_title("The check on held-out pieces (ringed = wrong)", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def push_plot(contributions, title, n=8):
    """For one text: how much each character pushed the score, the n strongest pushes (orange = towards Lu Xun, blue = towards Zhou Zuoren)."""
    import numpy as np
    plt = _plt()
    c = np.array(contributions)
    pick = sorted(np.argsort(-np.abs(c))[:n], key=lambda i: -c[i])
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 4.8))
        ax.barh(range(n), [c[i] for i in pick], color=[ORANGE if c[i] > 0 else BLUE for i in pick], height=0.7)
        _glosses(ax, [GRAMS[i] for i in pick])
        ax.invert_yaxis()
        ax.axvline(0, color=INK, lw=1)
        m = max(abs(c[pick])) * 1.15
        ax.set_xlim(-m, m)
        ax.set_xlabel("push on the score")
        ax.set_title("The %d biggest pushes in %s" % (n, title), loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def verdict_plot(titles_zh, titles_en, probs):
    """One row per disputed essay: a bar of width 1 split into blue (P Zhou Zuoren) and orange (P Lu Xun), with the 50% line."""
    import textwrap
    plt = _plt()
    n = len(probs)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(9.2, 1.3 * n + 1.6))
        for i, (zh, en, p) in enumerate(zip(titles_zh, titles_en, probs)):
            ax.barh(i, 1 - p, left=0, height=0.62, color=BLUE)
            ax.barh(i, p, left=1 - p, height=0.62, color=ORANGE)
            ax.text(0.985, i, "P(Lu Xun) = %.3f" % p, ha="right", va="center", color="white", fontsize=12.5)
            if 1 - p > 0.1:
                ax.text(0.012, i, "%.3f" % (1 - p), ha="left", va="center", color="white", fontsize=11)
        ax.set_yticks(range(n))
        ax.set_yticklabels(["%s\n%s" % (zh, textwrap.fill(en.replace("\u2019", "'"), 34)) for zh, en in zip(titles_zh, titles_en)], fontsize=11)
        ax.invert_yaxis()
        ax.plot([0.5, 0.5], [-0.5, n - 0.5], color=INK, ls="--", lw=2, zorder=5)
        ax.text(0.5, -0.58, "50%: no lean either way", ha="center", va="bottom", fontsize=11)
        ax.text(0.0, n - 0.42, "← more like Zhou Zuoren", ha="left", va="top", color=BLUE, fontsize=12)
        ax.text(1.0, n - 0.42, "more like Lu Xun →", ha="right", va="top", color=ORANGE, fontsize=12)
        ax.set_xlim(0, 1)
        ax.set_ylim(n - 0.1, -1.05)
        ax.set_xticks([])
        for s_ in ("left", "bottom"):
            ax.spines[s_].set_visible(False)
        ax.tick_params(axis="y", length=0)
        ax.set_title("Who does the model think wrote each disputed essay?", loc="left", fontsize=13)
        fig.tight_layout()
    return fig
