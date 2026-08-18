# Komið gott — sýnidæmi að vefsíðu

Sýnidæmi (demo) unnið eftir fyrirspurn Kristínar. Þetta er hlaðvarpsvefur
fyrst og fremst: allir hundrað þættirnir, spilanlegir beint á síðunni, og
þær tvær sem gera þá. Viðburðir, miðasala og vefverslun eru með — aftar í
röðinni.

## Skoða síðuna

```
node serve.js
```

og opna <http://localhost:4321>.

Allt er venjulegt HTML/CSS/JS án byggingarskrefa. `index.html` er í rót
geymslunnar, svo Vercel þarf hvorki byggingarskipun né stillingar.

```
index.html        · forsíða (plakat með þeim tveimur og nýjasta þætti,
                    þáttalisti, veitur, þáttastjórnendur, næsti viðburður)
thaettir.html     · þáttasafnið: 100 þættir, sía, röðun og leit
vidburdir.html    · viðburðir, niðurtalning og miðasala
budin.html        · vefverslunin
um.html           · Ólöf og Kristín, tölur um hlaðvarpið og póstlisti
assets/
  styles.css      · öll stílskráin
  app.js          · sameiginleg skrifta (spilari, þáttalistar, karfa)
  episodes.js     · þáttalistinn, byggður úr RSS-straumnum
  logo.jpg        · cover-artið
  tvaer.jpg       · myndin af Ólöfu og Kristínu
tools/
  saekja-thaetti.js · sækir strauminn og skrifar episodes.js upp á nýtt
robots.txt        · lokar á leitarvélar meðan þetta er sýnidæmi
serve.js          · lítill vefþjónn til að skoða á tölvunni
```

Bæði karfan og spilarinn fylgja milli síðna — hvort tveggja geymt í vafranum.

## Þættirnir

Þeir koma úr RSS-straumi hlaðvarpsins hjá Spotify for Podcasters:

```
node tools/saekja-thaetti.js
```

Skriftan sækir strauminn, les úr honum og skrifar `assets/episodes.js`. Þar
með uppfærist allt sem byggir á listanum: þáttaborðinn efst á forsíðunni,
kaflinn um nýjasta þáttinn, listinn á forsíðunni, allt safnið, síurnar,
leitin og spilarinn.

Straumurinn er ekki alveg snyrtilegur og skriftan tekur til eftir hann:

- **Þáttanúmerin** eru misrituð á nokkrum stöðum — `S04EO7` með bókstafnum O,
  `S0402` án E-sins, `SE01E01` með auka E. Öll þrjú eru lesin rétt, annars
  hefðu þeir þættir lent meðal sérþátta.
- **Kynningarsetningin** („Komið gott með Ólöfu Skafta og Kristínu Gunnars.“)
  stendur fremst í hverri lýsingu og er felld burt, líka afbrigðin þar sem
  gestur er talinn upp með þeim.
- **Styrktaraðilarnir** eru ýmist merktir „Okkar ljósberar:“ eða hengdir
  aftan við efnið án nokkurs formála. Þeir eru teknir frá og geymdir sér.
- **Sérþættirnir** eru flokkaðir eftir gerð: gestaþættir (`Komið gott x …`),
  kosningaspecial og annað utan þáttaraða.

Þættirnir heita ekki annað en „Komið gott S05E02“ í straumnum, svo fyrirsögn
hvers þáttar á síðunni er fyrsta setningin úr lýsingunni þeirra sjálfra. Það
er þeirra texti, ekki minn.

## Spilarinn

Ýttu á cover-artið hjá hvaða þætti sem er og hann spilast í borða neðst á
síðunni: spólun, ±15 sekúndur, hraðastilling og tenging við spilunarstýringar
stýrikerfisins (læsiskjár og heyrnartól). Hljóðið kemur beint af straumnum,
sömu skrár og Spotify og Apple sækja.

Vefurinn er venjulegar síður en ekki eitt forrit, svo hljóðið stöðvast þegar
skipt er um síðu. Staðan er geymd — hvaða þáttur og hvar hann stóð — og
spilarinn tekur upp þráðinn á næstu síðu. Vafrar leyfa sjálfvirka spilun eftir
síðuskipti aðeins hafi notandinn þegar spilað hljóð á léninu; annars bíður
spilarinn tilbúinn með réttan þátt á réttum stað. Hversu langt er komið í
hverjum þætti sést líka á cover-artinu í listanum.

**Ekki fullreynt:** spilunin var prófuð í vafra hér en sá vafri kemst hvorki
á netið né styður AAC-hljóð, svo sjálf afspilunin er óreynd. Skráin sjálf var
staðfest með beinni sókn: hún svarar, skilar `audio/mp4` og styður spólun
(`Range`). Prófið því á venjulegum vafra áður en síðan fer í loftið.

## Áður en síðan fer í loftið fyrir alvöru

