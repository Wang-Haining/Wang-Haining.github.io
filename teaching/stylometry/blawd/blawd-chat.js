/* B'lawd: the lab's helper, a pixel tabby in the bottom-right corner. It knows the lecture and this lab and answers
   through the site's server (api.hainingwang.org/lab, Claude Haiku), so questions typed here do leave the browser.
   Self-contained: no libraries; styles use the lab's CSS variables, so light and dark themes both work. */
(function () {
  "use strict";
  if (window.__blawd) return;
  window.__blawd = true;

  const script = document.currentScript;
  const ENDPOINT = (script && script.dataset.endpoint) || "https://api.hainingwang.org/lab";
  const ICON = new URL("blawd.svg", script ? script.src : location.href).href;
  const MAX_CHARS = 3000;
  const STORE = "blawd:conversation";
  let session = "";
  try { session = localStorage.getItem("blawd:session") || ""; if (!session) { session = Math.random().toString(36).slice(2, 14); localStorage.setItem("blawd:session", session); } } catch (e) { session = Math.random().toString(36).slice(2, 14); }

  const SUGGEST = {
    ch1: ["Why do small words like \"the\" give a writer away?", "What does logistic regression do here?", "What does this step's output mean?"],
    ch2: ["What is the alarm line, and why 1 in 20?", "Why do we turn counts into shares?", "Why are almost all the scores below 0?"],
    ch3: ["How can one count words in classical Chinese?", "What do the weights tell us about Lu Xun?", "What does this step's output mean?"],
    ch4: ["Why does back-translation help hide a writer?", "What does rank 1 mean?", "How would I disguise my own writing?"],
    any: ["What is stylometry, in one sentence?", "What should I try first?", "Explain the step I'm on"],
  };

  const css = `
  .bl-btn{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;align-items:flex-end;gap:6px;border:0;background:none;cursor:pointer;padding:0}
  .bl-btn img{width:78px;height:72px;image-rendering:pixelated;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25));transition:transform .15s}
  .bl-btn:hover img{transform:translateY(-3px)}
  .bl-tag{font:600 .85rem/1.2 system-ui,sans-serif;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:6px 12px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.12)}
  .bl-panel{position:fixed;right:18px;bottom:100px;z-index:61;width:min(420px,calc(100vw - 24px));height:min(600px,calc(100vh - 130px));display:flex;flex-direction:column;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:14px;box-shadow:0 10px 32px rgba(0,0,0,.22);overflow:hidden}
  .bl-panel[hidden]{display:none}
  .bl-head{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--line)}
  .bl-head img{width:34px;height:31px;image-rendering:pixelated}
  .bl-head b{flex:1;font-size:1rem}
  .bl-head button{border:0;background:none;color:var(--muted);font-size:1.3rem;cursor:pointer;line-height:1}
  .bl-note{font-size:.78rem;color:var(--muted);padding:8px 14px;border-bottom:1px solid var(--line)}
  .bl-log{flex:1;overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px}
  .bl-msg{max-width:92%;padding:8px 12px;border-radius:12px;font-size:.93rem;line-height:1.45;overflow-wrap:anywhere}
  .bl-msg p{margin:.25em 0}.bl-msg ul{margin:.25em 0;padding-left:1.2em}
  .bl-msg pre{background:var(--code-bg);border:1px solid var(--line);border-radius:6px;padding:6px 8px;overflow:auto;font-size:.82rem;margin:.4em 0}
  .bl-msg code{background:var(--code-bg);border-radius:4px;padding:0 3px;font-size:.86em}
  .bl-msg pre code{background:none;padding:0}
  .bl-user{align-self:flex-end;background:var(--code-bg);border:1px solid var(--line)}
  .bl-bot{align-self:flex-start;border:1px solid var(--line)}
  .bl-sugs{display:flex;flex-wrap:wrap;gap:6px}
  .bl-sugs button{font:inherit;font-size:.82rem;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:4px 10px;cursor:pointer;text-align:left}
  .bl-sugs button:hover{border-color:var(--accent)}
  .bl-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--line)}
  .bl-form textarea{flex:1;resize:none;min-height:38px;max-height:120px;font:inherit;font-size:.92rem;padding:7px 9px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)}
  .bl-form button{font:inherit;font-weight:600;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);padding:0 14px;cursor:pointer}
  .bl-form button:disabled{opacity:.5;cursor:default}
  .bl-ask{font:inherit;font-size:.82rem;margin-top:6px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--ink);padding:3px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
  .bl-ask img{width:18px;height:17px;image-rendering:pixelated}
  .bl-dots i{display:inline-block;width:6px;height:6px;margin-right:3px;border-radius:50%;background:var(--muted);animation:bl 1s infinite}
  .bl-dots i:nth-child(2){animation-delay:.15s}.bl-dots i:nth-child(3){animation-delay:.3s}
  @keyframes bl{0%,80%,100%{opacity:.25}40%{opacity:1}}
  @media (prefers-reduced-motion: reduce){.bl-dots i{animation:none}.bl-btn img{transition:none}}`;
  document.head.appendChild(Object.assign(document.createElement("style"), { textContent: css }));

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function render(src) {
    const blocks = [];
    let s = String(src).replace(/```[a-z]*\n?([\s\S]*?)```/g, (_, code) => "\u0000" + (blocks.push(code.replace(/\n$/, "")) - 1) + "\u0000");
    s = esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
    const html = s.split(/\n\s*\n/).map((p) => {
      const lines = p.split("\n");
      if (lines.every((l) => /^\s*([-*]|\d+\.)\s/.test(l))) return "<ul>" + lines.map((l) => "<li>" + l.replace(/^\s*([-*]|\d+\.)\s/, "") + "</li>").join("") + "</ul>";
      return "<p>" + p.replace(/\n/g, "<br>") + "</p>";
    }).join("");
    return html.replace(/<p>\u0000(\d+)\u0000<\/p>|\u0000(\d+)\u0000/g, (_, a, b) => "<pre><code>" + esc(blocks[+(a ?? b)]) + "</code></pre>");
  }

  // where the student is: the chapter in the URL and the step nearest the top of the screen
  function where() {
    const id = (location.hash.match(/^#(ch\d)/) || [])[1] || "";
    const title = ([...document.querySelectorAll(".chtitle")].find((h) => h.offsetParent) || {}).textContent || "";
    let step = "", best = Infinity;
    document.querySelectorAll(".cell h2").forEach((h) => {
      const r = h.closest(".cell").getBoundingClientRect();
      if (r.bottom > 80 && r.top < window.innerHeight * 0.6 && Math.abs(r.top) < best) { best = Math.abs(r.top); step = h.textContent; }
    });
    return { id, text: [title.trim() || id, step.trim()].filter(Boolean).join(" · ") };
  }

  const btn = document.createElement("button");
  btn.className = "bl-btn"; btn.type = "button"; btn.setAttribute("aria-label", "Ask B'lawd, the lab's helper");
  btn.innerHTML = `<span class="bl-tag">Ask B'lawd</span><img src="${ICON}" alt="">`;
  const panel = document.createElement("section");
  panel.className = "bl-panel"; panel.hidden = true; panel.setAttribute("aria-label", "Ask B'lawd");
  panel.innerHTML = `<div class="bl-head"><img src="${ICON}" alt=""><b>B'lawd</b><button type="button" aria-label="Close">×</button></div>
    <div class="bl-note">B'lawd knows today's lecture and this lab. Questions are sent to our server and answered by Claude (Anthropic); please don't paste anything private.</div>
    <div class="bl-log" aria-live="polite"></div>
    <form class="bl-form"><textarea rows="1" maxlength="${MAX_CHARS}" placeholder="Ask about a step, a line of code, an error…" aria-label="Your question"></textarea><button type="submit">Ask</button></form>`;
  document.body.append(btn, panel);
  const log = panel.querySelector(".bl-log"), form = panel.querySelector("form"), input = panel.querySelector("textarea"), send = form.querySelector("button");

  let messages = [];
  try { messages = JSON.parse(sessionStorage.getItem(STORE) || "[]"); } catch (e) { messages = []; }
  const save = () => { try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-20))); } catch (e) {} };
  const bubble = (role, html) => { const d = document.createElement("div"); d.className = "bl-msg " + (role === "user" ? "bl-user" : "bl-bot"); d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };

  function greet() {
    log.innerHTML = "";
    bubble("bot", render("Hi, I'm **B'lawd**. Stuck on a step, an error, or an idea from the lecture? Ask me. I'll give you a hint first."));
    for (const m of messages) bubble(m.role, m.role === "user" ? esc(m.content).replace(/\n/g, "<br>") : render(m.content));
    if (!messages.length) {
      const box = document.createElement("div"); box.className = "bl-sugs";
      (SUGGEST[where().id] || SUGGEST.any).concat(SUGGEST.any.slice(2)).forEach((q) => {
        const b = document.createElement("button"); b.type = "button"; b.textContent = q; b.onclick = () => ask(q); box.appendChild(b);
      });
      log.appendChild(box);
    }
  }
  function open(prefill) {
    panel.hidden = false; greet();
    if (prefill) { input.value = prefill; autosize(); }
    input.focus();
  }
  btn.onclick = () => (panel.hidden ? open() : (panel.hidden = true));
  panel.querySelector(".bl-head button").onclick = () => { panel.hidden = true; btn.focus(); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) panel.hidden = true; });
  const autosize = () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; };
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });

  let busy = false;
  async function ask(q) {
    q = String(q || "").trim();
    if (!q || busy) return;
    if (q.length > MAX_CHARS) q = q.slice(0, MAX_CHARS);
    busy = true; send.disabled = true;
    log.querySelectorAll(".bl-sugs").forEach((n) => n.remove());
    bubble("user", esc(q).replace(/\n/g, "<br>"));
    messages.push({ role: "user", content: q }); save();
    input.value = ""; autosize();
    const out = bubble("bot", '<span class="bl-dots" aria-label="Thinking"><i></i><i></i><i></i></span>');
    let answer = "";
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.slice(-12), where: where().text, session }),
      });
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? await res.text() : "B'lawd can't be reached right now. Please try again in a moment.");
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += dec.decode(value, { stream: true });
        out.innerHTML = render(answer); log.scrollTop = log.scrollHeight;
      }
      answer += dec.decode();
      out.innerHTML = render(answer);
      messages.push({ role: "assistant", content: answer }); save();
    } catch (err) {
      out.innerHTML = render(err && err.message && !/fetch|network/i.test(err.message) ? err.message : "B'lawd can't be reached right now. Please try again in a moment.");
      messages.pop(); save();
    } finally {
      busy = false; send.disabled = false; log.scrollTop = log.scrollHeight;
    }
  }

  // Under every error output, a one-click "Ask B'lawd about this error"
  function offerHelp(out) {
    if (out.querySelector(".bl-ask") || !/Traceback|Error:/.test(out.textContent)) return;
    const cell = out.closest(".cell"), step = cell && cell.querySelector("h2") ? cell.querySelector("h2").textContent : "";
    const b = document.createElement("button"); b.type = "button"; b.className = "bl-ask";
    b.innerHTML = `<img src="${ICON}" alt="">Ask B'lawd about this error`;
    b.onclick = () => {
      const err = out.textContent.replace("Ask B'lawd about this error", "").trim().split("\n").slice(-8).join("\n");
      open(`I got this error in "${step}":\n${err}\nWhat went wrong?`);
    };
    out.appendChild(b);
  }
  new MutationObserver(() => document.querySelectorAll(".cell .out").forEach(offerHelp)).observe(document.body, { childList: true, subtree: true });
})();
