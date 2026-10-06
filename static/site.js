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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", collapseNews);
  else collapseNews();
})();
