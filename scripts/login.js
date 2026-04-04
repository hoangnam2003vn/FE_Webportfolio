(function () {
  var toggle = document.getElementById("login-password-toggle");
  var input = document.getElementById("login-password");
  if (!toggle || !input) return;

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
})();
