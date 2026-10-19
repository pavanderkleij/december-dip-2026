# December-Dip - uitnodiging

Een mobielvriendelijke, getekende tweepagina-uitnodiging voor **19 december**.
Tik op de oever om de zwemmer in het water te laten duiken; de uitnodiging
verschijnt automatisch. Alles draait als statische site op GitHub Pages.

## Zo open je het bestand

Pak de zip uit en open `december-dip/index.html` in een browser, of
publiceer de map op GitHub Pages. Er zijn geen modules, accounts of
bibliotheken nodig. De gebruiker kan nogmaals duiken, teruggaan en de
decoratieve animaties pauzeren. De website houdt rekening met gebruikers
die animaties hebben uitgeschakeld.

## Wat is ingevuld?

- Datum: **19 december** (zonder jaartal, want er is geen jaartal opgegeven).
- Inloop: **15.00**, bij Paul thuis. Plons: **16.00**.
- Duiklocatie: kaartlink in `inhoud.js`.
- Opwarmen: **Willem van Hillegaersbergstraat 141D, Rotterdam**.
- De gedeelde Google-spreadsheet is gekoppeld, met knop **Link naar de spreadsheet**.
- Er zit een tijdelijke, fictieve illustratie op de plek van Killians foto.
- De blaadjes en sneeuwvlokjes vallen in ongeveer dubbele grootte langs de schermranden.
- De locaties zijn gelabeld als **Plonsplek** en **Opwarmplek**; bij zwemkleren staat een zwembroek en snorkel.
- Glühwein van Killian staat in een wijnrode banner.

## Foto van Killian vervangen (alleen een bestand)

Het mapje bevat `assets/killian.jpg`. Dit is **niet** Killian, maar een
illustratieve voorbeeldafbeelding met het opschrift `TIJDELIJKE AFBEELDING`.

Zodra je een echte foto hebt:

1. Converteer de foto naar **JPG** (dit voorkomt problemen met HEIC-formaat).
2. Noem de foto exact `killian.jpg` (kleine letters).
3. Vervang `assets/killian.jpg` door die foto.
4. Upload het vervangende bestand naar GitHub.

**Je hoeft verder helemaal geen code of instellingen te wijzigen.**
De website schaalt de foto passend bij de polaroid-illustratie. Bij een
foto met het gezicht aan de bovenkant kun je desgewenst in `inhoud.js`
`killianFotoUitsnede` van `xMidYMid slice` aanpassen naar `xMidYMin slice`.

## Gegevens, adressen of links bewerken

In `inhoud.js` staan datum, tijd, thuisadres, kaartlink, Google-spreadsheetlink
en het vaste pad naar Killians afbeelding. Die waarden kun je later aanpassen.
De Google-spreadsheet moet apart de juiste deelrechten hebben, zodat
gasten kunnen invullen of ze komen en eventueel wat ze maken.

## Publiceren op GitHub Pages

1. Maak een repository op GitHub (of gebruik een bestaande repository).
2. Upload de **inhoud van de map** `december-dip/` naar de hoofdmap van de repo.
   `index.html`, `styles.css`, `script.js` en `inhoud.js` staan naast elkaar.
   Vergeet `assets/killian.jpg` niet. Commit de bestanden.
3. Open **Settings > Pages** en kies bij Source **Deploy from a branch**.
4. Selecteer de juiste branch (bijvoorbeeld `main`) en **/ (root)**.
5. Klik op **Save** en wacht tot GitHub de Pages-link toont.

Er is een `.nojekyll`-bestand meegeleverd. Er is geen buildproces nodig.

Handleiding:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Privacy

Deze GitHub Pages-site is **openbaar**; het thuisadres, de locaties en een
echte foto zijn zichtbaar voor iedereen met de link, mogelijk ook daarbuiten.
`noindex, nofollow` is alleen een verzoek aan zoekmachines, geen toegangscontrole.
De website bevat geen tracking of externe lettertypen.
De spreadsheet heeft eigen deelinstellingen; test of gasten schrijfrechten
hebben zonder jouw Google-account.

## Bestanden

```
december-dip/
  index.html
  styles.css
  script.js
  inhoud.js
  README.md
  .nojekyll
  assets/
    killian.jpg         <-- dit ene bestand later vervangen
    favicon.svg
    LEESMIJ.txt
```
