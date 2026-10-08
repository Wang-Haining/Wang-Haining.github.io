/* Bolaud: a pixel Bobo who lives on top of the "Ask Haining" button.
   Front-view sprites are hand-placed pixel grids (26 x 24); side-view poses come from a small
   posable puppet (body, head, jointed legs, tail) on a 40 x 28 grid. Drawn to a canvas; no images, no libraries. */
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
    H: "#fffaf0", // eye highlight
    C: "#e8d5ae"  // chest: warm cream, a little yellower than the muzzle
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
    ".....OOBLCCCCCCLBOO......."
  ];
  var BODY_SIT = [
    ".....OBSLCCCCCCLSBO.......",
    ".....OSSBLCCCCLBSSO.......",
    "....OBBBBLCCCCLBBBBO......",
    "....OSSSBLLCCLLBSSSO......",
    "....OBBBOBLCCLBOBBBO......",
    "....OBBBOSSOOSSOBBBO......",
    "....OSSSOBBOOBBOSSSO......",
    "....OBBBOSSOOSSOBBBO......",
    "....OBSSOCCOOCCOSSBO......",
    "....OBBBOCCOOCCOBBBO......",
    ".....OOOOOOOOOOOOOO......."
  ];
  // Grooming: right front leg raised to the mouth (rows 17-23 replaced; paw drawn over the muzzle).
  var BODY_GROOM = [
    "....OBBBOBLCCLLBBBBO......",
    "....OBBBOSSOBBBBBBBO......",
    "....OSSSOBBOBSSSBSSO......",
    "....OBBBOSSOBBBBBBBO......",
    "....OBSSOCCOBSSSBSSO......",
    "....OBBBOCCOBBBBBBBO......",
    ".....OOOOOOOOOOOOOO......."
  ];
  var GROOM_PAC = { x: 12, y: 9, rows: [
    ".OOO..",
    "OCCCO.",
    "OCPCO.",
    "OBCCBO",
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
    [[8, 20], [9, 20], [14, 20], [15, 20]].forEach(function (p) { g[p[1]][p[0]] = "C"; });
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
      if (ch !== "." && yy >= 0 && yy < g.length && xx >= 0 && xx < g[0].length) g[yy][xx] = ch;
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
      if (yy >= 0 && yy < GH && xx >= 0 && xx < GW) g[yy][xx] = "C";
    });
  }
  function buildClimb(phase) {
    var g = blank(), y, x, up = phase === 0;
    for (y = 10; y < GH; y++) for (x = 0; x < GW; x++) {
      var d = ((x - 11.5) * (x - 11.5)) / 38 + ((y - 16) * (y - 16)) / 36;
      if (d <= 1) g[y][x] = (x === 11 || x === 12) ? "S" : (y % 3 === 0 ? "S" : "B");
    }
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


  /* ---------- Side view: a small posable puppet ---------- */
  // Everything is authored facing right on a 40 x 28 grid (ground: paws fill rows 25-26, outline row 27),
  // then mirrored for facing left. Each part is rasterized on its own and outlined, back to front.
  var CW = 40, CH = 28;
  COLORS.D = "#6f6253"; // far-side legs, one shade darker
  COLORS.X = "#c9a26b"; // cardboard
  COLORS.Y = "#8f6f45"; // cardboard ridges
  function cblank() { var g = []; for (var y = 0; y < CH; y++) g.push(new Array(CW).fill(".")); return g; }
  function inb(x, y) { return x >= 0 && y >= 0 && x < CW && y < CH; }
  function segDist(px, py, ax, ay, bx, by) {
    var vx = bx - ax, vy = by - ay, wx = px - ax, wy = py - ay, L = vx * vx + vy * vy;
    var t = L ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / L)) : 0;
    var dx = px - (ax + t * vx), dy = py - (ay + t * vy);
    return { d: Math.sqrt(dx * dx + dy * dy), t: t };
  }
  // Thick polyline: pts [[x,y],...], radii per point; color(s) where s = distance along the line from the start.
  function strand(part, pts, radii, color) {
    var lens = [0], i, total = 0;
    for (i = 1; i < pts.length; i++) { total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(total); }
    for (var y = 0; y < CH; y++) for (var x = 0; x < CW; x++) {
      var best = null;
      for (i = 1; i < pts.length; i++) {
        var r = segDist(x + 0.5, y + 0.5, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
        var rad = radii[i - 1] + (radii[i] - radii[i - 1]) * r.t;
        if (r.d <= rad && (!best || r.d - rad < best.k)) best = { k: r.d - rad, s: lens[i - 1] + r.t * (lens[i] - lens[i - 1]) };
      }
      if (best) part[y][x] = color(best.s, total);
    }
  }
  function ringColor(base) {
    return function (s, total) { return total - s < 1.4 ? "C" : (Math.floor(s) % 3 === 2 ? "S" : base); };
  }
  function legPart(leg, far) {
    var part = cblank(), base = far ? "D" : "B";
    strand(part, [leg[0], leg[1], leg[2]], [leg[3] || 1.35, 1.05, 1.0], function (s, total) {
      if (total - s < 1.4) return far ? "L" : "C";
      return Math.floor(s) % 3 === 2 ? "S" : base;
    });
    return part;
  }
  function tailPart(pts) {
    var part = cblank(), radii = pts.map(function (_, i) { return i === 0 ? 1.15 : 0.95; });
    strand(part, pts, radii, function (s, total) { return total - s < 2.2 ? "K" : (Math.floor(s / 1.5) % 2 ? "S" : "B"); });
    return part;
  }
  function bodyPart(b) {
    var part = cblank(), c = Math.cos(b.tilt || 0), sn = Math.sin(b.tilt || 0);
    if (b.curve) { // a bent body (the arched-back stretch)
      strand(part, b.curve, b.curve.map(function () { return b.r; }), function (s) { return Math.floor(s + 0.5) % 4 === 0 ? "S" : "B"; });
      return part;
    }
    for (var y = 0; y < CH; y++) for (var x = 0; x < CW; x++) {
      var dx = x + 0.5 - b.cx, dy = y + 0.5 - b.cy;
      // tilt > 0 lifts the front (right) end
      var u = dx * c - dy * sn, v = dx * sn + dy * c;
      if ((u * u) / (b.rx * b.rx) + (v * v) / (b.ry * b.ry) > 1) continue;
      var ch = "B";
      if (v > b.ry * 0.42) ch = "L";
      else if (v < -b.ry * 0.62) ch = "S";
      else if (Math.floor(u + b.rx + 0.5) % 4 === 0) ch = "S";
      if (u > b.rx * 0.5 && v > -b.ry * 0.05) ch = "C";
      part[y][x] = ch;
    }
    return part;
  }
  // Head: h = {x, y, tilt, eyes, mouth, back (snout points left)}
  // The side head shares the front head's size (model-sheet rule): HS scales the unit head up to match.
  var HS = 1.32;
  var SIDE_EYES = {
    open: ["EE", "EK", "EK"], wide: ["EE", "KK", "EK"], half: ["BB", "OO", "EK"],
    closed: ["BB", "OO", "BB"], happy: ["OB", "BO", "BB"], left: ["EE", "EK", "EK"], right: ["EE", "EK", "EK"]
  };
  function headPart(h) {
    var part = cblank(), dir = h.back ? -1 : 1, c = Math.cos(h.tilt || 0), sn = Math.sin(h.tilt || 0);
    function local(x, y) { // world cell -> unit head coords (facing right, y down)
      var dx = (x + 0.5 - h.x) * dir, dy = y + 0.5 - h.y;
      return [(dx * c + dy * sn * dir) / HS, (-dx * sn * dir + dy * c) / HS];
    }
    function tri(px, py, a, b, d) {
      function sgn(p1, p2, p3) { return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]); }
      var p = [px, py], d1 = sgn(p, a, b), d2 = sgn(p, b, d), d3 = sgn(p, d, a);
      return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
    }
    for (var y = 0; y < CH; y++) for (var x = 0; x < CW; x++) {
      var q = local(x, y), u = q[0], v = q[1], ch = null;
      var inHead = (u * u) / 20.25 + (v * v) / 15.2 <= 1;
      var inSnout = ((u - 3.4) * (u - 3.4)) / 3.6 + ((v - 1.2) * (v - 1.2)) / 2.6 <= 1;
      var earBack = tri(u, v, [-3.6, -1.6], [-0.6, -3.6], [-2.8, -6.9]);
      var earFront = tri(u, v, [-0.2, -3.7], [2.8, -2.4], [1.3, -7.0]);
      if (earBack) ch = "B";
      if (earFront) ch = tri(u, v, [0.55, -3.3], [2.15, -2.75], [1.3, -5.7]) ? "P" : "B";
      if (inHead || inSnout) {
        ch = "B";
        if (v < -2.1 && (Math.abs(u + 1.3) < 0.42 || Math.abs(u - 0.3) < 0.42)) ch = "S";
        if (Math.abs(v - 0.7) < 0.4 && u < -0.9 && u > -3.4) ch = "S";
        if (inSnout && v > 0.5) ch = "W";
        if (u > 1.6 && v > 1.5) ch = "W";
      }
      if (ch) part[y][x] = ch;
    }
    // Features: anchor a unit-head point to a cell, then draw whole-cell patches from it.
    function cell(u, v) {
      var a = Math.cos(h.tilt || 0), b = Math.sin(h.tilt || 0), uu = u * HS, vv = v * HS;
      return [Math.floor(h.x + (uu * a - vv * b) * dir), Math.floor(h.y + uu * b + vv * a)];
    }
    function patch(anchor, rows) {
      rows.forEach(function (row, r) { for (var k = 0; k < row.length; k++) {
        var X = anchor[0] + k * dir, Y = anchor[1] + r;
        if (row[k] !== "." && inb(X, Y)) part[Y][X] = row[k];
      } });
    }
    var e = SIDE_EYES[h.eyes || "open"] || SIDE_EYES.open;
    patch(cell(0.95, -1.15), e);
    patch(cell(4.75, 0.25), ["N"]);
    if (h.mouth === "lick") patch(cell(4.3, 1.95), ["PP"]);
    if (h.mouth === "open") patch(cell(3.4, 1.9), ["OPP"]);
    return part;
  }
  function padPart(x0, x1) {
    var part = cblank();
    for (var y = 24; y <= 26; y++) for (var x = x0; x <= x1; x++) part[y][x] = (y === 24) ? ((x - x0) % 2 ? "Y" : "X") : "X";
    return part;
  }
  // Composite a part: fills overwrite; the part's outline goes on empty cells, or over earlier parts when `over`.
  function put(g, part, over) {
    var y, x;
    for (y = 0; y < CH; y++) for (x = 0; x < CW; x++) if (part[y][x] !== ".") g[y][x] = part[y][x];
    for (y = 0; y < CH; y++) for (x = 0; x < CW; x++) {
      if (part[y][x] !== ".") continue;
      var edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var yy = y + d[1], xx = x + d[0]; return inb(xx, yy) && part[yy][xx] !== "."; });
      if (edge && (g[y][x] === "." || over)) g[y][x] = "O";
    }
  }
  // pose: {prop, farLegs:[leg], tail:[pts], nearLegs:[leg], body:{}, frontLegs:[leg], head:{}}; leg = [hip, knee, paw, hipRadius]
  function sideCat(p) {
    var g = cblank();
    if (p.pad) put(g, padPart(p.pad[0], p.pad[1]), false);
    (p.farLegs || []).forEach(function (l) { put(g, legPart(l, true), false); });
    if (p.tail) put(g, tailPart(p.tail), false);
    (p.nearLegs || []).forEach(function (l) { put(g, legPart(l, false), true); });
    put(g, bodyPart(p.body), false);
    (p.frontLegs || []).forEach(function (l) { put(g, legPart(l, false), true); });
    if (p.head) put(g, headPart(p.head), true);
    if (p.frontHead) {
      var fh = p.frontHead;
      stamp(g, HEAD, fh.x, fh.y);
      stamp(g, EYES[fh.eyes] || EYES.open, fh.x + 6, fh.y + 6);
      stamp(g, (EYES_RIGHT[fh.eyes] || EYES[fh.eyes] || EYES.open), fh.x + 15, fh.y + 6);
      if (fh.blep) stamp(g, ["P"], fh.x + 12, fh.y + 11);
    }
    if (p.afterHead) p.afterHead.forEach(function (l) { put(g, legPart(l, false), true); });
    return g;
  }
  function mirror(g) { return g.map(function (row) { return row.slice().reverse(); }); }

  // Side pose library (facing right). leg = [hip, knee, paw, hipRadius]
  var POSES = (function () {
    var G = 25.5; // paw centre row on the ground
    // Head anchor relative to the shoulders keeps every pose on the same model sheet.
    function walk(k) {
      var nf = [[26.5, G], [24.6, 24.2], [22.2, G], [24.2, G]][k];
      var ff = [[22.2, G], [24.2, G], [26.5, G], [24.6, 24.2]][k];
      var nb = [[12.4, G], [14.6, 24.3], [17, G], [15, G]][k];
      var fb = [[17, G], [15, G], [12.4, G], [14.6, 24.3]][k];
      var bob = k % 2 ? -0.5 : 0, sway = [0, 1, 0, -1][k];
      return {
        farLegs: [[[23.5, 19.5 + bob], [ff[0] - 0.3, 22.5], ff], [[15.5, 20 + bob], [fb[0] - 1.6, 22.8], fb]],
        tail: [[11.5, 17 + bob], [9.6, 15.3], [8.6, 13], [8.8, 10.6], [9.8 + sway, 8.8], [11 + sway, 8]],
        nearLegs: [[[24.5, 19.5 + bob], [nf[0] - 0.2, 22.5], nf, 1.45], [[14.5, 20 + bob], [nb[0] - 1.6, 22.8], nb, 1.55]],
        body: { cx: 19, cy: 18 + bob, rx: 8.2, ry: 4.6, tilt: 0 },
        head: { x: 28.4, y: 12.4 + bob, tilt: 0, eyes: "open" }
      };
    }
    function stand() { var p = walk(0);
      p.farLegs[0][2] = [23.4, G]; p.farLegs[0][1] = [23.4, 22.5]; p.farLegs[1][2] = [16.2, G]; p.farLegs[1][1] = [14.8, 22.8];
      p.nearLegs[0][2] = [25, G]; p.nearLegs[0][1] = [24.9, 22.5]; p.nearLegs[1][2] = [14.4, G]; p.nearLegs[1][1] = [12.9, 22.8];
      return p; }
    function lick(k, opt) { // big chicken-leg crotch lick: hind leg straight up behind, head bowed in front
      var bob = k % 2 ? 0.7 : 0;
      if (opt && opt.freeze) { // caught mid-lick: head turns to the screen, tongue out, leg still up
        return {
          tail: [[12.4, 24.2], [9.4, 25.3], [6.4, 25.5], [3.8, 24.8], [2.6, 23.4]],
          nearLegs: [[[15.6, 20.4], [16.6, 11.4], [17, 1.8], 2.0]],
          farLegs: [[[18.6, 16.8], [20, 21.4], [20.6, G]]],
          body: { cx: 15.8, cy: 20.6, rx: 6, ry: 5.2, tilt: 1.15 },
          frontLegs: [[[15.2, 23.2], [19.2, 24.8], [23.4, G], 1.6], [[19.6, 17], [21.2, 21.4], [22.2, G], 1.35]],
          frontHead: { x: 11, y: 6, eyes: (opt && opt.eyes) || "open", blep: true }
        };
      }
      return {
        tail: [[12.4, 24.2], [9.4, 25.3], [6.4, 25.5], [3.8, 24.8], [2.6, 23.4]],
        nearLegs: [[[15.6, 20.4], [17.4, 12.6], [18.4, 4.6], 2.0]],
        farLegs: [[[18.6, 16.8], [20, 21.4], [20.6, G]]],
        body: { cx: 15.8, cy: 20.6, rx: 6, ry: 5.2, tilt: 1.15 },
        frontLegs: [[[15.2, 23.2], [19.2, 24.8], [23.4, G], 1.6], [[19.6, 17], [21.2, 21.4], [22.2, G], 1.35]],
        head: { x: 22.4, y: 17.6 + bob, tilt: 0.75, back: true, eyes: "closed", mouth: k % 2 ? "lick" : null }
      };
    }
    function scoot(k) { // sitting on the butt, both hind legs splayed forward, front legs pulling
      var a = k % 2;
      return {
        farLegs: [[[21.8, 18.6], [a ? 24.6 : 22.8, 22.2], [a ? 25.6 : 23, G]], [[14.2, 22.4], [18.4, 23.6], [22.2, 24.8]]],
        tail: [[10.4, 23.2], [7.4, 24.4], [4.4, 24.6], [2.2, 23.8]],
        nearLegs: [[[22.8, 18.6], [a ? 22.6 : 24.8, 22.2], [a ? 22.4 : 26, G], 1.45]],
        body: { cx: 16.8, cy: 19.6, rx: 7.2, ry: 4.8, tilt: 0.62 },
        frontLegs: [[[14.6, 22.6], [19.4, 24.6], [24.6, G], 1.7]],
        head: { x: 25.6, y: 11.8, tilt: -0.1, eyes: "half" }
      };
    }
    function bow(k) { // the classic stretch: front legs reaching forward, butt up; k=1 pushes further
      var r = k ? 1.2 : 0;
      return {
        farLegs: [[[13.4, 16.4], [14.4, 20.8], [14.4, G]], [[22.6, 21.4], [28 + r, 24.6], [33 + r, G]]],
        tail: [[10, 13.6], [8.8, 10.6], [9.4, 7.8], [11, 5.8], [12.8, 5.2]],
        nearLegs: [[[12.4, 16.4], [12.8, 20.8], [12.2, G], 1.55], [[21.6, 21.2], [26.6 + r, 24.4], [31.6 + r, G], 1.4]],
        body: { cx: 17.2, cy: 18, rx: 8.4, ry: 4.2, tilt: -0.46 },
        head: { x: 26.4 + r * 0.5, y: 18.6, tilt: 0.12, eyes: "closed", mouth: k ? "open" : null }
      };
    }
    function legBack() { // after the bow: one hind leg stretched out behind
      var p = stand();
      p.nearLegs[1] = [[14.5, 20], [10.6, 21.6], [6.4, 23.4], 1.55];
      p.head.eyes = "closed";
      p.tail = [[11.5, 17], [9.4, 15.8], [8, 13.6], [7.8, 11], [8.6, 9]];
      return p;
    }
    function scratch(k) { // front paws raking a flat cardboard pad
      var a = k % 2;
      return {
        pad: [25, 37],
        farLegs: [[[22.8, 19.6], [a ? 26.4 : 28.6, 22], [a ? 28 : 31.4, 23.4]], [[15.6, 19.8], [14.2, 22.8], [15.6, G]]],
        tail: [[11.4, 16.6], [9.4, 14.6], [8.6, 12], [9.2, 9.6], [10.6, 8.2]],
        nearLegs: [[[23.8, 19.6], [a ? 28.6 : 26.4, 22], [a ? 31.4 : 28, 23.4], 1.45], [[14.6, 19.8], [13, 22.8], [14, G], 1.55]],
        body: { cx: 19, cy: 17.8, rx: 8.2, ry: 4.5, tilt: -0.18 },
        head: { x: 28.2, y: 14.4, tilt: 0.3, eyes: "open" }
      };
    }
    function crouch(k) { // hunting crouch, butt wiggle
      var w = k % 2 ? 0.7 : 0;
      return {
        farLegs: [[[22.6, 21.6], [24.6, 24], [26.2, G]], [[14.6, 21.2 - w], [12.4, 23.6], [15.2, G]]],
        tail: [[10.6, 20 - w], [7.6, 20.4], [5, 20], [2.8, 19.4 - w * 2]],
        nearLegs: [[[23.6, 21.6], [25.6, 24], [27.6, G], 1.4], [[13.6, 21.2 - w], [11.6, 23.6], [14, G], 1.6]],
        body: { cx: 18.4, cy: 21 - w * 0.5, rx: 8.4, ry: 3.8, tilt: -0.04 - w * 0.06 },
        head: { x: 28.2, y: 17.6, tilt: 0, eyes: "wide" }
      };
    }
    function leap() {
      return {
        farLegs: [[[23.6, 17.6], [27.6, 18.4], [31, 19.2]], [[14.2, 18.8], [10.6, 20.6], [7.2, 21.6]]],
        tail: [[10.8, 16.6], [8, 15.4], [5.4, 14.6], [3, 14.6]],
        nearLegs: [[[24.6, 17.8], [28.6, 18.8], [32.2, 19.8], 1.4], [[13.2, 19], [9.6, 21], [6, 22], 1.55]],
        body: { cx: 19, cy: 16.8, rx: 9, ry: 4.1, tilt: 0.08 },
        head: { x: 29, y: 12.2, tilt: -0.05, eyes: "wide" }
      };
    }
    function bat() { var p = stand();
      p.nearLegs[0] = [[24.5, 19.5], [27.6, 19.2], [30.4, 20.6], 1.45];
      p.head.eyes = "wide"; return p; }
    return { walk: walk, stand: stand, lick: lick, scoot: scoot, bow: bow, legBack: legBack, scratch: scratch, crouch: crouch, leap: leap, bat: bat };
  })();

  // One entry point for every frame: pose.side picks a profile pose (with pose.k frame and pose.dir),
  // otherwise the front-view sprite is centred on the larger canvas.
  function frame(p) {
    if (p.side) {
      var sp = POSES[p.side](p.k || 0, p);
      if (p.eyes && sp.head && p.side !== "lick") sp.head.eyes = p.eyes === "happy" ? "closed" : p.eyes;
      var g = sideCat(sp);
      return p.dir < 0 ? mirror(g) : g;
    }
    var f = compose(p), out = cblank(), ox = 7, oy = CH - GH;
    if (p.body === "climbA" || p.body === "climbB") {
      // Climbing is seen from behind: lift the sprite to make room for the tail hanging below, swaying each step.
      oy = 0;
      var sw = p.body === "climbA" ? 1 : -1;
      put(out, tailPart([[18.5, 19.5], [18.6, 22.4], [18.5 + sw * 1.2, 24.6], [18.5 + sw * 3.2, 25.9], [18.5 + sw * 5.6, 26], [18.5 + sw * 7.4, 25.2]]), false);
    }
    for (var y = 0; y < GH; y++) for (var x = 0; x < GW; x++) if (f[y][x] !== ".") out[y + oy][x + ox] = f[y][x];
    return out;
  }
  function drawFrame(ctx, g) {
    ctx.clearRect(0, 0, CW, CH);
    var box = [CW, CH, -1, -1];
    for (var y = 0; y < CH; y++) for (var x = 0; x < CW; x++) {
      var ch = g[y][x];
      if (ch === ".") continue;
      ctx.fillStyle = COLORS[ch];
      ctx.fillRect(x, y, 1, 1);
      if (x < box[0]) box[0] = x; if (y < box[1]) box[1] = y; if (x > box[2]) box[2] = x; if (y > box[3]) box[3] = y;
    }
    return box;
  }

  // Exposed for the sprite lab page.
  window.__bolaudSprites = { compose: compose, draw: draw, GW: GW, GH: GH, sideCat: sideCat, mirror: mirror, CW: CW, CH: CH, COLORS: COLORS, frame: frame, drawFrame: drawFrame, POSES: POSES };
  if (window.__bolaudLab) return;

  /* ---------- Behaviour ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  COLORS.R = "#c8545a"; // yarn
  COLORS.Q = "#ec9a96"; // yarn highlight
  var BALL = [
    ["..OOO..", ".ORRQO.", "ORQRRRO", "ORRQRRO", "ORRRQRO", ".OQRRO.", "..OOO.."],
    ["..OOO..", ".ORQRO.", "ORRRQRO", "OQRRRRO", "ORQRRRO", ".ORRQO.", "..OOO.."]
  ];

  var css = [
    "#bolaud{position:fixed;z-index:10002;pointer-events:none;image-rendering:pixelated;image-rendering:crisp-edges;transition:opacity .2s ease;}",
    "#bolaud.bolaud-hidden{opacity:0;}",
    "#bolaud.bolaud-hidden .bolaud-hit{pointer-events:none;}",
    "#bolaud canvas{display:block;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;}",
    "#bolaud .bolaud-hit{position:absolute;pointer-events:auto;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}",
    "#bolaud-ball{position:fixed;z-index:10002;pointer-events:none;image-rendering:pixelated;transition:opacity .25s ease;opacity:0;}",
    "#bolaud-ball.on{opacity:1;}",
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
    canvas.width = CW; canvas.height = CH;
    var hit = document.createElement("div");
    hit.className = "bolaud-hit";
    wrap.appendChild(canvas); wrap.appendChild(hit);
    document.body.appendChild(wrap);
    var ctx = canvas.getContext("2d");

    var ballEl = document.createElement("canvas");
    ballEl.id = "bolaud-ball"; ballEl.width = 7; ballEl.height = 7; ballEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(ballEl);
    var bctx = ballEl.getContext("2d"), ballCx = 0, ballF = 0;

    // mode: "launcher" (perched on the button), "panel" (on the chat input box), "moving" (in between).
    // cx is the cat's horizontal centre in page pixels; the canvas is centred on it.
    var S = 3, cx = 0, minC = 0, maxC = 0, baseBottom = 0, lift = 0, mode = "launcher";
    var panel = document.getElementById("ahw-panel");
    var form = panel && panel.querySelector(".ahw-form");
    var log = panel && panel.querySelector(".ahw-log");
    function surface() { return (mode === "panel" && form ? form : launcher).getBoundingClientRect(); }
    function layout() {
      S = window.innerWidth <= 600 ? 2 : 3;
      wrap.style.width = CW * S + "px";
      wrap.style.height = CH * S + "px";
      ballEl.style.width = ballEl.style.height = 7 * S + "px";
      if (mode === "moving") return;
      var r = surface();
      // Feet rest on the top edge of the pill (or the input box).
      baseBottom = window.innerHeight - r.top - S;
      minC = r.left + 10 * S;
      maxC = Math.max(minC, r.right - 10 * S);
      if (!cx || cx < minC || cx > maxC) cx = mode === "panel" ? Math.min(maxC, Math.max(minC, cx || maxC)) : maxC;
      place();
    }
    var box = [0, 0, CW - 1, CH - 1];
    function place() {
      // Keep every pixel of the current frame on screen.
      var left = cx - CW * S / 2 + box[0] * S, right = cx - CW * S / 2 + (box[2] + 1) * S, edge = 4;
      if (right > window.innerWidth - edge) cx -= right - (window.innerWidth - edge);
      else if (left < edge) cx += edge - left;
      wrap.style.left = Math.round(cx - CW * S / 2) + "px";
      wrap.style.bottom = Math.round(baseBottom + lift) + "px";
    }
    function placeBall() {
      ballEl.style.left = Math.round(ballCx - 3.5 * S) + "px";
      ballEl.style.bottom = Math.round(baseBottom + S) + "px";
      bctx.clearRect(0, 0, 7, 7);
      BALL[ballF % 2].forEach(function (row, y) { for (var x = 0; x < 7; x++) if (row[x] !== ".") { bctx.fillStyle = COLORS[row[x]]; bctx.fillRect(x, y, 1, 1); } });
    }

    var pose = { tail: "curl", eyes: "open" };
    function render() {
      var b = drawFrame(ctx, frame(pose));
      if (b[2] >= 0) {
        box = b;
        hit.style.left = b[0] * S + "px"; hit.style.top = b[1] * S + "px";
        hit.style.width = (b[2] - b[0] + 1) * S + "px"; hit.style.height = (b[3] - b[1] + 1) * S + "px";
      }
    }

    function fx(text, cls) {
      var r = hit.getBoundingClientRect();
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
    function padLog(on) { if (log) log.style.paddingBottom = on ? (CH * S + 6) + "px" : ""; }
    if (window.ResizeObserver && panel) {
      var ro = new ResizeObserver(function () { if (mode === "panel") layout(); });
      ro.observe(panel); if (form) ro.observe(form);
    }

    if (reduce) {
      // No motion: sit on whichever surface is showing.
      pose = { tail: "low", eyes: "open" };
      render();
      hit.addEventListener("click", function () { pose.eyes = pose.eyes === "happy" ? "open" : "happy"; render(); });
      new MutationObserver(function () {
        mode = chatOpen() ? "panel" : "launcher"; cx = 0; padLog(mode === "panel");
        setTimeout(layout, 260);
      }).observe(launcher, { attributes: true, attributeFilter: ["class"] });
      return;
    }

    // A tiny timeline runner: each step sets the pose, moves, lifts, or drives the yarn ball, then waits.
    var timer = null, token = 0, sleeping = false;
    function run(steps, done) {
      var my = ++token, i = 0;
      busy = true;
      (function next() {
        if (my !== token) return;
        if (i >= steps.length) { busy = false; if (done) done(); return; }
        var st = steps[i++];
        if (st.pose) pose = Object.assign({}, pose, st.pose);
        if (st.dcx) cx = (st.free || mode === "moving") ? cx + st.dcx : Math.min(maxC, Math.max(minC, cx + st.dcx));
        if (st.lift !== undefined) lift = st.lift;
        if (st.fx) fx(st.fx[0], st.fx[1]);
        if (st.ball) {
          if (st.ball.at !== undefined) { ballCx = st.ball.at; ballF = 0; placeBall(); ballEl.classList.add("on"); }
          if (st.ball.d) { ballCx += st.ball.d; ballF++; placeBall(); }
          if (st.ball.hide) ballEl.classList.remove("on");
        }
        render(); place();
        timer = setTimeout(next, st.t || 160);
      })();
    }
    function stop() { token++; clearTimeout(timer); busy = false; ballEl.classList.remove("on"); }

    // Eyes follow the pointer while sitting.
    var lookTimer = null, lastPointer = Date.now();
    document.addEventListener("pointermove", function (ev) {
      lastPointer = Date.now();
      if (busy || sleeping || pose.side) return;
      var r = hit.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 3;
      var dx = ev.clientX - mx;
      var want = Math.abs(dx) < 40 && ev.clientY > my - 60 ? "open" : dx < 0 ? "left" : "right";
      if (want !== pose.eyes) { pose.eyes = want; render(); }
      clearTimeout(lookTimer);
      lookTimer = setTimeout(function () { if (!busy && !sleeping && !pose.side) { pose.eyes = "open"; render(); } }, 2500);
    }, { passive: true });

    function blink() {
      if (busy || sleeping) return;
      var e = pose.eyes;
      run([{ pose: { eyes: "half" }, t: 60 }, { pose: { eyes: "closed" }, t: 90 }, { pose: { eyes: "half" }, t: 60 }, { pose: { eyes: e }, t: 10 }]);
    }

    var tailSeq = ["curl", "up", "out", "up"], tailI = 0;
    function idleTick() {
      if (!busy && !sleeping && !pose.side) { tailI = (tailI + 1) % tailSeq.length; pose.tail = tailSeq[tailI]; render(); }
    }

    // --- building blocks ---
    var SIT = { side: null, body: "sit", tail: "curl", eyes: "open", mouth: null, headDY: 0, ear: false };
    function sitDown(dir) { return [{ pose: Object.assign({}, SIT, { eyes: dir < 0 ? "left" : "right" }), lift: 0, t: 420 }, { pose: { eyes: "open" }, t: 10 }]; }
    function walkSteps(toCx, free) {
      var dir = toCx < cx ? -1 : 1, dist = Math.abs(toCx - cx), stride = S * 1.5, n = Math.round(dist / stride), out = [];
      for (var i = 0; i < n; i++) out.push({ pose: { side: "walk", k: i % 4, dir: dir, eyes: "open" }, dcx: dir * stride, t: 105, free: free });
      out.push({ pose: { side: "stand", k: 0, dir: dir }, t: 160 });
      return out;
    }
    function roomAhead(dir) { return dir < 0 ? cx - minC : maxC - cx; }
    // Wide side poses face whichever way has more room (on screen and on the surface).
    function roomyDir() {
      var screenR = window.innerWidth - cx, screenL = cx;
      var right = Math.min(roomAhead(1) + S * 12, screenR), left = Math.min(roomAhead(-1) + S * 12, screenL);
      return right >= left ? 1 : -1;
    }
    function pickDir(need) {
      var d = Math.random() < 0.5 ? -1 : 1;
      if (roomAhead(d) < need) d = -d;
      return roomAhead(d) >= need ? d : 0;
    }

    function walk() {
      if (maxC - minC < S * 8) return earFlick();
      var target;
      for (var tries = 0; tries < 6; tries++) { target = minC + Math.random() * (maxC - minC); if (Math.abs(target - cx) > S * 8) break; }
      var dir = target < cx ? -1 : 1;
      run(walkSteps(target).concat(sitDown(dir)));
    }
    function groom() {
      var st = [{ pose: Object.assign({}, SIT, { body: "groom", eyes: "closed", tail: "low" }), t: 300 }];
      for (var i = 0; i < 4; i++) { st.push({ pose: { mouth: "lick" }, t: 180 }); st.push({ pose: { mouth: null }, t: 200 }); }
      st.push({ pose: Object.assign({}, SIT), t: 10 });
      run(st);
    }
    function chickenLick() {
      var dir = roomyDir();
      var st = [{ pose: { side: "stand", k: 0, dir: dir, freeze: false }, t: 260 }];
      var before = 6 + Math.floor(Math.random() * 6);
      for (var i = 0; i < before; i++) st.push({ pose: { side: "lick", k: i % 2, dir: dir }, t: i === 0 ? 420 : 190 });
      if (Math.random() < 0.45) {
        // Caught mid-lick: turn to the screen, tongue out, and think very hard about nothing.
        var hold = 3000 + Math.random() * 3000;
        st.push({ pose: { side: "lick", k: 0, dir: dir, freeze: true, eyes: "open" }, t: hold * 0.35 });
        st.push({ fx: ["\u2026"], t: hold * 0.25 });
        st.push({ pose: { eyes: "half" }, t: 260 });
        st.push({ pose: { eyes: "closed" }, t: 160 });
        st.push({ pose: { eyes: "half" }, t: 220 });
        st.push({ pose: { eyes: "open" }, t: hold * 0.25, fx: Math.random() < 0.7 ? ["?"] : null });
        st.push({ pose: { side: "lick", k: 1, dir: dir, freeze: false, eyes: null }, t: 260 });
        for (i = 0; i < 4; i++) st.push({ pose: { side: "lick", k: i % 2, dir: dir }, t: 190 });
      }
      st.push({ pose: { side: "lick", k: 0, dir: dir }, t: 500 });
      st.push({ pose: { side: "stand", k: 0, dir: dir, freeze: false }, t: 220 });
      run(st.concat(sitDown(dir)));
    }
    function scoot() {
      var dir = pickDir(S * 10);
      if (!dir) return chickenLick();
      var n = Math.min(14, Math.floor(roomAhead(dir) / S));
      var st = [{ pose: { side: "stand", k: 0, dir: dir }, t: 220 }];
      for (var i = 0; i < n; i++) st.push({ pose: { side: "scoot", k: i % 2, dir: dir }, dcx: i % 2 ? dir * S * 1.4 : dir * S * 0.4, t: 150 });
      st.push({ pose: { side: "stand", k: 0, dir: dir }, t: 260 });
      run(st.concat(sitDown(dir)));
    }
    function stretch() {
      var dir = roomyDir();
      run([
        { pose: { side: "stand", k: 0, dir: dir }, t: 260 },
        { pose: { side: "bow", k: 0, dir: dir }, t: 650 },
        { pose: { side: "bow", k: 1, dir: dir }, t: 1100 },
        { pose: { side: "bow", k: 0, dir: dir }, t: 300 },
        { pose: { side: "stand", k: 0, dir: dir }, t: 220 },
        { pose: { side: "legBack", dir: dir }, t: 900 },
        { pose: { side: "stand", k: 0, dir: dir }, t: 260 }
      ].concat(sitDown(dir)));
    }
    function scratch() {
      var dir = pickDir(S * 6) || roomyDir();
      var st = [{ pose: { side: "stand", k: 0, dir: dir }, t: 220 }];
      for (var i = 0; i < 14; i++) st.push({ pose: { side: "scratch", k: i % 2, dir: dir }, t: 135 });
      st.push({ pose: { side: "stand", k: 0, dir: dir }, t: 280 });
      run(st.concat(sitDown(dir)));
    }
    function yarn() {
      var dir = pickDir(S * 18);
      if (!dir) return scratch();
      var st = [], c = cx, b = cx + dir * S * 13, room = roomAhead(dir);
      st.push({ ball: { at: b }, pose: { side: "stand", k: 0, dir: dir, eyes: "wide" }, t: 380 });
      for (var i = 0; i < 6; i++) st.push({ pose: { side: "crouch", k: i % 2, dir: dir }, t: 150 });
      // pounce
      var hop = (b - dir * S * 7) - c;
      st.push({ pose: { side: "leap", dir: dir }, dcx: hop * 0.35, lift: S * 3, t: 90 });
      st.push({ dcx: hop * 0.35, lift: S * 4, t: 90 });
      st.push({ dcx: hop * 0.3, lift: S * 1, t: 90 });
      st.push({ pose: { side: "stand", k: 0, dir: dir }, lift: 0, t: 120 });
      // bat it away, chase, bat it back
      var away = Math.max(S * 2, Math.min(S * 9, room - S * 20));
      st.push({ pose: { side: "bat", dir: dir }, t: 140 });
      for (i = 0; i < 4; i++) st.push({ ball: { d: dir * away / 4 }, t: 70 });
      st.push({ pose: { side: "stand", k: 0, dir: dir }, t: 220 });
      var steps = Math.round(away / (S * 1.5));
      for (i = 0; i < steps; i++) st.push({ pose: { side: "walk", k: i % 4, dir: dir }, dcx: dir * S * 1.5, t: 105 });
      st.push({ pose: { side: "bat", dir: dir }, t: 160 });
      for (i = 0; i < 5; i++) st.push({ ball: { d: -dir * S * 2 }, t: 70 });
      st.push({ pose: { side: "stand", k: 0, dir: -dir }, t: 260 });
      st.push({ ball: { hide: true }, pose: Object.assign({}, SIT, { eyes: "happy" }), t: 160, fx: ["♥", "heart"] });
      st.push({ t: 700 });
      st.push({ pose: { eyes: "open" }, t: 10 });
      run(st);
    }
    function yawn(then) {
      run([
        { pose: Object.assign({}, SIT, { eyes: "half", ear: true }), t: 200 },
        { pose: { eyes: "closed", mouth: "yawn" }, t: 700 },
        { pose: { eyes: "half", mouth: null, ear: false }, t: 250 },
        { pose: { eyes: "open" }, t: 10 }
      ], then);
    }
    function earFlick() {
      run([{ pose: Object.assign({}, SIT, { ear: true }), t: 140 }, { pose: { ear: false }, t: 140 }, { pose: { ear: true }, t: 120 }, { pose: { ear: false }, t: 10 }]);
    }
    function hop(withHearts) {
      var e = withHearts ? "happy" : "open";
      run([
        { pose: Object.assign({}, SIT, { headDY: 1, eyes: e }), t: 110, fx: withHearts ? ["♥", "heart"] : null },
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
      pose = Object.assign({}, SIT, { tail: "low", eyes: "closed" });
      render();
      yawn();
    }

    hit.addEventListener("click", function () {
      lastPointer = Date.now();
      if (sleeping) { wake(); return; }
      if (mode === "moving") return;
      stop();
      hop(true);
    });

    var ACTIONS = [
      [walk, 22], [groom, 7], [chickenLick, 9], [scoot, 7], [stretch, 10],
      [scratch, 9], [yarn, 10], [earFlick, 9], [yawn, 6], [function () { hop(false); }, 4], [function () { sleep(); }, 6]
    ];
    function choose() {
      if (document.hidden || busy || sleeping || mode === "moving") return;
      if (Date.now() - lastPointer > 120000) { sleep(); return; }
      var total = ACTIONS.reduce(function (a, b) { return a + b[1]; }, 0), r = Math.random() * total;
      for (var i = 0; i < ACTIONS.length; i++) { r -= ACTIONS[i][1]; if (r <= 0) { ACTIONS[i][0](); return; } }
    }

    // Chat opens: climb up the right edge of the chat window, then walk onto the input box.
    function enterPanel() {
      if (!form) { wrap.classList.add("bolaud-hidden"); return; }
      stop(); clearInterval(zzzTimer); sleeping = false;
      mode = "moving";
      wrap.classList.add("bolaud-hidden");
      setTimeout(function () {
        if (!chatOpen()) return;
        var pr = panel.getBoundingClientRect(), fr = form.getBoundingClientRect();
        padLog(true);
        baseBottom = window.innerHeight - fr.top - S;
        cx = Math.min(window.innerWidth - 10 * S, pr.right);
        lift = -(baseBottom + CH * S);
        pose = Object.assign({}, SIT, { body: "climbA" });
        render(); place();
        wrap.classList.remove("bolaud-hidden");
        var steps = [], climbed = lift, k = 0;
        while (climbed < 0) {
          climbed = Math.min(0, climbed + S * 3);
          steps.push({ pose: { body: k++ % 2 ? "climbB" : "climbA" }, lift: climbed, t: 110 });
        }
        steps.push({ pose: { body: "sit", side: "stand", k: 0, dir: -1 }, lift: S * 3, dcx: -S * 4, t: 120, free: true });
        steps.push({ lift: 0, t: 160 });
        var target = fr.left + fr.width * 0.55;
        run(steps, function () {
          run(walkSteps(target, true).concat(sitDown(-1)), function () { mode = "panel"; layout(); });
        });
      }, 280);
    }
    // Chat closes: hop back onto the button.
    function leavePanel() {
      stop(); clearInterval(zzzTimer); sleeping = false;
      padLog(false);
      wrap.classList.add("bolaud-hidden");
      mode = "launcher"; lift = 0; cx = 0;
      setTimeout(function () {
        if (chatOpen()) return;
        pose = Object.assign({}, SIT);
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
      window.__bolaudDebug = {
        walk: walk, groom: groom, lick: chickenLick, freeze: function () { var r = Math.random; Math.random = function () { return 0.1; }; try { chickenLick(); } finally { Math.random = r; } }, scoot: scoot, stretch: stretch, scratch: scratch, yarn: yarn,
        yawn: function () { yawn(); }, ear: earFlick, hop: function () { hop(true); }, sleep: function () { sleep(8000); }, wake: wake
      };
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
