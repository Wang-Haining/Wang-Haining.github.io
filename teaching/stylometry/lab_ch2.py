"""Chapter 2 helpers (Unabomber case): Burrows's Delta and the General Impostors score.

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
