# Mellemrum

Mellemrum er en React-prototype for en lokal kultur- og eventplatform i Aarhus. Platformen hjælper besøgende med at finde kulturoplevelser og arrangører med at få overblik over tilmeldinger.

[Se den udleverede løsning online](https://cederdorff.com/mellemrum/).

## Ændringer i denne version

Her er en oversigt over, hvad der konkret er ændret i koden, og hvor ændringerne findes.

### Oprydning og fælles komponenter

- `src/components/Footer.jsx`: Sidefoden er lavet som en selvstændig, genbrugelig komponent. Den viser Mellemrum-introduktion, links til Events og Om Mellemrum, kontakt via e-mail samt link til tilmeldingsoversigten.
- `src/pages/HomePage.jsx`, `src/pages/EventPage.jsx`, `src/pages/AboutPage.jsx`, `src/pages/NotFoundPage.jsx` og `src/pages/RegistrationsPage.jsx`: De enkelte sider bruger den fælles footer i stedet for hver især at have deres egen kopi af footer-markup.
- `src/App.jsx`: Appens routes samles her. Når brugeren går til en ny route, flyttes visningen tilbage til toppen af siden. Appen viser også loader-komponenten.

### Events og tilmelding

- `src/pages/HomePage.jsx`: Events og tilmeldinger hentes fra Supabase. Antallet af tilmeldte bruges til at beregne ledige pladser ud fra eventets kapacitet. Besøgende kan søge i eventtitel, beskrivelse og sted samt filtrere eventlisten efter kategori. Eventkortene viser dato, sted, ledige pladser eller status som udsolgt. Hele kortet er ét link, så man kan åbne eventet ved at klikke på kortet.
- `src/pages/EventPage.jsx`: Eventdetaljen viser dato, tidspunkt, adresse, venue-link og pris. Tilmeldingsformularen har separate felter til fornavn, efternavn og e-mail. Den kontrollerer, at navn og en gyldig e-mail er udfyldt, og viser fejl ved de felter, der skal rettes. Ved en gyldig tilmelding sendes oplysningerne til Supabase, og siden viser en bekræftelse. Hvis eventet er fuldt, vises udsolgt-status, og tilmeldingsknappen deaktiveres.
- `src/pages/RegistrationsPage.jsx`: Tilmeldinger hentes sammen med eventlisten og vises samlet under det event, de hører til. Siden viser også det samlede antal tilmeldinger og en besked, hvis der ikke er events eller tilmeldte at vise.
- `supabase/starter.sql`: Startdatabasen indeholder eventkapacitet og venuefelter, herunder postnummer, by og hjemmeside. Tilmeldinger gemmer fornavn og efternavn i separate kolonner sammen med e-mail, status og eventoplysninger.

### Visuelt design og brugerfeedback

- `src/styles.css`: Der er tilføjet styling til tilmeldingsoversigten, formularfelter og loader. Eventkort får skygge og løft ved hover eller tastaturfokus; knapper og links har tilsvarende hover-feedback. Fokusmarkeringer og fejltilstande gør det tydeligere, hvilket felt eller element brugeren arbejder med. Links med pile får en lille bevægelse ved hover, og interne ankerlinks ruller glidende til deres mål.
- `src/components/AppLoader.jsx` og `src/components/SlowLoader.jsx`: Der er lavet en loader-overlay med en Lottie-animation fra `src/assets/ellipse-1.json`. Loaderen har statusinformation for hjælpemidler og rydder animationen op, når komponenten fjernes.

### Afgrænsning

- Lazy loading er ikke implementeret. Loader-animationen er en separat visuel komponent og venter ikke på, at eventdata er færdigindlæst.
- `index.html` er ikke ændret i denne version og indeholder fortsat den oprindelige template-titel, template-beskrivelse og `lang="en"`.
- Prototypen har ikke login eller adgangskontrol. Tilmeldingssiden er derfor ikke beskyttet; brug kun testdata og ikke rigtige personoplysninger.

## Mulige næste forbedringer

Dette er idéer til videre arbejde og er ikke implementeret i den nuværende version:

- **Begrænse adgang til deltageroplysninger:** Arrangører bør kun kunne se tilmeldinger til deres egne events. Andre brugere og besøgende bør ikke kunne se, hvem der er tilmeldt hvilke events. Det kræver login, en tydelig kobling mellem arrangør og event samt adgangsregler i Supabase (Row Level Security), så oplysningerne beskyttes i databasen og ikke kun skjules i brugerfladen.
- **Arbejde videre med Supabase:** Undersøg Supabase Auth og Row Level Security, og forbind tilmeldinger til events med et event-id i stedet for kun at bruge eventets titel. Det vil give et mere robust grundlag for at hente de rigtige deltagere og håndhæve arrangørernes adgang.
- **Forbedre footermenuen:** Gennemgå hvilke links der er vigtigst for besøgende og arrangører, og justér rækkefølge og mobilvisning, så menuen er lettere at finde rundt i.
- **Undersøge lazy loading:** Indlæs eventbilleder eller andet indhold efter behov for at mindske den indledende indlæsningstid.
