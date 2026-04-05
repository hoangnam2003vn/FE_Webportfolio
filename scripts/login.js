(function () {
  "use strict";

  var toggle = document.getElementById("login-password-toggle");
  var input = document.getElementById("login-password");
  if (toggle && input) {
    var showIcon = toggle.querySelector(".login__pw-toggle-show");
    var hideIcon = toggle.querySelector(".login__pw-toggle-hide");

    toggle.addEventListener("click", function () {
      var isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      toggle.setAttribute("aria-pressed", isHidden ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu"
      );
      if (showIcon) showIcon.hidden = isHidden;
      if (hideIcon) hideIcon.hidden = !isHidden;
    });
  }

  var form = document.querySelector(".login__form");
  var feedback = document.getElementById("login-feedback");
  if (!form) return;
  if (typeof PortfolioApi === "undefined") {
    console.error("Thiếu api.js — thêm <script src=\"../scripts/api.js\" defer></script> trước login.js");
    return;
  }

  function showMsg(text, isError) {
    if (!feedback) return;
    feedback.textContent = text || "";
    feedback.hidden = !text;
    feedback.style.color = isError ? "#c62828" : "#2e7d32";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showMsg("");

    var email = (document.getElementById("login-email") || {}).value;
    var password = (document.getElementById("login-password") || {}).value;
    if (!email || !password) {
      showMsg("Vui lòng nhập email và mật khẩu.", true);
      return;
    }

    var submitBtn = form.querySelector(".login__submit");
    if (submitBtn) submitBtn.disabled = true;

    PortfolioApi.fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password: password }),
    })
      .then(function (r) {
        return r.json().then(function (body) {
          return { ok: r.ok, body: body };
        });
      })
      .then(function (result) {
        if (!result.ok || !result.body.success) {
          showMsg(
            (result.body && result.body.message) || "Đăng nhập thất bại.",
            true
          );
          return;
        }
        var data = result.body.data || {};
        if (data.token) PortfolioApi.setToken(data.token);
        var next = new URLSearchParams(window.location.search).get("next");
        window.location.href = next || "home.html";
      })
      .catch(function () {
        showMsg("Không kết nối được máy chủ. Chạy backend (npm start) và mở qua http://localhost:5000", true);
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
