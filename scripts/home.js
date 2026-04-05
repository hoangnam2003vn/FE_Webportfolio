/**
 * Home — scroll reveal, navbar blur, auth (JWT /api/auth/me), user dropdown, mobile menu
 */
(function () {
  "use strict";

  var docEl = document.documentElement;
  docEl.classList.add("js-animations");

  var revealNodes = document.querySelectorAll(".hero, main .page__section, .footer");
  var revealList = Array.prototype.slice.call(revealNodes);
  revealList.forEach(function (el) {
    el.classList.add("reveal");
  });

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  var header = document.querySelector(".header");

  function headerOffset() {
    return header ? header.offsetHeight : 0;
  }

  function onScrollHeader() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("header--scrolled", y > 20);
  }

  var navLinks = document.querySelectorAll('.navbar__link[href^="#"]');
  function syncActiveNav() {
    if (!navLinks.length) return;
    var sectionIds = ["hero", "about", "projects", "contact"];
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
      var toggle = document.getElementById("navbar-toggle");
      if (toggle) toggle.checked = false;
    });
  });

  document.querySelectorAll(".navbar__link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href && href.indexOf("#") === 0) return;
    link.addEventListener("click", function () {
      var toggle = document.getElementById("navbar-toggle");
      if (toggle) toggle.checked = false;
    });
  });

  function applyAuthVisibility(loggedIn) {
    var authItem = document.querySelector("[data-navbar-auth]");
    var userItem = document.querySelector("[data-navbar-user-wrap]");
    if (!authItem || !userItem) return;
    authItem.hidden = loggedIn;
    userItem.hidden = !loggedIn;
  }

  function fillUserUI(user) {
    var img = document.querySelector(".navbar__avatar");
    var nameEl = document.querySelector(".navbar__user-name");
    if (!img || !nameEl) return;
    var display =
      (user.fullName && String(user.fullName).trim()) ||
      user.username ||
      user.email ||
      "Tài khoản";
    nameEl.textContent = display;
    img.alt = display;
    if (user.avatar && String(user.avatar).trim()) {
      img.src = user.avatar;
    } else {
      img.removeAttribute("src");
      img.src =
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(display) +
        "&background=random&size=96";
    }
    img.onerror = function () {
      img.onerror = null;
      img.src = "https://picsum.photos/seed/useravatar/96/96";
    };
  }

  function initUserDropdown() {
    var root = document.querySelector("[data-navbar-user]");
    var btn = document.getElementById("user-menu-button");
    var menu = document.getElementById("user-menu-dropdown");
    if (!root || !btn || !menu) return;

    function setOpen(open) {
      root.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    }

    setOpen(false);

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!root.classList.contains("is-open"));
    });

    document.addEventListener("click", function () {
      setOpen(false);
    });

    root.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    menu.querySelectorAll(".navbar__dropdown-link").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var label = (a.textContent || "").trim();
        if (label.indexOf("Đăng xuất") === 0) {
          ev.preventDefault();
          if (typeof PortfolioApi !== "undefined") PortfolioApi.setToken(null);
          window.location.href = "home.html";
          return;
        }
        setOpen(false);
        var toggle = document.getElementById("navbar-toggle");
        if (toggle) toggle.checked = false;
      });
    });
  }

  function closeMobileMenu() {
    var toggle = document.getElementById("navbar-toggle");
    if (toggle) toggle.checked = false;
  }

  function syncAuthFromServer() {
    if (typeof PortfolioApi === "undefined") {
      applyAuthVisibility(false);
      return;
    }
    var token = PortfolioApi.getToken();
    if (!token) {
      applyAuthVisibility(false);
      return;
    }

    var authEarly = document.querySelector("[data-navbar-auth]");
    if (authEarly) authEarly.hidden = true;

    PortfolioApi.fetch("/api/auth/me")
      .then(function (r) {
        return r.json().then(function (body) {
          return { ok: r.ok, body: body };
        });
      })
      .then(function (result) {
        if (!result.ok || !result.body.success) {
          PortfolioApi.setToken(null);
          applyAuthVisibility(false);
          return;
        }
        applyAuthVisibility(true);
        fillUserUI(result.body.data || {});
        initUserDropdown();
      })
      .catch(function () {
        applyAuthVisibility(false);
      });
  }

  syncAuthFromServer();

  document.querySelectorAll(".navbar__auth-btn").forEach(function (btn) {
    btn.addEventListener("click", closeMobileMenu);
  });
})();
