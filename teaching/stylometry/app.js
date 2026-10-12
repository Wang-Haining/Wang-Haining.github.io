// Colab-style runner for the stylometry lab. No framework; Pyodide runs on the main thread
// (the page may freeze for a moment while a cell computes).
// One page, four case chapters (chapters/ch1.js ... ch4.js), opened by URL hash: index.html#ch1 ... #ch4.
// Python boots once; each chapter has its own data files and its own Python namespace, so each can run on its own.

// ---- settings ---------------------------------------------------------------------------
// OPTIONAL live-LLM path (instructors only). Leave "" (the default): the passcode box and every live-LLM control stay hidden and Case 4
// uses the ready-made rewrites in data/ch4/rewrites_cache.json. To enable it, deploy the Cloudflare Worker (see proxy/README.md) and put its URL here.
const PROXY_URL = "";
const PROXY_MODELS = ["openai/gpt-4o-mini", "google/gemini-2.0-flash-001", "meta-llama/llama-3.1-8b-instruct"]; // must match proxy/worker.js
const PROXY_TIMEOUT_MS = 40000;
// Python engine: the lab loads its own copy (vendor/pyodide/, same origin, relative to the page, so it works from any sub-folder).
// If that copy is missing and PYODIDE_CDN_FALLBACK is true, it falls back to the jsDelivr CDN (same pinned version). Set it to false for a strictly same-origin lab.
const PYODIDE_LOCAL = "vendor/pyodide/";
const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";      // pinned version
const PYODIDE_CDN_FALLBACK = true;
const PY_MODULES = ["lab_helpers.py", "lab_ch2.py", "lab_ch3.py", "lab_ch4.py"];   // put on Python's import path at boot

// ---- tiny helpers -----------------------------------------------------------------------
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/!!([^!]+)!!/g, '<span class="todo">$1</span>');
function md(src) {                       // very small Markdown: paragraphs, "- " lists, "> " quotes, **bold**, *italic*, `code`, !!badge!!
  return src.trim().split(/\n\s*\n/).map((blk) => {
    const lines = blk.split("\n");
    if (lines.every((l) => /^- /.test(l))) return "<ul>" + lines.map((l) => "<li>" + inline(l.slice(2)) + "</li>").join("") + "</ul>";
    if (lines.every((l) => /^> /.test(l))) return "<blockquote>" + inline(lines.map((l) => l.slice(2)).join(" ")) + "</blockquote>";
    return "<p>" + inline(blk.replace(/\n/g, " ")) + "</p>";
  }).join("");
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const store = {                          // sessionStorage may be blocked; never rely on it
  get(k) { try { return sessionStorage.getItem(k) || ""; } catch (e) { return ""; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
};
const drafts = {                         // students' own cells only; stays in this browser (localStorage may be blocked)
  load(id) { try { const v = JSON.parse(localStorage.getItem("labCells-" + id) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; } },
  save(id, list) { try { localStorage.setItem("labCells-" + id, JSON.stringify(list)); } catch (e) { /* ignore */ } },
};
const CHAPTERS = window.LAB_CHAPTERS;               // [{id, tab, nav, title, intro, data, cells, credits, llm}]
const chapterById = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));

// ---- Pyodide boot (shared by all chapters) -------------------------------------------------
let pyodide = null;
const t0 = performance.now();
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const sc = document.createElement("script");
    sc.src = src; sc.onload = resolve; sc.onerror = () => { sc.remove(); reject(new Error("could not load " + src)); };
    document.head.appendChild(sc);
  });
}
async function startPyodide() {                 // local copy first, then (optionally) the CDN
  const local = new URL(PYODIDE_LOCAL, document.baseURI).href;
  let where = local;
  try { await loadScript(local + "pyodide.js"); }
  catch (e) {
    if (!PYODIDE_CDN_FALLBACK) throw new Error("the lab's own Python engine (" + PYODIDE_LOCAL + ") is missing");
    console.warn("Local Python engine not found; using the CDN:", e.message);
    where = PYODIDE_CDN;
    await loadScript(PYODIDE_CDN + "pyodide.js");
  }
  window.__pyodideFrom = where === local ? "this site" : "CDN";
  return loadPyodide({ indexURL: where });
}
const bootReady = (async function boot() {
  const title = $("#boot-title"), detail = $("#boot-detail"), box = $("#boot");
  try {
    pyodide = await startPyodide();
    detail.textContent = "Loading the lab's helper code…";
    pyodide.FS.mkdirTree("/home/pyodide/data");
    for (const f of PY_MODULES) {
      const r = await fetch(f, { cache: "no-cache" });
      if (!r.ok) throw new Error("Could not load " + f + " (" + r.status + ")");
      pyodide.FS.writeFile("/home/pyodide/" + f, await r.text());
    }
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    window.__bootSeconds = secs;
    title.textContent = "Python is ready (" + secs + " s). Click ▶ on the first box.";
    detail.textContent = "Tip: Shift+Enter inside a code box runs it. You can edit any code.";
    box.classList.add("done");
    refreshButtons();
  } catch (err) {
    box.classList.add("fail");
    title.textContent = "Python could not start.";
    detail.textContent = "Reload the page, or try a current desktop Chrome, Edge or Firefox. (" + (err && err.message ? err.message : err) + ")";
    throw err;
  }
})();
bootReady.catch(() => {});

