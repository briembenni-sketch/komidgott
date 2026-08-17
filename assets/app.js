/* =============================================================================
   Komið gott — sameiginleg skrifta fyrir allar síður.
   Hver hluti keyrir aðeins ef viðkomandi element er á síðunni.
   ============================================================================= */

(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- TÁKN */
  /* Teiknuð tákn, ekki unicode-stafir sem gerast líkir tákni. */

  var ICON = {
    play:  '<svg class="i" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg class="i" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    plus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
    /* Höndin úr merkinu, rakin úr myndinni sjálfri */
    hand:  '<svg class="i" viewBox="0 0 845 1000" fill="currentColor" aria-hidden="true"><path d="M39.4 0Q38.1 0 25.4 12.7Q12.7 25.4 13.9 45.7Q15.2 66 7.6 76.2Q0 86.3 0 101.5Q0 116.8 53.3 219.6Q106.6 322.3 111.7 337.6Q116.8 352.8 132 375.6Q147.2 398.5 156.1 406.1Q165 413.7 176.4 437.8Q187.8 461.9 210.7 491.1Q233.5 520.3 241.1 554.5Q248.7 588.8 211.9 566Q175.1 543.1 143.4 531.7Q111.7 520.3 93.9 517.8Q76.1 515.2 60.9 521.5Q45.7 527.9 34.3 543.1Q22.8 558.4 22.8 576.1Q22.8 593.9 29.1 604Q35.5 614.2 118 670Q200.5 725.9 251.3 777.9Q302 829.9 317.3 838.8Q332.5 847.7 341.4 850.3Q350.3 852.8 388.4 850.3Q426.4 847.7 456.9 856.6Q487.3 865.5 601.5 903.5Q715.7 941.6 777.9 970.8Q840.1 1000 842.7 1000Q845.2 1000 845.2 851.5Q845.2 703 750 684Q654.8 665 620.5 653.5Q586.3 642.1 568.5 639.6Q550.8 637.1 536.8 628.2Q522.8 619.3 478.4 563.5Q434 507.6 404.8 454.3Q375.6 401 356.6 381.9Q337.6 362.9 330 359.1Q322.3 355.3 304.6 335Q286.8 314.7 257.6 270.3Q228.4 225.9 210.7 189.1Q192.9 152.3 186.6 148.5Q180.2 144.7 171.3 144.7Q162.4 144.7 137.1 112.9Q111.7 81.2 93.9 48.2Q76.1 15.2 68.5 8.8Q60.9 2.5 50.8 1.3Q40.6 0 39.4 0Z"/></svg>'
  };

  /* ------------------------------------------------------------ ÞÁTTUR */
  /* Sama færslan er teiknuð á forsíðunni og í safninu, svo hún er skrifuð
     einu sinni hér. */

  var SHOW_URL = "https://open.spotify.com/show/0MOGvOhy1255O5DG4xU5uj";

  function epItem(e) {
    return '<li class="ep">' +
        '<span class="ep__no data">' + e.code + '</span>' +
        '<div class="ep__body">' +
          '<h3 class="ep__title">' + e.title + '</h3>' +
          '<p class="ep__desc">' + e.desc + '</p>' +
          (e.guest ? '<span class="ep__guest micro">' + ICON.hand + 'Gestur: ' + e.guest + '</span>' : '') +
        '</div>' +
        '<div class="ep__meta"><span>' + e.date + '</span><span>' + e.len + '</span></div>' +
        '<a class="ep__play" href="' + SHOW_URL + '" target="_blank" rel="noopener" aria-label="Hlusta á ' + e.code + ' á Spotify">' +
          ICON.play +
        '</a>' +
      '</li>';
  }

  /* --------------------------------------------------------------- VERÐ */
  /* Intl fyrst; vafrar án íslenskra staðsetningargagna skila enskri kommu
     ("7,900"), og þá tekur handvirka sniðið við. */

  var fmt = (function () {
    try {
      var f = new Intl.NumberFormat("is-IS");
      if (f.format(7900).indexOf(".") > 0) return function (n) { return f.format(n); };
    } catch (e) { /* Intl ekki til staðar */ }
    return function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  })();

  /* Fast bil á milli tölu og einingar svo „7.900 kr.“ brotni aldrei í tvennt */
  var kr = function (n) { return fmt(n) + " kr."; };

  /* --------------------------------------------------------- TILKYNNING */

  var toastEl = $("#toast");
  var toastTimer = null;

  function toast(html) {
    if (!toastEl) return;
    toastEl.innerHTML = html;
    toastEl.dataset.open = "true";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.dataset.open = "false"; }, 3600);
  }

  /* -------------------------------------------------------------- VÖRUR */

  var PRODUCTS = [
    { id: "bolur", name: "„Komið gott“ bolur", kind: "Bolur",
      variant: "Svartur · þykkt bómullarefni", price: 7900,
      sizes: ["XS", "S", "M", "L", "XL"], badge: "Nýtt",
      art: { bg: "#100E14", fg: "#F4F0E4" } },

    { id: "hettupeysa", name: "Hettupeysa", kind: "Peysa",
      variant: "Rjómalituð · þung og góð", price: 12900,
      sizes: ["S", "M", "L", "XL"],
      art: { bg: "#F4F0E4", fg: "#100E14" } },

    { id: "taupoki", name: "Taupoki", kind: "Poki",
      variant: "Lífræn bómull · langar hankar", price: 3900, sizes: null,
      art: { bg: "#3B37E8", fg: "#FFFFFF" } },

    { id: "derhufa", name: "Derhúfa", kind: "Húfa",
      variant: "Útsaumað merki · stillanleg", price: 5900, sizes: null, badge: "Fáar eftir",
      art: { bg: "#F5B62B", fg: "#17130A" } },

    { id: "bolli", name: "Kaffibolli", kind: "Bolli",
      variant: "35 cl · þolir uppþvottavél", price: 4500, sizes: null,
      art: { bg: "#E7E1D0", fg: "#100E14" } },

    { id: "limmidar", name: "Límmiðapakki", kind: "Límmiðar",
      variant: "Sex miðar · vatnsheldir", price: 1500, sizes: null,
      art: { bg: "#191922", fg: "#F5B62B" } },

    { id: "gjafabref", name: "Gjafabréf á viðburð", kind: "Gjafabréf",
      variant: "Gildir á hvaða viðburð sem er", price: 6900, sizes: null,
      art: { bg: "#7C79FF", fg: "#0B0A1E" } },

    { id: "sokkar", name: "Sokkar", kind: "Sokkar",
      variant: "Tvö pör · stærð 36–44", price: 3200, sizes: null,
      art: { bg: "#08070A", fg: "#7C79FF" } }
  ];

  function product(id) {
    return PRODUCTS.filter(function (p) { return p.id === id; })[0];
  }

  var productsEl = $("#products");

  if (productsEl) {
    var limit = Number(productsEl.dataset.limit) || PRODUCTS.length;

    productsEl.innerHTML = PRODUCTS.slice(0, limit).map(function (p) {
      /* Miðstærðin er forvalin — nákvæmlega ein, hvað sem stærðunum líður. */
      var preset = p.sizes ? Math.floor((p.sizes.length - 1) / 2) : -1;

      return '<article class="product">' +
          '<div class="product__art">' +
            (p.badge ? '<span class="product__badge">' + p.badge + '</span>' : '') +
            '<span class="swatch" style="--bg:' + p.art.bg + ';--fg:' + p.art.fg + '">' +
              '<span class="swatch__mark">Komið<br>gott.</span>' +
              '<span class="swatch__kind">' + p.kind + '</span>' +
            '</span>' +
          '</div>' +
          '<h3 class="product__name">' + p.name + '</h3>' +
          '<p class="product__variant">' + p.variant + '</p>' +
          '<p class="product__price">' + kr(p.price) + '</p>' +
          (p.sizes
            ? '<div class="sizes" role="group" aria-label="Stærð — ' + p.name + '">' + p.sizes.map(function (s, j) {
                return '<button type="button" data-size="' + s + '" aria-pressed="' + (j === preset) + '">' + s + '</button>';
              }).join("") + '</div>'
            : '') +
          '<button class="btn btn--ghost" type="button" data-add="' + p.id + '">Setja í körfu</button>' +
        '</article>';
    }).join("");

    productsEl.addEventListener("click", function (ev) {
      var sizeBtn = ev.target.closest("[data-size]");
      if (sizeBtn) {
        $$("[data-size]", sizeBtn.parentElement).forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === sizeBtn));
        });
        return;
      }
      var addBtn = ev.target.closest("[data-add]");
      if (!addBtn) return;
      var chosen = $("[data-size][aria-pressed='true']", addBtn.closest(".product"));
      add(addBtn.dataset.add, chosen ? chosen.dataset.size : null);
    });
  }

  /* -------------------------------------------------------------- KARFA */

  var STORE = "kg-cart-v1";
  var cart = [];

  try {
    var saved = window.localStorage.getItem(STORE);
    if (saved) cart = JSON.parse(saved);
  } catch (err) { /* lokað fyrir vistun — karfan lifir þá bara í minni */ }

  /* Vörulistinn getur breyst milli heimsókna. Línur sem vísa í vöru sem er
     ekki lengur til eru hreinsaðar — annars félli útreikningur á heildar-
     upphæð og tæki alla skriftuna með sér. */
  cart = Array.isArray(cart)
    ? cart.filter(function (l) { return l && product(l.id) && l.qty > 0; })
    : [];

  function persist() {
    try { window.localStorage.setItem(STORE, JSON.stringify(cart)); } catch (err) {}
  }

  function add(id, size) {
    var key = id + "|" + (size || "");
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) { line.qty += 1; } else { cart.push({ key: key, id: id, size: size, qty: 1 }); }
    persist();
    renderCart();
    toast("<b>" + product(id).name + "</b> komið í körfuna" + (size ? " · " + size : ""));
  }

  function bump(key, delta) {
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (!line) return;
    line.qty += delta;
    if (line.qty < 1) cart = cart.filter(function (l) { return l.key !== key; });
    persist();
    renderCart();
  }

  var cartEl    = $("#cart");
  var cartItems = $("#cartItems");
  var cartEmpty = $("#cartEmpty");
  var cartTotal = $("#cartTotal");
  var cartCount = $("#cartCount");
  var checkout  = $("#checkout");
  var scrim     = $("#scrim");

  function renderCart() {
    if (!cartCount) return;
    var count = cart.reduce(function (n, l) { return n + l.qty; }, 0);
    var total = cart.reduce(function (n, l) { return n + product(l.id).price * l.qty; }, 0);

    cartCount.textContent = count;
    cartCount.hidden = count === 0;
    $("#cartOpen").setAttribute("aria-label", count ? "Opna körfu — " + count + " vörur" : "Opna körfu");

    if (!cartItems) return;
    cartTotal.textContent = kr(total);
    cartEmpty.hidden = count > 0;
    checkout.setAttribute("aria-disabled", String(count === 0));

    cartItems.innerHTML = cart.map(function (l) {
      var p = product(l.id);
      return '<li class="line">' +
          '<span class="line__art" style="background:' + p.art.bg + ';color:' + p.art.fg + '" aria-hidden="true">KG</span>' +
          '<div>' +
            '<p class="line__name">' + p.name + '</p>' +
            '<p class="line__sub">' + (l.size ? "Stærð " + l.size + " · " : "") + kr(p.price) + '</p>' +
            '<span class="qty">' +
              '<button type="button" data-bump="' + l.key + '" data-delta="-1" aria-label="Fækka um einn">' + ICON.minus + '</button>' +
              '<span>' + l.qty + '</span>' +
              '<button type="button" data-bump="' + l.key + '" data-delta="1" aria-label="Fjölga um einn">' + ICON.plus + '</button>' +
            '</span>' +
          '</div>' +
          '<span class="line__price">' + kr(p.price * l.qty) + '</span>' +
        '</li>';
    }).join("");
  }

  function openCart(open) {
    if (!cartEl) return;
    cartEl.dataset.open = String(open);
    cartEl.setAttribute("aria-hidden", String(!open));
    scrim.dataset.open = String(open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) $("#cartClose").focus();
    else $("#cartOpen").focus();
  }

  if (cartEl) {
    $("#cartOpen").addEventListener("click", function () { openCart(true); });
    $("#cartClose").addEventListener("click", function () { openCart(false); });
    scrim.addEventListener("click", function () { openCart(false); });
    cartItems.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-bump]");
      if (b) bump(b.dataset.bump, Number(b.dataset.delta));
    });
    cartEl.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-close-cart]")) openCart(false);
    });
    checkout.addEventListener("click", function () {
      if (cart.length) toast("Hér tæki greiðslugáttin við — <b>sýnidæmi</b>");
    });
  }

  renderCart();

  /* ------------------------------------------------------- NIÐURTALNING */

  var cd = { d: $("[data-cd='d']"), h: $("[data-cd='h']"), m: $("[data-cd='m']"), s: $("[data-cd='s']") };

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  if (cd.d) {
    var TARGET = new Date("2026-09-25T20:00:00Z").getTime();
    var tick = function () {
      var left = TARGET - Date.now();
      if (left <= 0) { cd.d.textContent = cd.h.textContent = cd.m.textContent = cd.s.textContent = "00"; return; }
      var s = Math.floor(left / 1000);
      cd.d.textContent = pad(Math.floor(s / 86400));
      cd.h.textContent = pad(Math.floor(s / 3600) % 24);
      cd.m.textContent = pad(Math.floor(s / 60) % 60);
      cd.s.textContent = pad(s % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------ SPILARI */

  var playBtn = $("#playBtn");

  if (playBtn) {
    var playFill = $("#playFill"), playTime = $("#playTime");
    var LEN = 3624, pos = 0, timer = null;

    var stamp = function (sec) {
      var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
      return (h ? h + ":" + pad(m) : pad(m)) + ":" + pad(s);
    };

    playBtn.addEventListener("click", function () {
      if (timer) {
        clearInterval(timer); timer = null;
        playBtn.innerHTML = ICON.play;
        playBtn.setAttribute("aria-label", "Spila sýnishorn");
        return;
      }
      playBtn.innerHTML = ICON.pause;
      playBtn.setAttribute("aria-label", "Gera hlé");
      toast("Sýnidæmi — hér spilast þátturinn beint af straumnum");
      timer = setInterval(function () {
        pos = (pos + 12) % LEN;
        playFill.style.width = (pos / LEN * 100) + "%";
        playTime.textContent = stamp(pos);
      }, 250);
    });
  }

  /* ------------------------------------------------- FYRRI ÞÆTTIR (FORSÍÐA) */

  var homeEps = $("#homeEps");

  if (homeEps && window.KG_EPISODES) {
    /* Fyrsta færslan er þátturinn sem stendur efst á forsíðunni — hún er
       sleppt hér svo sami þáttur birtist ekki tvisvar. */
    var skip = Number(homeEps.dataset.skip) || 0;
    var take = Number(homeEps.dataset.limit) || 6;
    homeEps.innerHTML = window.KG_EPISODES.slice(skip, skip + take).map(epItem).join("");
  }

  /* ----------------------------------------------------------- ÞÆTTIR */

  var listEl = $("#eplist");

  if (listEl && window.KG_EPISODES) {
    var EPISODES = window.KG_EPISODES;
    var PAGE = 8;
    var state = { filter: "all", q: "", shown: PAGE };
    var filtersEl = $("#filters"), moreBtn = $("#moreBtn");
    var searchEl = $("#epSearch"), countEl = $("#epCount");

    var SEASONS = [
      { key: "all", label: "Allt" }, { key: "5", label: "Röð 5" }, { key: "4", label: "Röð 4" },
      { key: "3", label: "Röð 3" }, { key: "2", label: "Röð 2" }, { key: "1", label: "Röð 1" },
      { key: "0", label: "Sérþættir" }
    ];

    /* Leitað er í titli, lýsingu, gesti og þáttanúmeri. Íslenskir stafir
       lækka rétt með toLowerCase, svo „SÓLMUNDUR“ finnur Sólmund. */
    var matches = function (e, q) {
      if (!q) return true;
      return (e.title + " " + e.desc + " " + (e.guest || "") + " " + e.code)
        .toLowerCase().indexOf(q) >= 0;
    };

    var filtered = function () {
      var q = state.q.trim().toLowerCase();
      return EPISODES.filter(function (e) {
        if (state.filter !== "all" && String(e.season) !== state.filter) return false;
        return matches(e, q);
      });
    };

    var renderEpisodes = function () {
      var list = filtered();
      var total = list.length;

      listEl.innerHTML = total
        ? list.slice(0, state.shown).map(epItem).join("")
        : '<li class="eps__empty">Enginn þáttur fannst. Prófaðu annað orð — eða skoðaðu allt safnið.</li>';

      moreBtn.hidden = state.shown >= total;
      moreBtn.textContent = "Hlaða fleiri þáttum (" + Math.max(total - state.shown, 0) + " eftir)";

      if (countEl) {
        /* „af 1 þætti“ en „af 2 þáttum“ — talan beygir orðið á eftir sér */
        countEl.textContent = total
          ? "Sýni " + Math.min(state.shown, total) + " af " + total + (total === 1 ? " þætti" : " þáttum")
          : (state.q.trim() ? "Ekkert fannst við leitina" : "Enginn þáttur í þessari síu");
      }
    };

    filtersEl.innerHTML = SEASONS.map(function (s) {
      return '<button class="chip" type="button" data-season="' + s.key + '" aria-pressed="' + (s.key === "all") + '">' + s.label + '</button>';
    }).join("");

    filtersEl.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-season]");
      if (!b) return;
      state.filter = b.dataset.season;
      state.shown = PAGE;
      $$("[data-season]", filtersEl).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      /* Staðan á að lifa af endurhleðslu og deilanlegan hlekk */
      var url = new URL(location.href);
      if (state.filter === "all") url.searchParams.delete("rod");
      else url.searchParams.set("rod", state.filter);
      history.replaceState(null, "", url);
      renderEpisodes();
    });

    moreBtn.addEventListener("click", function () { state.shown += PAGE; renderEpisodes(); });

    if (searchEl) {
      searchEl.addEventListener("input", function () {
        state.q = searchEl.value;
        state.shown = PAGE;
        renderEpisodes();
      });
    }

    var fromUrl = new URL(location.href).searchParams.get("rod");
    if (fromUrl && SEASONS.some(function (s) { return s.key === fromUrl; })) {
      state.filter = fromUrl;
      $$("[data-season]", filtersEl).forEach(function (x) {
        x.setAttribute("aria-pressed", String(x.dataset.season === fromUrl));
      });
    }
    renderEpisodes();
  }

  /* ---------------------------------------------------------- LIGHTBOX */

  var gallery = $("#gallery");
  var lb = $("#lightbox");

  if (gallery && lb) {
    var lbFrame = $("#lightboxFrame"), lbCap = $("#lightboxCap"), lbSub = $("#lightboxSub"), lbShot = null;

    gallery.addEventListener("click", function (ev) {
      var shot = ev.target.closest(".shot");
      if (!shot) return;
      lbShot = shot;
      var old = $("[data-lbfill]", lbFrame);
      if (old) lbFrame.removeChild(old);
      var img = document.createElement("img");
      img.src = shot.dataset.img;
      img.alt = shot.dataset.cap;
      /* Raunstærð myndarinnar svo ramminn hoppi ekki þegar hún hleðst */
      var src = $("img", shot);
      img.width = src ? src.width : 1640;
      img.height = src ? src.height : 1093;
      img.dataset.lbfill = "1";
      lbFrame.appendChild(img);
      lbCap.textContent = shot.dataset.cap;
      lbSub.textContent = shot.dataset.sub;
      lb.dataset.open = "true";
      document.body.style.overflow = "hidden";
      $("#lightboxClose").focus();
    });

    var closeLightbox = function () {
      lb.dataset.open = "false";
      document.body.style.overflow = "";
      if (lbShot) { lbShot.focus(); lbShot = null; }
    };
    $("#lightboxClose").addEventListener("click", closeLightbox);
    lb.addEventListener("click", function (ev) {
      if (ev.target === lb || ev.target.classList.contains("lightbox__stage")) closeLightbox();
    });
    window.__closeLightbox = closeLightbox;
  }

  /* --------------------------------------------------------- PÓSTLISTI */

  var form = $("#signupForm");

  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = $("#email"), err = $("#emailErr");
      var ok = /.+@.+\..+/.test(input.value.trim());
      err.hidden = ok;
      input.setAttribute("aria-invalid", String(!ok));
      if (!ok) { input.focus(); return; }
      toast("Skráð — <b>" + input.value.trim() + "</b> fær tilkynningu um næstu miðasölu");
      input.value = "";
      input.removeAttribute("aria-invalid");
    });
  }

  /* --------------------------------------------------- VALMYND & SKRUN */

  var nav = $("#nav"), navLinks = $("#navLinks"), navToggle = $("#navToggle");

  function setMenu(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navLinks.dataset.open = String(open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  navToggle.addEventListener("click", function () {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  navLinks.addEventListener("click", function (ev) { if (ev.target.closest("a")) setMenu(false); });

  window.addEventListener("scroll", function () {
    nav.dataset.stuck = String(window.scrollY > 12);
  }, { passive: true });

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    if (lb && lb.dataset.open === "true") window.__closeLightbox();
    else if (cartEl && cartEl.dataset.open === "true") openCart(false);
    else if (navLinks.dataset.open === "true") setMenu(false);
  });

})();
