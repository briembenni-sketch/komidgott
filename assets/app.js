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
    back15: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.5 5.5 7 9l4.5 3.5"/><path d="M7 9h6.5a5.5 5.5 0 1 1-5.5 5.5"/></svg>',
    fwd15:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 5.5 17 9l-4.5 3.5"/><path d="M17 9h-6.5A5.5 5.5 0 1 0 16 14.5"/></svg>',
    ext: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    /* Höndin úr merkinu, rakin úr myndinni sjálfri */
    hand:  '<svg class="i" viewBox="0 0 845 1000" fill="currentColor" aria-hidden="true"><path d="M39.4 0Q38.1 0 25.4 12.7Q12.7 25.4 13.9 45.7Q15.2 66 7.6 76.2Q0 86.3 0 101.5Q0 116.8 53.3 219.6Q106.6 322.3 111.7 337.6Q116.8 352.8 132 375.6Q147.2 398.5 156.1 406.1Q165 413.7 176.4 437.8Q187.8 461.9 210.7 491.1Q233.5 520.3 241.1 554.5Q248.7 588.8 211.9 566Q175.1 543.1 143.4 531.7Q111.7 520.3 93.9 517.8Q76.1 515.2 60.9 521.5Q45.7 527.9 34.3 543.1Q22.8 558.4 22.8 576.1Q22.8 593.9 29.1 604Q35.5 614.2 118 670Q200.5 725.9 251.3 777.9Q302 829.9 317.3 838.8Q332.5 847.7 341.4 850.3Q350.3 852.8 388.4 850.3Q426.4 847.7 456.9 856.6Q487.3 865.5 601.5 903.5Q715.7 941.6 777.9 970.8Q840.1 1000 842.7 1000Q845.2 1000 845.2 851.5Q845.2 703 750 684Q654.8 665 620.5 653.5Q586.3 642.1 568.5 639.6Q550.8 637.1 536.8 628.2Q522.8 619.3 478.4 563.5Q434 507.6 404.8 454.3Q375.6 401 356.6 381.9Q337.6 362.9 330 359.1Q322.3 355.3 304.6 335Q286.8 314.7 257.6 270.3Q228.4 225.9 210.7 189.1Q192.9 152.3 186.6 148.5Q180.2 144.7 171.3 144.7Q162.4 144.7 137.1 112.9Q111.7 81.2 93.9 48.2Q76.1 15.2 68.5 8.8Q60.9 2.5 50.8 1.3Q40.6 0 39.4 0Z"/></svg>',
    /* Tónjafnari sem hreyfist meðan þáttur spilast */
    eq: '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>'
  };

  var COVER = "assets/logo.jpg";
  var SHOW_URL = "https://open.spotify.com/show/0MOGvOhy1255O5DG4xU5uj";

  var EPISODES = window.KG_EPISODES || [];
  var byId = {};
  EPISODES.forEach(function (e) { byId[e.id] = e; });

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  var kr = function (n) { return fmt(n) + " kr."; };

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function stamp(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
    return (h ? h + ":" + pad(m) : String(m)) + ":" + pad(s);
  }

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

  /* =========================================================== SPILARI ==
     Þættirnir spilast í vafranum, beint af straumnum. Spilarinn er einn
     borði neðst á síðunni og fylgir öllum síðum.

     Spilarinn opnast aldrei af sjálfu sér: hann birtist fyrst þegar ýtt er
     á spila. Hlustunarstaðan í hverjum þætti er geymd, svo þáttur heldur
     áfram þar sem frá var horfið þegar hann er spilaður aftur.
     ==================================================================== */

  var POS_KEY = "kg-pos-v1";

  var player = {
    audio: null,
    ep: null,
    dock: null,
    seek: null,
    dragging: false
  };

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) { return fallback; }
  }

  function writeJSON(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (err) {}
  }

  var positions = readJSON(POS_KEY, {}) || {};

  function savePosition() {
    if (!player.ep || !player.audio) return;
    var t = player.audio.currentTime;
    /* Þáttur sem er nánast búinn telst kláraður og byrjar upp á nýtt */
    if (t > 5 && t < player.audio.duration - 20) positions[player.ep.id] = Math.floor(t);
    else delete positions[player.ep.id];
    writeJSON(POS_KEY, positions);
  }

  function buildDock() {
    var el = document.createElement("div");
    el.className = "dock";
    el.id = "dock";
    el.setAttribute("aria-label", "Spilari");
    el.dataset.open = "false";
    el.innerHTML =
      '<div class="dock__track">' +
        '<input class="dock__seek" id="dockSeek" type="range" min="0" max="1000" value="0" step="1" aria-label="Staðsetning í þætti">' +
      '</div>' +
      '<div class="dock__inner">' +
        '<img class="dock__art" src="' + COVER + '" width="120" height="120" alt="">' +
        '<div class="dock__meta">' +
          '<p class="dock__code data"><span data-d="code"></span>' + ICON.eq + '</p>' +
          '<p class="dock__title" data-d="title"></p>' +
        '</div>' +
        '<div class="dock__ctl">' +
          '<button class="dock__btn dock__skip" type="button" data-act="back" aria-label="Til baka um 15 sekúndur">' + ICON.back15 + '</button>' +
          '<button class="dock__play" type="button" data-act="toggle" aria-label="Spila">' + ICON.play + '</button>' +
          '<button class="dock__btn dock__skip" type="button" data-act="fwd" aria-label="Áfram um 15 sekúndur">' + ICON.fwd15 + '</button>' +
        '</div>' +
        '<p class="dock__time data"><b data-d="now">0:00</b><span data-d="dur">0:00</span></p>' +
        '<button class="dock__btn dock__rate" type="button" data-act="rate" aria-label="Hraði">1×</button>' +
        '<a class="dock__btn dock__ext" data-d="link" href="' + SHOW_URL + '" target="_blank" rel="noopener" aria-label="Opna þáttinn á Spotify">' + ICON.ext + '</a>' +
        '<button class="dock__btn dock__close" type="button" data-act="close" aria-label="Loka spilara">' + ICON.x + '</button>' +
      '</div>';
    document.body.appendChild(el);
    return el;
  }

  function dockSet(name, value) {
    var el = $('[data-d="' + name + '"]', player.dock);
    if (el) el.textContent = value;
  }

  function paintPlaying() {
    var id = player.ep ? player.ep.id : null;
    var on = !!(player.audio && !player.audio.paused);

    $$("[data-ep]").forEach(function (row) {
      var mine = row.dataset.ep === id;
      var live = mine && on;
      row.dataset.playing = String(live);
      row.dataset.current = String(mine);

      /* Aðeins reitir sem eru merktir sem tákn mega skipta um innihald —
         annars þurrkast cover-artið út með spilunarhnappinum. */
      $$("[data-icon]", row).forEach(function (el) {
        el.innerHTML = live ? ICON.pause : ICON.play;
      });
      var ep = byId[row.dataset.ep];
      $$("[data-play]", row).forEach(function (el) {
        el.setAttribute("aria-label", (live ? "Gera hlé á " : "Spila ") + (ep ? ep.code : "þætti"));
      });
    });

    if (player.dock) {
      player.dock.dataset.playing = String(on);
      var play = $(".dock__play", player.dock);
      play.innerHTML = on ? ICON.pause : ICON.play;
      play.setAttribute("aria-label", on ? "Gera hlé" : "Spila");
    }
  }

  function paintProgress() {
    if (!player.audio || !player.dock) return;
    var d = player.audio.duration || (player.ep ? player.ep.secs : 0);
    var t = player.audio.currentTime;
    dockSet("now", stamp(t));
    dockSet("dur", d ? stamp(d) : "–:––");
    if (!player.dragging && d) {
      player.seek.value = String(Math.round((t / d) * 1000));
      player.seek.style.setProperty("--p", (t / d * 100) + "%");
      player.seek.setAttribute("aria-valuetext", stamp(t) + " af " + stamp(d));
    }
    /* Hlustunarstaðan sést líka á þættinum sjálfum í listanum */
    var row = $('[data-ep="' + (player.ep ? player.ep.id : "") + '"]');
    if (row && d) row.style.setProperty("--heard", (t / d * 100) + "%");
  }

  function ensurePlayer() {
    if (player.audio) return;

    player.audio = new Audio();
    player.audio.preload = "metadata";
    player.dock = buildDock();
    player.seek = $("#dockSeek", player.dock);
    /* Eining án controls sést ekki, en í DOM-inu er hún sýnileg verkfærum */
    player.dock.appendChild(player.audio);

    var a = player.audio;

    a.addEventListener("timeupdate", paintProgress);
    a.addEventListener("durationchange", paintProgress);
    a.addEventListener("play", paintPlaying);
    a.addEventListener("pause", function () { paintPlaying(); savePosition(); });
    a.addEventListener("ended", function () {
      savePosition();
      var next = nextEpisode();
      if (next) play(next);
      else paintPlaying();
    });
    a.addEventListener("error", function () {
      player.dock.dataset.error = "true";
      toast("Náði ekki í hljóðskrána. <b>Prófaðu að opna þáttinn á Spotify</b>");
    });

    setInterval(function () { if (!a.paused) savePosition(); }, 5000);
    window.addEventListener("pagehide", savePosition);

    player.dock.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-act]");
      if (!b) return;
      var act = b.dataset.act;
      if (act === "toggle") toggle();
      if (act === "back") a.currentTime = Math.max(0, a.currentTime - 15);
      if (act === "fwd") a.currentTime = Math.min(a.duration || 1e9, a.currentTime + 15);
      if (act === "rate") cycleRate(b);
      if (act === "close") closeDock();
    });

    var onSeek = function () {
      var d = a.duration;
      if (!d) return;
      var t = (Number(player.seek.value) / 1000) * d;
      player.seek.style.setProperty("--p", (t / d * 100) + "%");
      dockSet("now", stamp(t));
      return t;
    };
    player.seek.addEventListener("pointerdown", function () { player.dragging = true; });
    player.seek.addEventListener("input", onSeek);
    player.seek.addEventListener("change", function () {
      var t = onSeek();
      if (t != null) a.currentTime = t;
      player.dragging = false;
    });
    /* Lyklaborðsnotkun sendir aðeins change, ekki pointerup */
    player.seek.addEventListener("keyup", function () { player.dragging = false; });
  }

  var RATES = [1, 1.25, 1.5, 1.75, 2];

  function cycleRate(btn) {
    var i = RATES.indexOf(player.audio.playbackRate);
    var r = RATES[(i + 1) % RATES.length];
    player.audio.playbackRate = r;
    btn.textContent = String(r).replace(".", ",") + "×";
  }

  function nextEpisode() {
    if (!player.ep) return null;
    var i = EPISODES.indexOf(player.ep);
    /* Listinn er nýjastur fyrst, svo „næsti“ er sá sem kom á undan í tíma */
    return i >= 0 && i + 1 < EPISODES.length ? EPISODES[i + 1] : null;
  }

  function load(ep, resumeAt) {
    ensurePlayer();
    if (player.ep && player.ep.id === ep.id) return;

    if (player.ep) savePosition();
    player.ep = ep;
    player.audio.src = ep.audio;

    var at = resumeAt != null ? resumeAt : (positions[ep.id] || 0);
    if (at > 0) {
      /* Staðsetningu má aðeins setja þegar vafrinn þekkir lengdina */
      var seekWhenReady = function () {
        try { player.audio.currentTime = at; } catch (err) {}
        player.audio.removeEventListener("loadedmetadata", seekWhenReady);
      };
      player.audio.addEventListener("loadedmetadata", seekWhenReady);
    }

    player.dock.dataset.open = "true";
    player.dock.dataset.error = "false";
    document.body.dataset.dock = "true";
    dockSet("code", ep.code + (ep.season ? "" : " · " + kindLabel(ep)));
    dockSet("title", ep.title);
    dockSet("dur", ep.secs ? stamp(ep.secs) : "0:00");
    dockSet("now", stamp(at));
    var link = $('[data-d="link"]', player.dock);
    if (link) link.href = ep.link || SHOW_URL;

    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: ep.title,
          artist: "Komið gott — " + ep.code,
          album: "Komið gott",
          artwork: [{ src: new URL(COVER, location.href).href, sizes: "512x512", type: "image/jpeg" }]
        });
        navigator.mediaSession.setActionHandler("play", function () { play(ep); });
        navigator.mediaSession.setActionHandler("pause", function () { player.audio.pause(); });
        navigator.mediaSession.setActionHandler("seekbackward", function () { player.audio.currentTime -= 15; });
        navigator.mediaSession.setActionHandler("seekforward", function () { player.audio.currentTime += 15; });
      } catch (err) { /* eldri vafrar */ }
    }

    paintPlaying();
    paintProgress();
  }

  function play(ep) {
    load(ep);
    var p = player.audio.play();
    if (p && p.catch) p.catch(function () { paintPlaying(); });
  }

  function toggle(ep) {
    ensurePlayer();
    if (ep && (!player.ep || player.ep.id !== ep.id)) { play(ep); return; }
    if (!player.ep) return;
    if (player.audio.paused) play(player.ep);
    else player.audio.pause();
  }

  function closeDock() {
    if (!player.audio) return;
    player.audio.pause();
    savePosition();
    player.dock.dataset.open = "false";
    document.body.dataset.dock = "false";
  }

  /* Smellur á hvaða spilunarhnapp sem er, hvar sem hann stendur á síðunni */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-play]");
    if (!b) return;
    ev.preventDefault();
    var ep = byId[b.dataset.play];
    if (ep) toggle(ep);
  });

  /* ----------------------------------------------------------- ÞÁTTUR */

  function kindLabel(e) {
    if (e.kind === "gestur") return "Gestur";
    if (e.kind === "kosningar") return "Kosningaspecial";
    return "Sérþáttur";
  }

  function epItem(e) {
    var heard = positions[e.id];
    var pct = heard && e.secs ? Math.min(100, heard / e.secs * 100) : 0;

    return '<li class="ep" data-ep="' + e.id + '" style="--heard:' + pct + '%">' +
        '<button class="ep__art" type="button" data-play="' + e.id + '" aria-label="Spila ' + esc(e.code) + '">' +
          '<img src="' + COVER + '" width="160" height="160" alt="" loading="lazy">' +
          '<span class="ep__cue" data-icon>' + ICON.play + '</span>' +
        '</button>' +
        '<div class="ep__body">' +
          '<p class="ep__no data">' +
            '<span class="ep__code">' + esc(e.code) + '</span>' +
            (e.season ? '' : '<span class="ep__kind">' + kindLabel(e) + '</span>') +
            ICON.eq +
          '</p>' +
          '<h3 class="ep__title">' + esc(e.title) + '</h3>' +
          (e.desc ? '<p class="ep__desc">' + esc(e.desc) + '</p>' : '') +
          (e.guest ? '<span class="ep__guest micro">' + ICON.hand + 'Gestur: ' + esc(e.guest) + '</span>' : '') +
        '</div>' +
        '<div class="ep__meta data"><span>' + esc(e.dateText) + '</span><span>' + esc(e.len) + '</span>' +
          (pct > 0 ? '<span class="ep__heard">Hlustað ' + Math.round(pct) + '%</span>' : '') +
        '</div>' +
        '<div class="ep__go">' +
          '<button class="ep__play" type="button" data-play="' + e.id + '" data-icon aria-label="Spila ' + esc(e.code) + '">' + ICON.play + '</button>' +
          '<a class="ep__ext" href="' + esc(e.link || SHOW_URL) + '" target="_blank" rel="noopener" aria-label="Opna ' + esc(e.code) + ' á Spotify">' + ICON.ext + '</a>' +
        '</div>' +
      '</li>';
  }

  /* --------------------------------------- NÝJASTI ÞÁTTUR OG FORSÍÐULISTI */

  var featured = EPISODES[0];

  if (featured) {
    /* Spjaldið „Nýjasti þátturinn“ */
    var feat = $("#featured");
    if (feat) {
      feat.dataset.ep = featured.id;
      $('[data-f="fcode"]', feat).textContent = featured.code + (featured.season ? " · Þáttaröð " + featured.season : " · " + kindLabel(featured));
      $('[data-f="fdate"]', feat).textContent = featured.dateText + " · " + featured.len;
      $('[data-f="ftitle"]', feat).textContent = featured.title;
      if (featured.desc) $('[data-f="fdesc"]', feat).textContent = featured.desc;
      var flink = $('[data-f="flink"]', feat);
      if (flink) flink.href = featured.link || SHOW_URL;
    }

    /* Hnappar með tómu data-play — hetjan og spjaldið — spila nýjasta
       þáttinn, hver sem hann er hverju sinni. */
    $$('[data-play=""]').forEach(function (b) { b.dataset.play = featured.id; });
  }

  var homeEps = $("#homeEps");

  if (homeEps && EPISODES.length) {
    /* Fyrsta færslan stendur þegar efst á síðunni og er sleppt hér */
    var skip = Number(homeEps.dataset.skip) || 0;
    var take = Number(homeEps.dataset.limit) || 6;
    homeEps.innerHTML = EPISODES.slice(skip, skip + take).map(epItem).join("");
    paintPlaying();
  }

  /* ----------------------------------------------------------- ÞÁTTASAFN */

  /* ----------------------------------------------------------- ÞÁTTASAFN */

  var listEl = $("#eplist");

  if (listEl && EPISODES.length) {
    var PAGE = 12;
    var state = { filter: "all", q: "", shown: PAGE };
    var filtersEl = $("#filters"), moreBtn = $("#moreBtn");
    var searchEl = $("#epSearch"), countEl = $("#epCount");

    var seasons = [];
    EPISODES.forEach(function (e) {
      if (e.season && seasons.indexOf(e.season) < 0) seasons.push(e.season);
    });
    seasons.sort(function (a, b) { return b - a; });

    var FILTERS = [{ key: "all", label: "Allt" }]
      .concat(seasons.map(function (se) { return { key: String(se), label: "Röð " + se }; }))
      .concat([{ key: "0", label: "Sérþættir" }]);

    var matches = function (e, q) {
      if (!q) return true;
      return (e.title + " " + e.desc + " " + (e.guest || "") + " " + e.code + " " + e.dateText)
        .toLowerCase().indexOf(q) >= 0;
    };

    /* Þáttaraðirnar standa heilar og í röð, sérþættirnir saman aftast */
    var order = function (a, b) {
      var sa = a.season ? 0 : 1, sb = b.season ? 0 : 1;
      if (sa !== sb) return sa - sb;
      if (!a.season) return a.date < b.date ? 1 : -1;
      if (a.season !== b.season) return b.season - a.season;
      return b.ep - a.ep;
    };

    var filtered = function () {
      var q = state.q.trim().toLowerCase();
      return EPISODES.filter(function (e) {
        if (state.filter === "0" && e.season) return false;
        if (state.filter !== "all" && state.filter !== "0" && String(e.season) !== state.filter) return false;
        return matches(e, q);
      }).sort(order);
    };

    /* Fyrirsögn þáttaraðar skýtur sér inn þegar röðin skiptir um */
    var groupHead = function (e) {
      if (!e.season) return '<li class="epgroup"><b>Sérþættir</b><span class="micro">Gestir og annað utan þáttaraða</span></li>';
      var n = EPISODES.filter(function (x) { return x.season === e.season; }).length;
      return '<li class="epgroup"><b>Þáttaröð ' + e.season + '</b><span class="micro">' + n + ' þættir</span></li>';
    };

    var renderEpisodes = function () {
      var list = filtered();
      var total = list.length;
      var slice = list.slice(0, state.shown);
      var grouped = state.filter === "all" && !state.q.trim();
      var last = null;
      var html = "";

      slice.forEach(function (e) {
        var key = e.season || 0;
        if (grouped && key !== last) { html += groupHead(e); last = key; }
        html += epItem(e);
      });

      listEl.innerHTML = total ? html
        : '<li class="eps__empty">Enginn þáttur fannst. Prófaðu annað orð eða skoðaðu allt safnið.</li>';

      moreBtn.hidden = state.shown >= total;
      moreBtn.textContent = "Hlaða fleiri þáttum (" + Math.max(total - state.shown, 0) + " eftir)";

      if (countEl) {
        countEl.textContent = total
          ? "Sýni " + Math.min(state.shown, total) + " af " + total + (total === 1 ? " þætti" : " þáttum")
          : (state.q.trim() ? "Ekkert fannst við leitina" : "Enginn þáttur í þessari síu");
      }
      paintPlaying();
    };

    filtersEl.innerHTML = FILTERS.map(function (f) {
      return '<button class="chip" type="button" data-season="' + f.key + '" aria-pressed="' + (f.key === "all") + '">' + f.label + '</button>';
    }).join("");

    filtersEl.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-season]");
      if (!b) return;
      state.filter = b.dataset.season;
      state.shown = PAGE;
      $$("[data-season]", filtersEl).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      /* Staðan lifir af endurhleðslu og deilanlegan hlekk */
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
    if (fromUrl && FILTERS.some(function (f) { return f.key === fromUrl; })) {
      state.filter = fromUrl;
      $$("[data-season]", filtersEl).forEach(function (x) {
        x.setAttribute("aria-pressed", String(x.dataset.season === fromUrl));
      });
    }
    renderEpisodes();
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
  var cart = readJSON(STORE, []) || [];

  /* Vörulistinn getur breyst milli heimsókna. Línur sem vísa í vöru sem er
     ekki lengur til eru hreinsaðar — annars félli útreikningur á heildar-
     upphæð og tæki alla skriftuna með sér. */
  cart = Array.isArray(cart)
    ? cart.filter(function (l) { return l && product(l.id) && l.qty > 0; })
    : [];

  function persist() { writeJSON(STORE, cart); }

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
    checkout.addEventListener("click", function () {
      if (cart.length) toast("Hér tæki greiðslugáttin við <b>(sýnidæmi)</b>");
    });
  }

  renderCart();

  /* ------------------------------------------------------- NIÐURTALNING */

  var cd = { d: $("[data-cd='d']"), h: $("[data-cd='h']"), m: $("[data-cd='m']"), s: $("[data-cd='s']") };

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
      toast("Skráð! <b>" + input.value.trim() + "</b> fær tilkynningu um næstu miðasölu");
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
    if (ev.key === "Escape") {
      if (cartEl && cartEl.dataset.open === "true") openCart(false);
      else if (navLinks.dataset.open === "true") setMenu(false);
      return;
    }

    /* Flýtileiðir spilarans mega ekki trufla innslátt í reit */
    var t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (!player.audio || !player.ep) return;

    if (ev.key === " " || ev.key === "k") { ev.preventDefault(); toggle(); }
    if (ev.key === "ArrowLeft") { ev.preventDefault(); player.audio.currentTime -= 15; }
    if (ev.key === "ArrowRight") { ev.preventDefault(); player.audio.currentTime += 15; }
  });

})();
