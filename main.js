function collectAuthParams() {
  var params = new URLSearchParams(window.location.search);
  var hash = String(window.location.hash || "").replace(/^#/, "");
  if (!hash) return params;
  var hashParams = new URLSearchParams(hash);
  hashParams.forEach(function (value, key) {
    if (!params.has(key)) params.set(key, value);
  });
  return params;
}

function resolveAuthLandingTarget(params) {
  var authKeys = [
    "access_token",
    "code",
    "error",
    "error_code",
    "error_description",
    "flow",
    "refresh_token",
    "state",
    "token_hash",
    "type",
  ];
  var hasAuthPayload = authKeys.some(function (key) {
    return params.has(key);
  });
  if (!hasAuthPayload) return null;

  var flow = String(params.get("flow") || "").trim().toLowerCase();
  var type = String(params.get("type") || "").trim().toLowerCase();
  if (flow === "password-reset" || type === "recovery") {
    return "reset-password/";
  }
  return "auth/callback/";
}

function redirectRootAuthLandingIfNeeded() {
  if (!document.body.classList.contains("page-home")) return;
  var params = collectAuthParams();
  var target = resolveAuthLandingTarget(params);
  if (!target) return;

  var nextUrl = new URL(target, window.location.href);
  nextUrl.search = window.location.search;
  nextUrl.hash = window.location.hash;
  if (nextUrl.toString() === window.location.href) return;
  window.location.replace(nextUrl.toString());
}

redirectRootAuthLandingIfNeeded();

var revealNodes = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && revealNodes.length > 0) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -32px 0px",
    },
  );

  revealNodes.forEach(function (node, index) {
    node.style.transitionDelay = Math.min(index * 45, 220) + "ms";
    observer.observe(node);
  });
} else {
  revealNodes.forEach(function (node) {
    node.classList.add("is-visible");
  });
}
