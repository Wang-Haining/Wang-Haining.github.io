"""Chapter 3 helpers (Lu Xun or Zhou Zuoren?): count 31 Chinese function characters and highlight them.

Ported from the_many_voices/utils.py and run.py (Xie, Li and Wang, DSH 2024, 0BSD licence).
"""
import re

# 27 single characters and 4 two-character words chosen by recursive feature elimination in the paper.
GRAMS = ['诚', '于', '乃', '光', '原', '各', '必', '惟', '不', '随', '本',
         '全', '但', '徒', '别', '是', '为', '何', '多', '夫', '则', '之',
         '焉', '皆', '而', '矣', '及', '自然', '进而', '足以', '于是']


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


def highlight_html(text, grams, weights):
    """The text with every feature marked: red = favours Lu Xun (weight > 0), grey = favours Zhou Zuoren (weight < 0).
    The darker the shade, the larger the weight."""
    w = dict(zip(grams, weights))
    top = max(abs(x) for x in weights)
    esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    pattern = re.compile("|".join(re.escape(g) for g in sorted(grams, key=lambda g: -len(g))))

    def mark(m):
        g = m.group(0)
        a = 0.2 + 0.6 * abs(w[g]) / top
        rgb = "214,39,40" if w[g] > 0 else "90,90,90"
        return '<mark style="background:rgba(%s,%.2f)">%s</mark>' % (rgb, a, g)

    out, pos = [], 0
    for m in pattern.finditer(text):
        out.append(esc(text[pos:m.start()]))
        out.append(mark(m))
        pos = m.end()
    out.append(esc(text[pos:]))
    body = "".join(out).replace("\n", "</p><p>")
    return '<div class="hl"><p>%s</p></div>' % body
