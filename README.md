# 🕋 Mosquefinder Sverige

En modern, blixtsnabb och mobilfokuserad webbapplikation för att hitta moskéer och hålla koll på bönetider i Sverige. Inspirerad av en minimalistisk "glassmorphism"-estetik och optimerad för daglig användning.

![Main Screenshot](/Users/farhadjelve/.gemini/antigravity/brain/9af4fd20-1176-40db-8b08-07e0e3ce39fb/proximity_list_final_png_1774393574718.png)

## ✨ Funktioner

- **📍 Närmast Moské**: Appen använder din position för att automatiskt sortera och visa de närmaste moskéerna först.
- **🕒 Live Bönetider**: Realtidsberäkning av bönetider via Aladhan API, med stöd för både Sunni och Shia (Tehran) beräkningsmetoder.
- **🗺️ Google Maps Integration**: Navigera enkelt till valfri moské med ett klick.
- **💎 Glassmorphic UI**: Ett modernt och premium utseende byggt med Tailwind CSS och Framer Motion.
- **🤝 Crowd-sourcing**: Användare kan föreslå nya moskéer direkt i appen.
- **🔥 Firebase Backend**: All data lagras och hämtas i realtid från Firestore.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Språk**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animationer**: [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **API**: [Aladhan API](https://aladhan.com/prayer-times-api)

## 🚀 Kom igång

### 1. Klona repot
```bash
git clone [repository-url]
cd Mosquefinder
```

### 2. Installera beroenden
```bash
npm install
```

### 3. Konfigurera Miljövariabler
Skapa en `.env` fil i projektroten och fyll i dina Firebase-credentials:
```env
VITE_FIREBASE_API_KEY=ditt_värde
VITE_FIREBASE_AUTH_DOMAIN=ditt_värde
VITE_FIREBASE_PROJECT_ID=ditt_värde
VITE_FIREBASE_STORAGE_BUCKET=ditt_värde
VITE_FIREBASE_MESSAGING_SENDER_ID=ditt_värde
VITE_FIREBASE_APP_ID=ditt_värde
```

### 4. Ladda upp data (Valfritt)
Om du vill återställa eller uppdatera moské-databasen:
```bash
npm run upload-data
```

### 5. Kör appen lokalt
```bash
npm run dev
```

## 📄 Licens
Detta projekt är skapat av **Farhad Jelve**.
