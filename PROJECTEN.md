# Projecten toevoegen of aanpassen

Alle projecten op `site/projecten.html` staan in één bestand:

**`site/assets/data/projecten.js`**

Je hoeft dus geen nieuwe pagina te maken en niets in de HTML te veranderen. Project toevoegen of tekst aanpassen, bestand opslaan, klaar. De pagina bouwt zichzelf op.

Het bestand begint met `window.EIPI_PROJECTEN = {` en eindigt met `};`. Laat die eerste en laatste regel staan, daar zit de rest tussen.

---

## Zo werkt het bestand

Bovenaan staan twee blokken met uitleg (`_uitleg` en `_velden`). Die mag je laten staan, ze doen niets. Daaronder staat de lijst met projecten.

Elk project ziet er zo uit:

```json
{
  "id": "gevel-monument",
  "titel": "Verlichte letters op een monument",
  "type": "Gevelreclame",
  "plaats": "Purmerend",
  "voorbeeld": true,
  "samenvatting": "Eén regel die op de kaart staat.",
  "omschrijving": [
    "Eerste alinea van het verhaal.",
    "Tweede alinea."
  ],
  "wat": [
    "Wat we deden, punt één",
    "Wat we deden, punt twee"
  ],
  "kaartbeeld": "assets/img/gevel-monument.png",
  "beelden": [
    { "src": "assets/img/gevel-monument.png", "alt": "Verlichte gevelletters op een monumentaal pand" },
    { "src": "assets/img/lichtbak-special.jpg", "alt": "Lichtbak met een opvallend beeld erin" }
  ]
}
```

| Veld | Verplicht | Wat het doet |
|---|---|---|
| `id` | ja | Korte naam zonder spaties. Moet uniek zijn: hier hangt het adres van het project aan (`projecten.html#project-gevel-monument`). |
| `titel` | ja | De naam van het project, groot op de kaart en in het paneel. |
| `type` | ja | Bepaalt ook de filterknoppen bovenaan. Gebruik steeds dezelfde spelling, dan komt er één knop per soort werk. |
| `plaats` | nee | Klein label boven de titel. |
| `voorbeeld` | nee | Zet `true` zolang het een voorbeeld is. Dan komt er "Voorbeeld" op de kaart te staan. Weghalen zodra het echt werk van de klant is. |
| `samenvatting` | ja | Eén of twee regels op de kaart. |
| `omschrijving` | ja | De alinea's in het uitgeklapte paneel. Elk stuk tussen aanhalingstekens is een alinea. |
| `wat` | ja | Korte punten: wat we gemaakt of gedaan hebben. |
| `kaartbeeld` | nee | Welke foto je op de kaart ziet. Vul de bestandsnaam precies in zoals hij bij `beelden` staat. Laat je dit weg, dan pakt hij de eerste foto. |
| `beelden` | ja | Twee tot vier foto's, in de volgorde van de carrousel. |

Let op: na elk stuk tekst een komma, behalve na het laatste stuk in een blok. Aanhalingstekens binnen de tekst moeten met een `\` ervoor: `"een 3,5 meter \"hoge\" lichtbak"`.

---

## Lichte versies voor de kaartjes in de hero

De foto's in de waaier bovenaan zijn klein. Daarvoor staat van elke foto een
lichte kopie in `site/assets/img/klein/` (dezelfde naam, maar `.jpg`). Zet je
een nieuwe foto in `site/assets/img/`, maak dan ook zo'n lichte versie; is die
er niet, dan pakt de pagina automatisch het origineel.

## Foto's op de kaart en in het project

In het overzicht staat **één foto per project**: die van `kaartbeeld`. Klik je het project open, dan zie je in het paneel **alle foto's als carrousel**:

- pijltjes links en rechts, en met de pijltjestoetsen op je toetsenbord;
- op de telefoon veeg je naar de volgende;
- onder de foto staan kleine thumbnails, met een rode rand om de foto die je ziet;
- rechtsonder staat hoeveel foto's er zijn, bijvoorbeeld **2 / 3**.

De volgorde in de carrousel is: eerst de foto van `kaartbeeld`, daarna de rest in de volgorde waarin ze bij `beelden` staan. Wil je een andere foto vooraan? Verzet die ene regel `kaartbeeld`.

Onderaan het overzicht staat één leeg vak (als het aantal projecten niet precies de rij vult) met een kaart uit de werkplaats: daarop staat wat er in Purmerend gemaakt wordt. Die vult zichzelf, je hoeft er niets voor te doen.

## Foto's

1. Zet de foto in `site/assets/img/`.
2. Verwijs er zo naar: `"src": "assets/img/mijn-foto.jpg"` — dus met `assets/` ervoor, geen hoofdletter, geen volledige link.
3. Geef elke foto een Nederlandse `alt`: één zin die beschrijft wat er te zien is. Dat is voor mensen die de foto niet kunnen zien, en het helpt bij Google.

De foto's die er nu in staan zijn **tijdelijke foto's** uit de bestaande beeldset. Ze hebben een badge "Tijdelijke foto" en dat mag weg zodra er echt werk van de klant op staat. Wat er nog nodig is, staat in `TODO.md`.

---

## Nieuwe foto's aanleveren

Lever per project 2 tot 4 foto's, liggend (minstens 1600 pixels breed), en het liefst:

- één overzicht van het hele werk,
- één detail waar je vakmanschap ziet,
- één foto in gebruik, of van dichtbij.

Geef per foto door welk project het is en wat erop te zien is.

---

## Controleren of het goed staat

Open `site/projecten.html` in de browser (dubbelklikken mag, je hebt geen server nodig) en kijk of:

- je nieuwe project tussen de kaarten staat,
- de filterknop van het nieuwe `type` er is,
- het paneel opent als je op de kaart klikt,
- de foto's te zien zijn.

Zie je een lege pagina of geen projecten? Dan is er waarschijnlijk een komma of een aanhalingsteken fout in het JSON-bestand. Zet het bestand dan in een JSON-controle (bijvoorbeeld jsonlint.com) en kijk waar de fout zit.

Het aantal voorbeeldprojecten is nu acht. Dat is genoeg om te laten zien hoe de pagina werkt; de bedoeling is dat ze op termijn vervangen worden door echt werk.
