/* Sækir RSS-straum hlaðvarpsins og skrifar assets/episodes.js
   Keyrsla:  node tools/saekja-thaetti.js
   Straumurinn kemur frá Spotify for Podcasters (áður Anchor). */

const fs = require("fs");
const path = require("path");

const FEED = "https://anchor.fm/s/f7d6516c/podcast/rss";
const OUT = path.join(__dirname, "..", "assets", "episodes.js");

async function main() {
  const res = await fetch(FEED, { redirect: "follow" });
  if (!res.ok) throw new Error("Straumurinn svaraði " + res.status);
  const xml = await res.text();
  build(xml);
}

function build(xml) {

const MONTHS = ["janúar", "febrúar", "mars", "apríl", "maí", "júní",
                "júlí", "ágúst", "september", "október", "nóvember", "desember"];

function pick(block, tag) {
  const m = block.match(new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)</" + tag + ">"));
  if (!m) return "";
  return m[1].replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
}

function attr(block, tag, name) {
  const m = block.match(new RegExp("<" + tag + "[^>]*\\b" + name + '="([^"]*)"'));
  return m ? m[1] : "";
}

function decode(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

/* Styrktaraðilar eru ýmist merktir „Okkar ljósberar:“ eða hengdir aftan við
   efnislýsinguna án nokkurs formála. Fyrri gerðin gefur okkur orðaforðann
   sem þarf til að þekkja þá seinni. */
const SPONSORS = new Set();

function collectSponsors(html) {
  const t = decode(html).replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "");
  t.split("\n").forEach(line => {
    if (!/^\s*Okkar ljósberar/i.test(line)) return;
    line.replace(/^\s*Okkar ljósberar:?\s*/i, "")
      .split(/,| og /)
      .map(s => s.replace(/\.$/, "").trim())
      .filter(s => s.length > 2)
      .forEach(s => SPONSORS.add(s.toLowerCase()));
  });
}

/* Er halinn styrktaraðilalisti en ekki texti?

   Tvö próf. Það fyrra ber halann saman við orðaforðann. Það síðara treystir
   á að íslenskur texti er fullur af litlum orðum — og, í, á, sem, með — en
   vörumerkjalisti er það ekki. Nöfn eins og „101 hotel“ og „IDE House of
   Brands“ bera lágstafi innanborðs og eru undanskilin.
   Seinna prófið þarf til því sum merki birtast aldrei í merktu línunum og
   vantar því í orðaforðann. */
const INNER = new Set(["hotel", "miðinn", "house", "of", "brands", "is", "norður", "og",
                       "lykilmanna", "hydrate", "sands", "sans", "reykjavík", "bank"]);

function isSponsorRun(tail) {
  const trimmed = tail.trim().replace(/\.$/, "");
  if (!trimmed) return false;

  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  if (tokens.length < 3) return false;

  const strays = tokens.filter(w => /^[a-záéíóúýþæöð]/.test(w) && !INNER.has(w.toLowerCase()));
  if (strays.length === 0) return true;

  let rest = trimmed, matched = 0;
  while (rest.length) {
    const hit = [...SPONSORS]
      .filter(n => rest.toLowerCase().startsWith(n))
      .sort((a, b) => b.length - a.length)[0];
    if (!hit) return false;
    matched++;
    rest = rest.slice(hit.length).replace(/^[\s,.]*(og\s+)?/i, "");
  }
  return matched >= 2;
}

/* Lýsingin er HTML: efnið, og svo styrktaraðilarnir í einni eða annarri mynd. */
function cleanDesc(html) {
  let t = decode(html)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/ /g, " ");

  const paras = t.split("\n").map(s => s.trim()).filter(Boolean);
  const body = paras.filter(p => !/^Okkar ljósberar/i.test(p) &&
                                 !/^Hlaðvarpið er í boði/i.test(p));
  let s = body.join(" ").replace(/\s+/g, " ").trim();

  /* „Komið gott með Ólöfu Skafta og Kristínu Gunnars.“ og afbrigði hennar
     þegar gestur situr með þeim — kynning, ekki efni. */
  s = s.replace(/^Komið\s+gott\s+með\s+[^.!?]*[.!?]\s*/i, "");

  /* Styrktaraðilar hengdir aftan við efnið, án formála */
  for (let i = 0; i < 4; i++) {
    const cuts = [...s.matchAll(/[.!?]\s+/g)];
    if (!cuts.length) break;
    const last = cuts[cuts.length - 1];
    const at = last.index + last[0].length;
    if (!isSponsorRun(s.slice(at))) break;
    s = s.slice(0, last.index + 1);
  }
  if (isSponsorRun(s)) s = "";

  return s.trim();
}

const sponsors = html => {
  const t = decode(html).replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "");
  const line = t.split("\n").map(s => s.trim()).find(p => /^Okkar ljósberar/i.test(p));
  return line ? line.replace(/^Okkar ljósberar:\s*/i, "").replace(/\.$/, "").trim() : "";
};

/* Fyrsta setningin verður fyrirsögn þáttarins. Skammstafanir með punkti
   (t.d. „o.fl.“) mega ekki slíta setninguna í sundur. */
function splitFirst(s) {
  const m = s.match(/^(.+?[.!?])(\s+[A-ZÁÉÍÓÚÝÞÆÖ].*)$/s);
  if (!m || m[1].length < 25) return [s, ""];
  return [m[1].trim(), m[2].trim()];
}

