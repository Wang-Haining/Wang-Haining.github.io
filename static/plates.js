// Plate of the day: a small glyph mosaic at the foot of the sidebar, built from real material in Haining's work.
// One plate per local day (preview any with ?plate=N). Glyphs are white on the palette's sidebar color; highlights
// use the palette's pop color, so each plate also changes with the palette of the hour.
(function () {
  "use strict";
  var S = 10, NS = "http://www.w3.org/2000/svg";

  // Deterministic hash in [0, 1) for a cell, so a plate looks the same all day.
  function rnd(i, j, k) {
    var h = (i * 374761393 + j * 668265263 + k * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // Rasterize a drawing into per-cell coverage (0..1) on a cols x rows grid, sampling 3x3 points per cell.
  function coverage(cols, rows, draw) {
    var W = cols * S, H = rows * S, c = document.createElement("canvas");
    c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    ctx.fillStyle = ctx.strokeStyle = "#000";
    draw(ctx);
    var px = ctx.getImageData(0, 0, W, H).data, out = [];
    for (var r = 0; r < rows; r++) {
      out.push([]);
      for (var q = 0; q < cols; q++) {
        var hit = 0;
        for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) {
          var x = q * S + 2 + a * 3, y = r * S + 2 + b * 3;
          if (px[(y * W + x) * 4 + 3] > 127) hit++;
        }
        out[r].push(hit / 9);
      }
    }
    return out;
  }

  // One glyph in cell (q, r). kind: tile | disc | ring | diamond | plus | dot; hi = draw in the pop color.
  function glyph(g, q, r, kind, ch, hi) {
    var x = q * S, y = r * S, cx = x + S / 2, cy = y + S / 2, cls = hi ? "pl-h" : "pl-g";
    if (kind === "tile") {
      el("rect", { x: x + 0.6, y: y + 0.6, width: S - 1.2, height: S - 1.2, "class": cls }, g);
      if (ch) { var t = el("text", { x: cx, y: cy + 2.6, "class": hi ? "pl-th" : "pl-t" }, g); t.textContent = ch; }
    } else if (kind === "disc") el("circle", { cx: cx, cy: cy, r: 4, "class": cls }, g);
    else if (kind === "ring") el("circle", { cx: cx, cy: cy, r: 3.4, "class": (hi ? "pl-rh" : "pl-r") }, g);
    else if (kind === "diamond") el("rect", { x: cx - 2.9, y: cy - 2.9, width: 5.8, height: 5.8, transform: "rotate(45 " + cx + " " + cy + ")", "class": cls }, g);
    else if (kind === "plus") {
      el("rect", { x: cx - 4, y: cy - 1.3, width: 8, height: 2.6, "class": cls }, g);
      el("rect", { x: cx - 1.3, y: cy - 4, width: 2.6, height: 8, "class": cls }, g);
    } else el("rect", { x: cx - 1.3, y: cy - 1.3, width: 2.6, height: 2.6, "class": cls + " pl-dot" }, g);
  }

  function lum(hex) { // relative luminance of #rrggbb
    var m = /#?([0-9a-f]{6})/i.exec(hex || ""); if (!m) return 0;
    var n = parseInt(m[1], 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function pick(u, mix) { // mix: [[kind, weight], ...]
    var s = 0, i;
    for (i = 0; i < mix.length; i++) s += mix[i][1];
    u *= s;
    for (i = 0; i < mix.length; i++) { u -= mix[i][1]; if (u < 0) return mix[i][0]; }
    return mix[mix.length - 1][0];
  }
  var BODY = [["tile", 22], ["disc", 26], ["ring", 18], ["diamond", 10], ["plus", 12], ["dot", 12]];

  // Fill a mosaic from coverage layers. layers: [{cov, mix, chars, hi}] drawn first-match-wins per cell.
  function mosaic(g, cols, rows, layers, seed) {
    var n = 0;
    for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++) {
      var u = rnd(q, r, seed), done = false;
      for (var L = 0; L < layers.length && !done; L++) {
        var ly = layers[L], c = ly.cov[r][q];
        if (c >= 0.5) {
          var kind = pick(u, ly.mix || BODY), ch = "";
          if (kind === "tile" && ly.chars) { ch = ly.chars[n % ly.chars.length]; n++; }
          glyph(g, q, r, kind, ch, ly.hi);
          done = true;
        } else if (ly.edge !== false && c > 0.12 && u < 0.55) { glyph(g, q, r, "dot", "", ly.hi); done = true; }
      }
      if (!done && rnd(r, q, seed + 7) < 0.035) el("rect", { x: q * S + 4, y: r * S + 4, width: 2, height: 2, "class": "pl-bg" }, g);
    }
  }

  // ── Plate 1: Under Five. The elephant; its trunk, the fifth parameter, wiggles. ──
  function elephant(svg, t) {
    var cols = 30, rows = 21, g = el("g", {}, svg);
    var body = coverage(cols, rows, function (x) {
      x.beginPath(); x.ellipse(170, 100, 82, 56, 0, 0, 7); x.fill();
      x.beginPath(); x.arc(86, 82, 40, 0, 7); x.fill();
      [[110, 128], [142, 170], [190, 218], [222, 248]].forEach(function (l) { x.fillRect(l[0], 130, l[1] - l[0], 66); });
      x.lineWidth = 6; x.beginPath(); x.moveTo(250, 92); x.quadraticCurveTo(272, 118, 262, 150); x.stroke();
      x.globalCompositeOperation = "destination-out"; x.beginPath(); x.arc(72, 72, 5, 0, 7); x.fill();
    });
    var ear = coverage(cols, rows, function (x) { x.beginPath(); x.ellipse(116, 86, 28, 38, -0.15, 0, 7); x.fill(); });
    var w = Math.sin(t) * 18, trunk = coverage(cols, rows, function (x) {
      x.lineWidth = 17; x.lineCap = "round"; x.beginPath(); x.moveTo(58, 96);
      x.bezierCurveTo(30 + w * 0.3, 140, 34 - w, 176, 58 + w * 0.6, 196); x.stroke();
    });
    var tusk = coverage(cols, rows, function (x) {
      x.lineWidth = 8; x.lineCap = "round"; x.beginPath(); x.moveTo(84, 112); x.quadraticCurveTo(52, 136, 26, 118); x.stroke();
    });
    mosaic(g, cols, rows, [
      { cov: tusk, mix: [["tile", 1]] },
      { cov: trunk, hi: true, chars: "5", mix: [["tile", 40], ["disc", 30], ["ring", 15], ["dot", 15]] },
      { cov: ear, mix: [["ring", 45], ["dot", 25], ["plus", 15], ["diamond", 15]] },
      { cov: body, chars: "4" }
    ], 11);
    return { cols: cols, rows: rows };
  }

  // ── Ivory tower: built from the letters of "jargon"; six lit steps come down to the door. ──
  function tower(svg) {
    var cols = 30, rows = 21, g = el("g", {}, svg);
    var body = coverage(cols, rows, function (x) {
      x.fillRect(110, 52, 82, 146);
      x.fillRect(98, 38, 106, 18);
      [98, 128, 158, 188].forEach(function (m) { x.fillRect(m, 22, 16, 18); });
      x.globalCompositeOperation = "destination-out";
      x.fillRect(140, 162, 22, 36);
      x.fillRect(142, 78, 18, 22); x.fillRect(142, 116, 18, 22);
    });
    var steps = coverage(cols, rows, function (x) {
      for (var k = 0; k < 6; k++) x.fillRect(84 - k * 14, 62 + k * 24, 26, 10);
    });
    var ground = coverage(cols, rows, function (x) { x.fillRect(0, 200, 300, 10); });
    mosaic(g, cols, rows, [
      { cov: steps, hi: true, mix: [["tile", 1]] },
      { cov: body, chars: "jargon", mix: [["tile", 50], ["disc", 16], ["ring", 12], ["diamond", 8], ["plus", 6], ["dot", 8]] },
      { cov: ground, mix: [["dot", 60], ["ring", 20], ["disc", 20]] }
    ], 31);
    return { cols: cols, rows: rows };
  }

  // ── DualR: a capsule, one half in the pop color, spelled from "medication list". ──
  function capsule(svg) {
    var cols = 30, rows = 21, g = el("g", {}, svg);
    function pill(x) { x.translate(150, 105); x.rotate(-0.42); }
    var left = coverage(cols, rows, function (x) {
      pill(x); x.beginPath(); x.moveTo(0, -40); x.lineTo(-80, -40); x.arc(-80, 0, 40, -Math.PI / 2, Math.PI / 2, true); x.lineTo(0, 40); x.closePath(); x.fill();
    });
    var right = coverage(cols, rows, function (x) {
      pill(x); x.beginPath(); x.moveTo(0, -40); x.lineTo(80, -40); x.arc(80, 0, 40, -Math.PI / 2, Math.PI / 2); x.lineTo(0, 40); x.closePath(); x.fill();
    });
    mosaic(g, cols, rows, [
      { cov: left, hi: true, chars: "medicationlist", mix: [["tile", 46], ["disc", 22], ["ring", 14], ["dot", 18]] },
      { cov: right, chars: "medicationlist", mix: [["tile", 40], ["disc", 22], ["ring", 16], ["diamond", 8], ["plus", 6], ["dot", 8]] }
    ], 41);
    return { cols: cols, rows: rows };
  }

  // ── Library fairness: a level balance; six weights, one per model, three on each pan. ──
  function scale(svg) {
    var cols = 30, rows = 21, g = el("g", {}, svg);
    var frame = coverage(cols, rows, function (x) {
      x.fillRect(144, 44, 12, 146);
      x.beginPath(); x.moveTo(104, 202); x.lineTo(196, 202); x.lineTo(170, 184); x.lineTo(130, 184); x.closePath(); x.fill();
      x.fillRect(40, 40, 220, 10);
      x.beginPath(); x.arc(150, 34, 9, 0, 7); x.fill();
      x.lineWidth = 8; x.lineCap = "round";
      [50, 250].forEach(function (c) {
        x.beginPath(); x.moveTo(c, 50); x.lineTo(c - 30, 122); x.moveTo(c, 50); x.lineTo(c + 30, 122); x.stroke();
      });
      [50, 250].forEach(function (cx) { x.beginPath(); x.moveTo(cx - 48, 122); x.lineTo(cx + 48, 122); x.lineTo(cx + 30, 142); x.lineTo(cx - 30, 142); x.closePath(); x.fill(); });
    });
    var weights = coverage(cols, rows, function (x) {
      [50, 250].forEach(function (cx) { [[-12, 112], [12, 112], [0, 96]].forEach(function (o) { x.beginPath(); x.arc(cx + o[0], o[1], 7, 0, 7); x.fill(); }); });
    });
    mosaic(g, cols, rows, [
      { cov: weights, hi: true, mix: [["disc", 1]] },
      { cov: frame, mix: [["tile", 22], ["disc", 26], ["ring", 16], ["diamond", 12], ["plus", 12], ["dot", 12]] }
    ], 53);
    return { cols: cols, rows: rows };
  }

  // ── Du Ying: the 1912 newspaper page, set in vertical columns read right to left. The first column, in the pop
  //    color, is the title and signature (望华国篇, 独应); the rest are the function characters Lu Xun used more. ──
  function paper(svg) {
    var cols = 30, rows = 21, g = el("g", {}, svg), body = "之而不于则是矣", n = 0;
    var title = "望华国篇", sign = "独应", len = [19, 17, 19, 18, 19, 14, 19, 19, 16, 19, 12];
    for (var c = 0; c < len.length; c++) {
      var q = 25 - c * 2;
      for (var r = 1; r <= len[c]; r++) {
        var u = rnd(q, r, 81);
        if (c === 0) {
          if (r <= title.length) glyph(g, q, r, "tile", title[r - 1], true);
          else if (r >= 7 && r < 7 + sign.length) glyph(g, q, r, "tile", sign[r - 7], true);
          else if (u < 0.5) glyph(g, q, r, "dot", "", true);
          continue;
        }
        if (u < 0.08) continue;
        if (u < 0.78) glyph(g, q, r, "tile", body[n++ % body.length], false);
        else glyph(g, q, r, u < 0.9 ? "disc" : "dot", "", false);
      }
    }
    for (var k = 3; k < 28; k += 2) if (rnd(k, 0, 82) < 0.7) glyph(g, k, 0, "dot", "", false);
    return { cols: cols, rows: rows };
  }

  // ── Authorship: a fingerprint whorl spelled in function words; the core in the pop color. ──
  function fingerprint(svg) {
    var cols = 30, rows = 21, g = el("g", {}, svg);
    var ridges = coverage(cols, rows, function (x) {
      x.translate(150, 106); x.rotate(-0.2); x.lineWidth = 10;
      [[26, 32, 0.9], [54, 62, 0.5], [82, 92, 0.25]].forEach(function (e, k) {
        x.beginPath(); x.ellipse(0, 0, e[0], e[1], 0, e[2], Math.PI * 2 - 0.1 - k * 0.12); x.stroke();
      });
    });
    var core = coverage(cols, rows, function (x) {
      x.translate(150, 106); x.rotate(-0.2); x.beginPath(); x.ellipse(0, 0, 8, 12, 0, 0, 7); x.fill();
    });
    mosaic(g, cols, rows, [
      { cov: core, hi: true, edge: false, mix: [["tile", 1]] },
      { cov: ridges, chars: "theofandtoa", edge: false, mix: [["tile", 1]] }
    ], 71);
    return { cols: cols, rows: rows };
  }

  // ── Plate 2: a year of new bioRxiv preprints, one mark per day; NIH R01 due dates in the pop color. ──
  var CAL = null; // filled from /static/plates-data.json
  function calendar(svg) {
    var g = el("g", {}, svg), year = CAL.year, counts = CAL.counts, due = CAL.due;
    var vals = counts.slice().sort(function (a, b) { return a - b; });
    function qt(v) { var lo = 0, hi = vals.length; while (lo < hi) { var m = (lo + hi) >> 1; if (vals[m] < v) lo = m + 1; else hi = m; } return lo / vals.length; }
    var cols = 4 * 7 + 3, rows = 3 * 6 + 2;
    for (var d = 0; d < counts.length; d++) {
      var date = new Date(year, 0, 1 + d), m = date.getMonth(), wd = (date.getDay() + 6) % 7;
      var first = (new Date(year, m, 1).getDay() + 6) % 7, wk = Math.floor((date.getDate() - 1 + first) / 7);
      var q = (m % 4) * 8 + wd, r = Math.floor(m / 4) * 7 + wk;
      var iso = year + "-" + ("0" + (m + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
      if (due.indexOf(iso) >= 0) { glyph(g, q, r, "plus", "", true); continue; }
      var near = due.some(function (x) { var k = (new Date(x + "T00:00") - date) / 86400000; return k > 0 && k <= CAL.window; });
      var p = qt(counts[d]);
      glyph(g, q, r, p >= 0.9 ? "tile" : p >= 0.65 ? "disc" : p >= 0.35 ? "ring" : "dot", "", near);
    }
    return { cols: cols, rows: rows };
  }

  var PLATES = [
    { draw: elephant, animate: true, label: "An elephant drawn in glyphs; its trunk wiggles",
      note: 'Four parameters fit an elephant; the fifth wiggles its trunk. <a href="/teaching/">Under Five</a>' },
    { draw: tower, label: "An ivory tower built from the letters of jargon, with six lit steps down to the door",
      note: 'Rewritten by a language model, scholarly abstracts come down about six US grade levels, from postgraduate to high school. <a href="https://doi.org/10.1007/s11192-025-05386-z">Ivory tower</a>' },
    { draw: capsule, label: "A capsule spelled from the letters of medication list",
      note: 'From the medication list alone, DualR flagged alcohol use disorder more than 300 days before diagnosis, across more than 1.3 million people. <a href="https://dualr.hainingwang.org">DualR</a>' },
    { draw: scale, label: "A level balance with three weights on each pan",
      note: 'Six LLMs answered library patrons who differed in race, sex and role: no differentiation by race or ethnicity, minor bias against women in one model. <a href="https://doi.org/10.1057/s41599-026-08465-5">Fairness audit</a>' },
    { draw: paper, label: "A 1912 newspaper page in vertical columns of Chinese characters, titled 望华国篇 and signed 独应",
      note: 'Signed 独应 (Du Ying) in 1912, &lsquo;Looking at the Country of China&rsquo; was written by Lu Xun. <a href="https://doi.org/10.1093/llc/fqae084">Du Ying</a>' },
    { draw: fingerprint, label: "A fingerprint spelled in the words the, of, and, to, a",
      note: 'The, of, and: small words no one chooses on purpose add up to a writer&rsquo;s fingerprint. <a href="/teaching/stylometry/">Stylometry lab</a>' },
    { draw: calendar, needs: "cal", label: "A year of bioRxiv preprints, one mark per day",
      note: 'Every new bioRxiv preprint of 2025, one mark per day; bigger marks, busier days. Crosses: NIH R01 due dates. In the four weeks before each (colored), the US share of preprints rises 2.3 to 2.7 percentage points. <a href="https://doi.org/10.64898/2026.10.10.758253">Zeitgeber</a>' }
  ];

  function mount() {
    var host = document.querySelector("aside .sidebar-inner");
    if (!host || !window.SVGElement) return;
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    var i = ((day % PLATES.length) + PLATES.length) % PLATES.length;
    try { var q = new URLSearchParams(location.search).get("plate"); if (q !== null && PLATES[+q]) i = +q; } catch (e) {}
    var P = PLATES[i];
    var fig = document.createElement("figure"); fig.className = "plate";
    // Highlight color: the palette's pop color unless it is too close to the sidebar; then its light selection tint.
    try {
      var cs = getComputedStyle(document.documentElement), bg = lum(cs.getPropertyValue("--pal-sidebar"));
      var cand = ["--pal-pop", "--pal-selection"].map(function (v) { return cs.getPropertyValue(v).trim(); }).filter(Boolean);
      for (var k = 0; k < cand.length; k++) {
        var L = lum(cand[k]), ratio = (Math.max(L, bg) + 0.05) / (Math.min(L, bg) + 0.05);
        if (ratio >= 2.4) { fig.style.setProperty("--pl-hi", cand[k]); fig.style.setProperty("--pl-hi-ink", L > 0.4 ? "#1a1a1a" : "#fff"); break; }
      }
    } catch (e) {}
    var svg = el("svg", { role: "img", "aria-label": P.label }, fig);
    var cap = document.createElement("figcaption"); cap.innerHTML = '<span class="pl-n">[' + (i + 1) + "]</span> " + P.note;
    fig.appendChild(cap);
    function render(t) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var dim = P.draw(svg, t || 0);
      svg.setAttribute("viewBox", "0 0 " + dim.cols * S + " " + dim.rows * S);
    }
    function go() {
      render(0); host.appendChild(fig);
      if (P.animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var t = 0;
        setInterval(function () { if (!document.hidden && fig.offsetParent) { t += 0.35; render(t); } }, 160);
      }
    }
    if (P.needs === "cal") {
      fetch("/static/plates-data.json").then(function (r) { return r.json(); })
        .then(function (j) { CAL = j; go(); }).catch(function () {});
    } else go();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
