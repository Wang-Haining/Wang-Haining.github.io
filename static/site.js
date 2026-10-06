(function () {
  "use strict";
  /* What's New: entries older than two years start collapsed behind a "show earlier" button.
     The entries stay in the HTML (search engines and no-JS readers see everything). */
  var MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  function entryDate(li) {
    var first = "";
    for (var n = li.firstChild; n; n = n.nextSibling) {
      first += n.textContent || "";
      if (first.indexOf(")") > -1) break;
    }
    var m = first.match(/\(\s*([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2})(?:\s*[–-]\s*\d{1,2})?,\s*(\d{4})\s*\)/);
    return m && MONTHS[m[1]] !== undefined ? new Date(+m[3], MONTHS[m[1]], +m[2]) : null;
  }
  function collapseNews() {
    var heading = Array.prototype.find.call(document.querySelectorAll("article h3, article h2"), function (h) {
      return /what.?s new/i.test(h.textContent);
    });
    if (!heading) return;
    var list = heading.nextElementSibling;
    while (list && list.tagName !== "UL") list = list.nextElementSibling;
    if (!list) return;
    var cutoff = new Date(); cutoff.setFullYear(cutoff.getFullYear() - 2);
    var old = Array.prototype.filter.call(list.children, function (li) {
      var d = entryDate(li); return d && d < cutoff;
    });
    if (!old.length) return;
    old.forEach(function (li) { li.classList.add("news-old"); li.hidden = true; });
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "news-more"; btn.setAttribute("aria-expanded", "false");
    var label = function (open) { return open ? "Show fewer updates" : "Show " + old.length + " earlier updates"; };
    btn.textContent = label(false);
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      old.forEach(function (li) { li.hidden = !open; });
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = label(open);
      if (!open) heading.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    list.insertAdjacentElement("afterend", btn);
  }
  /* Research: topic filter (All / NLP / Health / Metascience); state lives in the URL hash. */
  function setupPubFilter() {
    var bar = document.querySelector(".pub-filter");
    if (!bar) return;
    var chips = Array.prototype.slice.call(bar.querySelectorAll(".pub-chip"));
    var pubs = Array.prototype.slice.call(document.querySelectorAll("li.pub"));
    var sections = Array.prototype.slice.call(document.querySelectorAll(".pub-section"));
    function apply(tag, push) {
      if (!chips.some(function (c) { return c.dataset.filter === tag; })) tag = "all";
      chips.forEach(function (c) {
        var on = c.dataset.filter === tag;
        c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on));
      });
      pubs.forEach(function (li) {
        li.hidden = tag !== "all" && (" " + li.dataset.tags + " ").indexOf(" " + tag + " ") < 0;
      });
      sections.forEach(function (sec) { sec.hidden = !sec.querySelector("li.pub:not([hidden])"); });
      if (push) history.replaceState(null, "", tag === "all" ? location.pathname + location.search : "#" + tag);
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { apply(c.dataset.filter, true); }); });
    apply((location.hash || "").slice(1) || "all", false);
  }

  /* Home: wrap each news date "(Mon D, YYYY)" in a span for styling; the text itself is unchanged. */
  function markNewsDates() {
    document.querySelectorAll(".page-home > div > ul > li").forEach(function (li) {
      var n = li.firstChild;
      while (n && n.nodeType === 3 && !n.textContent.trim()) n = n.nextSibling;
      if (!n || n.nodeType !== 3) return;
      var m = n.textContent.match(/^\s*(\([A-Z][a-z]{2}[^)]*\d{4}\))/);
      if (!m) return;
      var span = document.createElement("span"); span.className = "news-date"; span.textContent = m[1];
      n.textContent = n.textContent.slice(n.textContent.indexOf(m[1]) + m[1].length);
      li.insertBefore(span, n);
    });
  }

  /* Resource: label each card with where it lives (GitHub, Zenodo, PyPI, ...). */
  function labelResources() {
    var SOURCES = [[/github\.com/, "GitHub", "fa-brands fa-github"], [/zenodo\.org/, "Zenodo", "fa-solid fa-database"],
                   [/pypi\.org/, "PyPI", "fa-brands fa-python"], [/overleaf\.com/, "Overleaf", "fa-solid fa-file-lines"],
                   [/huggingface\.co/, "Hugging Face", "fa-solid fa-cube"], [/codeberg\.org/, "Codeberg", "fa-solid fa-code"]];
    document.querySelectorAll(".page-resource > div > ul > li").forEach(function (li) {
      var a = li.querySelector("a"); if (!a) return;
      a.classList.add("res-name");
      var holder = a.parentNode; // <li> or the <p> Markdown wraps it in
      var rest = a.nextSibling;
      if (rest && rest.nodeType === 3) rest.textContent = rest.textContent.replace(/^\s*:\s*/, "");
      var src = SOURCES.find(function (s) { return s[0].test(a.href); }); if (!src) return;
      var tag = document.createElement("span"); tag.className = "res-source";
      tag.innerHTML = '<i class="' + src[2] + '" aria-hidden="true"></i>';
      tag.appendChild(document.createTextNode(src[1]));
      holder.insertBefore(tag, holder.firstChild);
    });
  }

  // The address never appears in the HTML: links marked data-email get their mailto only when a person interacts.
  function protectEmail() {
    var parts = ["hw56", "iu", "edu"];
    function arm() { this.href = "mailto:" + parts[0] + String.fromCharCode(64) + parts[1] + "." + parts[2]; }
    document.querySelectorAll("[data-email]").forEach(function (a) {
      ["mouseenter", "focus", "touchstart", "mousedown"].forEach(function (ev) { a.addEventListener(ev, arm, { passive: true }); });
    });
  }

  function init() { collapseNews(); setupPubFilter(); markNewsDates(); labelResources(); protectEmail(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
