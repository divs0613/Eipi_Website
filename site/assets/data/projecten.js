/* Eipi Belettering - de projecten van de projectenpagina.
   Dit is één bestand met alle projecten. Je kunt er zelf een project bij zetten
   door een blok tussen { en } te kopiëren en aan te passen. Zet de foto's in
   site/assets/img/ en vul de bestandsnaam in bij beelden. Met kaartbeeld kies je
   welke foto op de kaart staat. Laat voorbeeld op true staan tot het echt werk is.
   Uitleg staat in PROJECTEN.md. Vraag het aan Winq als je ergens niet uitkomt.

   Onder _home staat welke projecten op de homepage komen te staan: het aantal
   en de volgorde. Haal je er een id uit, dan schuift er automatisch een ander
   project uit de lijst naar voren. Zet het aantal op 0 om de rij op de
   homepage leeg te laten. */
window.EIPI_PROJECTEN = {
  "_uitleg": "Hier staan de projecten van de projectenpagina. Je kunt zelf een project toevoegen door een blok tussen { en } te kopieren en aan te passen. Zet de foto's in de map site/assets/img/ en vul de bestandsnaam in bij beelden. Met kaartbeeld kies je welke foto op de kaart staat; de andere foto's komen daarachter in de carrousel. Laat voorbeeld op true staan tot je een project echt hebt gemaakt; zet hem daarna op false. Vraag het aan Winq als je ergens niet uitkomt.",
  "_velden": {
    "id": "korte naam zonder spaties, alleen voor de link in de adresbalk",
    "titel": "zoals hij op de kaart en in het paneel staat",
    "type": "de dienst, bijvoorbeeld Gevelreclame. Hierop kun je op de pagina filteren",
    "plaats": "waar het staat, bijvoorbeeld Purmerend",
    "samenvatting": "één regel die op de kaart past",
    "omschrijving": "twee of drie alinea's voor in het paneel",
    "wat": "lijstje met wat we voor dit project deden",
    "kaartbeeld": "de foto die op de kaart staat, precies zoals hij bij beelden staat. Laat weg voor de eerste foto",
    "beelden": "twee tot vier foto's met een Nederlandse alt-tekst, in de volgorde van de carrousel",
    "voorbeeld": "true zolang het een voorbeeld is, daarna false"
  },
  "_home": {
    "uitleg": "Welke projecten staan er op de homepage, en hoeveel? Zet hier het aantal en de volgorde van de id's. Een id dat je weglaat of weghaalt, wordt automatisch aangevuld met een ander project. Met uitgelicht kies je welk project groot op de projectenpagina staat.",
    "aantal": 6,
    "projecten": [
      "gevel-monument",
      "wagenpark",
      "kantoor-glas",
      "wayfinding",
      "specials",
      "horeca-winkel"
    ],
    "uitgelicht": "wagenpark"
  },
  "projecten": [
    {
      "id": "puien",
      "titel": "Puien",
      "type": "Gevelreclame",
      "plaats": "Purmerend",
      "samenvatting": "Gevelletters en raamvisuals over de volle breedte van de pui.",
      "omschrijving": [
        "Gevelletters en raamvisuals over de volle breedte van de pui, in één keer gemonteerd. Eén ontwerp dat op de hele pui klopt, in plaats van losse letters die er later bij zijn gezocht.",
        "We tekenen het eerst uit, frezen en printen het in eigen huis en hangen het met de eigen hoogwerker op. Zo blijft de hele klus bij ons en houd je één aanspreekpunt."
      ],
      "wat": [
        "Gevelletters",
        "Raamvisuals over de volle breedte",
        "Montage met eigen hoogwerker"
      ],
      "kaartbeeld": "assets/img/pui-gevelletters.jpg",
      "beelden": [
        {
          "src": "assets/img/pui-gevelletters.jpg",
          "alt": "Gevelletters en raamvisuals over de volle breedte van een winkelpui"
        },
        {
          "src": "assets/img/gevelreclame-caravan-centrum.png",
          "alt": "Lichtreclame aan de gevel van een bedrijfspand"
        },
        {
          "src": "assets/img/gevel-monument.png",
          "alt": "Verlichte gevelletters en een lichtbak op een monumentaal pand"
        }
      ],
      "voorbeeld": true
    },
    {
      "id": "gevel-monument",
      "titel": "Verlichte letters op een monument",
      "type": "Gevelreclame",
      "plaats": "Purmerend",
      "samenvatting": "Verlichte letters en een lichtbak op een monumentaal pand.",
      "omschrijving": [
        "Verlichte letters en een lichtbak op een monumentaal pand, netjes weggewerkt zodat het pand zelf voorop blijft staan. 's Avonds goed leesbaar vanaf de straat.",
        "Bij een oud pand komt het aan op de bevestiging: zo min mogelijk in het metselwerk, en alles wat je ziet strak in lijn."
      ],
      "wat": [
        "Freesletters en doosletters",
        "Lichtbak op maat",
        "Directe verlichting"
      ],
      "kaartbeeld": "assets/img/gevel-monument.png",
      "beelden": [
        {
          "src": "assets/img/gevel-monument.png",
          "alt": "Verlichte gevelletters en een lichtbak op een monumentaal pand"
        },
        {
          "src": "assets/img/lichtbak-special.jpg",
          "alt": "Lichtbak met een opvallend beeld erin"
        },
        {
          "src": "assets/img/pui-gevelletters.jpg",
          "alt": "Gevelletters en raamvisuals over de volle breedte van een winkelpui"
        }
      ],
      "voorbeeld": true
    },
    {
      "id": "wayfinding",
      "titel": "Terrein en routing",
      "type": "Bewegwijzering",
      "plaats": "Noord-Holland",
      "samenvatting": "Terreinborden en routing die buiten jaren meegaan.",
      "omschrijving": [
        "Terreinborden en routing die buiten jaren meegaan, van de parkeerplaats tot de voordeur. Eén systeem, zodat een bezoeker overal dezelfde weg ziet.",
        "We bedenken het, maken het en hangen het op. Ook als er later een gebouw bij komt, sluit het aan op wat er al staat."
      ],
      "wat": [
        "Terreinborden",
        "Routing en verwijsborden",
        "Montage op het terrein"
      ],
      "kaartbeeld": "assets/img/terreinbord-bewegwijzering.jpg",
      "beelden": [
        {
          "src": "assets/img/terreinbord-bewegwijzering.jpg",
          "alt": "Terreinbord met bewegwijzering langs een oprit"
        },
        {
          "src": "assets/img/wooncomplex-signing.jpg",
          "alt": "Bewegwijzering en banieren bij een groot wooncomplex"
        },
        {
          "src": "assets/img/gevelreclame-caravan-centrum.png",
          "alt": "Lichtreclame aan de gevel van een bedrijfspand"
        }
      ],
      "voorbeeld": true
    },
    {
      "id": "groot-werk",
      "titel": "Groot werk",
      "type": "Bewegwijzering",
      "plaats": "Purmerend",
      "samenvatting": "Signing voor grote wooncomplexen, inclusief vlaggen en banieren.",
      "omschrijving": [
        "Signing voor grote wooncomplexen: gevelletters, banieren, vlaggen en de bewegwijzering erbij. Alles in dezelfde stijl, zodat het als één geheel leest.",
        "Bij zulke projecten komt veel samen: ontwerp, productie, planning en montage op een plek waar altijd iemand langskomt."
      ],
      "wat": [
        "Gevelletters",
        "Banieren en vlaggen",
        "Bewegwijzering",
        "Planning met de opdrachtgever"
      ],
      "kaartbeeld": "assets/img/wooncomplex-signing.jpg",
      "beelden": [
        {
          "src": "assets/img/terreinbord-bewegwijzering.jpg",
          "alt": "Terreinbord met bewegwijzering langs een oprit"
        },
        {
          "src": "assets/img/wooncomplex-signing.jpg",
          "alt": "Bewegwijzering en banieren bij een groot wooncomplex"
        },
        {
          "src": "assets/img/gevelreclame-caravan-centrum.png",
          "alt": "Lichtreclame aan de gevel van een bedrijfspand"
        }
      ],
      "voorbeeld": true
    },
    {
      "id": "wagenpark",
      "titel": "Een wagenpark in één huisstijl",
      "type": "Autobelettering",
      "plaats": "Purmerend",
      "samenvatting": "Eén bus of een compleet wagenpark in dezelfde huisstijl.",
      "omschrijving": [
        "Eén bus of een compleet wagenpark in dezelfde huisstijl. De voertuigtemplates liggen klaar, dus je ziet het ontwerp voordat er iets gesneden wordt.",
        "Ramen blinderen kan in dezelfde ronde mee, RDW-erkend, dus gewoon toegestaan op de weg."
      ],
      "wat": [
        "Snijfolie in huisstijlkleuren",
        "Ramen blinderen (RDW erkend)",
        "Montage in eigen werkplaats"
      ],
      "kaartbeeld": "assets/img/wagenpark-huisstijl.jpg",
      "beelden": [
        {
          "src": "assets/img/wagenpark-huisstijl.jpg",
          "alt": "Rij bussen in dezelfde huisstijl op een rij"
        },
        {
          "src": "assets/img/gevelreclame-caravan-centrum.png",
          "alt": "Lichtreclame aan de gevel van een bedrijfspand"
        },
        {
          "src": "assets/img/werkplaats-snijplotters.jpg",
          "alt": "Snijplotters in de eigen werkplaats in Purmerend"
        }
      ],
      "voorbeeld": true
    },
    {
      "id": "kantoor-glas",
      "titel": "Kantoor achter glas",
      "type": "Raamfolie",
      "plaats": "Purmerend",
      "samenvatting": "Van één ruit tot een compleet kantoorpand.",
      "omschrijving": [
        "Van één ruit tot een compleet kantoorpand: blinderingsfolie voor privacy, zonwerende folie tegen hitte en schittering, of zandstraalfolie met matglas-effect.",
        "Op de zuidkant scheelt het echt: met zonwerende folie blijft het binnen rustiger en hoef je de airco minder te laten werken."
      ],
      "wat": [
        "Zandstraalfolie",
        "Zonwerende folie",
        "Montage buiten kantooruren"
      ],
      "kaartbeeld": "assets/img/zandstraalfolie-kantoor.jpg",
      "beelden": [
        {
          "src": "assets/img/zandstraalfolie-kantoor.jpg",
          "alt": "Zandstraalfolie op het glas van een kantoorpand"
        },
        {
          "src": "assets/img/artwall-ontvangstruimte.jpg",
          "alt": "Artwall in de ontvangstruimte van een kantoor"
        },
        {
          "src": "assets/img/pui-gevelletters.jpg",
          "alt": "Gevelletters en raamvisuals over de volle breedte van een winkelpui"
        }
      ],
      "voorbeeld": true
    },
    {
      "id": "horeca-winkel",
      "titel": "Binnen bij horeca en winkel",
      "type": "Visuals",
      "plaats": "Purmerend",
      "samenvatting": "Een wand die het verhaal van de zaak vertelt.",
      "omschrijving": [
        "Typografische wand in de zaak: het eerste wat gasten zien als ze binnenkomen. Een kale wand staat er meestal binnen een dag anders bij.",
        "We drukken het zelf en hangen het zelf op, dus het zit in één keer recht en op de juiste hoogte."
      ],
      "wat": [
        "Artwall op maat",
        "Visuals op acrylaat",
        "Montage in eigen beheer"
      ],
      "kaartbeeld": "assets/img/wand-horeca.jpg",
      "beelden": [
        {
          "src": "assets/img/wand-horeca.jpg",
          "alt": "Typografische wand in een horecazaak"
        },
        {
          "src": "assets/img/artwall-ontvangstruimte.jpg",
          "alt": "Artwall in de ontvangstruimte van een kantoor"
        },
        {
          "src": "assets/img/lichtbak-special.jpg",
          "alt": "Lichtbak met een opvallend beeld erin"
        }
      ],
      "voorbeeld": true
    },
    {
      "id": "specials",
      "titel": "Specials uit de werkplaats",
      "type": "Specials",
      "plaats": "Purmerend",
      "samenvatting": "Van een A3-kliklijst tot de complete bewegwijzering van een hotel.",
      "omschrijving": [
        "Elke opdracht is hier een special. Van een A3-kliklijst tot de complete bewegwijzering van een hotel, en alles wat daartussen zit.",
        "Staat het niet in de lijst? Dan maken we het alsnog. Vertel wat je in gedachten hebt en we kijken samen wat er kan."
      ],
      "wat": [
        "Maatwerk",
        "Eigen ontwerpstudio",
        "Eigen productie in Purmerend"
      ],
      "kaartbeeld": "assets/img/lichtbak-special.jpg",
      "beelden": [
        {
          "src": "assets/img/lichtbak-special.jpg",
          "alt": "Lichtbak met een opvallend beeld erin"
        },
        {
          "src": "assets/img/werkplaats-snijplotters.jpg",
          "alt": "Snijplotters in de eigen werkplaats in Purmerend"
        },
        {
          "src": "assets/img/wand-horeca.jpg",
          "alt": "Typografische wand in een horecazaak"
        }
      ],
      "voorbeeld": true
    }
  ]
};
