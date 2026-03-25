<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Farhad030619/Mosquefinder">
    <h3 align="center">🕋 Mosquefinder Sverige</h3>
  </a>

  <p align="center">
    En modern, blixtsnabb och mobilfokuserad webbapplikation för att hitta moskéer och hålla koll på bönetider i Sverige.
    <br />
    <a href="https://github.com/Farhad030619/Mosquefinder"><strong>Utforska dokumentationen »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Farhad030619/Mosquefinder">Se Demo</a>
    ·
    <a href="https://github.com/Farhad030619/Mosquefinder/issues">Rapportera Bugg</a>
    ·
    <a href="https://github.com/Farhad030619/Mosquefinder/issues">Föreslå Funktion</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Innehållsförteckning</summary>
  <ol>
    <li>
      <a href="#om-projektet">Om Projektet</a>
      <ul>
        <li><a href="#byggt-med">Byggt Med</a></li>
      </ul>
    </li>
    <li>
      <a href="#kom-igång">Kom Igång</a>
      <ul>
        <li><a href="#förutsättningar">Förutsättningar</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#använda-appen">Använda Appen</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#bidra">Bidra</a></li>
    <li><a href="#licens">Licens</a></li>
    <li><a href="#kontakt">Kontakt</a></li>
    <li><a href="#tack">Tack</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## Om Projektet

[![Mosquefinder Screen Shot][product-screenshot]](https://github.com/Farhad030619/Mosquefinder)

Mosquefinder Sverige är skapat för att ge svenska muslimer en premium-upplevelse när de söker efter böneplatser. Med fokus på snabbhet, precision och en modern "glassmorphic" design, erbjuder appen:

*   **📍 Realtids-sortering**: Hittar automatiskt de 27 pre-laddade moskéerna baserat på din GPS-position.
*   **🕒 Precise Prayer Times**: Använder Aladhan API med stöd för både Sunni och Shia (Tehran-metoden).
*   **🌙 Dark Mode Support**: Fullt stöd för mörkt läge med smart färghantering.
*   **🗺️ Maps Integration**: Direktlänkar till Google Maps för enkel navigering.

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

### Byggt Med

Detta projekt använder de senaste verktygen för att leverera en högpresterande upplevelse:

*   [![React][React.js]][React-url]
*   [![Vite][Vite.js]][Vite-url]
*   [![Tailwind][Tailwind.css]][Tailwind-url]
*   [![Firebase][Firebase.google]][Firebase-url]
*   [![Framer][Framer.motion]][Framer-url]

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- GETTING STARTED -->
## Kom Igång

För att få en lokal kopia av projektet och köra det, följ dessa enkla steg.

### Förutsättningar

*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Klona repot
    ```sh
    git clone https://github.com/Farhad030619/Mosquefinder.git
    ```
2.  Installera NPM-paket
    ```sh
    npm install
    ```
3.  Konfigurera din `.env` fil
    ```sh
    VITE_FIREBASE_API_KEY=ENTER_YOUR_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=ENTER_DOMAIN
    VITE_FIREBASE_PROJECT_ID=ENTER_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=ENTER_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=ENTER_SENDER_ID
    VITE_FIREBASE_APP_ID=ENTER_APP_ID
    ```
4.  Ladda upp data till Firestore (Valfritt)
    ```sh
    npm run upload-data
    ```
5.  Kör utvecklingsservern
    ```sh
    npm run dev
    ```

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- USAGE EXAMPLES -->
## Använda Appen

Appen är designad för att vara intuitiv:
1.  **Hem**: Se din nästa bön och dagens fullständiga tider. Växla mellan Sunni och Shia i inställningarna.
2.  **Moskéer**: Se listan sorterad efter avstånd. Klicka på ett kort för att öppna direkt i Google Maps.
3.  **Föreslå**: Hittar du inte din lokala moské? Använd formuläret i appen för att föreslå en ny böneplats.

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Implementera Dark Mode
- [x] Optimera prestanda med `useMemo`
- [x] Lägga till källa (Aladhan API)
- [ ] Push-notiser för bönetider
- [ ] Stöd för fler orter utanför Stockholm

Se [öppna ärenden](https://github.com/Farhad030619/Mosquefinder/issues) för en fullständig lista över planerade funktioner.

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- CONTRIBUTING -->
## Bidra

Bidrag gör open source-gemenskapen till en så fantastisk plats att lära, inspireras och skapa. Alla bidrag du gör är **starkt uppskattade**.

Om du har ett förslag som skulle göra detta bättre, gaffla (fork) gärna repot och skapa en pull-begäran. Du kan också helt enkelt öppna ett ärende (issue) med taggen "enhancement". Glöm inte att ge projektet en stjärna! Tack!

1.  Gaffla projektet
2.  Skapa din funktion-gren (`git checkout -b feature/AmazingFeature`)
3.  Begå dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4.  Skicka upp grenen (`git push origin feature/AmazingFeature`)
5.  Öppna en Pull Request

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- LICENSE -->
## Licens

Distribueras under MIT-licensen. Se `LICENSE` för mer information.

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- CONTACT -->
## Kontakt

Farhad Jelve - [@ditt_twitter_namn](https://twitter.com/ditt_twitter_namn) - farhad@exempel.se

Projektlänk: [https://github.com/Farhad030619/Mosquefinder](https://github.com/Farhad030619/Mosquefinder)

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Tack

*   [Aladhan API](https://aladhan.com/) för bönedata.
*   [Lucide React](https://lucide.dev/) för ikonerna.
*   [Framer Motion](https://www.framer.com/motion/) för de mjuka animationerna.

<p align="right">(<a href="#readme-top">tillbaka till toppen</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/Farhad030619/Mosquefinder.svg?style=for-the-badge
[contributors-url]: https://github.com/Farhad030619/Mosquefinder/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Farhad030619/Mosquefinder.svg?style=for-the-badge
[forks-url]: https://github.com/Farhad030619/Mosquefinder/network/members
[stars-shield]: https://img.shields.io/github/stars/Farhad030619/Mosquefinder.svg?style=for-the-badge
[stars-url]: https://github.com/Farhad030619/Mosquefinder/stargazers
[issues-shield]: https://img.shields.io/github/issues/Farhad030619/Mosquefinder.svg?style=for-the-badge
[issues-url]: https://github.com/Farhad030619/Mosquefinder/issues
[license-shield]: https://img.shields.io/github/license/Farhad030619/Mosquefinder.svg?style=for-the-badge
[license-url]: https://github.com/Farhad030619/Mosquefinder/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/farhad-jelve
[product-screenshot]: /Users/farhadjelve/.gemini/antigravity/artifacts/9af4fd20-1176-40db-8b08-07e0e3ce39fb/home_dark_mode.webp
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind.css]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Firebase.google]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[Firebase-url]: https://firebase.google.com/
[Framer.motion]: https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white
[Framer-url]: https://www.framer.com/motion/