// ---- per-chapter data and Python namespace ---------------------------------------------------
const chapterData = {};                      // id -> Promise (data written into Pyodide's file system)
const chapterNs = {};                        // id -> Python dict used as the chapter's globals
const chapterBytes = {};                     // id -> bytes downloaded
function ensureData(ch) {
  if (chapterData[ch.id]) return chapterData[ch.id];
  chapterData[ch.id] = (async () => {
    await bootReady;
    let bytes = 0;
    for (const f of ch.data || []) {
      const r = await fetch(f, { cache: "no-cache" });
      if (!r.ok) throw new Error("Could not load " + f + " (" + r.status + ")");
      const txt = await r.text();
      bytes += new Blob([txt]).size;
      pyodide.FS.mkdirTree("/home/pyodide/" + f.split("/").slice(0, -1).join("/"));
      pyodide.FS.writeFile("/home/pyodide/" + f, txt);
    }
    if (ch.remote) bytes += await fetchRemote(ch);
    chapterBytes[ch.id] = bytes;
    if (currentId === ch.id) showDataNote();
    return bytes;
  })();
  chapterData[ch.id].catch((e) => { console.warn("chapter data:", e); delete chapterData[ch.id]; });   // allow a retry after a network failure
  return chapterData[ch.id];
}
// Extra files a chapter loads from its own folder at run time (Case 4: the EBG texts in data/ch4/ebg/).
// ch.remote = {manifest: "data/.../manifest.json", dest: "data/ch4/ebg"}; the manifest lists {p, bytes, sha256}; Python checks the hashes.
async function fetchRemote(ch) {
  const man = await (await fetch(ch.remote.manifest, { cache: "no-cache" })).json();
  const files = man.files;
  let done = 0, bytes = 0, next = 0;
  const note = () => { chapterProgress = "Loading the EBG texts: " + done + " / " + files.length; if (currentId === ch.id) $("#data-note").textContent = chapterProgress; setBanner(ch, "loading", chapterProgress + " …"); };
  const one = async (f) => {
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(man.raw_base + f.p, { cache: "no-cache" });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const buf = new Uint8Array(await r.arrayBuffer());
        const dir = "/home/pyodide/" + ch.remote.dest + "/" + f.p.split("/").slice(0, -1).join("/");
        pyodide.FS.mkdirTree(dir);
        pyodide.FS.writeFile("/home/pyodide/" + ch.remote.dest + "/" + f.p, buf);
        bytes += buf.length; done += 1; if (done % 20 === 0 || done === files.length) note();
        return;
      } catch (e) { lastErr = e; await sleep(400 * (attempt + 1)); }
    }
    throw new Error("Could not load " + man.raw_base + f.p + " (" + (lastErr && lastErr.message) + "). Reload the page and try again.");
  };
  note();
  await Promise.all(Array.from({ length: 10 }, async () => { while (next < files.length) await one(files[next++]); }));
  chapterProgress = "";
  return bytes;
}
let chapterProgress = "";
function nsFor(ch) {
  if (!chapterNs[ch.id]) {
    const d = pyodide.globals.get("dict")();
    d.set("__name__", "__main__");
    chapterNs[ch.id] = d;
  }
  return chapterNs[ch.id];
}
function showDataNote() {
  const b = chapterBytes[currentId], n = $("#data-note");
  if (b == null && chapterProgress && chapterById[currentId].remote) { n.textContent = chapterProgress; return; }
  n.textContent = b != null ? "Case data loaded: " + (b < 1e5 ? Math.round(b / 1e3) + " KB" : (b / 1e6).toFixed(1) + " MB") : "Case data: not loaded yet";
}

