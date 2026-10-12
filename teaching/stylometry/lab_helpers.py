"""Small helpers for the stylometry lab (runs inside Pyodide, also used by tools/build_data.py).

Everything here is plain Python so the lab cells can stay short.
Heavier helpers (plots, diffs) import numpy / matplotlib only when called.
"""
import re
import json
import unicodedata
import difflib
import base64
import io
from collections import Counter

# ---------------------------------------------------------------- text basics
_QUOTES = {"‘": "'", "’": "'", "“": '"', "”": '"', "—": "-", "–": "-"}


def fold(text):
    """Lower-case, straighten quotes, drop accents (Tzŭ -> tzu)."""
    for a, b in _QUOTES.items():
        text = text.replace(a, b)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return text.lower()


def tokens(text):
    """Split a text into lower-case words (letters only)."""
    return re.findall(r"[a-z]+", fold(text))


def count_function_words(text, words):
    """Return a list of counts, one per function word, in the order of `words`."""
    c = Counter(tokens(text))
    return [c[w] for w in words]


def load_koppel(path="data/koppel_function_words.txt"):
    """The 512-word Koppel function-word list (one word per line; some contain an apostrophe)."""
    with open(path, encoding="utf-8") as f:
        return f.read().splitlines()


def koppel_counts(text, words):
    """Counts of each word in `words`: how often it occurs as a whole word, regex \\bword\\b, in the lower-cased text.

    Same rule as vectorize_koppel512 in the published reproduction (Wang, Reproduction and Replication of an Adversarial
    Stylometry Experiment), so the counts are identical. For a word without an apostrophe, \\bword\\b matches exactly when
    the word is a whole run of letters/digits, so those words are counted from one pass over the text (much faster);
    the few words with an apostrophe (can't, e'g') use the regex itself.
    """
    low = text.lower()
    runs = Counter(re.findall(r"\w+", low))
    return [len(re.findall(r"\b" + w + r"\b", low)) if "'" in w else runs[w] for w in words]


def relative_freq(counts, n_words):
    """Counts -> share of all words (e.g. 0.035 = 3.5 %)."""
    return [x / max(n_words, 1) for x in counts]


# --------------------------------------------------- character 3-gram features
def cg_normalize(text):
    """Keep letters, digits, spaces and basic punctuation; collapse white space."""
    t = re.sub(r"[^a-z0-9 .,;:!?\"'()-]", " ", fold(text))
    return re.sub(r"\s+", " ", t).strip()


def cg_counts(text, vocab_index):
    """Count character 3-grams that are in the lab's fixed vocabulary.

    vocab_index: dict {trigram: column number}. Returns {column: count}.
    """
    t = cg_normalize(text)
    c = Counter(t[i:i + 3] for i in range(len(t) - 2))
    return {vocab_index[g]: n for g, n in c.items() if g in vocab_index}


def cg_matrix(rows, n_cols):
    """List of {column: count} dicts -> dense numpy matrix; each row is scaled to length 1 (L2)."""
    import numpy as np
    M = np.zeros((len(rows), n_cols))
    for i, r in enumerate(rows):
        for j, n in r.items():
            M[i, int(j)] = n
    return M / np.maximum(np.sqrt((M ** 2).sum(axis=1, keepdims=True)), 1e-9)


# ------------------------------------------------------------------ word diff
def word_diff_html(before, after):
    """HTML with deleted words in red/struck-through and added words in green."""
    a, b = before.split(), after.split()
    out = []
    esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal":
            out.append(esc(" ".join(a[i1:i2])))
        else:
            if i2 > i1:
                out.append('<del>%s</del>' % esc(" ".join(a[i1:i2])))
            if j2 > j1:
                out.append('<ins>%s</ins>' % esc(" ".join(b[j1:j2])))
    return '<div class="diff">%s</div>' % " ".join(out)


def diff_stats(before, after):
    a, b = before.split(), after.split()
    r = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
    return "%.0f%% of the words are unchanged (%d words before, %d after)" % (100 * r, len(a), len(b))


# ------------------------------------------------------- output to the page
def show_html(html):
    """Send an HTML snippet (e.g. a table) to the output area of the running cell."""
    print("<<<LAB:HTML>>>" + html.replace("\n", " ") + "<<<LAB:END>>>")


def show_table(header, rows, caption=None):
    esc = lambda s: str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    h = "".join("<th>%s</th>" % esc(c) for c in header)
    body = "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % esc(c) for c in r) for r in rows)
    cap = "<caption>%s</caption>" % esc(caption) if caption else ""
    show_html('<table class="data">%s<thead><tr>%s</tr></thead><tbody>%s</tbody></table>' % (cap, h, body))


def show_plot(fig):
    """Render a matplotlib figure as PNG and send it to the output area."""
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=110, bbox_inches="tight")
    import matplotlib.pyplot as plt
    plt.close(fig)
    print("<<<LAB:PNG>>>" + base64.b64encode(buf.getvalue()).decode() + "<<<LAB:END>>>")


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)
