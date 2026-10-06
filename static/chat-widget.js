(function () {
  "use strict";
  /*** Ask Haining: floating chat widget, v10 (opens large on desktop) ***/

  const script = document.currentScript;
  const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const ENDPOINT = (script && script.dataset.endpoint) || (LOCAL ? "/chat" : "https://api.hainingwang.org/chat");
  const AVATAR = "/images/profile.png";
  const MAX_CHARS = 2000;
  const STORE_KEY = "ahw:conversation";
  const SEEN_KEY = "ahw:seen";
  const WIDE_KEY = "ahw:wide"; // remembers whether the visitor prefers the large panel
  const MAX_IMAGES = 3;
  const BOBO = ["/images/bobo/bobo-1.jpg", "/images/bobo/bobo-2.jpg", "/images/bobo/bobo-3.jpg", "/images/bobo/bobo-4.jpg"];

  /* ------------------------------------------------------------
   * Question pool, grouped by theme so a draw spans topics.
   * ----------------------------------------------------------*/
  const POOL = {
    clinical: [
      "What is DualR, and how does a medication list become a risk score?",
      "How early can DualR flag alcohol use disorder?",
      "Why run an on-premises LLM on patient data?",
      "What is \"textomics\" in the NIH multimodal AI project?",
      "What kinds of real-world health data does Haining work with?",
      "What is DualReasoning, from the AMIA 2025 poster?",
      "Can a language model find alcohol use disorder that diagnosis codes miss?",
      "How can LLMs help with kidney injury after cancer immunotherapy?",
      "What is Agentic Delphi?",
      "Can negative-control drugs make causal machine learning more trustworthy?",
    ],
    policy: [
      "What changed for minority health research after NIH's 2025 award reviews?",
      "What does \"still funded, no longer counted\" mean?",
      "Is NSF's golden ticket better than funding the runners-up?",
      "Did ending the NIH embargo make funded research public faster?",
      "Are newcomers still getting NSF grants?",
      "How can you measure scientific novelty from text?",
      "Does publishing in a specialized journal change who cites a paper?",
      "Do authors in top journals win more federal funding, and was that gap there before?",
      "What happens to a research problem when its researcher leaves?",
    ],
    library: [
      "Do LLMs treat library patrons differently depending on who asks?",
      "How do you audit an AI reference service for fairness?",
      "Can AI make a scientific abstract readable for high-school students?",
      "How does the Digital Humanities Quarterly recommender work?",
      "Can LLMs do computer-mediated discourse analysis?",
      "What was the Library of Congress talk about?",
      "Is AI reference help still fair once it involves conversation and search tools?",
    ],
    health: [
      "How do income and insurance relate to COVID-19 and flu hospitalization?",
      "Do social determinants of health affect kidney injury during immunotherapy?",
      "Is IV magnesium after heart surgery linked to kidney injury?",
      "What is Haining studying about social engagement in older adults?",
    ],
    stylometry: [
      "Can stylometry identify authors who try to hide?",
      "Who wrote the disputed Duying essays, Lu Xun or Zhou Zuoren?",
      "Does authorship attribution work across vernacular and classical Chinese?",
      "Why is authorship attribution hard to evaluate fairly?",
      "What did the adversarial stylometry replication find?",
      "How can language models protect an author's anonymity?",
      "What is Haining's book about?",
    ],
    tools: [
      "What is your-voice, and how does it keep a draft sounding like me?",
      "What open datasets and Python packages has Haining released?",
      "Can I try DualR myself?",
    ],
    people: [
      "What courses has Haining taught?",
      "What is the practical LLM short course about?",
      "How does Haining mentor students?",
      "How did an archival studies degree lead to clinical NLP?",
      "What ties clinical NLP, library AI, and research policy together?",
      "What is Haining working on next?",
      "How can I collaborate with Haining?",
      "What talks has Haining given recently?",
      "Does Haining have a cat?",
    ],
  };

  /* ------------------------------------------------------------
   * Storage helpers (storage may be unavailable).
   * ----------------------------------------------------------*/
  const store = {
    get(area, key, fallback) {
      try { const v = window[area].getItem(key); return v ? JSON.parse(v) : fallback; } catch (_) { return fallback; }
    },
    set(area, key, value) {
      try { window[area].setItem(key, JSON.stringify(value)); } catch (_) { /* ignore */ }
    },
    del(area, key) {
      try { window[area].removeItem(key); } catch (_) { /* ignore */ }
    },
  };

  function pickQuestions(n, exclude) {
    const seen = new Set(store.get("localStorage", SEEN_KEY, []));
    const skip = new Set(exclude || []);
    const themes = Object.keys(POOL).sort(() => Math.random() - 0.5);
    const picks = [];
    for (let round = 0; picks.length < n && round < 2; round++) {
      for (const t of themes) {
        if (picks.length >= n) break;
        const fresh = POOL[t].filter((q) => !skip.has(q) && !picks.includes(q) && (round > 0 || !seen.has(q)));
        if (fresh.length) picks.push(fresh[Math.floor(Math.random() * fresh.length)]);
      }
    }
    const all = Object.values(POOL).flat();
    const nextSeen = [...seen, ...picks].slice(-Math.floor(all.length * 0.6));
    store.set("localStorage", SEEN_KEY, nextSeen);
    return picks;
  }

  /* ------------------------------------------------------------
   * Safe Markdown: escape first, then a small subset.
   * ----------------------------------------------------------*/
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function inline(s) {
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, (_, p, u) => `${p}<a href="${u}" target="_blank" rel="noopener noreferrer">${u.replace(/^https?:\/\//, "")}</a>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[+i]}</code>`);
  }
  function renderMarkdown(src) {
    const lines = esc(src).split("\n");
    let html = "", list = null, para = [];
    const flushPara = () => { if (para.length) { html += `<p>${inline(para.join(" "))}</p>`; para = []; } };
    const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^```/.test(line)) {
        flushPara(); closeList();
        const buf = [];
        while (++i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i]);
        html += `<pre><code>${buf.join("\n")}</code></pre>`;
        continue;
      }
      const ul = line.match(/^\s*[-*]\s+(.*)$/), ol = line.match(/^\s*\d+[.)]\s+(.*)$/), h = line.match(/^#{1,4}\s+(.*)$/);
      if (ul || ol) {
        flushPara();
        const kind = ul ? "ul" : "ol";
        if (list !== kind) { closeList(); html += `<${kind}>`; list = kind; }
        html += `<li>${inline((ul || ol)[1])}</li>`;
      } else if (h) {
        flushPara(); closeList(); html += `<p><strong>${inline(h[1])}</strong></p>`;
      } else if (!line.trim()) {
        flushPara(); closeList();
      } else {
        closeList(); para.push(line.trim());
      }
    }
    flushPara(); closeList();
    return html;
  }

  // [[bobo]] is the easter-egg token; [[bobo:N]] pins which photo was shown.
  function pinBobo(text) {
    return text.replace(/\[\[bobo\]\]/g, () => `[[bobo:${Math.floor(Math.random() * BOBO.length)}]]`);
  }
  function renderAnswer(text, streaming) {
    if (streaming) text = text.replace(/\[\[[a-z:0-9]*\]?$/, ""); // hide a half-streamed token
    return renderMarkdown(text).replace(/\[\[bobo(?::(\d))?\]\]/g, (_, n) => {
      const src = BOBO[n !== undefined ? +n % BOBO.length : 0];
      return `</p><figure class="ahw-bobo"><img src="${src}" alt="Bobo the cat" loading="lazy"></figure><p>`;
    }).replace(/<p>\s*<\/p>/g, "");
  }
  function forApi(text) {
    return text.replace(/\[\[bobo(?::\d)?\]\]/g, "[photo of Bobo]");
  }

  /* ------------------------------------------------------------
   * Images: downscale in the browser before upload.
   * ----------------------------------------------------------*/
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve({ img, url });
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("unreadable image")); };
      img.src = url;
    });
  }
  async function prepareImage(file) {
    const { img, url } = await loadImage(file);
    const scale = Math.min(1, 1568 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let data = "";
    for (const q of [0.85, 0.7, 0.55]) {
      data = canvas.toDataURL("image/jpeg", q).split(",")[1];
      if (data.length < 1_400_000) break;
    }
    return { media_type: "image/jpeg", data, url };
  }

  /* ------------------------------------------------------------
   * Styles
   * ----------------------------------------------------------*/
  const css = `
  #ahw-launcher,#ahw-panel{--ahw-accent:var(--pal-pop,#5c8374);--ahw-accent-ink:var(--pal-pop-ink,#fff);--ahw-link:var(--pal-accent,#3f6a5c);--ahw-bg:#fff;--ahw-surface:#f4f6f5;--ahw-ink:#1f2a27;--ahw-muted:#66736f;--ahw-line:#e2e7e5;--ahw-bot:#f1f4f3;--ahw-shadow:0 18px 50px rgba(20,35,30,.22),0 2px 8px rgba(20,35,30,.08);
    font-family:"Source Sans Pro",system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;}
  @media (prefers-color-scheme:dark){#ahw-launcher,#ahw-panel{--ahw-accent:var(--pal-pop,#7fa898);--ahw-accent-ink:var(--pal-pop-ink,#0f1513);--ahw-link:var(--pal-accent-dark,#9cc5b4);--ahw-bg:#1c2120;--ahw-surface:#232a28;--ahw-ink:#e6ecea;--ahw-muted:#9aa8a3;--ahw-line:#313a37;--ahw-bot:#262e2c;--ahw-shadow:0 18px 50px rgba(0,0,0,.55);}}
  #ahw-launcher{position:fixed;right:22px;bottom:22px;z-index:9999;display:flex;align-items:center;gap:10px;padding:7px 18px 7px 7px;border:0;border-radius:999px;background:var(--ahw-accent);color:var(--ahw-accent-ink);font-size:16px;font-weight:600;letter-spacing:.01em;cursor:pointer;box-shadow:var(--ahw-shadow);border:1px solid color-mix(in srgb,var(--ahw-accent-ink) 16%,transparent);transition:transform .18s ease,box-shadow .18s ease,opacity .18s ease;}
  #ahw-launcher:hover{transform:translateY(-2px);}
  #ahw-launcher:focus-visible{outline:3px solid var(--ahw-link);outline-offset:3px;}
  @keyframes ahw-hop{0%,100%{transform:translateY(0);}20%{transform:translateY(-12px);}40%{transform:translateY(0);}55%{transform:translateY(-6px);}70%{transform:translateY(0);}}
  #ahw-launcher.ahw-hop{animation:ahw-hop .9s cubic-bezier(.3,.7,.4,1) 1;}
  #ahw-launcher img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.75);}
  #ahw-launcher .ahw-dot{width:8px;height:8px;border-radius:50%;background:#b8f0d2;box-shadow:0 0 0 0 rgba(184,240,210,.7);animation:ahw-ping 2.4s ease-out 3;}
  @keyframes ahw-ping{0%{box-shadow:0 0 0 0 rgba(184,240,210,.7);}80%,100%{box-shadow:0 0 0 9px rgba(184,240,210,0);}}
  #ahw-launcher.ahw-hidden{opacity:0;pointer-events:none;transform:scale(.9);}
  #ahw-panel{position:fixed;right:22px;bottom:22px;z-index:10000;width:400px;height:min(640px,calc(100vh - 44px));display:flex;flex-direction:column;background:var(--ahw-bg);color:var(--ahw-ink);border:1px solid var(--ahw-line);border-radius:18px;box-shadow:var(--ahw-shadow);overflow:hidden;opacity:0;transform:translateY(14px) scale(.98);transform-origin:bottom right;pointer-events:none;transition:opacity .2s ease,transform .2s ease,width .25s ease,height .25s ease;}
  #ahw-panel.ahw-open{opacity:1;transform:none;pointer-events:auto;}
  #ahw-panel.ahw-wide{width:min(760px,calc(100vw - 44px));height:calc(100vh - 44px);}
  #ahw-panel *{box-sizing:border-box;}
  .ahw-head{display:flex;align-items:center;gap:12px;padding:14px 12px 14px 16px;background:var(--ahw-accent);color:var(--ahw-accent-ink);}
  .ahw-head img{width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.7);}
  .ahw-title{flex:1;min-width:0;line-height:1.2;}
  .ahw-title b{display:block;font-size:16.5px;}
  .ahw-title span{font-size:12.5px;opacity:.85;}
  .ahw-icon{width:34px;height:34px;display:grid;place-items:center;border:0;border-radius:10px;background:transparent;color:inherit;cursor:pointer;opacity:.85;}
  .ahw-icon:hover{background:color-mix(in srgb,currentColor 14%,transparent);opacity:1;}
  .ahw-icon:focus-visible{outline:2px solid currentColor;outline-offset:1px;}
  .ahw-icon svg{width:18px;height:18px;}
  .ahw-log{flex:1;overflow-y:auto;padding:18px 16px 8px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;overscroll-behavior:contain;}
  .ahw-msg{max-width:88%;padding:10px 14px;border-radius:16px;font-size:15px;line-height:1.5;overflow-wrap:anywhere;}
  .ahw-msg p{margin:0 0 .55em;} .ahw-msg p:last-child{margin-bottom:0;}
  .ahw-msg ul,.ahw-msg ol{margin:.2em 0 .55em;padding-left:1.25em;} .ahw-msg li{margin:.15em 0;}
  .ahw-msg a{color:var(--ahw-link);text-decoration:underline;text-underline-offset:2px;}
  .ahw-msg code{font-family:"Source Code Pro",ui-monospace,monospace;font-size:.88em;background:var(--ahw-surface);padding:.1em .35em;border-radius:5px;}
  .ahw-msg pre{background:var(--ahw-surface);padding:10px;border-radius:10px;overflow-x:auto;margin:.4em 0;} .ahw-msg pre code{background:none;padding:0;}
  .ahw-bot{align-self:flex-start;background:var(--ahw-bot);border-bottom-left-radius:6px;}
  .ahw-user{align-self:flex-end;background:var(--ahw-accent);color:var(--ahw-accent-ink);border-bottom-right-radius:6px;white-space:pre-wrap;}
  .ahw-note{align-self:center;font-size:13px;color:var(--ahw-muted);text-align:center;max-width:92%;}
  .ahw-typing{display:inline-flex;gap:4px;padding:4px 2px;} .ahw-typing i{width:7px;height:7px;border-radius:50%;background:var(--ahw-muted);opacity:.5;animation:ahw-bounce 1.1s infinite ease-in-out;}
  .ahw-typing i:nth-child(2){animation-delay:.15s;} .ahw-typing i:nth-child(3){animation-delay:.3s;}
  @keyframes ahw-bounce{0%,80%,100%{transform:translateY(0);opacity:.4;}40%{transform:translateY(-5px);opacity:1;}}
  .ahw-sugs{display:flex;flex-direction:column;align-items:flex-start;gap:7px;padding:2px 0 4px;}
  .ahw-sugs-label{font-size:12.5px;color:var(--ahw-muted);display:flex;align-items:center;gap:8px;}
  .ahw-chip{border:1px solid var(--ahw-line);background:var(--ahw-bg);color:var(--ahw-ink);font:inherit;font-size:14px;line-height:1.35;text-align:left;padding:8px 12px;border-radius:12px;cursor:pointer;max-width:100%;transition:border-color .15s,background .15s;}
  .ahw-chip:hover{border-color:var(--ahw-link);background:color-mix(in srgb,var(--ahw-accent) 22%,var(--ahw-bg));}
  .ahw-chip:focus-visible{outline:2px solid var(--ahw-link);outline-offset:1px;}
  .ahw-shuffle{border:0;background:none;color:var(--ahw-link);font:inherit;font-size:12.5px;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:4px;}
  .ahw-shuffle:hover{text-decoration:underline;}
  .ahw-form{display:flex;align-items:flex-end;gap:8px;margin:8px 12px 6px;padding:6px 6px 6px 14px;border:1px solid var(--ahw-line);border-radius:16px;background:var(--ahw-surface);transition:border-color .15s;}
  .ahw-form:focus-within{border-color:var(--ahw-link);}
  .ahw-form textarea{flex:1;resize:none;border:0;outline:0;background:transparent;color:var(--ahw-ink);font:inherit;font-size:15px;line-height:1.45;padding:6px 0;max-height:132px;min-height:24px;}
  .ahw-form textarea::placeholder{color:var(--ahw-muted);}
  .ahw-send{width:36px;height:36px;flex:none;display:grid;place-items:center;border:0;border-radius:12px;background:var(--ahw-accent);color:var(--ahw-accent-ink);cursor:pointer;transition:opacity .15s;}
  .ahw-send:disabled{opacity:.4;cursor:default;} .ahw-send svg{width:18px;height:18px;}
  .ahw-foot{display:flex;justify-content:space-between;gap:8px;padding:0 16px 10px;font-size:11.5px;color:var(--ahw-muted);}
  .ahw-foot .ahw-count.ahw-over{color:#c0392b;}
  .ahw-attach{width:36px;height:36px;flex:none;display:grid;place-items:center;border:0;border-radius:12px;background:transparent;color:var(--ahw-muted);cursor:pointer;}
  .ahw-attach:hover{color:var(--ahw-link);background:color-mix(in srgb,var(--ahw-link) 10%,transparent);} .ahw-attach svg{width:19px;height:19px;}
  .ahw-attach:disabled{opacity:.35;cursor:default;}
  .ahw-form{padding-left:6px;}
  .ahw-thumbs{display:flex;gap:8px;padding:0 14px;flex-wrap:wrap;} .ahw-thumbs:empty{display:none;}
  .ahw-thumb{position:relative;width:56px;height:56px;margin-top:8px;}
  .ahw-thumb img{width:100%;height:100%;object-fit:cover;border-radius:10px;border:1px solid var(--ahw-line);}
  .ahw-thumb button{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;border:0;background:var(--ahw-ink);color:var(--ahw-bg);font-size:13px;line-height:20px;cursor:pointer;padding:0;}
  .ahw-user-imgs{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;margin-bottom:6px;}
  .ahw-user-imgs img{max-width:140px;max-height:140px;border-radius:10px;object-fit:cover;}
  .ahw-user .ahw-imgnote{opacity:.8;font-size:13px;display:block;}
  .ahw-bobo{margin:.5em 0 .3em;} .ahw-bobo img{display:block;width:100%;max-width:300px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.15);}
  #ahw-panel.ahw-drop .ahw-log{outline:2px dashed var(--ahw-link);outline-offset:-8px;}
  @media (max-width:600px){
    #ahw-launcher{right:14px;bottom:14px;padding:6px 14px 6px 6px;font-size:15px;}
    #ahw-panel,#ahw-panel.ahw-wide{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;border:0;}
    .ahw-wide-btn{display:none !important;}
    .ahw-msg{font-size:15.5px;}
  }
  @media (prefers-reduced-motion:reduce){#ahw-launcher,#ahw-launcher.ahw-hop,#ahw-panel,.ahw-typing i,#ahw-launcher .ahw-dot{animation:none !important;transition:none !important;}}
  `;

  const ICONS = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    wide: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
    narrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M10 14l-7 7M14 10l7-7"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.4 11.1l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6l7.8-7.8"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
  };

  /* ------------------------------------------------------------
   * DOM
   * ----------------------------------------------------------*/
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const launcher = document.createElement("button");
  launcher.id = "ahw-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-haspopup", "dialog");
  launcher.setAttribute("aria-controls", "ahw-panel");
  launcher.innerHTML = `<img src="${AVATAR}" alt=""><span>Ask Haining</span><span class="ahw-dot" aria-hidden="true"></span>`;

  const panel = document.createElement("section");
  panel.id = "ahw-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Ask Haining chat");
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `
    <header class="ahw-head">
      <img src="${AVATAR}" alt="">
      <div class="ahw-title"><b>Ask Haining</b><span>AI assistant for Haining's work</span></div>
      <button type="button" class="ahw-icon ahw-reset-btn" title="New conversation" aria-label="New conversation">${ICONS.reset}</button>
      <button type="button" class="ahw-icon ahw-wide-btn" title="Expand" aria-label="Expand">${ICONS.wide}</button>
      <button type="button" class="ahw-icon ahw-close-btn" title="Close" aria-label="Close">${ICONS.close}</button>
    </header>
    <div class="ahw-log" aria-live="polite"></div>
    <div class="ahw-thumbs"></div>
    <form class="ahw-form">
      <button type="button" class="ahw-attach" title="Attach images" aria-label="Attach images">${ICONS.clip}</button>
      <input type="file" accept="image/*" multiple hidden>
      <textarea rows="1" maxlength="${MAX_CHARS + 200}" placeholder="Ask about research, papers, teaching…" aria-label="Your question"></textarea>
      <button type="submit" class="ahw-send" aria-label="Send">${ICONS.send}</button>
    </form>
    <div class="ahw-foot"><span>AI answers can be wrong · images are processed by Anthropic, not stored</span><span class="ahw-count"></span></div>`;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const log = panel.querySelector(".ahw-log");
  const form = panel.querySelector(".ahw-form");
  const input = form.querySelector("textarea");
  const sendBtn = form.querySelector(".ahw-send");
  const wideBtn = panel.querySelector(".ahw-wide-btn");
  const count = panel.querySelector(".ahw-count");
  const thumbs = panel.querySelector(".ahw-thumbs");
  const attachBtn = form.querySelector(".ahw-attach");
  const fileInput = form.querySelector('input[type="file"]');
  let pending = [];

  /* ------------------------------------------------------------
   * State
   * ----------------------------------------------------------*/
  let messages = store.get("sessionStorage", STORE_KEY, []);
  let controller = null;
  let shown = [];

  function save() { store.set("sessionStorage", STORE_KEY, messages.slice(-24)); }
  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addBubble(role, html, imgs) {
    const el = document.createElement("div");
    el.className = `ahw-msg ${role === "user" ? "ahw-user" : "ahw-bot"}`;
    if (role === "user") {
      if (imgs && imgs.length) {
        const row = document.createElement("div");
        row.className = "ahw-user-imgs";
        for (const src of imgs) { const im = document.createElement("img"); im.src = src; im.alt = "Attached image"; row.appendChild(im); }
        el.appendChild(row);
      }
      el.appendChild(document.createTextNode(html));
    } else el.innerHTML = html;
    log.appendChild(el);
    scrollDown();
    return el;
  }

  function renderSuggestions(label) {
    log.querySelectorAll(".ahw-sugs").forEach((n) => n.remove());
    const box = document.createElement("div");
    box.className = "ahw-sugs";
    const draw = () => {
      shown = pickQuestions(3, shown);
      box.innerHTML = `<div class="ahw-sugs-label">${esc(label)}<button type="button" class="ahw-shuffle">${ICONS.shuffle} other ideas</button></div>` +
        shown.map((q) => `<button type="button" class="ahw-chip">${esc(q)}</button>`).join("");
      box.querySelector(".ahw-shuffle").onclick = draw;
      box.querySelectorAll(".ahw-chip").forEach((b, i) => { b.onclick = () => ask(shown[i]); });
      scrollDown();
    };
    draw();
    log.appendChild(box);
  }

  function renderAll() {
    log.innerHTML = "";
    addBubble("bot", renderMarkdown("Hi! I'm an AI assistant that knows Haining's papers, projects, and teaching. What would you like to know?"));
    for (const m of messages) {
      if (m.role === "user") {
        const b = addBubble("user", m.content);
        if (m.images) { const n = document.createElement("span"); n.className = "ahw-imgnote"; n.textContent = `🖼 ${m.images} image${m.images > 1 ? "s" : ""}`; b.prepend(n); }
      } else addBubble("bot", renderAnswer(m.content));
    }
    renderSuggestions(messages.length ? "Keep exploring" : "Try asking");
  }

  function setBusy(busy) {
    sendBtn.innerHTML = busy ? ICONS.stop : ICONS.send;
    sendBtn.setAttribute("aria-label", busy ? "Stop" : "Send");
    updateSend();
  }

  function updateSend() {
    const len = input.value.trim().length + pending.length;
    const over = input.value.length > MAX_CHARS;
    sendBtn.disabled = !controller && (len === 0 || over);
    attachBtn.disabled = !!controller || pending.length >= MAX_IMAGES;
    count.textContent = input.value.length > MAX_CHARS * 0.8 ? `${input.value.length}/${MAX_CHARS}` : "";
    count.classList.toggle("ahw-over", over);
  }

  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 132) + "px";
  }

  /* ------------------------------------------------------------
   * Chat
   * ----------------------------------------------------------*/
  async function ask(question) {
    question = (question || "").trim();
    const imgs = pending;
    if ((!question && !imgs.length) || controller || question.length > MAX_CHARS) return;
    if (!question) question = "Please take a look at this image.";
    pending = []; renderThumbs();
    log.querySelectorAll(".ahw-sugs").forEach((n) => n.remove());
    addBubble("user", question, imgs.map((i) => i.url));
    messages.push(imgs.length ? { role: "user", content: question, images: imgs.length } : { role: "user", content: question });
    save();
    input.value = ""; autosize();

    const bubble = addBubble("bot", '<span class="ahw-typing" aria-label="Thinking"><i></i><i></i><i></i></span>');
    controller = new AbortController();
    setBusy(true);
    let answer = "";
    let frame = 0;
    const paint = (done) => { frame = 0; bubble.innerHTML = renderAnswer(answer, !done); scrollDown(); };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: (m.images && m !== messages[messages.length - 1] ? "[image attached] " : "") + forApi(m.content) })),
          images: imgs.map((i) => ({ media_type: i.media_type, data: i.data })),
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const msg = res.status === 429 ? await res.text() : "Sorry, I couldn't reach the server. Please try again in a moment.";
        throw Object.assign(new Error(msg), { friendly: true });
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        if (!frame) frame = requestAnimationFrame(paint);
      }
      answer = pinBobo(answer + decoder.decode());
      paint(true);
    } catch (err) {
      if (err.name === "AbortError") {
        answer = answer ? pinBobo(answer) + " …" : "";
        if (answer) paint(true); else bubble.remove();
      } else {
        bubble.innerHTML = renderMarkdown(err.friendly ? err.message : "Sorry, something went wrong. Please try again.");
        answer = "";
      }
    } finally {
      if (frame) cancelAnimationFrame(frame);
      controller = null;
      setBusy(false);
    }

    if (answer.trim()) messages.push({ role: "assistant", content: answer.trim() });
    else messages.pop(); // drop the unanswered question from history
    save();
    renderSuggestions("You might also ask");
    input.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------
   * Attachments
   * ----------------------------------------------------------*/
  function renderThumbs() {
    thumbs.innerHTML = "";
    pending.forEach((p, i) => {
      const t = document.createElement("div");
      t.className = "ahw-thumb";
      t.innerHTML = `<img src="${p.url}" alt="Attached image ${i + 1}"><button type="button" aria-label="Remove image">×</button>`;
      t.querySelector("button").onclick = () => { pending.splice(i, 1); renderThumbs(); };
      thumbs.appendChild(t);
    });
    updateSend();
  }
  async function addFiles(files) {
    for (const f of Array.from(files || [])) {
      if (pending.length >= MAX_IMAGES) break;
      if (!/^image\//.test(f.type)) continue;
      try { pending.push(await prepareImage(f)); } catch (_) { /* skip unreadable files */ }
    }
    renderThumbs();
    input.focus({ preventScroll: true });
  }
  attachBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => { addFiles(fileInput.files); fileInput.value = ""; });
  input.addEventListener("paste", (e) => {
    const files = Array.from(e.clipboardData ? e.clipboardData.files : []);
    if (files.length) { e.preventDefault(); addFiles(files); }
  });
  panel.addEventListener("dragover", (e) => { if (e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files")) { e.preventDefault(); panel.classList.add("ahw-drop"); } });
  panel.addEventListener("dragleave", (e) => { if (!panel.contains(e.relatedTarget)) panel.classList.remove("ahw-drop"); });
  panel.addEventListener("drop", (e) => { e.preventDefault(); panel.classList.remove("ahw-drop"); addFiles(e.dataTransfer && e.dataTransfer.files); });

  /* ------------------------------------------------------------
   * Open / close
   * ----------------------------------------------------------*/
  let opened = false;
  function open() {
    if (!opened) {
      // Desktop opens large by default; phones always get the full-screen sheet.
      if (window.innerWidth > 600) setWide(store.get("localStorage", WIDE_KEY, true) !== false, false);
      renderAll(); opened = true;
    }
    else if (!controller) renderSuggestions(messages.length ? "Keep exploring" : "Try asking");
    panel.classList.add("ahw-open");
    panel.setAttribute("aria-hidden", "false");
    launcher.classList.add("ahw-hidden");
    launcher.setAttribute("aria-expanded", "true");
    setTimeout(() => input.focus({ preventScroll: true }), 180);
  }
  function close() {
    panel.classList.remove("ahw-open");
    panel.setAttribute("aria-hidden", "true");
    launcher.classList.remove("ahw-hidden");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus({ preventScroll: true });
  }

  launcher.addEventListener("click", open);

  // Idle nudge: if the visitor stops interacting, the launcher hops (at most 3 times per page).
  let hops = 0, idleTimer = 0;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function armIdle() {
    clearTimeout(idleTimer);
    if (reduceMotion || hops >= 3) return;
    idleTimer = setTimeout(() => {
      if (panel.classList.contains("ahw-open") || document.hidden) { armIdle(); return; }
      hops++;
      launcher.classList.remove("ahw-hop"); void launcher.offsetWidth; launcher.classList.add("ahw-hop");
      armIdle();
    }, hops === 0 ? 20000 : 35000);
  }
  launcher.addEventListener("animationend", (e) => { if (e.animationName === "ahw-hop") launcher.classList.remove("ahw-hop"); });
  ["mousemove", "scroll", "keydown", "touchstart", "click"].forEach((ev) => window.addEventListener(ev, armIdle, { passive: true }));
  armIdle();
  panel.querySelector(".ahw-close-btn").addEventListener("click", close);
  function setWide(wide, remember) {
    panel.classList.toggle("ahw-wide", wide);
    wideBtn.innerHTML = wide ? ICONS.narrow : ICONS.wide;
    wideBtn.title = wide ? "Shrink" : "Expand";
    wideBtn.setAttribute("aria-label", wideBtn.title);
    if (remember) store.set("localStorage", WIDE_KEY, wide);
  }
  wideBtn.addEventListener("click", () => setWide(!panel.classList.contains("ahw-wide"), true));
  panel.querySelector(".ahw-reset-btn").addEventListener("click", () => {
    if (controller) controller.abort();
    messages = []; store.del("sessionStorage", STORE_KEY); shown = []; pending = []; renderThumbs();
    renderAll();
  });
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (controller) { controller.abort(); return; }
    ask(input.value);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  input.addEventListener("input", () => { autosize(); updateSend(); });
  updateSend();
})();
