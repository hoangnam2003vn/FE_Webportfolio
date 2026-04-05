/**
 * Gọi API cùng origin (backend phục vụ FE trên một cổng, mặc định 5000).
 */
(function (global) {
  "use strict";

  var TOKEN_KEY = "portfolio_token";

  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }

  function setToken(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  function authHeaders(extra) {
    var h = { "Content-Type": "application/json" };
    if (extra) {
      Object.keys(extra).forEach(function (k) {
        h[k] = extra[k];
      });
    }
    var t = getToken();
    if (t) h.Authorization = "Bearer " + t;
    return h;
  }

  function apiFetch(path, options) {
    options = options || {};
    var headers = authHeaders(options.headers);
    return fetch(path, Object.assign({}, options, { headers: headers }));
  }

  global.PortfolioApi = {
    TOKEN_KEY: TOKEN_KEY,
    getToken: getToken,
    setToken: setToken,
    authHeaders: authHeaders,
    fetch: apiFetch,
  };
})(typeof window !== "undefined" ? window : this);
