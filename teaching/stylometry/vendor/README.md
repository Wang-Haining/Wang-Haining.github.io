# vendor/

`vendor/pyodide/` holds the Python engine the lab runs in the browser: Pyodide v0.27.7 (Mozilla Public License 2.0) and the packages
numpy, scipy, scikit-learn, matplotlib and their dependencies (each under its own open-source licence; see the packages' metadata inside the wheels).
It is created by `python3 tools/vendor_pyodide.py` (from the lab folder, needs internet once). Until it exists, the page falls back to the jsDelivr CDN
(see `PYODIDE_LOCAL`, `PYODIDE_CDN` and `PYODIDE_CDN_FALLBACK` at the top of `app.js`).
