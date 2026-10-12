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
