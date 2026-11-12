(function () {
  var dataEl = document.getElementById("lk-data");
  var root = document.getElementById("lk");
  if (!dataEl || !root) return;

  var d = JSON.parse(dataEl.textContent);
  var pv = root.querySelectorAll(".pv");
  var name = document.getElementById("lk-name");
  var s = { trade: d.trade, style: d.style, color: d.color };

  function set(sel, text) {
    root.querySelectorAll(sel).forEach(function (n) { n.textContent = text; });
  }

  function btnInk(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (h.length !== 6) return "#fff";
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    var L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return L > 0.62 ? "#1a1405" : "#fff";
  }

  function draw() {
    var t = d.trades[s.trade], c = d.colors[s.color], biz = (name && name.value.trim()) || t.sample;
    pv.forEach(function (p) {
      p.className = "pv " + p.getAttribute("data-kind") + " t-" + s.style;
      p.style.setProperty("--pk", c);
      p.style.setProperty("--btnfg", btnInk(c));
    });
    set("[data-t=biz]", biz);
    set("[data-t=head]", t.head);
    set("[data-t=sub]", t.sub);
    set("[data-t=cta]", t.cta);
    set("[data-t=ad]", t.ad);
    set("[data-t=offer]", t.offer);
    root.querySelectorAll("[data-t=photo]").forEach(function (i) {
      i.src = t.photo;
      i.alt = t.label + " at work (stock photo)";
    });
    var chips = root.querySelector("[data-t=chips]");
    if (chips) {
      chips.textContent = "";
      t.chips.forEach(function (x) {
        var e = document.createElement("span");
        e.textContent = x;
        chips.appendChild(e);
      });
    }
    var pitch = root.querySelector("[data-t=pitch]");
    if (pitch && d.styles[s.style]) pitch.textContent = d.styles[s.style];
    root.querySelectorAll("[data-pick]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(s[b.getAttribute("data-pick")] === b.value));
    });
    root.querySelectorAll("[data-order]").forEach(function (a) {
      var base = a.getAttribute("data-order"), item = a.getAttribute("data-item");
      a.href = base + "?client_reference_id=site-" + s.style + "-" + s.color + "__" + item;
    });
    var look = (d.labels[s.style] || s.style) + " \u00b7 " + (d.labels[s.color] || s.color);
    set("[data-t=look]", look);
  }

  root.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-pick]");
    if (!b) return;
    s[b.getAttribute("data-pick")] = b.value;
    draw();
  });
  if (name) name.addEventListener("input", draw);

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, max, lh, maxLines) {
    var words = String(text || "").split(" "), line = "", lines = 0, yy = y;
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > max && line) {
        ctx.fillText(line, x, yy);
        line = w;
        yy += lh;
        lines += 1;
        if (maxLines && lines >= maxLines) return;
      } else line = test;
    });
    if (line && (!maxLines || lines < maxLines)) ctx.fillText(line, x, yy);
    return yy;
  }

  function cssVar(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name).trim();
    return v || fallback;
  }

  var dl = root.querySelector("[data-lk-download]");
  if (dl) {
    dl.addEventListener("click", function () {
      var site = root.querySelector(".pv.site") || root.querySelector("[data-kind=site]");
      var adw = root.querySelector(".pv.adw") || root.querySelector("[data-kind=adw]");
      if (!site) return;
      var photo = site.querySelector("[data-t=photo]");
      var bg = cssVar(site, "--bg", "#0b1220");
      var fg = cssVar(site, "--fg", "#fff");
      var mut = cssVar(site, "--mut", "#94a3b8");
      var card = cssVar(site, "--card", "#111b31");
      var pk = cssVar(site, "--pk", "#e8672c");
      var btnfg = cssVar(site, "--btnfg", "#fff");
      var nav = cssVar(site, "--nav", "#0b1220");
      var navInk = cssVar(site, "--navInk", "#fff");
      var radius = parseFloat(cssVar(site, "--r", "14")) || 14;
      var head = cssVar(site, "--head", "Manrope, Inter, sans-serif");
      var biz = (site.querySelector("[data-t=biz]") || {}).textContent || "Your business";
      var headline = (site.querySelector("[data-t=head]") || {}).textContent || "";
      var sub = (site.querySelector("[data-t=sub]") || {}).textContent || "";
      var cta = (site.querySelector("[data-t=cta]") || {}).textContent || "Call now";
      var adHead = (adw && adw.querySelector("[data-t=ad]") || {}).textContent || headline;
      var offer = (adw && adw.querySelector("[data-t=offer]") || {}).textContent || "";
      var chips = Array.prototype.map.call(site.querySelectorAll("[data-t=chips] span"), function (n) { return n.textContent; });
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas");
        c.width = 1600;
        c.height = 1000;
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#0b1220";
        ctx.fillRect(0, 0, 1600, 1000);
        // Phone
        var px = 120, py = 80, pw = 520, ph = 840, bezel = 16, br = 40;
        ctx.fillStyle = "#05070d";
        roundRect(ctx, px, py, pw, ph, br);
        ctx.fill();
        var ix = px + bezel, iy = py + bezel, iw = pw - bezel * 2, ih = ph - bezel * 2;
        ctx.save();
        roundRect(ctx, ix, iy, iw, ih, br - 10);
        ctx.clip();
        ctx.fillStyle = bg;
        ctx.fillRect(ix, iy, iw, ih);
        ctx.fillStyle = nav;
        ctx.fillRect(ix, iy, iw, 64);
        ctx.fillStyle = navInk;
        ctx.font = "700 22px " + head;
        ctx.fillText(biz, ix + 20, iy + 42);
        ctx.fillStyle = pk;
        roundRect(ctx, ix + iw - 130, iy + 16, 110, 32, Math.min(16, radius));
        ctx.fill();
        ctx.fillStyle = btnfg;
        ctx.font = "700 14px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(cta, ix + iw - 75, iy + 38);
        ctx.textAlign = "left";
        var hy = iy + 64, hh = 280;
        ctx.drawImage(img, ix, hy, iw, hh);
        var by = hy + hh;
        ctx.fillStyle = fg;
        ctx.font = "700 36px " + head;
        var after = wrapText(ctx, headline, ix + 22, by + 48, iw - 44, 40, 3);
        ctx.fillStyle = mut;
        ctx.font = "16px Inter, sans-serif";
        after = wrapText(ctx, sub, ix + 22, after + 36, iw - 44, 22, 3);
        ctx.fillStyle = pk;
        if (root.querySelector(".pv.t-classic, .pv.t-minimal")) {
          ctx.strokeStyle = pk;
          ctx.lineWidth = 2;
          roundRect(ctx, ix + 22, after + 24, iw - 44, 48, radius);
          ctx.stroke();
          ctx.fillStyle = pk;
        } else {
          roundRect(ctx, ix + 22, after + 24, iw - 44, 48, radius);
          ctx.fill();
          ctx.fillStyle = btnfg;
        }
        ctx.font = "700 18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(cta, ix + iw / 2, after + 55);
        ctx.textAlign = "left";
        var cy = after + 90;
        chips.forEach(function (ch, i) {
          var y = cy + i * 54;
          ctx.fillStyle = card;
          roundRect(ctx, ix + 22, y, iw - 44, 44, radius);
          ctx.fill();
          ctx.fillStyle = pk;
          ctx.beginPath();
          ctx.arc(ix + 42, y + 22, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = fg;
          ctx.font = "600 16px Inter, sans-serif";
          ctx.fillText(ch, ix + 60, y + 28);
        });
        ctx.restore();

        // Ad
        if (adw) {
          var ax = 760, ay = 140, aw = 700, ah = 720, ar = 22;
          ctx.save();
          roundRect(ctx, ax, ay, aw, ah, ar);
          ctx.clip();
          ctx.fillStyle = bg;
          ctx.fillRect(ax, ay, aw, ah);
          ctx.drawImage(img, ax, ay, aw, 400);
          ctx.fillStyle = pk;
          roundRect(ctx, ax + 24, ay + 24, Math.min(360, ctx.measureText(offer).width + 48 || 220), 36, 18);
          ctx.fill();
          ctx.fillStyle = btnfg;
          ctx.font = "700 16px Inter, sans-serif";
          ctx.fillText(offer, ax + 40, ay + 48);
          ctx.fillStyle = pk;
          ctx.fillRect(ax, ay + 400, aw, 8);
          ctx.fillStyle = fg;
          ctx.font = "700 40px " + head;
          wrapText(ctx, adHead, ax + 32, ay + 470, aw - 64, 44, 3);
          ctx.fillStyle = fg;
          ctx.font = "700 20px " + head;
          ctx.fillText(biz, ax + 32, ay + ah - 40);
          ctx.fillStyle = pk;
          roundRect(ctx, ax + aw - 170, ay + ah - 70, 138, 44, radius);
          ctx.fill();
          ctx.fillStyle = btnfg;
          ctx.font = "700 16px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(cta, ax + aw - 101, ay + ah - 42);
          ctx.textAlign = "left";
          ctx.restore();
        }

        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px Inter, sans-serif";
        var look = (d.labels[s.style] || s.style) + " \u00b7 " + (d.labels[s.color] || s.color);
        ctx.fillText("Sample preview · " + look, 60, 960);

        var a = document.createElement("a");
        a.download = (biz.replace(/[^\w]+/g, "-") || "preview") + "-" + s.style + ".png";
        a.href = c.toDataURL("image/png");
        a.click();
      };
      img.src = photo ? photo.src : "img/home/plumber.jpg";
    });
  }

  draw();
})();
