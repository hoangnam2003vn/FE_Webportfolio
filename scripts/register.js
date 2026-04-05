(function () {
  "use strict";

  var toggle = document.getElementById("register-password-toggle");
  var input = document.getElementById("register-password");
  if (toggle && input) {
    var showIcon = toggle.querySelector(".register__pw-toggle-show");
    var hideIcon = toggle.querySelector(".register__pw-toggle-hide");

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

  var form = document.querySelector(".register__form");
  var feedback = document.getElementById("register-feedback");
  if (!form) return;
  if (typeof PortfolioApi === "undefined") {
    console.error("Thiếu api.js — thêm <script src=\"../scripts/api.js\" defer></script> trước register.js");
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

    var username = (document.getElementById("register-username") || {}).value;
    var full_name = (document.getElementById("register-name") || {}).value;
    var email = (document.getElementById("register-email") || {}).value;
    var phone = (document.getElementById("register-phone") || {}).value;
    var password = (document.getElementById("register-password") || {}).value;
    var passwordConfirm = (
      document.getElementById("register-password-confirm") || {}
    ).value;

    if (password !== passwordConfirm) {
      showMsg("Mật khẩu xác nhận không khớp.", true);
      return;
    }

    if (!username || !email || !password) {
      showMsg("Tên đăng nhập, email và mật khẩu là bắt buộc.", true);
      return;
    }

    var submitBtn = form.querySelector(".register__submit");
    if (submitBtn) submitBtn.disabled = true;

    PortfolioApi.fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        password: password,
        full_name: (full_name || "").trim(),
        phone: (phone || "").trim(),
      }),
    })
      .then(function (r) {
        return r.json().then(function (body) {
          return { ok: r.ok, body: body };
        });
      })
      .then(function (result) {
        if (!result.ok || !result.body.success) {
          showMsg(
            (result.body && result.body.message) || "Đăng ký thất bại.",
            true
          );
          return;
        }
        var data = result.body.data || {};
        if (data.token) PortfolioApi.setToken(data.token);
        window.location.href = "home.html";
      })
      .catch(function () {
        showMsg("Không kết nối được máy chủ. Chạy backend (npm start) và mở qua http://localhost:5000", true);
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
