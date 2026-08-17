# Komið gott — sýnidæmi að vefsíðu

Sýnidæmi (demo) unnið eftir fyrirspurn Kristínar: viðburðir og miðasala,
hugmynd að vefverslun, myndir af viðburðum — auk þáttasafns og efnis um þær.

## Skoða síðuna

```
node serve.js
```

og opna <http://localhost:4321>.

Allt er venjulegt HTML/CSS/JS án byggingarskrefa. `index.html` er í rót
geymslunnar, svo Vercel þarf hvorki byggingarskipun né stillingar.

```
index.html        · forsíða (plakat, þáttur vikunnar, næstu viðburðir, búð)
thaettir.html     · þáttasafnið
vidburdir.html    · viðburðir og miðasala
myndir.html       · myndir af viðburðum
budin.html        · vefverslunin
um.html           · um Ólöfu og Kristínu, og póstlisti
assets/
  styles.css      · öll stílskráin
  app.js          · sameiginleg skrifta (karfa, sía, spilari, myndagluggi)
  episodes.js     · þáttalistinn
  logo.jpg        · cover-artið
  tvaer.jpg       · myndin af Ólöfu og Kristínu
robots.txt        · lokar á leitarvélar meðan þetta er sýnidæmi
serve.js          · lítill vefþjónn til að skoða á tölvunni
```

Karfan fylgir milli síðna — hún er geymd í vafranum, ekki í minni einnar síðu.

## Áður en síðan fer í loftið fyrir alvöru

Síðan er lokuð fyrir leitarvélum, bæði með `robots.txt` og `noindex`-línu efst
í hverri HTML-skrá. Það er gert svo tilbúnu viðburðadagsetningarnar hér að
neðan rati ekki í Google undir nafni hlaðvarpsins. **Fjarlægið hvort tveggja**
þegar efnið er orðið rétt.

## Hönnunin

Cover-artið þeirra er þegar gott plakat — hreinn svartur, rjómaserif, bendandi
hönd. Síðan byggir á því:

- **Höndin** er ekki JPG-mynd heldur vektor sem var rakinn úr merkinu sjálfu
  (þröskuldur, tengdir hlutar, marching squares, Douglas–Peucker). Hún er því
  hnífskörp í hvaða stærð sem er, ólíkt myndinni sem varð mjúk í stækkun.
- **Miðaborðinn** neðst á forsíðunni er fullbreiður: næsti viðburður,
  niðurtalning og hnappur á miðasölu.
- **Viðburðir eru miðar** með rifgati og útstungum.
- **Vörur** eru prentfletir með þrykktu merki, ekki litaðir ferningar.
- Reitir á myndasíðunni sem bíða ljósmynda eru **titilspjöld**, ekki
  eftirlíking af ljósmynd.

Letur: Fraunces í fyrirsagnir (næsti ættingi letursins í merkinu), Archivo í
texta, DM Mono í dagsetningar, verð og tímakóða.

Útlitið er skrifað fyrir síma fyrst og stækkar upp. Prófað í 320, 360, 390,
430, 768, 1024 og 1440 px: engin lárætt skrun, engin göt í rúðunetum, allir
snertifletir yfir 32 px, andstæða texta alls staðar yfir 4,5:1, hver síða með
nákvæmlega einn `h1`, allar myndir með `alt` og fastar stærðir. Stillingin
„draga úr hreyfingu“ í stýrikerfinu slekkur á öllum hreyfingum.

## Það sem er á síðunni

| Síða | Hvað hún gerir |
|---|---|
| **Forsíða** | Plakat, þáttur vikunnar með spilara, næstu viðburðir, sýnishorn úr búðinni |
| **Þættir** | Allt safnið, síað eftir þáttaröð. Sían skrifast í slóðina svo hægt sé að deila henni |
| **Viðburðir** | Komandi viðburðir sem miðar, tenglar á Tix, listi yfir liðna viðburði |
| **Myndir** | Myndanet með stækkunarglugga |
| **Búðin** | Vörur, stærðarval og karfa sem man sig milli heimsókna og milli síðna |
| **Um okkur** | Ólöf og Kristín, tölur um hlaðvarpið og póstlisti |

## Hvað er raunverulegt og hvað er sett inn til sýnis

**Rétt:** nöfn þeirra Ólafar og Kristínar og bakgrunnur þeirra, þáttaraðir og
dagsetningar nýjustu þátta (S05E02, S05E01 og gestaþættirnir í maí og júní),
einkunnin á Apple Podcasts, tenglar á Spotify, Apple Podcasts og mbl.is, og að
Iðnó og Austurbær hafi selst upp.

**Sett inn til sýnis — þarf að leiðrétta áður en síðan fer í loftið:**

- **Titlar og lýsingar þátta.** Þættirnir heita bara „Komið gott S05E02“ í
  straumnum, svo ég skrifaði lýsandi titla til að sýna hvernig safnið lítur út
  þegar það er með þeim. Sömuleiðis eldri þættir í þáttaröðum 1–4.
- **Viðburðirnir þrír framundan** (Austurbær 25. sept., Hof 17. okt., Iðnó
  4. des.), verð og miðafjöldi. Miðatenglar vísa á forsíðu tix.is.
- **Allar vörur og verð í búðinni.** Vörumyndir eru prentfletir, ekki ljósmyndir.
- **Myndirnar** nema myndin af þeim tveimur.
- **Netföngin** `hae@komidgott.is` og `auglysingar@komidgott.is`.
- Talan „120+ þættir“.

## Hvað þarf að tengja fyrir alvöru útgáfu

- **Þættir** lesnir sjálfkrafa úr RSS-straumnum svo safnið uppfærist sjálft.
- **Karfan** tengd greiðslugátt (Rapyd, Netgíró eða Aur) og lagerstöðu.
- **Póstlistinn** tengdur við t.d. Mailchimp.
- **Vefumsjón** svo hægt sé að bæta við viðburði, myndum og vörum án þess að
  fara í kóðann.

Miðasalan er látin liggja hjá Tix frekar en að byggja hana inn í síðuna — þá
sleppa þær við að halda utan um sætaskipan og endurgreiðslur.