Síðan er lokuð fyrir leitarvélum, bæði með `robots.txt` og `noindex`-línu efst
í hverri HTML-skrá. Það er gert svo tilbúnu viðburðadagsetningarnar hér að
neðan rati ekki í Google undir nafni hlaðvarpsins. **Fjarlægið hvort tveggja**
þegar efnið er orðið rétt.

## Hönnunin

Sama hönnunarmál og chessafterdark.is og betkastid.is: eitt djúpt, dökkt
litaheimili með rafhreim, grótesk letur, stór rúnnun, pillur og glóandi
skuggar — fært yfir á vörumerki Komið gott. Rjómalitur cover-artsins er
textaliturinn, indígóliturinn rafhreimurinn og gula merkið fylgir
viðburðunum. Höndin úr merkinu (rakin sem vektor úr myndinni sjálfri)
bendir á þær tvær á plakatinu.

- **Hetjan**: pilla með nýjasta þættinum, heitið stórt, spilunarhnappur og
  „Hlustaðu & fylgdu“-pillur — myndin af þeim í rúnnuðu spjaldi með glóð.
- **Hlaupandi borði** undir hetjunni: „Nýr þáttur alla þriðjudaga“.
- **Nýjasti þátturinn** er eitt stórt glóandi spjald með spilun.
- **Þættir eru spjöld** með cover-arti sem er um leið spilunarhnappurinn;
  tónjafnari hreyfist á þeim þætti sem er í spilun og safnið raðast eftir
  þáttaröðum með sérþættina saman aftast.
- **Spilarinn** er fljótandi, ávalur borði neðst með blur og glóð.

Letur: Bricolage Grotesque í fyrirsagnir, Hanken Grotesk í texta og
Space Mono í dagsetningar, verð og tímakóða — sami leturstakkur og
hönnunarmál og viðmiðunarsíðurnar nota.

Útlitið er skrifað fyrir síma fyrst og stækkar upp. Prófað í 390 og 1440 px
á öllum síðum: engin lárétt skrun og hver síða með nákvæmlega einn h1.
Stillingin „draga úr hreyfingu“ slekkur á borðanum og öllum hreyfingum.

## Það sem er á síðunni

| Síða | Hvað hún gerir |
|---|---|
| **Forsíða** | Plakat með þeim tveimur og nýjasta þætti neðst — hann spilast beint þaðan — sex nýlegir þættir, hlustunarveiturnar, þáttastjórnendur og næsti viðburður. Búðin er á sinni síðu |
| **Þættir** | Allir 100 þættirnir, raðaðir eftir þáttaröðum, síaðir, leitanlegir og spilanlegir. Sían skrifast í slóðina svo hægt sé að deila henni |
| **Viðburðir** | Niðurtalning að næsta viðburði, komandi viðburðir sem miðar, tenglar á Tix, listi yfir liðna viðburði |
| **Búðin** | Vörur, stærðarval og karfa sem man sig milli heimsókna og milli síðna |
| **Þáttastjórnendur** | Ólöf og Kristín, tölur um hlaðvarpið, veitutenglar og póstlisti |

## Hvað er raunverulegt og hvað er sett inn til sýnis

**Rétt — kemur beint úr straumnum eða frá þeim:** allir 100 þættirnir með
sínum réttu lýsingum, dagsetningum, lengd og hljóðskrám; þáttaraðirnar fimm og
sextán sérþættir; nöfn þeirra Ólafar og Kristínar og bakgrunnur þeirra;
einkunnin á Apple Podcasts; tenglar á Spotify, Apple Podcasts og mbl.is; og að
Iðnó og Austurbær hafi selst upp.

**Sett inn til sýnis — þarf að leiðrétta áður en síðan fer í loftið:**

- **Viðburðirnir þrír framundan** (Austurbær 25. sept., Hof 17. okt., Iðnó
  4. des.), verð og miðafjöldi. Miðatenglar vísa á forsíðu tix.is.
- **Allar vörur og verð í búðinni.** Vörumyndir eru prentfletir, ekki ljósmyndir.
- **Netföngin** `hae@komidgott.is` og `auglysingar@komidgott.is`.

## Hvað þarf að tengja fyrir alvöru útgáfu

- **Þáttalistinn** er sóttur með skriftu sem keyra þarf handvirkt. Í alvöru
  útgáfu væri hún keyrð sjálfkrafa — í byggingarskrefi hjá Vercel eða á
  tímasetningu — svo nýi þátturinn birtist á þriðjudagsmorgni án handtaka.
  Nýjasti þátturinn er líka skrifaður beint í `index.html` svo hann sjáist þótt
  skriftur bregðist; sá texti þarf að fylgja fyrstu færslunni í listanum.
- **Karfan** tengd greiðslugátt (Rapyd, Netgíró eða Aur) og lagerstöðu.
- **Póstlistinn** tengdur við t.d. Mailchimp.
- **Vefumsjón** svo hægt sé að bæta við viðburði og vörum án þess að fara í
  kóðann.

Miðasalan er látin liggja hjá Tix frekar en að byggja hana inn í síðuna — þá
sleppa þær við að halda utan um sætaskipan og endurgreiðslur.
