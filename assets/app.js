/* =============================================================================
   Komið gott — demo
   Gögnin hér að neðan eru sett upp eins og þau kæmu úr vefumsjónarkerfi.
   ============================================================================= */

(function () {
  "use strict";

  /* Kveikir á földu upphafsástandi innkomu-hreyfingarinnar. Sé skriftan
     ekki keyrð helst allt efni sýnilegt. */
  document.documentElement.classList.add("js");

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* Íslensk þúsundamerking er punktur. Við setjum hana sjálf í stað þess að
     treysta á toLocaleString — vafrar án íslenskra staðsetningargagna
     detta annars í enska kommu ("7,900 kr."). */
  var kr = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " kr.";
  };

  /* ---------------------------------------------------------------- ÞÆTTIR */

  var EPISODES = [
    { code: "S05E02", season: 5, date: "12. ágúst 2026", len: "1:00:24",
      title: "Sumarfrí á enda, Sundabraut og siðanefndin",
      desc: "Fyrsti þátturinn eftir sumarleyfi: framkvæmdir sem enginn skilur, nefnd sem enginn bað um og eitt símtal sem hefði mátt bíða." },

    { code: "S05E01", season: 5, date: "5. ágúst 2026", len: "1:03:11",
      title: "Ný þáttaröð, gamlir vanar",
      desc: "Fimmta þáttaröðin fer af stað. Farið yfir sumarið, þjóðhátíðina og það sem gerðist á meðan enginn var að fylgjast með." },

    { code: "SÉR", season: 0, date: "24. júní 2026", len: "1:13:02",
      title: "Komið gott x Sólmundur Hólm", guest: "Gestur: Sólmundur Hólm",
      desc: "Sérþáttur með gesti sem kann að lesa salinn — og segir samt hlutina hvort eð er." },

    { code: "SÉR", season: 0, date: "17. júní 2026", len: "1:04:47",
      title: "Komið gott x Fiskikóngurinn", guest: "Gestur: Fiskikóngurinn",
      desc: "Þjóðhátíðardagurinn tekinn með manni sem hefur skoðun á öllu — sérstaklega því sem er á grillinu." },

    { code: "S04E19", season: 4, date: "10. júní 2026", len: "1:16:30",
      title: "Lokaþáttur þáttaraðar: uppgjörið",
      desc: "Farið yfir veturinn, bestu og verstu augnablikin, og eitt loforð sem á eftir að eldast illa." },

    { code: "S04E18", season: 4, date: "3. júní 2026", len: "1:09:12",
      title: "Sumarið er komið og með því allir skoðanapistlarnir",
      desc: "Sumarbústaðamenning, tjaldsvæðin og fólkið sem gleymir að slökkva á hljóðnemanum." },

    { code: "S04E17", season: 4, date: "27. maí 2026", len: "0:59:41",
      title: "Eftir Austurbæ: hvað gerðist eiginlega?",
      desc: "Uppgjör á uppseldum viðburði í Austurbæ, ásamt því sem ekki komst í loftið." },

    { code: "SÉR", season: 0, date: "20. maí 2026", len: "1:09:55",
      title: "Komið gott x Tyrfingur Tyrfingsson snýr aftur", guest: "Gestur: Tyrfingur Tyrfingsson",
      desc: "Hann kom, hann sagði of mikið, hann var beðinn um að koma aftur." },

    { code: "S04E16", season: 4, date: "13. maí 2026", len: "1:05:18",
      title: "Vorið, verðbólgan og vinsælasta afsökunin",
      desc: "Hagtölur sem enginn les, tilkynningar sem enginn skilur og eitt viðtal sem allir sáu." },

    { code: "S04E15", season: 4, date: "6. maí 2026", len: "1:02:07",
      title: "Fundargerðin sem enginn átti að sjá",
      desc: "Opinber gögn, óopinberar skýringar og spurningin um hver skrifaði undir." },

    { code: "S04E14", season: 4, date: "29. apríl 2026", len: "1:11:33",
      title: "Stofnanir sem mættu missa sín",
      desc: "Listi sem byrjaði í gríni og varð óþægilega langur." },

    { code: "S04E13", season: 4, date: "22. apríl 2026", len: "1:07:49",
      title: "Páskaeggið, pallborðið og pínlega þögnin",
      desc: "Páskarnir gerðir upp og farið yfir umræðuþáttinn sem allir tala um." },

    { code: "S03E20", season: 3, date: "11. desember 2025", len: "1:14:20",
      title: "Jólaþáttur — árið gert upp",
      desc: "Verðlaunaafhending ársins: besta útspilið, versta afsökunin og maður ársins að mati stelpnanna." },

    { code: "S03E19", season: 3, date: "4. desember 2025", len: "1:03:56",
      title: "Aðventan og allt sem má ekki segja í desember",
      desc: "Jólahlaðborð, starfsmannafélög og listinn yfir það sem ekki þolir dagsljós." },

    { code: "S03E18", season: 3, date: "27. nóvember 2025", len: "1:08:03",
      title: "Kjaraviðræður fyrir byrjendur",
      desc: "Farið yfir samningaviðræðurnar á mannamáli — og af hverju allir eru reiðir." },

    { code: "S03E17", season: 3, date: "20. nóvember 2025", len: "1:01:44",
      title: "Samfélagsmiðlar og siðferðið sem fauk",
      desc: "Hvenær varð allt að efni? Umræða um mörkin sem enginn man hvar liggja." },

    { code: "S02E22", season: 2, date: "15. maí 2025", len: "1:05:02",
      title: "Vorþáttur: kosningar, kaffi og kjaftasögur",
      desc: "Stjórnmálin tekin fyrir án þess að nokkur nefni orðið „málamiðlun“." },

    { code: "S02E21", season: 2, date: "8. maí 2025", len: "0:58:37",
      title: "Auðmannagleraugun",
      desc: "Þátturinn þar sem hugmyndin að gjöfinni fyrir Austurbæ varð til." },

    { code: "S02E20", season: 2, date: "1. maí 2025", len: "1:04:15",
      title: "Fyrsti maí og fólkið á svölunum",
      desc: "Kröfugöngur, ræðuhöld og spurningin um hver eigi daginn í dag." },

    { code: "S01E24", season: 1, date: "12. desember 2024", len: "1:02:28",
      title: "Fyrsta þáttaröðin kvödd",
      desc: "Hvernig þetta byrjaði, af hverju það hélt áfram og hverjir hættu að svara í símann." },

    { code: "S01E23", season: 1, date: "5. desember 2024", len: "1:07:11",
      title: "Iðnó var troðfullt — og þátturinn fór aldrei í loftið",
      desc: "Sagan af kvöldinu í Iðnó sem seldist upp á innan við sólarhring." },

    { code: "S01E21", season: 1, date: "21. nóvember 2024", len: "0:56:49",
      title: "Nafngreina og hlífa engum",
      desc: "Þátturinn sem gaf hlaðvarpinu orðsporið sem það hefur enn." }
  ];

  var SEASONS = [
    { key: "all", label: "Allt" },
    { key: "5",   label: "Þáttaröð 5" },
    { key: "4",   label: "Þáttaröð 4" },
    { key: "3",   label: "Þáttaröð 3" },
    { key: "2",   label: "Þáttaröð 2" },
    { key: "1",   label: "Þáttaröð 1" },
    { key: "0",   label: "Sérþættir" }
  ];

  var PAGE = 8;
  var state = { filter: "all", shown: PAGE };

  var listEl    = $("#eplist");
  var filtersEl = $("#filters");
  var moreBtn   = $("#moreBtn");

  function filtered() {
    if (state.filter === "all") return EPISODES;
    return EPISODES.filter(function (e) { return String(e.season) === state.filter; });
  }

  function renderEpisodes() {
    var rows = filtered().slice(0, state.shown);

    listEl.innerHTML = rows.map(function (e) {
      return '<li class="ep">' +
          '<span class="ep__no data">' + e.code + '</span>' +
          '<div>' +
            '<h3 class="ep__title">' + e.title + '</h3>' +
            '<p class="ep__desc">' + e.desc + '</p>' +
            (e.guest ? '<span class="ep__guest">☞ ' + e.guest + '</span>' : '') +
          '</div>' +
          '<div class="ep__side">' +
            '<span>' + e.date + '</span>' +
            '<span>' + e.len + '</span>' +
            '<a class="ep__listen" href="https://open.spotify.com/show/0MOGvOhy1255O5DG4xU5uj" target="_blank" rel="noopener" aria-label="Hlusta á ' + e.code + '">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' +
            '</a>' +
          '</div>' +
        '</li>';
    }).join("");

    var total = filtered().length;
    moreBtn.hidden = state.shown >= total;
    moreBtn.textContent = "Hlaða fleiri þáttum (" + Math.max(total - state.shown, 0) + " eftir)";
  }

  filtersEl.innerHTML = SEASONS.map(function (s) {
    return '<button class="chip" type="button" data-season="' + s.key + '" aria-pressed="' +
      (s.key === "all") + '">' + s.label + '</button>';
  }).join("");

  filtersEl.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-season]");
    if (!btn) return;
    state.filter = btn.dataset.season;
    state.shown = PAGE;
    $$("[data-season]", filtersEl).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    renderEpisodes();
  });

  moreBtn.addEventListener("click", function () {
    state.shown += PAGE;
    renderEpisodes();
  });

  renderEpisodes();

  /* ----------------------------------------------------------------- BÚÐIN */

  var PRODUCTS = [
    { id: "bolur-svartur", name: "„Komið gott“ bolur", variant: "Svartur, þykkt bómullarefni",
      price: 7900, sizes: ["XS", "S", "M", "L", "XL"], badge: "Nýtt",
      art: { bg: "#14121A", fg: "#F3EFE2" } },

    { id: "hettupeysa", name: "Hettupeysa", variant: "Rjómalituð, þung og góð",
      price: 12900, sizes: ["S", "M", "L", "XL"],
      art: { bg: "#F3EFE2", fg: "#14121A" } },

    { id: "taupoki", name: "Taupoki", variant: "Lífræn bómull, langar hankar",
      price: 3900, sizes: null,
      art: { bg: "#3F3BEB", fg: "#FFFFFF" } },

    { id: "derhufa", name: "Derhúfa", variant: "Útsaumað merki, stillanleg",
      price: 5900, sizes: null, badge: "Fáir eftir",
      art: { bg: "#F0B429", fg: "#17130A", round: true } },

    { id: "bolli", name: "Kaffibolli", variant: "35 cl, þolir uppþvottavél",
      price: 4500, sizes: null,
      art: { bg: "#E8E2D1", fg: "#14121A", round: true } },

    { id: "limmidar", name: "Límmiðapakki", variant: "Sex miðar, vatnsheldir",
      price: 1500, sizes: null,
      art: { bg: "#17151B", fg: "#F0B429", round: true } },

    { id: "gjafabref", name: "Gjafabréf á viðburð", variant: "Gildir á hvaða viðburð sem er",
      price: 6900, sizes: null,
      art: { bg: "#7A77FF", fg: "#FFFFFF" } },

    { id: "sokkar", name: "Sokkar", variant: "Tvö pör, stærð 36–44",
      price: 3200, sizes: null,
      art: { bg: "#0C0B0D", fg: "#7A77FF" } }
  ];

  var productsEl = $("#products");

  productsEl.innerHTML = PRODUCTS.map(function (p, i) {
    return '<article class="product rise" data-rise style="--i:' + i + '">' +
        '<div class="product__art">' +
          (p.badge ? '<span class="product__badge">' + p.badge + '</span>' : '') +
          '<span class="product__mock" style="background:' + p.art.bg + ';color:' + p.art.fg +
            (p.art.round ? ';--shape:50%' : '') + '">Komið<br>gott.</span>' +
        '</div>' +
        '<h3 class="product__name">' + p.name + '</h3>' +
        '<div class="product__meta">' +
          '<span>' + p.variant + '</span>' +
          '<span class="product__price">' + kr(p.price) + '</span>' +
        '</div>' +
        (p.sizes
          ? '<div class="sizes" role="group" aria-label="Stærð">' + p.sizes.map(function (s, j) {
              /* Miðstærðin er forvalin — nákvæmlega ein, hvað sem
                 stærðunum líður. */
              var preset = Math.floor((p.sizes.length - 1) / 2);
              return '<button type="button" data-size="' + s + '" aria-pressed="' + (j === preset) + '">' + s + '</button>';
            }).join("") + '</div>'
          : '') +
        '<button class="btn btn--ghost btn--block" type="button" data-add="' + p.id + '">Setja í körfu</button>' +
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

    var card = addBtn.closest(".product");
    var chosen = $("[data-size][aria-pressed='true']", card);
    add(addBtn.dataset.add, chosen ? chosen.dataset.size : null);
  });

  /* ----------------------------------------------------------------- KARFA */

  var STORE = "kg-cart-v1";
  var cart = [];

  try {
    var saved = window.localStorage.getItem(STORE);
    if (saved) cart = JSON.parse(saved);
  } catch (err) { /* file:// eða lokað fyrir vistun — karfan lifir bara í minni */ }

  function persist() {
    try { window.localStorage.setItem(STORE, JSON.stringify(cart)); } catch (err) {}
  }

  function product(id) {
    return PRODUCTS.filter(function (p) { return p.id === id; })[0];
  }

  function add(id, size) {
    var key = id + "|" + (size || "");
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) { line.qty += 1; }
    else { cart.push({ key: key, id: id, size: size, qty: 1 }); }
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

  var cartItems = $("#cartItems");
  var cartEmpty = $("#cartEmpty");
  var cartTotal = $("#cartTotal");
  var cartCount = $("#cartCount");
  var checkout  = $("#checkout");

  function renderCart() {
    var count = cart.reduce(function (n, l) { return n + l.qty; }, 0);
    var total = cart.reduce(function (n, l) { return n + product(l.id).price * l.qty; }, 0);

    cartCount.textContent = count;
    cartCount.hidden = count === 0;
    cartTotal.textContent = kr(total);
    cartEmpty.hidden = count > 0;
    checkout.setAttribute("aria-disabled", String(count === 0));

    cartItems.innerHTML = cart.map(function (l) {
      var p = product(l.id);
      return '<li class="line">' +
          '<span class="line__art" style="background:' + p.art.bg + ';color:' + p.art.fg + '">KG</span>' +
          '<div>' +
            '<p class="line__name">' + p.name + '</p>' +
            '<p class="line__sub">' + (l.size ? "Stærð " + l.size + " · " : "") + kr(p.price) + '</p>' +
            '<span class="qty">' +
              '<button type="button" data-bump="' + l.key + '" data-delta="-1" aria-label="Fækka">−</button>' +
              '<span>' + l.qty + '</span>' +
              '<button type="button" data-bump="' + l.key + '" data-delta="1" aria-label="Fjölga">+</button>' +
            '</span>' +
          '</div>' +
          '<span class="line__price">' + kr(p.price * l.qty) + '</span>' +
        '</li>';
    }).join("");
  }

  cartItems.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-bump]");
    if (btn) bump(btn.dataset.bump, Number(btn.dataset.delta));
  });

  checkout.addEventListener("click", function () {
    if (!cart.length) return;
    toast("Hér tæki greiðslugáttin við — <b>sýnidæmi</b>");
  });

  var cartEl = $("#cart");
  var scrim  = $("#scrim");

  function openCart(open) {
    cartEl.dataset.open = String(open);
    cartEl.setAttribute("aria-hidden", String(!open));
    scrim.hidden = false;
    scrim.dataset.open = String(open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) $("#cartClose").focus();
  }

  $("#cartOpen").addEventListener("click", function () { openCart(true); });
  $("#cartClose").addEventListener("click", function () { openCart(false); });
  scrim.addEventListener("click", function () { openCart(false); });
  cartEl.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-close-cart]")) openCart(false);
  });

  renderCart();

  /* ------------------------------------------------------------ NIÐURTALNING */

  var TARGET = new Date("2026-09-25T20:00:00Z").getTime();
  var cdEls = {
    d: $("[data-cd='d']"), h: $("[data-cd='h']"),
    m: $("[data-cd='m']"), s: $("[data-cd='s']")
  };

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function tick() {
    var left = TARGET - Date.now();
    if (left <= 0) {
      cdEls.d.textContent = cdEls.h.textContent = cdEls.m.textContent = cdEls.s.textContent = "00";
      return;
    }
    var s = Math.floor(left / 1000);
    cdEls.d.textContent = pad(Math.floor(s / 86400));
    cdEls.h.textContent = pad(Math.floor(s / 3600) % 24);
    cdEls.m.textContent = pad(Math.floor(s / 60) % 60);
    cdEls.s.textContent = pad(s % 60);
  }

  tick();
  setInterval(tick, 1000);

  /* --------------------------------------------------------------- SPILARI */

  var playBtn  = $("#playBtn");
  var playFill = $("#playFill");
  var playTime = $("#playTime");
  var LEN = 3624;              // 1:00:24 í sekúndum
  var pos = 0, timer = null;

  var ICON_PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';

  function stamp(sec) {
    var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
    return (h ? h + ":" + pad(m) : pad(m)) + ":" + pad(s);
  }

  playBtn.addEventListener("click", function () {
    if (timer) {
      clearInterval(timer);
      timer = null;
      playBtn.innerHTML = ICON_PLAY;
      playBtn.setAttribute("aria-label", "Spila sýnishorn");
      return;
    }
    playBtn.innerHTML = ICON_PAUSE;
    playBtn.setAttribute("aria-label", "Gera hlé");
    toast("Sýnidæmi — hér spilast þátturinn beint af straumnum");
    timer = setInterval(function () {
      pos = (pos + 12) % LEN;
      playFill.style.width = (pos / LEN * 100) + "%";
      playTime.textContent = stamp(pos);
    }, 250);
  });

  /* -------------------------------------------------------------- LIGHTBOX */

  var lb      = $("#lightbox");
  var lbFrame = $("#lightboxFrame");
  var lbCap   = $("#lightboxCap");
  var lbSub   = $("#lightboxSub");
  var lbShot  = null;

  $("#gallery").addEventListener("click", function (ev) {
    var shot = ev.target.closest(".shot");
    if (!shot) return;

    lbShot = shot;
    if (lbFrame.lastElementChild && lbFrame.lastElementChild.dataset.lbfill) {
      lbFrame.removeChild(lbFrame.lastElementChild);
    }

    var fill;
    if (shot.dataset.img) {
      fill = document.createElement("img");
      fill.src = shot.dataset.img;
      fill.alt = shot.dataset.cap;
    } else {
      fill = document.createElement("span");
      fill.className = "shot__art";
      fill.style.cssText = $(".shot__art", shot).getAttribute("style");
    }
    fill.dataset.lbfill = "1";
    lbFrame.appendChild(fill);

    lbCap.textContent = shot.dataset.cap;
    lbSub.textContent = shot.dataset.sub;
    lb.dataset.open = "true";
    document.body.style.overflow = "hidden";
    $("#lightboxClose").focus();
  });

  function closeLightbox() {
    lb.dataset.open = "false";
    document.body.style.overflow = "";
    if (lbShot) { lbShot.focus(); lbShot = null; }
  }

  $("#lightboxClose").addEventListener("click", closeLightbox);
  lb.addEventListener("click", function (ev) {
    if (ev.target === lb || ev.target.classList.contains("lightbox__stage")) closeLightbox();
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    if (lb.dataset.open === "true") closeLightbox();
    if (cartEl.dataset.open === "true") openCart(false);
  });

  /* ------------------------------------------------------------- PÓSTLISTI */

  $("#signupForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var input = $("#email");
    if (!input.value || input.value.indexOf("@") < 1) {
      toast("Sláðu inn gilt netfang svo við náum í þig");
      input.focus();
      return;
    }
    toast("Skráð — <b>" + input.value + "</b> fær tilkynningu um næstu miðasölu");
    input.value = "";
  });

  /* ------------------------------------------------------------ TILKYNNING */

  var toastEl = $("#toast");
  var toastTimer = null;

  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.dataset.open = "true";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.dataset.open = "false"; }, 3400);
  }

  /* ------------------------------------------------------- VALMYND & SKRUN */

  var nav = $("#nav");
  var navLinks = $("#navLinks");
  var navToggle = $("#navToggle");

  navToggle.addEventListener("click", function () {
    var open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navLinks.dataset.open = String(!open);
  });

  navLinks.addEventListener("click", function (ev) {
    if (!ev.target.closest("a")) return;
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.dataset.open = "false";
  });

  window.addEventListener("scroll", function () {
    nav.dataset.stuck = String(window.scrollY > 12);
  }, { passive: true });

  /* Virkur hlekkur í valmynd */
  var sections = ["nyjast", "thaettir", "vidburdir", "myndir", "budin", "um"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      $$("#navLinks a").forEach(function (a) {
        a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + entry.target.id));
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(function (s) { spy.observe(s); });

  /* Innkomu-hreyfing */
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.dataset.seen = "true";
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });

  $$("[data-rise]").forEach(function (el) { reveal.observe(el); });

})();
