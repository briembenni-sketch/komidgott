# Komið gott — sýnidæmi að vefsíðu

Sýnidæmi (demo) unnið eftir fyrirspurn Kristínar: viðburðir og miðasala,
hugmynd að vefverslun, myndir af viðburðum — auk þáttasafns og efnis um þær.

## Skoða síðuna

```
node serve.js
```
og opna <http://localhost:4321>.

Það er líka hægt að tvísmella beint á `index.html`. Allt er venjulegt
HTML/CSS/JS án byggingarskrefa, svo Vercel þarf hvorki byggingarskipun né
stillingar — `index.html` er í rót geymslunnar og er borin fram eins og hún er.

```
index.html
assets/
  styles.css
  app.js
  logo.jpg       · cover-artið
  tvaer.jpg      · myndin af Ólöfu og Kristínu
robots.txt       · lokar á leitarvélar meðan þetta er sýnidæmi
serve.js         · lítill vefþjónn til að skoða á tölvunni
```

## Áður en síðan fer í loftið fyrir alvöru

Síðan er lokuð fyrir leitarvélum — bæði með `robots.txt` og `noindex`-línu efst
í `index.html`. Það er gert svo tilbúnu viðburðadagsetningarnar hér að neðan
rati ekki í Google undir nafni hlaðvarpsins. **Fjarlægið hvort tveggja** þegar
efnið er orðið rétt.

## Það sem er á síðunni

| Hluti | Hvað hann gerir |
|---|---|
| **Haus** | Næsti viðburður festur efst, með niðurtalningu og hnapp á miðasölu |
| **Borði** | Rennandi lína með því sem er í gangi — nýr þáttur, miðasala, nýjar vörur |
| **Nýjasti þátturinn** | Þáttur vikunnar með spilara og tenglum á Spotify, Apple og mbl.is |
| **Þáttasafn** | Allir þættir, síaðir eftir þáttaröð, með „hlaða fleiri“ |
| **Viðburðir** | Næsti viðburður stór, svo listi yfir komandi og liðna. Tenglar á Tix |
| **Myndir** | Myndanet með stækkunarglugga |
| **Búðin** | Vörur, stærðarval og karfa sem man sig milli heimsókna |
| **Um okkur** | Ólöf og Kristín, ásamt tölum um hlaðvarpið |
| **Póstlisti** | Skráning fyrir tilkynningar um miðasölu |

Síðan virkar í síma, spjaldtölvu og tölvu, og virðir stillinguna „draga úr
hreyfingu“ í stýrikerfinu.

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
- **Allar vörur og verð í búðinni.** Vörumyndir eru merkiflötur, ekki ljósmyndir.
- **Myndirnar á myndasíðunni** nema myndin af þeim tveimur. Hinar eru
  rastaflötur sem bíða ljósmynda frá viðburðunum.
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
