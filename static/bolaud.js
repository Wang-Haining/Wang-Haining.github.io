/* Bolaud: a pixel Bobo who lives on top of the "Ask Haining" button.
   Sprites are hand-placed pixel grids (26 x 24) drawn to a canvas; poses are layered
   from a body, a head, a tail and small face/ear/paw patches. No images, no libraries. */
(function () {
  "use strict";
  if (window.__bolaud) return;
  window.__bolaud = true;

  var COLORS = {
    O: "#2b2622", // outline
    B: "#8e7f6c", // tabby base
    L: "#b9a88f", // light fur
    S: "#4f453b", // stripes
    W: "#f2ece2", // white muzzle, chest, paws
    P: "#e2a39b", // inner ear, tongue
    N: "#d4846f", // nose
    E: "#dcb33a", // golden eyes
    K: "#1f1b17", // pupils, tail tip
    H: "#fffaf0"  // eye highlight
  };
  var GW = 26, GH = 24;

  // Head (rows 0-12) and sitting body (rows 13-23), cat occupies cols 3-20; the tail uses cols 19-25.
  var HEAD = [
    ".....O............O.......",
    "....OPO..........OPO......",
    "....OPPO........OPPO......",
    "...OBPPBOOOOOOOOBPPBO.....",
    "...OBBBBBSBSSBSBBBBBO.....",
    "...OBBBSBBSBBSBBSBBBO.....",
    "...OBBEEEBBLLBBEEEBBO.....",
    "...OSBEKEBLLLLBEKEBSO.....",
    "...OBBEKEBBLLBBEKEBBO.....",
    "...OSBBBLLWNNWLLBBBSO.....",
    "...OBSBLWWWWWWWWLBSBO.....",
    "....OBBLWWWWWWWWLBBO......",
    ".....OOBLWWWWWWLBOO......."
  ];
  var BODY_SIT = [
    ".....OBSLWWWWWWLSBO.......",
    ".....OSSBLWWWWLBSSO.......",
    "....OBBBBLWWWWLBBBBO......",
    "....OSSSBLLWWLLBSSSO......",
    "....OBBBOBLWWLBOBBBO......",
    "....OBBBOSSOOSSOBBBO......",
    "....OSSSOBBOOBBOSSSO......",
    "....OBBBOSSOOSSOBBBO......",
    "....OBSSOWWOOWWOSSBO......",
    "....OBBBOWWOOWWOBBBO......",
    ".....OOOOOOOOOOOOOO......."
  ];
  // Walking: one front paw lifted (rows 21-23 replaced).
  var WALK_A = [
    "....OBSSOWWOOSSOSSBO......",
    "....OBBBOOOOOWWOBBBO......",
    ".....OOOOOOOOOOOOOO......."
  ];
  var WALK_B = [
    "....OBSSOSSOOWWOSSBO......",
    "....OBBBOWWOOOOOBBBO......",
    ".....OOOOOOOOOOOOOO......."
  ];
  // Grooming: right front leg raised to the mouth (rows 17-23 replaced; paw drawn over the muzzle).
  var BODY_GROOM = [
    "....OBBBOBLWWLLBBBBO......",
    "....OBBBOSSOBBBBBBBO......",
    "....OSSSOBBOBSSSBSSO......",
    "....OBBBOSSOBBBBBBBO......",
    "....OBSSOWWOBSSSBSSO......",
    "....OBBBOWWOBBBBBBBO......",
    ".....OOOOOOOOOOOOOO......."
  ];
  var GROOM_PAW = { x: 12, y: 9, rows: [
    ".OOO..",
    "OWWWO.",
    "OWPWO.",
    "OBWWBO",
    "..OSBO",
    "..OBSO",
    "..OSBO",
    "..OBBO"
  ] };
  // Sleeping: a curled ball wider than the head, tail wrapped along the front, paws peeking out.
  function stampLoaf(g) {
    var cx = 11.5, cy = 19, rx = 12.4, ry = 7.6, y, x;
    for (y = 12; y < GH; y++) for (x = 0; x < GW; x++) {
      var d = ((x - cx) * (x - cx)) / (rx * rx) + ((y - cy) * (y - cy)) / (ry * ry);
      if (d <= 1 && y <= 22) g[y][x] = ((y + Math.round(Math.abs(x - cx) / 4)) % 3 === 0) ? "S" : "B";
    }
    for (x = 3; x <= 20; x++) g[22][x] = x <= 4 ? "K" : (x % 3 === 0 ? "S" : "L");
    [[8, 20], [9, 20], [14, 20], [15, 20]].forEach(function (p) { g[p[1]][p[0]] = "W"; });
    var o = blank();
    for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) {
      if (g[y][x] !== ".") continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var yy = y + d[1], xx = x + d[0]; return yy >= 0 && yy < GH && xx >= 0 && xx < GW && g[yy][xx] !== "."; })) o[y][x] = "O";
    }
    for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) if (o[y][x] === "O") g[y][x] = "O";
  }

  // Eye patches: 3x3, placed at (6,6) and (15,6) in head coordinates.
  var EYES = {
    open:   ["EEE", "EKE", "EKE"],
    left:   ["EEE", "KEE", "KEE"],
    right:  ["EEE", "EEK", "EEK"],
    half:   ["BBB", "OOO", "EKE"],
    closed: ["BBB", "OOO", "BBB"],
    happy:  ["BOB", "OBO", "BBB"]
  };
  var EYES_RIGHT = { left: ["EEE", "KEE", "KEE"], right: ["EEE", "EEK", "EEK"] };
  var MOUTH_YAWN = { x: 10, y: 10, rows: ["OOOO", "OPPO", ".OO."] };
  var MOUTH_LICK = { x: 10, y: 11, rows: ["PP"] };
  // Left ear twitch: the ear dips one pixel and folds at the tip.
  var EAR_FLICK = { x: 3, y: 0, clear: [6, 3], rows: [
    "......",
    "..OO..",
    ".OPPO."
  ] };

  // Tails: [x, y, color] fills; the outline is added automatically.
  var TAIL_BASE = [[20, 21, "B"], [21, 21, "B"], [22, 20, "S"], [22, 19, "B"], [23, 18, "S"], [23, 17, "B"], [23, 16, "S"], [23, 15, "B"]];
  var TAILS = {
    curl: TAIL_BASE.concat([[22, 14, "K"], [21, 13, "K"]]),
    up:   TAIL_BASE.concat([[23, 14, "K"], [23, 13, "K"]]),
    out:  TAIL_BASE.concat([[24, 14, "K"], [24, 13, "K"]]),
    low:  [[20, 22, "B"], [21, 22, "S"], [22, 22, "B"], [23, 22, "S"], [24, 21, "K"], [24, 20, "K"]]
  };

  function blank() { var g = []; for (var y = 0; y < GH; y++) g.push(new Array(GW).fill(".")); return g; }
  function stamp(g, rows, x, y) {
    for (var r = 0; r < rows.length; r++) for (var c = 0; c < rows[r].length; c++) {
      var ch = rows[r][c], yy = y + r, xx = x + c;
      if (ch !== "." && yy >= 0 && yy < GH && xx >= 0 && xx < GW) g[yy][xx] = ch;
    }
  }
  function stampTail(g, pts) {
    var t = blank();
    pts.forEach(function (p) { t[p[1]][p[0]] = p[2]; });
    for (var y = 0; y < GH; y++) for (var x = 0; x < GW; x++) {
      if (t[y][x] !== ".") continue;
      var n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) {
        var yy = y + d[1], xx = x + d[0];
        return yy >= 0 && yy < GH && xx >= 0 && xx < GW && t[yy][xx] !== "." && t[yy][xx] !== "O";
      });
      if (n) t[y][x] = "O";
    }
    for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) if (t[y][x] !== ".") g[y][x] = t[y][x];
  }

  // Climbing: seen from behind, paws reaching up the side of the chat window in turns.
  function outlineAll(g) {
    var o = blank(), y, x;
    for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) {
      if (g[y][x] !== ".") continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) {
        var yy = y + d[1], xx = x + d[0];
        return yy >= 0 && yy < GH && xx >= 0 && xx < GW && g[yy][xx] !== "." && g[yy][xx] !== "O";
      })) o[y][x] = "O";
    }
    for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) if (o[y][x] === "O") g[y][x] = "O";
  }
  function limb(g, x0, y0, x1, y1) {
    var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)), i;
    for (i = 0; i <= n; i++) {
      var x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(function (d) {
        var yy = y + d[1], xx = x + d[0];
        if (yy >= 0 && yy < GH && xx >= 0 && xx < GW) g[yy][xx] = (i % 3 === 1) ? "S" : "B";
      });
    }
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(function (d) {
      var yy = y1 + d[1], xx = x1 + d[0];
      if (yy >= 0 && yy < GH && xx >= 0 && xx < GW) g[yy][xx] = "W";
    });
  }
  function buildClimb(phase) {
    var g = blank(), y, x, up = phase === 0;
    for (y = 10; y < GH; y++) for (x = 0; x < GW; x++) {
      var d = ((x - 11.5) * (x - 11.5)) / 38 + ((y - 16) * (y - 16)) / 36;
      if (d <= 1) g[y][x] = (x === 11 || x === 12) ? "S" : (y % 3 === 0 ? "S" : "B");
    }
    g[22][11] = "S"; g[22][12] = "B"; g[23][11] = "K"; g[23][12] = "K";
    // limbs over the body, reaching past the head; the high paw swaps each frame
    limb(g, 6, 13, 1, up ? 3 : 8);
    limb(g, 16, 13, 21, up ? 8 : 3);
    limb(g, 7, 19, 3, up ? 22 : 20);
    limb(g, 15, 19, 19, up ? 20 : 22);
    var back = HEAD.map(function (row) { return row.replace(/[EKNWLHP]/g, "B"); });
    stamp(g, back, 0, 0);
    [[9, 6], [9, 7], [14, 6], [14, 7], [11, 8], [12, 8], [11, 9], [12, 9], [6, 9], [17, 9], [10, 11], [13, 11]].forEach(function (p) { if (g[p[1]][p[0]] === "B") g[p[1]][p[0]] = "S"; });
    outlineAll(g);
    return g;
  }

  // pose = {body, tail, eyes, headDY, mouth, ear, paw}
  function compose(p) {
    if (p.body === "climbA") return buildClimb(0);
    if (p.body === "climbB") return buildClimb(1);
    var g = blank(), dy = p.headDY || 0;
    if (p.body === "loaf") {
      stampLoaf(g);
      dy = 7;
    } else {
      if (p.tail) stampTail(g, TAILS[p.tail]);
      stamp(g, BODY_SIT, 0, 13);
      if (p.body === "walkA") stamp(g, WALK_A, 0, 21);
      if (p.body === "walkB") stamp(g, WALK_B, 0, 21);
      if (p.body === "groom") stamp(g, BODY_GROOM, 0, 17);
    }
    stamp(g, HEAD, 0, dy);
    var e = p.eyes || "open";
    stamp(g, EYES[e], 6, 6 + dy);
    stamp(g, (EYES_RIGHT[e] || EYES[e]), 15, 6 + dy);
    if (p.mouth === "yawn") stamp(g, MOUTH_YAWN.rows, MOUTH_YAWN.x, MOUTH_YAWN.y + dy);
    if (p.mouth === "lick") stamp(g, MOUTH_LICK.rows, MOUTH_LICK.x, MOUTH_LICK.y + dy);
    if (p.ear) {
      for (var cy = 0; cy < EAR_FLICK.clear[1]; cy++) for (var cx = 0; cx < EAR_FLICK.clear[0]; cx++) {
        var yy = EAR_FLICK.y + dy + cy; if (yy >= 0 && yy < GH) g[yy][EAR_FLICK.x + cx] = ".";
      }
      stamp(g, EAR_FLICK.rows, EAR_FLICK.x, EAR_FLICK.y + dy);
    }
    if (p.body === "groom") stamp(g, GROOM_PAW.rows, GROOM_PAW.x, GROOM_PAW.y + dy);
    return g;
  }

  function draw(ctx, g) {
    ctx.clearRect(0, 0, GW, GH);
    for (var y = 0; y < GH; y++) for (var x = 0; x < GW; x++) {
      var ch = g[y][x];
      if (ch === ".") continue;
      ctx.fillStyle = COLORS[ch];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Exposed for the sprite lab page.
  window.__bolaudSprites = { compose: compose, draw: draw, GW: GW, GH: GH };
  if (window.__bolaudLab) return;

  /* ---------- Behaviour ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = [
    "#bolaud{position:fixed;z-index:10002;pointer-events:auto;cursor:pointer;image-rendering:pixelated;image-rendering:crisp-edges;",
    "transition:opacity .2s ease;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}",
    "#bolaud.bolaud-hidden{opacity:0;pointer-events:none;}",
    "#bolaud canvas{display:block;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;}",
    ".bolaud-fx{position:fixed;z-index:10003;pointer-events:none;font:700 12px/1 ui-monospace,Menlo,monospace;color:#7d8aa3;",
    "animation:bolaud-float 1.6s ease-out forwards;}",
    ".bolaud-fx.heart{color:#e0564f;font-size:14px;}",
    "@keyframes bolaud-float{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx,6px),-34px)}}",
    "@media (prefers-reduced-motion:reduce){.bolaud-fx{animation:none;opacity:0}}"
  ].join("");

  function start(launcher) {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.id = "bolaud";
    wrap.setAttribute("aria-hidden", "true");
    var canvas = document.createElement("canvas");
    canvas.width = GW; canvas.height = GH;
    wrap.appendChild(canvas);
    document.body.appendChild(wrap);
    var ctx = canvas.getContext("2d");

    // mode: "launcher" (perched on the button), "panel" (on the chat input box), "moving" (in between).
    var S = 3, x = 0, minX = 0, maxX = 0, baseBottom = 0, lift = 0, mode = "launcher";
    var panel = document.getElementById("ahw-panel");
    var form = panel && panel.querySelector(".ahw-form");
    var log = panel && panel.querySelector(".ahw-log");
    function layout() {
      S = window.innerWidth <= 600 ? 2 : 3;
      wrap.style.width = GW * S + "px";
      wrap.style.height = GH * S + "px";
      if (mode === "moving") return;
      var r = (mode === "panel" && form ? form : launcher).getBoundingClientRect();
      // Feet rest on the top edge of the pill (or the input box), a little in from the ends.
      baseBottom = window.innerHeight - r.top - S * 1;
      minX = r.left + (mode === "panel" ? 10 : 6);
      maxX = Math.max(minX, r.right - GW * S - (mode === "panel" ? 10 : 4));
      if (!x || x < minX || x > maxX) x = mode === "panel" ? Math.min(maxX, Math.max(minX, x)) : maxX;
      place();
    }
    function place() {
      wrap.style.left = Math.round(x) + "px";
      wrap.style.bottom = Math.round(baseBottom + lift) + "px";
    }

    var pose = { tail: "curl", eyes: "open" };
    function render() { draw(ctx, compose(pose)); }

    function fx(text, cls) {
      var r = wrap.getBoundingClientRect();
      var el = document.createElement("span");
      el.className = "bolaud-fx" + (cls ? " " + cls : "");
      el.textContent = text;
      el.style.left = (r.left + r.width * (0.35 + Math.random() * 0.3)) + "px";
      el.style.top = (r.top + 2) + "px";
      el.style.setProperty("--dx", (Math.random() * 16 - 8).toFixed(0) + "px");
      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, 1700);
    }

    layout();
    render();
    window.addEventListener("resize", layout);

    var busy = false;
    function chatOpen() { return launcher.classList.contains("ahw-hidden"); }
    function padLog(on) { if (log) log.style.paddingBottom = on ? (GH * S + 10) + "px" : ""; }
    if (window.ResizeObserver && panel) {
      var ro = new ResizeObserver(function () { if (mode === "panel") layout(); });
      ro.observe(panel); if (form) ro.observe(form);
    }

    if (reduce) {
      // No motion: sit on whichever surface is showing.
      pose = { tail: "low", eyes: "open" };
      render();
      wrap.addEventListener("click", function () { pose.eyes = pose.eyes === "happy" ? "open" : "happy"; render(); });
      new MutationObserver(function () {
        mode = chatOpen() ? "panel" : "launcher"; x = 0; padLog(mode === "panel");
        setTimeout(layout, 260);
      }).observe(launcher, { attributes: true, attributeFilter: ["class"] });
      return;
    }

    // A tiny timeline runner: each step sets the pose and/or position, then waits.
    var timer = null, token = 0, mood = "idle", sleeping = false;
    function run(steps, done) {
      var my = ++token, i = 0;
      busy = true;
      (function next() {
        if (my !== token) return;
        if (i >= steps.length) { busy = false; if (done) done(); return; }
        var s = steps[i++];
        if (s.pose) { pose = Object.assign({}, pose, s.pose); }
        if (s.dx) { x = (s.free || mode === "moving") ? x + s.dx : Math.min(maxX, Math.max(minX, x + s.dx)); }
        if (s.lift !== undefined) lift = s.lift;
        if (s.fx) fx(s.fx[0], s.fx[1]);
        render(); place();
        timer = setTimeout(next, s.t || 160);
      })();
    }
    function stop() { token++; clearTimeout(timer); busy = false; }

    // Eyes follow the pointer while idle.
    var lookTimer = null, lastPointer = Date.now();
    document.addEventListener("pointermove", function (ev) {
      lastPointer = Date.now();
      if (busy || sleeping) return;
      var r = wrap.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 3;
      var dx = ev.clientX - cx;
      var want = Math.abs(dx) < 40 && ev.clientY > cy - 60 ? "open" : dx < 0 ? "left" : "right";
      if (want !== pose.eyes) { pose.eyes = want; render(); }
      clearTimeout(lookTimer);
      lookTimer = setTimeout(function () { if (!busy && !sleeping) { pose.eyes = "open"; render(); } }, 2500);
    }, { passive: true });

    function blink() {
      if (busy || sleeping) return;
      var e = pose.eyes;
      run([{ pose: { eyes: "half" }, t: 60 }, { pose: { eyes: "closed" }, t: 90 }, { pose: { eyes: "half" }, t: 60 }, { pose: { eyes: e }, t: 10 }]);
    }

    var tailSeq = ["curl", "up", "out", "up"], tailI = 0;
    function idleTick() {
      if (!busy && !sleeping) { tailI = (tailI + 1) % tailSeq.length; pose.tail = tailSeq[tailI]; render(); }
    }

    function walk() {
      var dir = Math.random() < 0.5 ? -1 : 1;
      if (x <= minX + 4) dir = 1;
      if (x >= maxX - 4) dir = -1;
      var room = dir < 0 ? x - minX : maxX - x;
      var stepsN = Math.max(2, Math.min(10, Math.floor(room / (S * 2))));
      var eyes = dir < 0 ? "left" : "right", steps = [];
      for (var i = 0; i < stepsN; i++) {
        steps.push({ pose: { body: i % 2 ? "walkB" : "walkA", eyes: eyes, tail: i % 2 ? "up" : "out" }, dx: dir * S * 2, lift: i % 2 ? 0 : S * 0.34, t: 150 });
      }
      steps.push({ pose: { body: "sit", eyes: eyes, tail: "curl" }, lift: 0, t: 500 });
      steps.push({ pose: { eyes: "open" }, t: 10 });
      run(steps);
    }
    function groom() {
      var s = [{ pose: { body: "groom", eyes: "closed", tail: "low" }, t: 300 }];
      for (var i = 0; i < 4; i++) { s.push({ pose: { mouth: "lick" }, t: 180 }); s.push({ pose: { mouth: null }, t: 200 }); }
      s.push({ pose: { body: "sit", eyes: "open", mouth: null, tail: "curl" }, t: 10 });
      run(s);
    }
    function yawn(then) {
      run([
        { pose: { eyes: "half", ear: true }, t: 200 },
        { pose: { eyes: "closed", mouth: "yawn" }, t: 700 },
        { pose: { eyes: "half", mouth: null, ear: false }, t: 250 },
        { pose: { eyes: "open" }, t: 10 }
      ], then);
    }
    function earFlick() {
      run([{ pose: { ear: true }, t: 140 }, { pose: { ear: false }, t: 140 }, { pose: { ear: true }, t: 120 }, { pose: { ear: false }, t: 10 }]);
    }
    function hop(withHearts) {
      var e = withHearts ? "happy" : pose.eyes;
      run([
        { pose: { headDY: 1, eyes: e }, t: 110, fx: withHearts ? ["♥", "heart"] : null },
        { pose: { headDY: 0, tail: "up" }, lift: S * 4, t: 90 },
        { lift: S * 7, t: 120 },
        { lift: S * 4, t: 90, fx: withHearts && Math.random() < 0.6 ? ["♥", "heart"] : null },
        { pose: { headDY: 1 }, lift: 0, t: 110 },
        { pose: { headDY: 0, tail: "curl" }, t: withHearts ? 600 : 10 },
        { pose: { eyes: "open" }, t: 10 }
      ]);
    }
    function hopWithLauncher() { if (!busy && !sleeping) hop(false); }

    var zzzTimer = null;
    function sleep(ms) {
      sleeping = true;
      stop();
      pose = { body: "loaf", eyes: "closed" };
      render();
      clearInterval(zzzTimer);
      zzzTimer = setInterval(function () { if (!document.hidden) fx(Math.random() < 0.5 ? "z" : "Z"); }, 1400);
      clearTimeout(timer);
      timer = setTimeout(wake, ms || 20000 + Math.random() * 25000);
    }
    function wake() {
      if (!sleeping) return;
      sleeping = false;
      clearInterval(zzzTimer);
      pose = { body: "sit", tail: "low", eyes: "closed" };
      render();
      yawn();
    }

    wrap.addEventListener("click", function () {
      lastPointer = Date.now();
      if (sleeping) { wake(); return; }
      stop();
      hop(true);
    });

    function choose() {
      if (document.hidden || busy || sleeping) return;
      if (Date.now() - lastPointer > 120000) { sleep(); return; }
      var r = Math.random();
      if (r < 0.32) walk();
      else if (r < 0.48) groom();
      else if (r < 0.60) earFlick();
      else if (r < 0.70) yawn();
      else if (r < 0.80) hop(false);
      else if (r < 0.88) sleep();
    }

    // Chat opens: climb up the right edge of the chat window, then walk onto the input box.
    function enterPanel() {
      if (!form) { wrap.classList.add("bolaud-hidden"); return; }
      stop(); clearInterval(zzzTimer); sleeping = false;
      mode = "moving";
      wrap.classList.add("bolaud-hidden");
      setTimeout(function () {
        if (!chatOpen()) return;
        var pr = panel.getBoundingClientRect(), fr = form.getBoundingClientRect(), w = GW * S;
        padLog(true);
        baseBottom = window.innerHeight - fr.top - S;
        x = Math.min(window.innerWidth - w, pr.right - Math.round(w / 2));
        lift = -(baseBottom + GH * S);
        pose = { body: "climbA" };
        render(); place();
        wrap.classList.remove("bolaud-hidden");
        var steps = [], climbed = lift, k = 0;
        while (climbed < 0) {
          climbed = Math.min(0, climbed + S * 3);
          steps.push({ pose: { body: k++ % 2 ? "climbB" : "climbA" }, lift: climbed, t: 110 });
        }
        var target = fr.left + fr.width * 0.55 - w / 2;
        steps.push({ pose: { body: "sit", tail: "up", eyes: "left", headDY: 1 }, lift: S * 3, t: 120 });
        steps.push({ pose: { headDY: 0 }, lift: 0, t: 140 });
        var n = Math.max(2, Math.min(30, Math.round((x - target) / (S * 3))));
        for (var i = 0; i < n; i++) {
          steps.push({ pose: { body: i % 2 ? "walkB" : "walkA", eyes: "left", tail: i % 2 ? "up" : "out" }, dx: -S * 3, lift: i % 2 ? 0 : S * 0.34, t: 130, free: true });
        }
        steps.push({ pose: { body: "sit", tail: "curl", eyes: "open" }, lift: 0, t: 300 });
        run(steps, function () { mode = "panel"; layout(); });
      }, 280);
    }
    // Chat closes: hop back onto the button.
    function leavePanel() {
      stop(); clearInterval(zzzTimer); sleeping = false;
      padLog(false);
      wrap.classList.add("bolaud-hidden");
      mode = "launcher"; lift = 0; x = 0;
      setTimeout(function () {
        if (chatOpen()) return;
        pose = { tail: "curl", eyes: "open" };
        layout(); render();
        wrap.classList.remove("bolaud-hidden");
        hop(false);
      }, 220);
    }
    var wasOpen = chatOpen();
    new MutationObserver(function () {
      var open = chatOpen();
      if (open !== wasOpen) { wasOpen = open; if (open) enterPanel(); else leavePanel(); }
      else if (!open && launcher.classList.contains("ahw-hop")) hopWithLauncher();
    }).observe(launcher, { attributes: true, attributeFilter: ["class"] });
    if (wasOpen) enterPanel();

    if (/[?&]bolaud=debug/.test(location.search)) {
      window.__bolaudDebug = { walk: walk, groom: groom, yawn: function () { yawn(); }, ear: earFlick, hop: function () { hop(true); }, sleep: function () { sleep(8000); }, wake: wake };
    }

    setInterval(idleTick, 420);
    (function blinkLoop() { setTimeout(function () { if (!document.hidden) blink(); blinkLoop(); }, 2500 + Math.random() * 4000); })();
    (function actLoop() { setTimeout(function () { choose(); actLoop(); }, 4000 + Math.random() * 5000); })();
  }

  function waitForLauncher(tries) {
    var l = document.getElementById("ahw-launcher");
    if (l) { start(l); return; }
    if (tries > 60) return;
    setTimeout(function () { waitForLauncher(tries + 1); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { waitForLauncher(0); });
  else waitForLauncher(0);
})();