// ---- LLM helper (called from Python as `from js import ask_llm`) -----------------------------
const llmState = { model: PROXY_MODELS[0] };
const jsonCache = {};
async function getJSON(path) { if (!jsonCache[path]) { const r = await fetch(path); if (!r.ok) throw new Error(path + " " + r.status); jsonCache[path] = await r.json(); } return jsonCache[path]; }
function llmReady() { return !!PROXY_URL && !!$("#passcode").value.trim(); }
function refreshMode() {
  const pill = $("#llm-mode");
  if (!PROXY_URL) { pill.textContent = ""; pill.classList.remove("live"); }
  else if (!llmReady()) { pill.textContent = "LLM step: offline cache (no passcode)"; pill.classList.remove("live"); }
  else { pill.textContent = "LLM step: live via class proxy"; pill.classList.add("live"); }
}
function between(s, tag) {                  // text between [TAG] and [/TAG]; the whole reply if the tags are missing
  const m = new RegExp("\\[" + tag + "\\]([\\s\\S]*?)(\\[/" + tag + "\\]|$)").exec(s);
  return (m ? m[1] : s).trim();
}
async function callProxy(system, user) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), PROXY_TIMEOUT_MS);
  try {
    const res = await fetch(PROXY_URL, {
      method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", "X-Class-Passcode": $("#passcode").value.trim() },
      body: JSON.stringify({ model: llmState.model, max_tokens: 1600, temperature: 0.7,
        messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    if (!res.ok) throw new Error(res.status === 401 ? "the passcode was rejected" : res.status === 429 ? "the rate limit was reached" : "the proxy answered with HTTP " + res.status);
    const data = await res.json();
    const out = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!out) throw new Error("the proxy sent an unexpected reply");
    return out;
  } catch (e) {
    if (e && e.name === "AbortError") throw new Error("the proxy did not answer in time");
    if (e instanceof TypeError) throw new Error("the proxy could not be reached");
    throw e;
  } finally { clearTimeout(timer); }
}
// ask_llm(case, key, strategy, text, config): key = the cached text's id (e.g. John Doe's author id); strategy = obfuscation, imitation,
// simplification or backtranslation; config = which cached model configuration to use (Case 4; default: the first one).
// Live: through the proxy with the book's prompts. Otherwise: data/<case>/rewrites_cache.json.
async function askLLM(chap, key, strategy, text, config) {
  const prompts = await getJSON("data/" + chap + "/prompts.json");
  let why = !PROXY_URL ? "" : "no passcode was entered";
  if (llmReady()) {
    try {
      const fill = (p) => p.user.replace("{{text}}", () => text);
      let out;
      if (strategy === "backtranslation") {          // English -> Chinese -> English: two calls
        const zh = between(await callProxy(prompts.en_to_zh.system, fill(prompts.en_to_zh)), "TRANSLATION");
        out = between(await callProxy(prompts.zh_to_en.system, prompts.zh_to_en.user.replace("{{text}}", () => zh)), "REWRITE");
      } else {
        out = between(await callProxy(prompts[strategy].system, fill(prompts[strategy])), "REWRITE");
      }
      return JSON.stringify({ text: out, source: "live LLM (" + llmState.model + ") via class proxy" });
    } catch (e) { why = e.message; }
  }
  const cache = await getJSON("data/" + chap + "/rewrites_cache.json");
  if (cache.rewrites) {                              // benchmark cache: {rewrites: {"<id>|<strategy>": {"<config>": {text, ...}}}, configs: {...}}
    const cfg = config || Object.keys(cache.configs)[0], hit = (cache.rewrites[key + "|" + strategy] || {})[cfg], m = cache.configs[cfg];
    if (hit && hit.text) return JSON.stringify({ text: hit.text, source: "cached rewrite by " + m.model + " (" + m.precision + "); " + cache._source.replace(/\.$/, "") + (why ? "; live LLM not used because " + why : "") });
    return JSON.stringify({ error: "There is no cached rewrite for this text, strategy and model configuration." });
  }
  const hit = cache[key + "|" + strategy];
  if (hit && typeof hit === "object" && hit.text) {
    return JSON.stringify({ text: hit.text, source: "cached rewrite" + (hit.placeholder ? " [PLACEHOLDER: hand-written stand-in, not from an LLM]" : " (" + hit.model + ")") + (why ? "; live LLM not used because " + why : "") });
  }
  return JSON.stringify({ error: "There is no ready-made rewrite for this text and strategy." });
}
window.ask_llm = askLLM;
// cache_all(case, config): every cached rewrite of one configuration as JSON {"<id>|<strategy>": text}, for the whole-population tables.
window.cache_all = async (chap, config) => {
  const cache = await getJSON("data/" + chap + "/rewrites_cache.json"), out = {};
  for (const [k, v] of Object.entries(cache.rewrites || {})) if (v[config]) out[k] = v[config].text;
  return JSON.stringify(out);
};
window.cache_configs = async (chap) => JSON.stringify((await getJSON("data/" + chap + "/rewrites_cache.json")).configs || {});

// ---- chapters: tabs, hash routing, building cells -----------------------------------------------
let currentId = null;
const built = {};                          // id -> {host, cellState}
const queue = { p: Promise.resolve(), busy: 0 };
const range = (ch, idx) => { const a = []; for (let i = 0; i <= idx; i++) if (built[ch.id].cellState[i].ta) a.push(i); return a; };   // indices of code cells (including the student's own)

function buildTabs() {
  $("#tabs").innerHTML = CHAPTERS.filter((c) => !c.hidden).map((c) => `<a href="#${c.id}" data-ch="${c.id}"><span class="num">${esc(c.tab)}</span> ${esc(c.nav)}</a>`).join("");
}

const EDIT_NOTE = "All code boxes are editable — change a number and press ▶ again.";

// The editable code box of one cell (built-in or the student's own). `st` is the cell's state object; its position is looked up
// when a button is clicked, because students can add and delete cells and shift the indices.
function buildCodeBlock(ch, st, code) {
  const idxOf = () => built[ch.id].cellState.indexOf(st);
  const wrap = el("div", "codewrap");
  const gut = el("div", "gutter");
  const play = el("button", "play", "▶"); play.title = "Run this cell (Shift+Enter)"; play.setAttribute("aria-label", "Run this cell"); play.disabled = !pyodide || queue.busy > 0;
  st.status = el("div", "status");
  gut.append(play, st.status);
  const ed = el("div", "editor");
  const ta = el("textarea"); ta.value = code; ta.spellcheck = false; ta.setAttribute("aria-label", st.user ? "Your own Python code, editable" : "Python code, editable");
  ta.rows = st.user ? Math.max(4, code.split("\n").length) : code.split("\n").length;
  if (st.user) ta.placeholder = "# Write Python here. It runs in this chapter's session, so names from the boxes above (like a1, review) are available.";
  ed.appendChild(ta);
  const tools = el("div", "tools");
  const upto = el("button", "link upto", "Run all up to here"); upto.disabled = !pyodide || queue.busy > 0;
  const reset = el("button", "link", st.user ? "Clear" : "Reset code");
  tools.append(upto, reset);
  ed.appendChild(tools);
  wrap.append(gut, ed);
  st.ta = ta;
  play.addEventListener("click", () => enqueue(ch, [idxOf()]));
  upto.addEventListener("click", () => enqueue(ch, range(ch, idxOf())));
  reset.addEventListener("click", () => { ta.value = code; if (st.user) saveDrafts(ch); });
  ta.addEventListener("input", () => { if (st.user) saveDrafts(ch); });
  ta.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.shiftKey || e.ctrlKey || e.metaKey)) { e.preventDefault(); if (!play.disabled) enqueue(ch, [idxOf()]); }
    else if (e.key === "Tab") { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText("    ", s, ta.selectionEnd, "end"); }
  });
  return wrap;
}