function seasonEp(rawTitle) {
  /* Innsláttarvillur í straumnum: S04EO7 (bókstafurinn O), S0402 (E vantar),
     SE01E01 (auka E). Allar þrjár eiga að lesast rétt. */
  let t = rawTitle.replace(/^Komið\s+[Gg]ott\s*/i, "").trim();
  let m = t.match(/^S\s*E?\s*(\d{1,2})\s*[EO]{0,2}\s*(\d{1,2})\b/i);
  if (m) return { season: Number(m[1]), ep: Number(m[2]) };
  return null;
}

function specialTitle(raw) {
  let t = raw.trim();
  let m = t.match(/^Komið\s+gott\s+x\s+(.+)$/i);
  if (m) return { title: m[1].trim(), guest: m[1].replace(/\s+snýr\s+aftur$/i, "").trim(), kind: "gestur" };

  m = t.match(/^Kosningaspecial\s+KG\s*pod:?\s*(.*)$/i);
  if (m) return { title: "Kosningaspecial" + (m[1] ? ": " + m[1].trim() : ""), guest: null, kind: "kosningar" };

  m = t.match(/^Komið\s+gott\s+í\s+(.+)$/i);
  if (m) return { title: "Í " + m[1].trim(), guest: null, kind: "serth" };

  t = t.replace(/\s*KG\s*pod\s*$/i, "").trim();
  return { title: t, guest: null, kind: "serth" };
}

const items = xml.split("<item>").slice(1).map(b => b.split("</item>")[0]);

/* Fyrst orðaforðinn yfir styrktaraðila, svo hreinsunin — hún byggir á honum */
items.forEach(b => collectSponsors(pick(b, "description")));

const out = [];

items.forEach(block => {
  const raw = pick(block, "title");
  const descHtml = pick(block, "description");
  const desc = cleanDesc(descHtml);
  const audio = attr(block, "enclosure", "url");
  const link = pick(block, "link");
  const pub = pick(block, "pubDate");
  const dur = pick(block, "itunes:duration");
  const guid = pick(block, "guid");

  const d = new Date(pub);
  const se = seasonEp(raw);

  let title, guest = null, kind, code;
  if (se) {
    kind = "full";
    code = "S" + String(se.season).padStart(2, "0") + "E" + String(se.ep).padStart(2, "0");
    const [head, rest] = splitFirst(desc);
    title = head || raw;
    var body = rest;
  } else {
    const sp = specialTitle(raw);
    kind = sp.kind; guest = sp.guest; code = "SÉR";
    title = sp.title;
    var body = desc;
  }

  /* Lengd á forminu HH:MM:SS eða MM:SS eða sekúndur */
  let secs = 0;
  if (/^\d+$/.test(dur)) secs = Number(dur);
  else {
    const p = dur.split(":").map(Number);
    secs = p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + (p[1] || 0);
  }
  const hh = Math.floor(secs / 3600), mm = Math.floor(secs / 60) % 60;

  out.push({
    id: guid.slice(0, 8),
    code,
    season: se ? se.season : 0,
    ep: se ? se.ep : 0,
    kind,
    title: title.replace(/\s+/g, " ").trim(),
    desc: (body || "").replace(/\s+/g, " ").trim(),
    guest,
    sponsors: sponsors(descHtml),
    date: d.toISOString().slice(0, 10),
    dateText: d.getUTCDate() + ". " + MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear(),
    len: hh ? hh + " klst " + String(mm).padStart(2, "0") + " mín" : mm + " mín",
    lenShort: (hh ? hh + ":" + String(mm).padStart(2, "0") : String(mm)) + ":" + String(secs % 60).padStart(2, "0"),
    secs,
    audio,
    link
  });
});

/* Nýjast fyrst */
out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

const seasons = [...new Set(out.filter(e => e.season).map(e => e.season))].sort((a, b) => b - a);
console.log("Þættir:", out.length);
console.log("Þáttaraðir:", seasons.join(", "));
console.log("Sérþættir:", out.filter(e => !e.season).length);
console.log("Án hljóðs:", out.filter(e => !e.audio).length);
console.log("Án lýsingar:", out.filter(e => !e.title).length);
console.log("Lengsti titill:", Math.max(...out.map(e => e.title.length)));

seasons.forEach(s => {
  const eps = out.filter(e => e.season === s);
  console.log("  Röð " + s + ": " + eps.length + " þættir (" + eps[eps.length - 1].code + "–" + eps[0].code + ")");
});

const js = "/* Þáttalisti Komið gott — byggður úr RSS-straumnum\n" +
  "   https://anchor.fm/s/f7d6516c/podcast/rss\n" +
  "   Sóttur " + new Date().toISOString().slice(0, 10) + ". Keyrðu tools/saekja-thaetti.js til að uppfæra.\n" +
  "   Öll gögn hér — titlar, lýsingar, dagsetningar, lengd og hljóðskrár — koma\n" +
  "   beint úr straumnum. Ekkert er skáldað. */\n" +
  "window.KG_EPISODES = " + JSON.stringify(out, null, 1) + ";\n";

fs.writeFileSync(OUT, js);
console.log("\nSkrifað: assets/episodes.js (" + Math.round(js.length / 1024) + " KB)");
}

main().catch(err => { console.error("Mistókst:", err.message); process.exit(1); });
