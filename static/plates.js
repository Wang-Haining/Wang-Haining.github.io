// Plate of the hour: a small glyph mosaic at the foot of the sidebar, built from real material in Haining's work.
// One plate per local hour, like the palette (preview any with ?plate=N). Glyphs are white on the palette's sidebar color; highlights
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
    } else if (kind === "char") {
      var tc = el("text", { x: cx, y: cy + 3.4, fill: hi ? "var(--pl-hi, var(--pal-pop, #ffd23f))" : "rgba(255,255,255,0.92)", style: "font-size:10px" }, g);
      tc.textContent = ch;
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
  // Background washes and beams, drawn under the glyphs (white at low opacity, like light or water).
  var gid = 0;
  function wash(g, tag, attrs, op) { attrs.fill = "rgba(255,255,255," + op + ")"; return el(tag, attrs, g); }
  function beam(g, points, x1, y1, x2, y2, op) { // a polygon fading from opacity op to 0 along (x1,y1)->(x2,y2)
    var id = "plg" + (++gid), defs = el("defs", {}, g);
    var lg = el("linearGradient", { id: id, gradientUnits: "userSpaceOnUse", x1: x1, y1: y1, x2: x2, y2: y2 }, defs);
    el("stop", { offset: "0", "stop-color": "#fff", "stop-opacity": op }, lg);
    el("stop", { offset: "1", "stop-color": "#fff", "stop-opacity": 0 }, lg);
    return el("polygon", { points: points, fill: "url(#" + id + ")" }, g);
  }
  function glow(g, cx, cy, r, op) {
    var id = "plg" + (++gid), defs = el("defs", {}, g);
    var rg = el("radialGradient", { id: id, cx: cx, cy: cy, r: r, gradientUnits: "userSpaceOnUse" }, defs);
    el("stop", { offset: "0", "stop-color": "#fff", "stop-opacity": op }, rg);
    el("stop", { offset: "1", "stop-color": "#fff", "stop-opacity": 0 }, rg);
    return el("circle", { cx: cx, cy: cy, r: r, fill: "url(#" + id + ")" }, g);
  }
  function water(g, y, W, H) { // a water band from y down, with a few ripple lines
    wash(g, "rect", { x: 0, y: y, width: W, height: (H || 210) - y }, 0.07);
    for (var k = 0; k < 4; k++) {
      var yy = y + 8 + k * 11, d = "M0 " + yy;
      for (var t = 0; t <= W; t += 10) d += " L" + t + " " + (yy + 2 * Math.sin(t / 12 + k));
      el("path", { d: d, fill: "none", stroke: "rgba(255,255,255," + (0.16 - k * 0.03) + ")", "stroke-width": 1.2 }, g);
    }
  }

  function frame(t) { return Math.round((t || 0) / 0.35); } // animation frame, about 6 per second

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
          if (kind === "tile" && ly.chars) { ch = ly.charFn ? ly.charFn(n, q, r) : ly.chars[n % ly.chars.length]; n++; }
          glyph(g, q, r, kind, ch, ly.hi);
          done = true;
        } else if (ly.edge !== false && c > 0.12 && u < 0.55) { glyph(g, q, r, "dot", "", ly.hi); done = true; }
      }
      if (!done && rnd(r, q, seed + 7) < 0.035) el("rect", { x: q * S + 4, y: r * S + 4, width: 2, height: 2, "class": "pl-bg" }, g);
    }
  }

  // ── Plate 1: Under Five. The elephant; its trunk, the fifth parameter, wiggles. ──
  function elephant(svg, t) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg);
    wash(bg, "ellipse", { cx: 176, cy: 200, rx: 112, ry: 8 }, 0.1);
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

  // ── Ivory tower: built from the letters of "jargon"; six steps light up one by one, coming down to the door. ──
  function tower(svg, t) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg), f = frame(t);
    var lit = t ? Math.floor(f / 4) % 9 : 9; // still frame: all six lit
    glow(bg, 236, 52, 70, 0.16); wash(bg, "circle", { cx: 236, cy: 52, r: 24 }, 0.1);
    var body = coverage(cols, rows, function (x) {
      x.fillRect(110, 52, 82, 146);
      x.fillRect(98, 38, 106, 18);
      [98, 128, 158, 188].forEach(function (m) { x.fillRect(m, 22, 16, 18); });
      x.globalCompositeOperation = "destination-out";
      x.fillRect(140, 162, 22, 36);
      x.fillRect(142, 78, 18, 22); x.fillRect(142, 116, 18, 22);
    });
    var on = coverage(cols, rows, function (x) { for (var k = 0; k < 6; k++) if (k < lit) x.fillRect(84 - k * 14, 62 + k * 24, 26, 10); });
    var off = coverage(cols, rows, function (x) { for (var k = 0; k < 6; k++) if (k >= lit) x.fillRect(84 - k * 14, 62 + k * 24, 26, 10); });
    var ground = coverage(cols, rows, function (x) { x.fillRect(0, 200, 300, 10); });
    mosaic(g, cols, rows, [
      { cov: on, hi: true, edge: false, mix: [["tile", 1]] },
      { cov: off, edge: false, mix: [["ring", 1]] },
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

  // ── Library fairness: a balance with three weights (one per model) on each pan; it wobbles, then settles level. ──
  function scale(svg, t) {
    var cols = 30, rows = 21, g = el("g", {}, svg), f = frame(t), p = f % 64;
    var a = t ? 0.16 * Math.exp(-p / 14) * Math.sin(p * 0.75) : 0; // beam angle: a damped wobble that comes to rest
    function at(dx) { return [150 + dx * Math.cos(a), 45 + dx * Math.sin(a)]; }
    var stand = coverage(cols, rows, function (x) {
      x.fillRect(144, 44, 12, 146);
      x.beginPath(); x.moveTo(104, 202); x.lineTo(196, 202); x.lineTo(170, 184); x.lineTo(130, 184); x.closePath(); x.fill();
      x.beginPath(); x.arc(150, 34, 9, 0, 7); x.fill();
    });
    var arms = coverage(cols, rows, function (x) {
      x.save(); x.translate(150, 45); x.rotate(a); x.fillRect(-110, -5, 220, 10); x.restore();
      x.lineWidth = 8; x.lineCap = "round";
      [-100, 100].forEach(function (dx) {
        var e = at(dx);
        x.beginPath(); x.moveTo(e[0], e[1]); x.lineTo(e[0] - 30, e[1] + 72); x.moveTo(e[0], e[1]); x.lineTo(e[0] + 30, e[1] + 72); x.stroke();
        x.beginPath(); x.moveTo(e[0] - 48, e[1] + 72); x.lineTo(e[0] + 48, e[1] + 72); x.lineTo(e[0] + 30, e[1] + 92); x.lineTo(e[0] - 30, e[1] + 92); x.closePath(); x.fill();
      });
    });
    var weights = coverage(cols, rows, function (x) {
      [-100, 100].forEach(function (dx) { var e = at(dx); [[-12, 62], [12, 62], [0, 46]].forEach(function (o) { x.beginPath(); x.arc(e[0] + o[0], e[1] + o[1], 7, 0, 7); x.fill(); }); });
    });
    mosaic(g, cols, rows, [
      { cov: weights, hi: true, mix: [["disc", 1]] },
      { cov: arms, mix: [["tile", 22], ["disc", 26], ["ring", 16], ["diamond", 12], ["plus", 12], ["dot", 12]] },
      { cov: stand, mix: [["tile", 22], ["disc", 26], ["ring", 16], ["diamond", 12], ["plus", 12], ["dot", 12]] }
    ], 53);
    return { cols: cols, rows: rows };
  }

  // ── Du Ying: the 1912 newspaper page, set in vertical columns read right to left. The first column, in the pop
  //    color, is the title and signature (望华国篇, 独应); the rest are the function characters Lu Xun used more. ──
  function paper(svg, t) {
    var cols = 30, rows = 21, g = el("g", {}, svg), body = "之而不于则是矣", n = 0, idx = 0;
    var shown = t ? (frame(t) % 110) * 2.4 : 1e9; // cells typeset so far, column by column from the right
    var title = "望华国篇", sign = "独应", len = [19, 17, 19, 18, 19, 14, 19, 19, 16, 19, 12];
    for (var c = 0; c < len.length; c++) {
      var q = 25 - c * 2;
      for (var r = 1; r <= len[c]; r++) {
        var u = rnd(q, r, 81);
        if (idx++ > shown) continue;
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

  // ── Authorship: a tilted loop fingerprint, every ridge spelled out in glyphs (the, of, and, to, a), core in the pop color.
  //    Ridges follow a core-and-delta orientation field (evenly spaced streamlines), two grid cells apart on a 53 x 37 grid. ──
  function fingerprint(svg, t) {
    var COLS = 53, ROWS = 37, K = 1.325, OX = 265, OY = 188, SEP = 15;
    var bg = el("g", {}, svg), g = el("g", {}, svg), ridges = [], bins = {}, seeds = [], seen = {};
    var ca = Math.cos(25 * Math.PI / 180), sa = Math.sin(25 * Math.PI / 180), core = [8, -30], delta = [-44, 48];
    function turn(p) { return [OX + K * (p[0] * ca - p[1] * sa), OY + K * (p[0] * sa + p[1] * ca)]; }
    function inPad(p) { return p[0] * p[0] / 10000 + p[1] * p[1] / 16384 <= 1; }
    function direction(p, v) {
      var a = 0.5 * (Math.atan2(p[1] - core[1], 2 * (p[0] - core[0])) - Math.atan2(p[1] - delta[1], 2 * (p[0] - delta[0]))) + 0.46;
      a = Math.atan2(2 * Math.sin(a), Math.cos(a));
      var w = Math.max(0, Math.min(0.85, (-p[1] - 35) / 90)), arch = Math.atan(0.018 * p[0]);
      a = 0.5 * Math.atan2((1 - w) * Math.sin(2 * a) + w * Math.sin(2 * arch), (1 - w) * Math.cos(2 * a) + w * Math.cos(2 * arch));
      var u = [Math.cos(a), Math.sin(a)];
      return v && u[0] * v[0] + u[1] * v[1] < 0 ? [-u[0], -u[1]] : u;
    }
    function near(p, d) {
      var bx = Math.floor(p[0] / SEP), by = Math.floor(p[1] / SEP);
      for (var x = bx - 1; x <= bx + 1; x++) for (var y = by - 1; y <= by + 1; y++) {
        var cell = bins[x + "," + y] || [];
        for (var j = 0; j < cell.length; j++) if (Math.pow(p[0] - cell[j][0], 2) + Math.pow(p[1] - cell[j][1], 2) < d * d) return true;
      }
      return false;
    }
    function trace(seed, sign) {
      var pts = [], p = seed, v = direction(p).map(function (x) { return x * sign; });
      for (var i = 0; i < 400; i++) {
        v = direction(p, v);
        var u = direction([p[0] + v[0], p[1] + v[1]], v), next = [p[0] + 2 * u[0], p[1] + 2 * u[1]];
        if (!inPad(next) || near(next, SEP * 0.72) || Math.hypot(next[0] - core[0], next[1] - core[1]) < 5 || Math.hypot(next[0] - delta[0], next[1] - delta[1]) < 5) break;
        if (pts.length > 20 && pts.some(function (q, j) { return j < pts.length - 16 && Math.hypot(q[0] - next[0], q[1] - next[1]) < 4; })) break;
        pts.push(next); p = next; v = u;
      }
      return pts;
    }
    function plant(seed) {
      if (!inPad(seed) || near(seed, SEP * 0.95)) return;
      var pts = trace(seed, -1).reverse().concat([seed], trace(seed, 1));
      if (pts.length < 8) return;
      ridges.push(pts);
      pts.forEach(function (p, i) {
        var key = Math.floor(p[0] / SEP) + "," + Math.floor(p[1] / SEP);
        (bins[key] = bins[key] || []).push(p);
        if (i % 5 === 0) { var v = direction(p); seeds.push([p[0] - SEP * v[1], p[1] + SEP * v[0]], [p[0] + SEP * v[1], p[1] - SEP * v[0]]); }
      });
    }
    for (var top = -35; top > -128; top -= SEP) seeds.push([8, top]);
    for (var i = 0; i < seeds.length; i++) plant(seeds[i]);
    for (var yy = -120; yy <= 120; yy += 7) for (var xx = -96; xx <= 96; xx += 7) plant([xx, yy]);
    wash(bg, "ellipse", { cx: OX, cy: OY, rx: 100 * K, ry: 128 * K, transform: "rotate(25 " + OX + " " + OY + ")" }, 0.05);
    var words = "theofandtoa", n = 0, scan = (frame(t) % 52) - 4; // the scan line's row
    var c0 = turn(core), cq = Math.floor(c0[0] / S), cr = Math.floor(c0[1] / S);
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(function (o) { seen[(cq + o[0]) + "," + (cr + o[1])] = 1; glyph(g, cq + o[0], cr + o[1], "tile", "", true); });
    ridges.forEach(function (pts, k) {
      pts.forEach(function (p) {
        var q = turn(p), c = Math.floor(q[0] / S), r = Math.floor(q[1] / S), key = c + "," + r;
        if (seen[key]) return; seen[key] = 1;
        glyph(g, c, r, k % 2 ? "char" : "tile", words[n++ % words.length], t > 0 && Math.abs(r - scan) <= 1); // one style per ridge
      });
    });
    return { cols: COLS, rows: ROWS };
  }

  // ── Golden ticket: a ticket in the pop color; its letters spin like a lottery reel and settle on "lottery". ──
  function ticket(svg, t) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg), f = frame(t), word = "lottery";
    var p = t ? f % 70 : 69; // still frame: settled
    beam(bg, "130 0 170 0 290 210 10 210", 150, 0, 150, 210, 0.14);
    var body = coverage(cols, rows, function (x) {
      x.fillRect(20, 44, 260, 122);
      x.globalCompositeOperation = "destination-out";
      [[20, 105], [280, 105]].forEach(function (c) { x.beginPath(); x.arc(c[0], c[1], 24, 0, 7); x.fill(); });
      x.fillRect(210, 44, 10, 122);
      x.fillRect(50, 74, 140, 2);
    });
    var perf = coverage(cols, rows, function (x) { x.fillRect(210, 44, 10, 122); });
    mosaic(g, cols, rows, [
      { cov: perf, edge: false, mix: [["dot", 1]] },
      { cov: body, hi: true, chars: word, edge: false, mix: [["tile", 70], ["disc", 14], ["ring", 6], ["dot", 10]],
        charFn: function (n, q) { // each column stops spinning a little later than the one to its left
          return p < 8 + q * 1.3 ? "abcdefghijklmnopqrstuvwxyz"[Math.floor(rnd(n, f, 93) * 26)] : word[n % word.length]; } }
    ], 91);
    if (t) for (var k = 0; k < 14; k++) { // sparkle in the spotlight
      var u = rnd(k, f, 94), r = Math.floor(rnd(k, f, 95) * 4), q = 13 + Math.round((u - 0.5) * (4 + r * 2));
      glyph(g, q, r, u < 0.5 ? "dot" : "plus", "", false);
    }
    return { cols: cols, rows: rows };
  }

  // ── NIH embargo: a padlock whose body spells "PMC"; the shackle (pop color) springs open and glyph rays spread out. ──
  function padlock(svg, t) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg), f = frame(t);
    var p = t ? f % 48 : 47, lift = p < 10 ? 0 : Math.min(1, (p - 10) / 4); // closed, then open
    var body = coverage(cols, rows, function (x) {
      x.fillRect(84, 96, 132, 104);
      x.globalCompositeOperation = "destination-out";
      x.beginPath(); x.arc(150, 136, 11, 0, 7); x.fill(); x.fillRect(145, 136, 10, 34);
    });
    var shackle = coverage(cols, rows, function (x) {
      var up = 18 * lift;
      x.lineWidth = 18; x.lineCap = "butt"; x.beginPath();
      x.moveTo(110, 96); x.lineTo(110, 52 - up); x.arc(150, 52 - up, 40, Math.PI, 0); x.lineTo(190, lift ? 70 - up : 96); x.stroke();
    });
    mosaic(g, cols, rows, [
      { cov: shackle, hi: true, mix: [["tile", 50], ["disc", 30], ["dot", 20]] },
      { cov: body, chars: "PMC", mix: [["tile", 48], ["disc", 18], ["ring", 12], ["diamond", 8], ["plus", 6], ["dot", 8]] }
    ], 101);
    if (lift === 1) { // rays: glyphs moving outward along five directions
      var reach = t ? (p - 14) * 9 : 200;
      [-2.6, -2.05, -1.57, -1.09, -0.54].forEach(function (a, k) {
        for (var d = 70; d < Math.min(reach + 70, 230); d += 14) {
          var x = 150 + Math.cos(a) * d, y = 92 + Math.sin(a) * d, q = Math.floor(x / S), r = Math.floor(y / S);
          if (q < 0 || q >= cols || r < 0) continue;
          var tip = t && d + 14 >= reach + 70;
          glyph(g, q, r, tip ? "plus" : (d / 14 + k) % 2 ? "dot" : "ring", "", tip);
        }
      });
    }
    return { cols: cols, rows: rows };
  }

  // ── NSF newcomers: ten doorways, three of them shut; light falls through the open ones. ──
  function doors(svg) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg), shut = [1, 5, 8];
    for (var d = 0; d < 10; d++) {
      var q0 = 1 + (d % 5) * 6, r0 = d < 5 ? 1 : 11, closed = shut.indexOf(d) >= 0;
      if (!closed) {
        var x0 = q0 * S, x1 = (q0 + 4) * S, yb = (r0 + 9) * S;
        beam(bg, x0 + " " + yb + " " + x1 + " " + yb + " " + (x1 + 9) + " " + (yb + 10) + " " + (x0 - 9) + " " + (yb + 10), 0, yb, 0, yb + 10, 0.3);
        wash(bg, "rect", { x: x0 + 6, y: (r0 + 1) * S, width: 28, height: 80 }, 0.06);
      }
      for (var r = r0; r < r0 + 9; r++) for (var q = q0; q < q0 + 4; q++) {
        var edge = q === q0 || q === q0 + 3 || r === r0, u = rnd(q, r, 111);
        if (closed) glyph(g, q, r, (q === q0 + 2 && r === r0 + 5) ? "dot" : "tile", "", false);
        else if (edge) glyph(g, q, r, u < 0.5 ? "tile" : "disc", "", false);
        else if (r > r0 + 2) glyph(g, q, r, u < 0.55 ? "disc" : u < 0.8 ? "ring" : "dot", "", true);
      }
    }
    return { cols: cols, rows: rows };
  }

  // ── Still funded, no longer counted: five-bar tally gates drawn stroke by stroke; once all are counted, three gates
  //    turn hollow: still there, no longer counted. ──
  function tally(svg, t) {
    var cols = 30, rows = 21, g = el("g", {}, svg), lost = [1, 5, 6], f = frame(t);
    var p = t ? f % 96 : 95, drawn = Math.floor(p / 1.5), done = p >= 72;
    for (var k = 0; k < 9; k++) {
      var q0 = 1 + (k % 3) * 10, r0 = 1 + Math.floor(k / 3) * 7, gone = done && lost.indexOf(k) >= 0, slash = {};
      var have = Math.max(0, Math.min(5, drawn - k * 5)); // strokes of this gate drawn so far (4 bars, then the slash)
      for (var m = 0; m <= 8; m++) slash[(q0 + m) + "," + Math.round(r0 + 5 - m * 5 / 8)] = 1;
      for (var q = q0; q <= q0 + 8; q++) for (var r = r0; r <= r0 + 5; r++) {
        var b = (q - q0 - 1) / 2, bar = (q - q0) % 2 === 1 && q - q0 <= 7 && b < have, onSlash = slash[q + "," + r] && have === 5;
        if (onSlash) glyph(g, q, r, gone ? "ring" : "tile", "", gone);
        else if (bar) glyph(g, q, r, gone ? "ring" : (rnd(q, r, 121) < 0.55 ? "tile" : "disc"), "", gone);
      }
    }
    return { cols: cols, rows: rows };
  }

  // ── DHQ recommender: a constellation of articles; one in the pop color, linked to its five nearest. ──
  function stars(svg, t) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg), P = [], k, j;
    for (k = 0; k < 40; k++) P.push([1 + Math.floor(rnd(k, 1, 131) * 28), 1 + Math.floor(rnd(k, 2, 131) * 19)]);
    var hub = 0, best = 1e9;
    P.forEach(function (p, i) { var d = Math.pow(p[0] - 15, 2) + Math.pow(p[1] - 10, 2); if (d < best) { best = d; hub = i; } });
    function line(a, b, hi) {
      var n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
      for (var s = 1; s < n; s++) glyph(g, Math.round(a[0] + (b[0] - a[0]) * s / n), Math.round(a[1] + (b[1] - a[1]) * s / n), "dot", "", hi);
    }
    for (k = 0; k < P.length; k++) {
      var near = P.map(function (p, i) { return [Math.pow(p[0] - P[k][0], 2) + Math.pow(p[1] - P[k][1], 2), i]; })
        .sort(function (a, b) { return a[0] - b[0]; });
      if (k !== hub && rnd(k, 3, 131) < 0.8 && near[1][0] < 90) line(P[k], P[near[1][1]], false);
    }
    var hubNear = P.map(function (p, i) { return [Math.pow(p[0] - P[hub][0], 2) + Math.pow(p[1] - P[hub][1], 2), i]; })
      .filter(function (x) { return x[0] >= 16; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 5).map(function (x) { return x[1]; });
    var links = t ? Math.min(5, Math.floor((frame(t) % 48) / 6)) : 5;
    hubNear.forEach(function (i, m) { if (m < links) line(P[hub], P[i], true); });
    glow(bg, P[hub][0] * S + 5, P[hub][1] * S + 5, 80, 0.16);
    P.forEach(function (p, i) {
      var u = rnd(i, 4, 131);
      if (i === hub) glyph(g, p[0], p[1], "tile", "", true);
      else {
        var lit = hubNear.indexOf(i) >= 0 && hubNear.indexOf(i) < links, tw = t && rnd(i, frame(t), 132) < 0.12; // twinkle
        glyph(g, p[0], p[1], tw ? "dot" : lit ? "disc" : u < 0.35 ? "plus" : u < 0.7 ? "disc" : "ring", "", lit);
      }
    });
    return { cols: cols, rows: rows };
  }

  // ── Adversarial stylometry: a chameleon on a branch, spelled "obfuscate"; the curled tail in the pop color. ──
  function chameleon(svg) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg);
    var body = coverage(cols, rows, function (x) {
      x.beginPath(); x.ellipse(150, 102, 70, 40, -0.05, 0, 7); x.fill();
      for (var c = 0; c < 6; c++) { x.beginPath(); x.moveTo(96 + c * 20, 72 - (c > 0 && c < 5 ? 6 : 0)); x.lineTo(106 + c * 20, 52 - (c > 0 && c < 5 ? 6 : 0)); x.lineTo(116 + c * 20, 72 - (c > 0 && c < 5 ? 6 : 0)); x.fill(); }
      x.beginPath(); x.moveTo(200, 70); x.lineTo(268, 98); x.lineTo(214, 132); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(196, 70); x.lineTo(214, 46); x.lineTo(232, 80); x.closePath(); x.fill();
      x.lineWidth = 12; x.lineCap = "round";
      [[118, 134, 104, 170], [178, 134, 194, 170]].forEach(function (l) { x.beginPath(); x.moveTo(l[0], l[1]); x.lineTo(l[2], l[3]); x.stroke(); });
      x.globalCompositeOperation = "destination-out"; x.beginPath(); x.arc(232, 94, 13, 0, 7); x.fill();
    });
    var tail = coverage(cols, rows, function (x) {
      x.lineWidth = 11; x.lineCap = "round"; x.beginPath(); x.moveTo(90, 112);
      for (var a = 0; a <= 7.4; a += 0.08) { var r = 52 - a * 5.6; x.lineTo(62 + r * Math.cos(-0.35 - a), 150 + r * Math.sin(-0.35 - a)); }
      x.stroke();
    });
    var branch = coverage(cols, rows, function (x) { x.fillRect(20, 172, 270, 10); });
    [[40, 40, 26, 12, -0.5], [250, 30, 30, 13, 0.4], [282, 150, 22, 10, -0.3], [120, 196, 28, 10, 0.2]].forEach(function (l) {
      wash(bg, "ellipse", { cx: l[0], cy: l[1], rx: l[2], ry: l[3], transform: "rotate(" + l[4] * 57 + " " + l[0] + " " + l[1] + ")" }, 0.08);
    });
    mosaic(g, cols, rows, [
      { cov: tail, hi: true, edge: false, mix: [["tile", 60], ["disc", 40]] },
      { cov: body, chars: "obfuscate", mix: [["tile", 46], ["disc", 18], ["ring", 12], ["diamond", 8], ["plus", 8], ["dot", 8]] },
      { cov: branch, mix: [["dot", 50], ["plus", 25], ["ring", 25]] }
    ], 141);
    el("circle", { cx: 232, cy: 94, r: 10, "class": "pl-rh", style: "stroke-width:3" }, g); // the turret eye
    el("circle", { cx: 235, cy: 94, r: 3.6, "class": "pl-h" }, g);
    return { cols: cols, rows: rows };
  }

  // ── NovEval: a platypus, the classic odd combination; the bill in the pop color, the body spelled "surprise". ──
  function platypus(svg) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg);
    water(bg, 132, 300);
    var body = coverage(cols, rows, function (x) {
      x.beginPath(); x.ellipse(150, 110, 78, 36, 0, 0, 7); x.fill();
      x.beginPath(); x.arc(226, 102, 26, 0, 7); x.fill();
      x.beginPath(); x.ellipse(60, 118, 38, 18, 0.1, 0, 7); x.fill();
      [[104, 142], [128, 142], [178, 142], [202, 142]].forEach(function (f) { x.fillRect(f[0], f[1], 12, 18); x.fillRect(f[0] - 6, f[1] + 16, 24, 8); });
      x.globalCompositeOperation = "destination-out"; x.beginPath(); x.arc(230, 92, 5, 0, 7); x.fill();
    });
    var bill = coverage(cols, rows, function (x) {
      x.beginPath(); x.moveTo(246, 92); x.lineTo(286, 90); x.quadraticCurveTo(298, 104, 286, 118); x.lineTo(246, 116); x.closePath(); x.fill();
    });
    mosaic(g, cols, rows, [
      { cov: bill, hi: true, edge: false, mix: [["tile", 1]] },
      { cov: body, chars: "surprise", mix: [["tile", 46], ["disc", 18], ["ring", 12], ["diamond", 8], ["plus", 8], ["dot", 8]] }
    ], 151);
    return { cols: cols, rows: rows };
  }

  // ── Prestige before the prize: a peacock in full display; the eyes of the train in the pop color. ──
  function peacock(svg) {
    var cols = 30, rows = 21, g = el("g", {}, svg);
    var fan = coverage(cols, rows, function (x) {
      x.beginPath(); x.moveTo(150, 168); x.ellipse(150, 168, 140, 150, 0, Math.PI, 2 * Math.PI); x.closePath(); x.fill();
    });
    var eyes = coverage(cols, rows, function (x) {
      [[124, 9], [88, 7], [54, 5]].forEach(function (ring) {
        for (var i = 0; i < ring[1]; i++) {
          var a = Math.PI + (i + 0.5) * Math.PI / ring[1];
          x.beginPath(); x.arc(150 + Math.cos(a) * ring[0] * 1.05, 168 + Math.sin(a) * ring[0] * 1.05, 9, 0, 7); x.fill();
        }
      });
    });
    var bird = coverage(cols, rows, function (x) {
      x.beginPath(); x.ellipse(150, 150, 18, 30, 0, 0, 7); x.fill();
      x.fillRect(144, 92, 12, 40); x.beginPath(); x.arc(150, 86, 10, 0, 7); x.fill();
      x.lineWidth = 5; x.beginPath(); x.moveTo(142, 178); x.lineTo(136, 204); x.moveTo(158, 178); x.lineTo(164, 204); x.stroke();
    });
    var crest = coverage(cols, rows, function (x) { [[140, 64], [150, 60], [160, 64]].forEach(function (c) { x.beginPath(); x.arc(c[0], c[1], 4, 0, 7); x.fill(); }); });
    mosaic(g, cols, rows, [
      { cov: bird, chars: "prestige", edge: false, mix: [["tile", 1]] },
      { cov: crest, edge: false, mix: [["disc", 1]] },
      { cov: eyes, hi: true, edge: false, mix: [["disc", 60], ["ring", 40]] },
      { cov: fan, edge: false, mix: [["dot", 62], ["plus", 12], ["ring", 14], ["diamond", 6], ["disc", 6]] }
    ], 161);
    return { cols: cols, rows: rows };
  }

  // ── K23: a mother duck leading three ducklings across the water; the ducklings in the pop color. ──
  //    A finer 40 x 28 grid, so the heads and bills read.
  function ducks(svg, t) {
    var cols = 40, rows = 28, bg = el("g", {}, svg), g = el("g", {}, svg), wl = 222, W = wl, f = frame(t);
    water(bg, wl, 400, 280);
    function duck(x, cx, k) { // side view facing right, floating on the waterline
      x.beginPath();
      x.moveTo(cx - 52 * k, wl - 30 * k);
      x.quadraticCurveTo(cx - 46 * k, wl, cx - 26 * k, wl);
      x.lineTo(cx + 30 * k, wl);
      x.quadraticCurveTo(cx + 46 * k, wl - 4 * k, cx + 36 * k, wl - 24 * k);
      x.quadraticCurveTo(cx + 4 * k, wl - 30 * k, cx - 52 * k, wl - 30 * k);
      x.fill();
      x.fillRect(cx + 16 * k, wl - 44 * k, 18 * k, 24 * k);
      x.beginPath(); x.arc(cx + 26 * k, wl - 50 * k, 16 * k, 0, 7); x.fill();
      x.beginPath(); x.moveTo(cx + 38 * k, wl - 56 * k); x.quadraticCurveTo(cx + 66 * k, wl - 54 * k, cx + 64 * k, wl - 44 * k);
      x.lineTo(cx + 38 * k, wl - 42 * k); x.closePath(); x.fill();
    }
    var mom = coverage(cols, rows, function (x) {
      duck(x, 296, 1.6);
      x.globalCompositeOperation = "destination-out"; x.beginPath(); x.arc(296 + 30 * 1.6, wl - 54 * 1.6, 5, 0, 7); x.fill();
    });
    var kids = coverage(cols, rows, function (x) { // each duckling bobs a little, in turn
      [30, 96, 162].forEach(function (cx, i) { wl = W - (t ? 6 * Math.max(0, Math.sin(t * 1.2 - i * 1.1)) : 0); duck(x, cx, 0.64); });
      wl = W;
    });
    mosaic(g, cols, rows, [
      { cov: kids, hi: true, edge: false, mix: [["tile", 64], ["disc", 36]] },
      { cov: mom, chars: "K23", edge: false, mix: [["tile", 52], ["disc", 18], ["ring", 12], ["diamond", 6], ["plus", 6], ["dot", 6]] }
    ], 171);
    for (var r = 23; r < rows; r += 2) for (var q = 0; q < cols; q++) // ripples drifting left
      if ((q + f + r * 3) % 9 === 0) glyph(g, q, r, "char", "~", false);
    return { cols: cols, rows: rows };
  }

  // ── DualReasoning: the hare (fast) and the tortoise (slow); the tortoise's shell in the pop color. ──
  function tortoiseHare(svg, t) {
    var cols = 30, rows = 21, bg = el("g", {}, svg), g = el("g", {}, svg), f = frame(t);
    var hop = t && f % 24 < 8 ? 18 * Math.sin((f % 24) / 8 * Math.PI) : 0; // a quick hop, then a long rest
    var creep = t ? 4 * Math.floor((f % 72) / 8) - 16 : 0;              // the tortoise, step by step
    [[14, 176, 12], [34, 182, 9], [4, 160, 7]].forEach(function (c) { wash(bg, "circle", { cx: c[0], cy: c[1], r: c[2] }, 0.1); });
    var hare = coverage(cols, rows, function (x) {
      x.translate(0, -hop);
      x.beginPath(); x.ellipse(80, 108, 44, 24, -0.25, 0, 7); x.fill();
      x.beginPath(); x.arc(122, 80, 16, 0, 7); x.fill();
      x.lineWidth = 10; x.lineCap = "round";
      x.beginPath(); x.moveTo(118, 66); x.lineTo(104, 22); x.moveTo(128, 66); x.lineTo(132, 20); x.stroke();
      x.beginPath(); x.moveTo(52, 118); x.lineTo(20, 140); x.moveTo(104, 116); x.lineTo(132, 136); x.stroke();
      x.beginPath(); x.arc(38, 100, 9, 0, 7); x.fill();
      x.globalCompositeOperation = "destination-out"; x.beginPath(); x.arc(126, 76, 3.5, 0, 7); x.fill();
    });
    var shell = coverage(cols, rows, function (x) { x.translate(creep, 0); x.beginPath(); x.ellipse(214, 168, 54, 40, 0, Math.PI, 2 * Math.PI); x.closePath(); x.fill(); });
    var tortoise = coverage(cols, rows, function (x) {
      x.translate(creep, 0);
      x.beginPath(); x.ellipse(276, 160, 14, 11, 0, 0, 7); x.fill();
      x.fillRect(254, 158, 14, 10);
      [172, 200, 228, 252].forEach(function (lx) { x.fillRect(lx - 6, 166, 12, 20); });
      x.beginPath(); x.moveTo(160, 166); x.lineTo(146, 174); x.lineTo(162, 174); x.fill();
    });
    var ground = coverage(cols, rows, function (x) { x.fillRect(0, 194, 300, 8); });
    mosaic(g, cols, rows, [
      { cov: shell, hi: true, chars: "slow", edge: false, mix: [["tile", 70], ["disc", 30]] },
      { cov: tortoise, edge: false, mix: [["tile", 50], ["disc", 50]] },
      { cov: hare, chars: "fast", mix: [["tile", 46], ["disc", 18], ["ring", 12], ["diamond", 8], ["plus", 8], ["dot", 8]] },
      { cov: ground, mix: [["dot", 60], ["ring", 20], ["disc", 20]] }
    ], 181);
    return { cols: cols, rows: rows };
  }

  // ── Zeitgeber: a year of new bioRxiv preprints, one mark per day (bigger marks, busier days). The four weeks before
  //    each NIH R01 due date are bright and the rest of the year is dimmed; a cursor races through ordinary weeks,
  //    slows down through each four-week window, and the due date (a cross) flashes as it arrives. ──
  var CAL = null; // filled from /static/plates-data.json
  function calendar(svg, t) {
    var dim = el("g", { opacity: 0.38 }, svg), g = el("g", {}, svg), year = CAL.year, counts = CAL.counts, due = CAL.due, f = frame(t);
    var vals = counts.slice().sort(function (a, b) { return a - b; });
    function qt(v) { var lo = 0, hi = vals.length; while (lo < hi) { var m = (lo + hi) >> 1; if (vals[m] < v) lo = m + 1; else hi = m; } return lo / vals.length; }
    var cols = 4 * 7 + 3, rows = 3 * 6 + 2, info = [], total = 0, d;
    for (d = 0; d < counts.length; d++) {
      var date = new Date(year, 0, 1 + d), m = date.getMonth(), wd = (date.getDay() + 6) % 7;
      var first = (new Date(year, m, 1).getDay() + 6) % 7, wk = Math.floor((date.getDate() - 1 + first) / 7);
      var iso = year + "-" + ("0" + (m + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
      var isDue = due.indexOf(iso) >= 0;
      var near = due.some(function (x) { var k = (new Date(x + "T00:00") - date) / 86400000; return k > 0 && k <= CAL.window; });
      var w = isDue ? 14 : near ? 1.6 : 0.22; // time the cursor spends on each day
      info.push({ q: (m % 4) * 8 + wd, r: Math.floor(m / 4) * 7 + wk, due: isDue, near: near, at: total, w: w });
      total += w;
    }
    var pos = t ? (f * 0.9) % (total + 8) : -1, cur = -1;
    for (d = 0; d < info.length; d++) if (pos >= info[d].at && pos < info[d].at + info[d].w) cur = d;
    for (d = 0; d < info.length; d++) {
      var c = info[d], p = qt(counts[d]), kind = p >= 0.9 ? "tile" : p >= 0.65 ? "disc" : p >= 0.35 ? "ring" : "dot";
      if (c.due) {
        var flash = cur === d && f % 2 === 0;
        glyph(g, c.q, c.r, flash || cur > d && cur < d + 6 ? "tile" : "plus", "", true);
      } else if (d === cur || d === cur - 1) glyph(g, c.q, c.r, "tile", "", true);
      else if (c.near) glyph(g, c.q, c.r, kind, "", true);
      else glyph(dim, c.q, c.r, kind, "", false);
    }
    return { cols: cols, rows: rows };
  }

  var PLATES = [
    { draw: elephant, animate: true, label: "An elephant drawn in glyphs; its trunk wiggles",
      note: 'Four parameters fit an elephant; the fifth wiggles its trunk. <a href="/teaching/">Under Five</a>' },
    { draw: tower, animate: true, label: "An ivory tower built from the letters of jargon, with six lit steps down to the door",
      note: 'Rewritten by a language model, scholarly abstracts come down about six US grade levels, from postgraduate to high school. <a href="https://doi.org/10.1007/s11192-025-05386-z">Ivory tower</a>' },
    { draw: capsule, label: "A capsule spelled from the letters of medication list",
      note: 'From the medication list alone, DualR flagged alcohol use disorder more than 300 days before diagnosis, across more than 1.3 million people. <a href="https://dualr.hainingwang.org">DualR</a>' },
    { draw: scale, animate: true, label: "A level balance with three weights on each pan",
      note: 'Six LLMs answered library patrons who differed in race, sex and role: no differentiation by race or ethnicity, minor bias against women in one model. <a href="https://doi.org/10.1057/s41599-026-08465-5">Fairness audit</a>' },
    { draw: paper, animate: true, label: "A 1912 newspaper page in vertical columns of Chinese characters, titled 望华国篇 and signed 独应",
      note: 'Signed 独应 (Du Ying) in 1912, &lsquo;Looking at the Country of China&rsquo; was written by Lu Xun. <a href="https://doi.org/10.1093/llc/fqae084">Du Ying</a>' },
    { draw: fingerprint, animate: true, label: "A fingerprint spelled in the words the, of, and, to, a",
      note: 'The, of, and: small words no one chooses on purpose add up to a writer&rsquo;s fingerprint. <a href="/teaching/stylometry/">Stylometry lab</a>' },
    { draw: ticket, animate: true, label: "A golden ticket spelled in the letters of lottery",
      note: 'On 10,625 rejected conference submissions, the golden ticket picked like a lottery; ranking by the panel mean picked papers cited 7.75 percentile points higher. <a href="https://arxiv.org/abs/2609.19552">Golden ticket</a>' },
    { draw: padlock, animate: true, label: "An open padlock whose body spells PMC",
      note: 'After NIH ended its 12-month embargo, NIH-funded papers in PubMed Central within a week of publication doubled from 11% to 22% in journals outside DOAJ. <a href="https://arxiv.org/abs/2609.14842">Embargo</a>' },
    { draw: doors, label: "Ten doorways, three of them shut",
      note: 'In FY2026 NSF made 30% fewer new research projects; newcomers kept the same share (34.5% to 34.3%), through fewer doors. <a href="https://doi.org/10.31235/osf.io/9qpb7_v1">Newcomers</a>' },
    { draw: tally, animate: true, label: "Nine five-bar tally gates, three of them hollow",
      note: 'NIH&rsquo;s minority health label stayed on 99.4% of projects with unchanged summaries, but on 15.7% of those that no longer named a population; the funding stayed. <a href="https://arxiv.org/abs/2610.03443">Uncounted</a>' },
    { draw: stars, animate: true, label: "A constellation of articles, one linked to its five nearest",
      note: 'Over 750 articles in <i>Digital Humanities Quarterly</i>, each now shown with its nearest neighbors, found three ways. <a href="https://journal.code4lib.org/articles/18501">DHQ recommender</a>' },
    { draw: chameleon, label: "A chameleon on a branch, spelled in the letters of obfuscate",
      note: 'Writers can disguise their style by hand. Replicating Brennan et al. (2012), we reached the same conclusion, but the disguises may work less well than first reported. <a href="https://doi.org/10.17879/replicationresearch-2026-9414">Replication</a>' },
    { draw: platypus, label: "A platypus spelled in the letters of surprise, its bill highlighted",
      note: 'Novelty as an atypical combination of existing knowledge, measured by how surprised a language model is. Think duck bill on a beaver tail. <a href="https://doi.org/10.1007/978-3-031-57867-0_31">NovEval</a>' },
    { draw: peacock, label: "A peacock in full display, the eyes of its train highlighted",
      note: 'Top-journal papers were followed by a new NIH or NSF award twice as often (55.3 vs 26.3 per 1,000), but the gap was as large two years before publication. <a href="https://doi.org/10.31235/osf.io/cf5u8_v1">Prestige</a>' },
    { draw: ducks, animate: true, label: "A mother duck leading three ducklings across the water",
      note: 'After NIH&rsquo;s 2018 K23 trial pathway, awardees led their award&rsquo;s own trial more often (13.7 percentage points), with no detectable gain in leading new trials. <a href="https://doi.org/10.64898/2026.10.09.758109">K23</a>' },
    { draw: tortoiseHare, animate: true, label: "A hare and a tortoise, the tortoise's shell highlighted",
      note: 'Thinking, fast and slow: DualReasoning pulls clinical knowledge out of messy medication records with LLMs. A distinguished poster nominee at AMIA 2025. <a href="https://drive.google.com/file/d/1r9FAD9tLjCtWvCUjI-enLxQ4FxUeflFd/view?usp=sharing">Poster</a>' },
    { draw: calendar, animate: true, needs: "cal", label: "A year of bioRxiv preprints, one mark per day",
      note: 'Every new bioRxiv preprint of 2025, one mark per day. Crosses: NIH R01 due dates. In the four weeks before each (bright), the US share of preprints rises 2.3 to 2.7 percentage points. <a href="https://doi.org/10.64898/2026.10.10.758253">Zeitgeber</a>' }
  ];

  function mount() {
    var host = document.querySelector("aside .sidebar-inner");
    if (!host || !window.SVGElement) return;
    var hour = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 3600000); // same clock as the palette
    var i = ((hour % PLATES.length) + PLATES.length) % PLATES.length;
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
