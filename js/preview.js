(function () {
  var root = document.querySelector("[data-live-preview]");
  if (!root) return;

  var THEMES = {
    modern: {
      label: "Modern",
      head: "Manrope, Inter, sans-serif",
      body: "Inter, system-ui, sans-serif",
      bg: "#f5f6f8", paper: "#ffffff", ink: "#0f172a", text: "#334155",
      nav: "#0b1220", navInk: "#ffffff", accent: "#c44e18",
      radius: 14, hero: "split", btn: "fill", swatches: ["#0b1220", "#c44e18", "#f5f6f8"]
    },
    bold: {
      label: "Bold",
      head: "Manrope, Inter, sans-serif",
      body: "Inter, system-ui, sans-serif",
      bg: "#fff4ec", paper: "#ffffff", ink: "#111111", text: "#1f1f1f",
      nav: "#111111", navInk: "#ffffff", accent: "#e8672c",
      radius: 4, hero: "block", btn: "fill", swatches: ["#111111", "#e8672c", "#fff4ec"]
    },
    classic: {
      label: "Classic",
      head: 'Georgia, "Times New Roman", serif',
      body: "Georgia, serif",
      bg: "#f6f1e8", paper: "#fffaf3", ink: "#1c1917", text: "#44403c",
      nav: "#1c1917", navInk: "#f6f1e8", accent: "#9a3412",
      radius: 0, hero: "centered", btn: "outline", swatches: ["#1c1917", "#9a3412", "#f6f1e8"]
    },
    dark: {
      label: "Dark",
      head: "Manrope, Inter, sans-serif",
      body: "Inter, system-ui, sans-serif",
      bg: "#0b1220", paper: "#111b31", ink: "#f3f6fb", text: "#cbd5e1",
      nav: "#05070d", navInk: "#ffffff", accent: "#e8672c",
      radius: 12, hero: "split", btn: "fill", swatches: ["#0b1220", "#e8672c", "#111b31"]
    },
    minimal: {
      label: "Minimal",
      head: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      bg: "#ffffff", paper: "#ffffff", ink: "#0a0a0a", text: "#525252",
      nav: "#ffffff", navInk: "#0a0a0a", accent: "#0a0a0a",
      radius: 0, hero: "centered", btn: "outline", swatches: ["#0a0a0a", "#ffffff", "#e5e5e5"]
    },
    warm: {
      label: "Warm",
      head: "Manrope, Inter, sans-serif",
      body: "Inter, system-ui, sans-serif",
      bg: "#faf6f1", paper: "#fffdf9", ink: "#3b2a22", text: "#5c4a42",
      nav: "#3b2a22", navInk: "#fffdf9", accent: "#c44e18",
      radius: 20, hero: "split", btn: "fill", swatches: ["#3b2a22", "#c44e18", "#faf6f1"]
    }
  };

  var TYPES = {
    plumber: { label: "Plumber", head: "Leaks fixed fast. Done right.", sub: "Repairs, drains and water heaters.", cta: "Call now", chips: ["Leak repair", "Drains", "Water heaters"] },
    salon: { label: "Salon", head: "Walk out feeling new.", sub: "Cuts, color and styling by people who listen.", cta: "Book now", chips: ["Cuts", "Color", "Styling"] },
    hvac: { label: "HVAC", head: "Warm again. Tonight.", sub: "Heating and cooling, when you need it.", cta: "Book a visit", chips: ["Heating", "Cooling", "Service"] },
    restaurant: { label: "Restaurant", head: "Dinner, done right.", sub: "Pickup ordering for a fictional kitchen.", cta: "Order pickup", chips: ["Menu", "Pickup", "Hours"] },
    contractor: { label: "Contractor", head: "Homes, rebuilt around how you live.", sub: "Remodeling with a project gallery and a quote request.", cta: "Get a quote", chips: ["Projects", "Gallery", "Quote"] },
    electrician: { label: "Electrician", head: "Safe wiring. Clean work.", sub: "Panels, lighting and repairs.", cta: "Get a quote", chips: ["Panel upgrades", "Lighting", "Repairs"] },
    other: { label: "Local business", head: "Look like the best choice in town.", sub: "A clear site made from your real work.", cta: "Call now", chips: ["Services", "Work", "Contact"] }
  };

  var form = document.getElementById(root.getAttribute("data-form") || "lead") || document.getElementById("intake");
  var state = { theme: "modern", color: "", type: "other", pages: ["Home", "Services", "Contact"] };
  var themeInput = form && form.querySelector('[name="theme"]');

  function detectType(text) {
    var s = (text || "").toLowerCase();
    if (/plumb|drain|leak|pipe/.test(s)) return "plumber";
    if (/salon|hair|beauty|barber|lash|nail/.test(s)) return "salon";
    if (/hvac|heat|cool|furnace|air cond/.test(s)) return "hvac";
    if (/restaurant|cafe|food|kitchen|diner|bistro/.test(s)) return "restaurant";
    if (/contract|remod|build|construct|carpenter/.test(s)) return "contractor";
    if (/electr|wir/.test(s)) return "electrician";
    return "other";
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function businessName() {
    var lk = document.getElementById("lk-name");
    if (lk) {
      var lv = String(lk.value || "").replace(/\s+/g, " ").trim();
      if (lv) return lv;
    }
    if (!form) return "Your business";
    var el = form.elements.namedItem("business") || form.querySelector('[name="business"]');
    var v = el ? String(el.value || "").replace(/\s+/g, " ").trim() : "";
    return v || "Your business";
  }
  function typeKey() {
    var sel = root.querySelector('[data-preview-type]');
    if (sel && sel.value) return sel.value;
    var tradeBtn = document.querySelector('#lk [data-pick="trade"][aria-pressed="true"]');
    if (tradeBtn && tradeBtn.value && TYPES[tradeBtn.value]) return tradeBtn.value;
    if (form) {
      var w = form.elements.what || form.elements.services;
      if (w && w.value) return detectType(w.value);
    }
    return state.type;
  }

  var picker = root.querySelector(".theme-picker");
  picker.setAttribute("role", "radiogroup");
  picker.setAttribute("aria-label", "Theme");
  var keys = ["modern", "bold", "classic", "dark", "minimal", "warm"];
  picker.innerHTML = keys.map(function (k, i) {
    var t = THEMES[k];
    var dots = t.swatches.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("");
    return '<button type="button" class="theme-card" role="radio" aria-checked="' + (k === state.theme) + '" data-theme="' + k + '" tabindex="' + (k === state.theme ? "0" : "-1") + '"><span class="swatch">' + dots + '</span>' + t.label + "</button>";
  }).join("");

  function setTheme(k, fromKey) {
    state.theme = k;
    var cards = picker.querySelectorAll(".theme-card");
    cards.forEach(function (c) {
      var on = c.getAttribute("data-theme") === k;
      c.setAttribute("aria-checked", on ? "true" : "false");
      c.tabIndex = on ? 0 : -1;
      if (on && fromKey) c.focus();
    });
    if (themeInput) themeInput.value = THEMES[k].label;
    draw();
  }
  picker.addEventListener("click", function (e) {
    var b = e.target.closest(".theme-card");
    if (b) setTheme(b.getAttribute("data-theme"));
  });
  picker.addEventListener("keydown", function (e) {
    var i = keys.indexOf(state.theme);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setTheme(keys[(i + 1) % keys.length], true); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setTheme(keys[(i - 1 + keys.length) % keys.length], true); }
    else if (e.key === "Home") { e.preventDefault(); setTheme(keys[0], true); }
    else if (e.key === "End") { e.preventDefault(); setTheme(keys[keys.length - 1], true); }
  });

  var typeSel = root.querySelector("[data-preview-type]");
  if (typeSel) typeSel.addEventListener("change", function () { state.type = typeSel.value; draw(); });
  var colorInp = root.querySelector("[data-preview-color]");
  if (colorInp) {
    colorInp.addEventListener("input", function () { state.color = colorInp.value; draw(); });
  }
  root.querySelectorAll("[data-preview-page]").forEach(function (cb) {
    cb.addEventListener("change", function () {
      state.pages = Array.prototype.slice.call(root.querySelectorAll("[data-preview-page]:checked")).map(function (x) { return x.value; });
      if (!state.pages.length) state.pages = ["Home"];
      draw();
    });
  });
  if (form) {
    ["business", "what", "services"].forEach(function (n) {
      var el = form.elements[n];
      if (el) el.addEventListener("input", draw);
    });
  }
  var lkName = document.getElementById("lk-name");
  if (lkName) lkName.addEventListener("input", draw);
  var lkRoot = document.getElementById("lk");
  if (lkRoot) lkRoot.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest('[data-pick="trade"]')) setTimeout(draw, 0);
  });

  function themeNow() {
    var t = Object.assign({}, THEMES[state.theme]);
    if (state.color) t.accent = state.color;
    return t;
  }
  function mockHTML(phone) {
    var t = themeNow();
    var typ = TYPES[typeKey()] || TYPES.other;
    var name = businessName();
    var pages = state.pages.slice(0, phone ? 3 : 5);
    var radius = t.radius + "px";
    var ctaStyle = t.btn === "outline"
      ? "background:transparent;color:" + t.accent + ";border:1px solid " + t.accent + ";border-radius:" + radius
      : "background:" + t.accent + ";color:#fff;border:0;border-radius:" + radius;
    var heroInner = '<h4 style="font-family:' + t.head + ';color:' + t.ink + ';font-size:' + (phone ? "11px" : "15px") + ';margin:0">' + typ.head + "</h4>" +
      '<p style="margin:0;color:' + t.text + '">' + typ.sub + "</p>" +
      '<span class="mock-cta" style="' + ctaStyle + '">' + typ.cta + "</span>";
    var heroStyle = t.hero === "centered"
      ? "text-align:center;background:" + t.bg
      : t.hero === "block"
        ? "background:" + t.accent + ";color:#fff"
        : "background:" + t.bg;
    if (t.hero === "block") {
      heroInner = '<h4 style="font-family:' + t.head + ';color:#fff;font-size:' + (phone ? "11px" : "15px") + ';margin:0">' + typ.head + "</h4>" +
        '<span class="mock-cta" style="background:#fff;color:' + t.ink + ';border-radius:' + radius + '">' + typ.cta + "</span>";
    }
    var cards = typ.chips.map(function (c) {
      return '<div class="mock-card" style="background:' + t.paper + ';border:1px solid ' + (t.ink === "#f3f6fb" ? "rgba(255,255,255,.12)" : "#e2e8f0") + ';border-radius:' + radius + ';padding:5px;color:' + t.text + '">' + esc(c) + "</div>";
    }).join("");
    var navRight = phone
      ? '<span class="mock-burger" aria-hidden="true"><span></span><span></span><span></span></span>'
      : '<span class="mock-links">' + pages.map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("") + "</span>";
    return '<div class="mock ' + (phone ? "is-phone" : "is-desk") + '" style="background:' + t.bg + ';color:' + t.text + ';font-family:' + t.body + ';border-radius:' + (phone ? "12px" : "8px") + '">' +
      '<div class="mock-nav" style="background:' + t.nav + ';color:' + t.navInk + '"><span class="mock-brand" style="font-family:' + t.head + '" title="' + esc(name) + '">' + esc(name) + "</span>" + navRight + "</div>" +
      '<div class="mock-hero" style="' + heroStyle + ';padding:' + (phone ? "8px" : "12px 10px") + '">' + heroInner + "</div>" +
      '<div class="mock-cards" style="grid-template-columns:repeat(' + typ.chips.length + ',minmax(0,1fr))">' + cards + "</div></div>";
  }

  var stage = root.querySelector(".device-stage");
  var live = root.querySelector("[data-preview-live]");
  var drawTimer = 0;
  function fitMock(screen) {
    if (!screen) return;
    var mock = screen.querySelector(".mock");
    if (!mock) return;
    mock.style.transform = "none";
    mock.style.width = "100%";
    var sw = screen.clientWidth;
    var sh = screen.clientHeight;
    if (!sw || !sh) return;
    var mw = mock.scrollWidth;
    var mh = mock.scrollHeight;
    var s = Math.min(1, sw / Math.max(mw, 1), sh / Math.max(mh, 1));
    if (s < 0.999) {
      mock.style.transformOrigin = "top left";
      mock.style.width = (100 / s) + "%";
      mock.style.height = (100 / s) + "%";
      mock.style.transform = "scale(" + s + ")";
    }
  }
  function paintPreview() {
    var typ = TYPES[typeKey()] || TYPES.other;
    var t = themeNow();
    var name = businessName();
    var html = '<div class="pv-laptop laptop"><div class="laptop-screen" data-desk></div></div>' +
      '<div class="pv-phone phone"><div class="phone-screen" data-ph></div></div>';
    if (!stage) return;
    stage.innerHTML = html;
    var desk = stage.querySelector("[data-desk]");
    var ph = stage.querySelector("[data-ph]");
    if (desk) desk.innerHTML = mockHTML(false);
    if (ph) ph.innerHTML = mockHTML(true);
    fitMock(desk);
    fitMock(ph);
    stage.style.opacity = "1";
    if (live) {
      live.textContent = "Preview of " + name + ", " + typ.label + ", " + t.label + " theme, accent " + t.accent + ", pages: " + state.pages.join(", ") + ".";
    }
  }
  function draw() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    clearTimeout(drawTimer);
    if (!reduce && stage) {
      stage.style.opacity = "0.72";
      drawTimer = setTimeout(paintPreview, 60);
    } else {
      paintPreview();
    }
  }

  var dl = root.querySelector("[data-preview-download]");
  if (dl) dl.addEventListener("click", function () {
    var typ = TYPES[typeKey()] || TYPES.other;
    var t = themeNow();
    var name = businessName();
    var c = document.createElement("canvas");
    c.width = 1600; c.height = 1000;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#0b1220"; ctx.fillRect(0, 0, 1600, 1000);
    // laptop
    var lx = 140, ly = 120, lw = 980, lh = 640;
    ctx.fillStyle = "#1a2233";
    roundRect(ctx, lx, ly, lw, lh, 18); ctx.fill();
    ctx.fillStyle = t.bg;
    ctx.fillRect(lx + 16, ly + 16, lw - 32, lh - 40);
    ctx.fillStyle = t.nav;
    ctx.fillRect(lx + 16, ly + 16, lw - 32, 64);
    ctx.fillStyle = t.navInk;
    ctx.font = "700 28px Manrope, Inter, sans-serif";
    ctx.fillText(name, lx + 36, ly + 58);
    ctx.fillStyle = t.hero === "block" ? t.accent : t.bg;
    ctx.fillRect(lx + 16, ly + 80, lw - 32, 240);
    ctx.fillStyle = t.hero === "block" ? "#fff" : t.ink;
    ctx.font = "800 42px " + (t.head.indexOf("Georgia") === 0 ? "Georgia" : "Manrope") + ", sans-serif";
    wrapText(ctx, typ.head, lx + 48, ly + 160, lw - 80, 48);
    ctx.fillStyle = t.accent;
    if (t.btn !== "outline") { roundRect(ctx, lx + 48, ly + 250, 160, 44, t.radius); ctx.fill(); ctx.fillStyle = "#fff"; }
    else { ctx.strokeStyle = t.accent; ctx.strokeRect(lx + 48, ly + 250, 160, 44); ctx.fillStyle = t.accent; }
    ctx.font = "700 18px Inter, sans-serif";
    ctx.fillText(typ.cta, lx + 68, ly + 278);
    // phone
    var px = 1180, py = 280, pw = 280, ph = 560;
    ctx.fillStyle = "#111";
    roundRect(ctx, px, py, pw, ph, 36); ctx.fill();
    ctx.fillStyle = t.bg;
    ctx.fillRect(px + 12, py + 12, pw - 24, ph - 24);
    ctx.fillStyle = t.nav;
    ctx.fillRect(px + 12, py + 12, pw - 24, 48);
    ctx.fillStyle = t.navInk;
    ctx.font = "700 14px Manrope, sans-serif";
    ctx.fillText(name, px + 24, py + 42);
    ctx.fillStyle = t.ink;
    ctx.font = "800 18px Manrope, sans-serif";
    wrapText(ctx, typ.head, px + 24, py + 90, pw - 48, 22);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(t.label + " theme", 60, 960);
    var a = document.createElement("a");
    a.download = (name.replace(/[^\w]+/g, "-") || "preview") + "-" + state.theme + ".png";
    a.href = c.toDataURL("image/png");
    a.click();
  });
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function wrapText(ctx, text, x, y, max, lh) {
    var words = text.split(" "), line = "", yy = y;
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > max) { ctx.fillText(line, x, yy); line = w; yy += lh; }
      else line = test;
    });
    if (line) ctx.fillText(line, x, yy);
  }

  draw();
})();
