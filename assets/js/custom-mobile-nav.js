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

  /* Don't add our own click handler - the theme's greedy-nav already toggles .hidden on
     .hidden-links. A second handler would double-toggle and leave the menu closed. */

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
