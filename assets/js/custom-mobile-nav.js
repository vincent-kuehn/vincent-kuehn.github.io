/**
 * On viewports <= 768px: show only site title + menu button; nav links in dropdown.
 * On larger viewports: use default greedy-nav behavior.
 */
(function () {
  var MOBILE_BREAKPOINT = 768;
  var $nav = document.getElementById("site-nav");
  if (!$nav) return;

  var $btn = $nav.querySelector("button");
  var $vlinks = $nav.querySelector(".visible-links");
  var $hlinks = $nav.querySelector(".hidden-links");
  if (!$vlinks || !$hlinks || !$btn) return;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function moveToHidden() {
    var items = Array.from($vlinks.querySelectorAll("li:not(.persist)"));
    items.forEach(function (li) {
      $hlinks.appendChild(li);
    });
    $btn.classList.remove("hidden");
    $btn.setAttribute("aria-expanded", "false");
  }

  function moveToVisible() {
    var tail = $vlinks.querySelector("li.tail");
    var insertBefore = tail || null;
    var items = Array.from($hlinks.querySelectorAll("li"));
    items.forEach(function (li) {
      $vlinks.insertBefore(li, insertBefore);
    });
    $btn.classList.add("hidden");
    $hlinks.classList.add("hidden");
    $btn.classList.remove("close");
    $btn.setAttribute("aria-expanded", "false");
  }

  function updateMobileNav() {
    if (isMobile()) {
      if ($hlinks.querySelectorAll("li").length === 0) moveToHidden();
      $btn.classList.remove("hidden");
    } else {
      if ($hlinks.querySelectorAll("li").length > 0) moveToVisible();
      if (typeof window.updateNav === "function") window.updateNav();
    }
  }

  /* On mobile we handle the click ourselves so the menu reliably opens. Use capture so we
     run before the theme's handler and prevent it from double-toggling or re-hiding. */
  $btn.addEventListener("click", function (e) {
    if (isMobile()) {
      e.stopImmediatePropagation();
      $hlinks.classList.toggle("hidden");
      this.classList.toggle("close");
      this.setAttribute("aria-expanded", $hlinks.classList.contains("hidden") ? "false" : "true");
    }
  }, true);

  window.addEventListener("resize", function () {
    if (isMobile()) {
      if ($hlinks.querySelectorAll("li").length === 0) moveToHidden();
    } else {
      if ($hlinks.querySelectorAll("li").length > 0) moveToVisible();
    }
  });

  function runAfterGreedyNav() {
    updateMobileNav();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAfterGreedyNav);
  } else {
    runAfterGreedyNav();
  }
  window.addEventListener("load", runAfterGreedyNav);
})();
