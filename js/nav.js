(function () {
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.getElementById("site-drawer");
  var backdrop = document.querySelector(".drawer-backdrop");
  var closeBtn = document.querySelector(".drawer-close");
  if (!toggle || !drawer) return;

  var lastFocus = null;
  function focusables() {
    return Array.prototype.slice.call(
      drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.hasAttribute("disabled") && el.offsetParent !== null; });
  }
  function open() {
    lastFocus = document.activeElement;
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    drawer.removeAttribute("hidden");
    if (backdrop) backdrop.hidden = false;
    var f = focusables();
    (f[0] || drawer).focus();
  }
  function close() {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    drawer.setAttribute("hidden", "");
    if (backdrop) backdrop.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function isOpen() { return document.body.classList.contains("menu-open"); }

  toggle.addEventListener("click", function () { isOpen() ? close() : open(); });
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);
  drawer.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) close();
  });
  drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { close(); });
  });

  // Active section highlighting on the homepage
  var links = document.querySelectorAll('nav.links a[href^="#"], .drawer nav a[href^="#"]');
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (id) map[id] = map[id] || [];
      if (id) map[id].push(a);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        (map[id] || []).forEach(function (a) { a.classList.add("is-active"); });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();

(function () {
  var fab = document.querySelector(".float-cta");
  var builder = document.getElementById("lk") || document.querySelector(".lk-order");
  if (!fab || !builder || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    var vis = entries.some(function (e) { return e.isIntersecting; });
    document.body.classList.toggle("fab-hide-for-lookbook", vis);
  }, { root: null, threshold: 0, rootMargin: "0px 0px -72px 0px" });
  io.observe(builder);
})();

(function () {
  var chat = document.getElementById("chat");
  var builder = document.getElementById("lk") || document.getElementById("design");
  if (!chat || !builder || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    var vis = entries.some(function (e) { return e.isIntersecting; });
    document.body.classList.toggle("chat-hide-for-lookbook", vis);
  }, { root: null, threshold: 0, rootMargin: "0px 0px -15% 0px" });
  io.observe(builder);
})();
