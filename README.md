# December-Dip

Een mobielvriendelijke, geïllustreerde uitnodiging met twee schermen.
Geen installatie, accountkoppeling, buildstap, externe lettertypen of bibliotheken nodig.

## Bekijken

Pak het zipbestand uit en open `index.html` in een browser.
Tik ergens op het beginscherm: de zwemmer duikt het water in en de uitnodiging opent.
Met `Terug naar de oever` of `Nog een duik?` begin je opnieuw.
De losse `december-dip-preview.html` die naast het zipbestand is geleverd, bevat
hetzelfde ontwerp in één bestand. Voor verdere aanpassingen gebruik je het mapje.

Op een telefoon gaat het bekijken het makkelijkst via de gepubliceerde GitHub Pages-link.
Sommige bestandsapps op telefoons tonen HTML namelijk als tekst in plaats van als website.

## Wat nog openstaat

Datum, tijd, zwemplek, thuisadres, de Google-spreadsheetlink en Killians foto.
Er is geen datum, jaar, adres, telefoonnummer of externe link verzonnen.
De tekst `Allergieën? App Paul!` is bewust geen WhatsApp-link: er is geen telefoonnummer opgegeven.
Er is ook geen aanmeldformulier of gastenregistratie toegevoegd.

## Gegevens invullen

Open `inhoud.js` in een teksteditor. Vul alleen de waarden tussen de dubbele
aanhalingstekens in en laat de veldnamen, komma's en overige code staan.

```js
window.DECEMBER_DIP = {
  datum: "",
  tijd: "",
  zwemplek: "",
  thuisadres: "",
  spreadsheetUrl: "",
  killianFoto: "",
  killianFotoUitsnede: "xMidYMid slice"
};
```

Een lege waarde laat de betreffende invulplek zichtbaar. Tekst in deze velden
wordt als gewone tekst verwerkt, niet als HTML. Langere locaties breken automatisch af.
Een tijd mag ook een tekst zijn, zoals een starttijd en een aparte tijd voor het opwarmen.

## Killians foto toevoegen

Plaats de echte foto in `assets/`, bijvoorbeeld onder de naam `killian.jpg`.
Vul bij `killianFoto` het pad `assets/killian.jpg` in. Let op hoofdletters in bestandsnamen.
De foto verschijnt in het staande kader achter de pan glühwein. De pan staat
ervoor, zodat Killian achter de pan lijkt te staan. Het kader is bewust leeg
gebleven: er is geen vervangende foto of gegenereerde persoon toegevoegd.

Een staande foto is het makkelijkst. De foto wordt standaard gecentreerd en
bijgesneden. Met `xMidYMin slice` bij `killianFotoUitsnede` blijft de bovenkant
van de foto in beeld. JPG, PNG, WebP, AVIF en GIF worden geaccepteerd.
Bij een ontbrekende foto blijft het lege kader zichtbaar.

## Het dipoverzicht koppelen

Maak zelf de Google-spreadsheet en stel de deelrechten zo in dat je gasten
hun dip kunnen invullen. Plak de volledige `https://`-deel-link in
`spreadsheetUrl`. Tot dat moment is de invulplek niet klikbaar. Met een
geldige link verschijnt automatisch de knop `Vul je dip in`.
De website maakt of beheert de spreadsheet niet.

## Publiceren op GitHub Pages

1. Maak een repository, of gebruik een bestaande repository voor deze uitnodiging.
2. Upload de **inhoud** van het mapje `december-dip` naar de hoofdmap van de
   repository. `index.html`, `styles.css`, `script.js` en `inhoud.js` moeten
   naast elkaar staan. Neem ook de map `assets` mee. Commit de bestanden.
3. Ga in de repository naar **Settings > Pages**.
4. Kies bij **Source** voor **Deploy from a branch**.
5. Selecteer de branch met je bestanden, bijvoorbeeld **main**, en **/ (root)**.
6. Klik op **Save**. Zodra de publicatie gereed is, toont GitHub Pages de site-link.

Er is een leeg `.nojekyll`-bestand meegeleverd. De site bestaat volledig uit
statische HTML, CSS, JavaScript en SVG en heeft geen Jekyll-verwerking nodig.
Verborgen bestanden worden soms niet meegenomen bij slepen in een uploadvenster;
de uitnodiging gebruikt geen bestanden met speciale Jekyll-namen en blijft dan ook werken.

Upload dus niet alleen het zipbestand of alleen `index.html`. Staat het hele
mapje juist in een submap van je repository, dan staat de site ook onder die submap.

Bron: GitHub Docs, 'Configuring a publishing source for your GitHub Pages site':
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Privacy

GitHub Pages-sites zijn openbaar. Zet het thuisadres en de foto pas online als
het de bedoeling is dat die openbaar bereikbaar zijn. De pagina vraagt
zoekmachines met `noindex, nofollow` niet te indexeren, maar dat is **geen**
wachtwoord, toegangsbeveiliging of garantie dat de gegevens onvindbaar blijven.
De website gebruikt zelf geen cookies, analytics, trackers of externe lettertypen.
De spreadsheet blijft een afzonderlijke Google-dienst met eigen deelinstellingen.

## Vormgeving en toegankelijkheid

- De illustraties zijn bewerkbare SVG-code in `index.html`.
- Kleuren, afmetingen en animaties staan in `styles.css`.
- De interactie en invulvelden staan in `script.js` en `inhoud.js`.
- De tekst staat in het Nederlands en de knoppen werken met het toetsenbord.
- De kleine pauzeknop stopt de decoratieve animaties en slaat de duikovergang over.
- Een systeemvoorkeur voor minder beweging wordt gerespecteerd.
- Zonder JavaScript is de uitnodiging leesbaar, maar werken de animatie en de
  gegevens uit `inhoud.js` niet. De invulplekken blijven dan zichtbaar.

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
    favicon.svg
    LEESMIJ.txt
```
