(function () {
  "use strict";

  var STORAGE_KEY = "kikkake-saved";
  var STAR_OFF = "☆";
  var STAR_ON = "★";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var emptyMessage = document.querySelector(".empty");
  var currentFilter = "all";

  // 保存は補助機能。ストレージが使えない環境では、このページを開いている間だけ覚える。
  function readSaved() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeSaved() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (error) {
      console.info("保存はこのページを開いている間だけ有効です");
    }
  }

  var saved = readSaved();

  function isSaved(slug) {
    return saved.indexOf(slug) !== -1;
  }

  function matchesFilter(card) {
    if (currentFilter === "all") return true;
    if (currentFilter === "saved") return isSaved(card.dataset.slug);
    if (currentFilter === "non-engineer") return card.dataset.nonEngineer === "true";
    return card.dataset.stance === currentFilter;
  }

  function applyFilter() {
    var visible = 0;
    cards.forEach(function (card) {
      var show = matchesFilter(card);
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyMessage) emptyMessage.hidden = !(currentFilter === "saved" && visible === 0);
  }

  function paintStar(card) {
    var star = card.querySelector(".star");
    var on = isSaved(card.dataset.slug);
    star.textContent = on ? STAR_ON : STAR_OFF;
    star.setAttribute("aria-pressed", String(on));
  }

  function toggleSaved(card) {
    var slug = card.dataset.slug;
    saved = isSaved(slug)
      ? saved.filter(function (item) { return item !== slug; })
      : saved.concat([slug]);
    writeSaved();
    paintStar(card);
    applyFilter();
  }

  cards.forEach(function (card) {
    paintStar(card);
    card.querySelector(".star").addEventListener("click", function () {
      toggleSaved(card);
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      currentFilter = chip.dataset.filter;
      chips.forEach(function (other) {
        var on = other === chip;
        other.classList.toggle("is-on", on);
        other.setAttribute("aria-pressed", String(on));
      });
      applyFilter();
    });
  });
})();
