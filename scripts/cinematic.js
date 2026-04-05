/**
 * Trang mẫu cinematic — scroll reveal, header, anchor mượt
 */
(function () {
  "use strict";

  var docEl = document.documentElement;
  docEl.classList.add("js-animations");

  var revealNodes = document.querySelectorAll(
    ".page--cinematic .cinematic-hero, .page--cinematic .cinematic-about, .page--cinematic .cinematic-skills, .page--cinematic .cinematic-footer"
  );
  var revealList = Array.prototype.slice.call(revealNodes);
  revealList.forEach(function (el) {
    el.classList.add("reveal");
  });

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    revealList.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    revealList.forEach(function (el) {
      io.observe(el);
    });
  }

  var header = document.querySelector(".page--cinematic .cinematic-header");

  function headerOffset() {
    return header ? header.offsetHeight : 0;
  }

  function onScrollHeader() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", y > 20);
  }

  var navLinks = document.querySelectorAll(
    '.page--cinematic .cinematic-header nav a[href^="#"]'
  );

  var sectionIds = ["hero", "about", "skills", "contact"];

  function syncActiveNav() {
    if (!navLinks.length) return;
    var pos = (window.scrollY || 0) + headerOffset() + 48;
    var activeId = "hero";
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= pos) activeId = id;
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + activeId);
    });
  }

  var scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      onScrollHeader();
      syncActiveNav();
      scrollTicking = false;
    });
  }

  onScrollHeader();
  syncActiveNav();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") !== 0) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset() -
        12;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  });
})();