function addRow(ch, st) {
  const row = el("div", "addrow");
  const b = el("button", "addbtn", "+ Add a code cell"); b.type = "button";
  b.addEventListener("click", () => { const u = addUserCell(ch, st); u.ta.focus(); });
  row.appendChild(b);
  st.add = row;
  return row;
}

function saveDrafts(ch) {
  const list = built[ch.id].cellState, out = [];
  list.forEach((st, i) => { if (st.user) out.push({ uid: st.uid, after: list[i - 1] ? list[i - 1].key : "", code: st.ta.value }); });
  drafts.save(ch.id, out);
}

// Insert an empty, editable Python cell right after `afterSt` (a cell state object); null = at the end.
function addUserCell(ch, afterSt, code = "", uid = null) {
  const b = built[ch.id], list = b.cellState;
  const st = { user: true, uid: uid || "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), cell: { title: "Your cell" }, out: el("div", "out") };
  st.key = st.uid;
  st.sec = el("section", "cell usercell");
  const head = el("div", "uhead", "<span>Your own code cell (runs in this chapter's Python session)</span>");
  const del = el("button", "delbtn", "Delete cell"); del.type = "button";
  del.addEventListener("click", () => {
    const i = list.indexOf(st); if (i < 0) return;
    list.splice(i, 1); st.sec.remove(); st.add.remove(); saveDrafts(ch);
  });
  head.appendChild(del);
  st.sec.append(head, buildCodeBlock(ch, st, code), st.out);
  const row = addRow(ch, st);
  const prev = afterSt && list.indexOf(afterSt) >= 0 ? afterSt : list[list.length - 1];
  list.splice(list.indexOf(prev) + 1, 0, st);
  prev.add.after(st.sec, row);
  saveDrafts(ch);
  return st;
}

// "Check that everything works": one banner at the top of each chapter (loading / ready / what failed and what to try).
const TRY = " What to try: reload the page; use a current desktop Chrome, Edge or Firefox; if you are on a school or work network, try another network (some block WebAssembly or large downloads).";
function setBanner(ch, state, msg) {
  const b = built[ch.id] && built[ch.id].banner; if (!b) return;
  b.dataset.state = state;
  b.querySelector(".msg").textContent = msg;
  b.querySelector("button").hidden = state !== "fail";
}
async function checkReady(ch) {
  setBanner(ch, "loading", "Checking that everything works: starting Python and loading this case's data …");
  try { await bootReady; }
  catch (e) { setBanner(ch, "fail", "Not ready: the Python engine could not start (" + (e && e.message ? e.message : e) + ")." + TRY); return; }
  try { await ensureData(ch); }
  catch (e) { setBanner(ch, "fail", "Not ready: this case's data could not be loaded (" + (e && e.message ? e.message : e) + ")." + TRY); return; }
  const b = chapterBytes[ch.id];
  setBanner(ch, "ok", "Ready. The Python engine and this case's data (" + (b < 1e5 ? Math.round(b / 1e3) + " KB" : (b / 1e6).toFixed(1) + " MB") + ") are loaded. Click Run all, or ▶ on a box.");
}

function buildChapter(ch) {
  const host = el("div", "chapter"); host.id = "chapter-" + ch.id; host.hidden = true;
  host.appendChild(el("h2", "chtitle", inline(ch.title)));
  const banner = el("div", "ready", '<span class="msg"></span> <button type="button" class="btn small" hidden>Check again</button>');
  banner.setAttribute("role", "status"); banner.dataset.state = "loading";
  banner.querySelector("button").addEventListener("click", () => checkReady(ch));
  host.appendChild(banner);
  host.appendChild(el("p", "editnote", esc(EDIT_NOTE)));
  host.appendChild(el("div", "md chintro", md(ch.intro)));
  const cellState = [];
  built[ch.id] = { host, cellState, banner };
  ch.cells.forEach((c) => {
    const sec = el("section", "cell");
    sec.id = ch.id + "-" + c.id;
    sec.appendChild(el("h2", null, esc(c.title)));
    sec.appendChild(el("div", "md", md(c.md)));
    const st = { cell: c, key: c.id, sec, ta: null, out: el("div", "out"), status: null };
    if (c.controls === "llm") sec.appendChild(buildLLMControls());
    if (c.controls === "paste") sec.appendChild(buildPasteControls());
    if (c.code) sec.appendChild(buildCodeBlock(ch, st, c.code));
    sec.appendChild(st.out);
    host.append(sec, addRow(ch, st));
    cellState.push(st);
  });
  $("#cells").appendChild(host);
  for (const d of drafts.load(ch.id)) {                 // the student's own cells from an earlier visit (this browser only)
    const anchor = cellState.find((x) => x.key === d.after);
    if (d && typeof d.code === "string" && typeof d.uid === "string") addUserCell(ch, anchor || null, d.code, d.uid);
  }
  if (ch.llm) initControls(ch).catch((e) => console.warn("controls:", e));
  checkReady(ch);
}

function buildLLMControls() {
  const box = el("div", "controls");
  box.innerHTML = `
    <label>Strategy <select id="sel-strategy"></select></label>
    <div class="preview" id="strategy-prompt"></div>
    <label id="cfg-wrap">Model (the rewrite was made earlier by this model) <select id="sel-cfg"></select></label>
    ${PROXY_URL ? '<label>AI model (live path, only with the passcode) <select id="sel-model"></select></label>' : '<select id="sel-model" hidden></select>'}`;
  return box;
}
function buildPasteControls() {
  const box = el("div", "controls");
  box.innerHTML = `<label class="paste">Your rewritten text (paste it here; it stays in your browser)
    <textarea id="own-text" rows="9" spellcheck="false" placeholder="Paste your rewrite of John Doe's review here, then press the play button below."></textarea></label>`;
  return box;
}

async function initControls(ch) {
  const q = (sel) => built[ch.id].host.querySelector(sel);        // two Case 4 versions can be open in one session: scope to this chapter
  const dir = ch.dir || ch.id;
  const prompts = await getJSON("data/" + dir + "/prompts.json");
  const labels = { obfuscation: "Obfuscate: hide the author's style", imitation: "Imitate Cormac McCarthy", simplification: "Simplify (Special English)", backtranslation: "Round trip: English to Chinese and back" };
  q("#sel-strategy").innerHTML = Object.keys(labels).map((k) => `<option value="${k}">${esc(labels[k])}</option>`).join("");
  q("#sel-model").innerHTML = PROXY_MODELS.map((m) => `<option>${esc(m)}</option>`).join("");   // hidden unless PROXY_URL is set
  const cache = await getJSON("data/" + dir + "/rewrites_cache.json");
  const cfgs = cache.configs || {};
  q("#cfg-wrap").hidden = !Object.keys(cfgs).length;
  q("#sel-cfg").innerHTML = Object.entries(cfgs).map(([k, m]) => `<option value="${esc(k)}">${esc(m.model + " (" + m.precision + ")")}</option>`).join("");
  const sync = () => {
    const k = q("#sel-strategy").value;
    q("#strategy-prompt").textContent = k === "backtranslation"
      ? "Prompt 1: " + prompts.en_to_zh.user.replace("{{text}}", "<the text>") + "\n\nPrompt 2 (on the Chinese result): " + prompts.zh_to_en.user.replace("{{text}}", "<the Chinese text>")
      : prompts[k].user.replace("{{text}}", "<the text>");
  };
  q("#sel-strategy").addEventListener("change", sync);
  sync();
}

function showChapter(id) {
  if (!chapterById[id]) id = CHAPTERS[0].id;
  const ch = chapterById[id];
  currentId = id;
  if (!built[id]) buildChapter(ch);
  Object.entries(built).forEach(([k, b]) => { b.host.hidden = k !== id; });
  document.querySelectorAll("#tabs a").forEach((a) => a.classList.toggle("on", a.dataset.ch === id));
  document.title = "Case " + ch.tab + " " + ch.nav + " · Stylometry Lab";
  $("#credits").innerHTML = md(ch.credits || "");
  $("#pass-wrap").hidden = $("#llm-mode").hidden = !(ch.llm && PROXY_URL);
  showDataNote();
  refreshButtons();
  ensureData(ch).then(showDataNote).catch(() => {});
}

function refreshButtons() {
  const dis = queue.busy > 0 || !pyodide;
  document.querySelectorAll(".play, .upto, #run-all").forEach((b) => (b.disabled = dis));
}

function currentChoice(ch) {
  const q = (sel) => built[ch.id].host.querySelector(sel);
  llmState.model = q("#sel-model").value || PROXY_MODELS[0];
  return { strategy_id: q("#sel-strategy").value, cache_config: q("#sel-cfg").value };
}

// ---- running cells ---------------------------------------------------------------------------
function enqueue(ch, indices) {
  queue.busy += 1; refreshButtons();
  queue.p = queue.p.then(async () => { for (const i of indices) { const ok = await runCell(ch, i); if (!ok) break; } })
    .catch(() => {}).finally(() => { queue.busy -= 1; refreshButtons(); });
  return queue.p;
}

function renderOutput(out, lines) {
  // Python prints "<<<LAB:HTML>>>...<<<LAB:END>>>" or "<<<LAB:PNG>>>base64<<<LAB:END>>>" for rich output; everything else is text.
  let text = [];
  const flush = () => { if (text.length) { out.appendChild(el("pre", null, esc(text.join("\n")))); text = []; } };
  for (const line of lines) {
    const m = /^<<<LAB:(HTML|PNG)>>>([\s\S]*)<<<LAB:END>>>$/.exec(line);
    if (!m) { text.push(line); continue; }
    flush();
    if (m[1] === "HTML") { const d = el("div", m[2].startsWith("<table") ? "tablewrap" : "", m[2]); out.appendChild(d); }
    else { const img = el("img"); img.alt = "Plot produced by the cell"; img.src = "data:image/png;base64," + m[2]; out.appendChild(img); }
  }
  flush();
}

async function runCell(ch, i) {
  const st = built[ch.id].cellState[i];
  await bootReady.catch(() => {});
  if (!pyodide) return false;
  st.out.innerHTML = ""; st.sec.classList.remove("done", "error"); st.sec.classList.add("running");
  st.status.textContent = "running";
  const msg = el("p", "runmsg"); st.out.appendChild(msg);
  const lines = [];
  let ok = true;
  try {
    msg.textContent = "Loading this case's data…";
    await ensureData(ch);
    const pk = st.cell.packages || [];
    if (pk.length) {
      msg.textContent = "Downloading " + pk.join(", ") + " (first time only; this can take a minute)…";
      await pyodide.loadPackage(pk, { messageCallback: () => {}, errorCallback: (e) => console.warn(e) });
    }
    if (st.user) { msg.textContent = "Checking which packages your code needs…"; try { await pyodide.loadPackagesFromImports(st.ta.value, { messageCallback: () => {}, errorCallback: (e) => console.warn(e) }); } catch (e) { console.warn(e); } }
    msg.textContent = "Running…";
    await sleep(30);
    pyodide.setStdout({ batched: (s) => lines.push(s) });
    pyodide.setStderr({ batched: (s) => { if (!/font cache/i.test(s)) lines.push(s); } });
    const ns = nsFor(ch);
    if (st.cell.controls === "llm") for (const [k, v] of Object.entries(currentChoice(ch))) ns.set(k, v);
    if (st.cell.controls === "paste") ns.set("my_text", built[ch.id].host.querySelector("#own-text").value);
    const t1 = performance.now();
    await pyodide.runPythonAsync(st.ta.value, { globals: ns });
    st.seconds = ((performance.now() - t1) / 1000).toFixed(1);
    st.sec.classList.add("done"); st.status.textContent = "done";
  } catch (err) {
    ok = false;
    const full = String(err && err.message ? err.message : err);
    const last = full.trim().split("\n").filter(Boolean).pop() || full;
    st.sec.classList.add("error"); st.status.textContent = "error";
    lines.push("⚠ " + last);
    if (/NameError/.test(last)) lines.push("Hint: a box above has not been run yet. Use “Run all up to here”.");
    st.errFull = full;
  } finally {
    msg.remove();
    st.sec.classList.remove("running");
    renderOutput(st.out, lines);
    if (!ok) {
      st.out.querySelectorAll("pre").forEach((p) => p.classList.add("err"));
      if (st.errFull && st.errFull.includes("Traceback")) { const d = el("details", null, "<summary>Full error</summary><pre class=\"err\">" + esc(st.errFull) + "</pre>"); st.out.appendChild(d); }
    }
  }
  return ok;
}

// ---- go ----------------------------------------------------------------------------------------
buildTabs();
$("#passcode").value = store.get("labPasscode");
$("#passcode").addEventListener("input", (e) => { store.set("labPasscode", e.target.value); refreshMode(); });
$("#run-all").addEventListener("click", () => { const ch = chapterById[currentId]; enqueue(ch, range(ch, built[ch.id].cellState.length - 1)); });
window.addEventListener("hashchange", () => { showChapter(location.hash.slice(1)); window.scrollTo(0, 0); });
refreshMode();
showChapter(location.hash.slice(1));
