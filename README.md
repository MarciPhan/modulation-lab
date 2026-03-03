# Digital Modulation Lab

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-Not_Required-red.svg)]()
[![JS](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Pico_W_/_Web-brightgreen.svg)]()

Interaktivní virtuální laboratoř pro simulaci a analýzu digitálních rádiových modulací. Tato platforma slouží jako demonstrační a experimentální nástroj pro pochopení principů číslicového zpracování signálů (DSP) v rámci akademických kurzů zaměřených na komunikační systémy.

---

## Obsah
- [Instalace a spuštění](#instalace-a-spuštění)
- [Architektura projektu](#architektura-projektu)
- [Rozšiřitelnost](#rozšiřitelnost)
  - [Přidávání nových modulací](#přidávání-nových-modulací)
  - [Přidávání nových témat](#přidávání-nových-témat)
  - [Lokalizace (i18n)](#lokalizace-i18n)
- [Technické specifikace](#technické-specifikace)
- [Prezentační režim](#prezentační-režim)
- [Nasazení na Pico W](#nasazení-na-pico-w)
- [Licence](#licence)

---

## Instalace a spuštění

Tato aplikace běží přímo v prohlížeči. Pro její správné fungování ale musíte kód nejprve stáhnout a spustit lokální server (díky využití moderních ES modulů to nelze jen prostým dvojklikem na soubor).

**Postupujte přesně podle těchto 3 kroků:**

### 1. Stažení zdrojových kódů (Download)
Otevřete terminál (na Windows např. Příkazový řádek `cmd` nebo `PowerShell`, na Mac/Linux aplikaci `Terminal`) a zadejte:
```bash
git clone https://github.com/MarciPhan/modulation-lab.git
```

### 2. Přesunutí do složky (Navigate)
V tomtéž terminálu přejděte do složky, kterou jste právě stáhli:
```bash
cd modulation-lab
```

### 3. Spuštění lokálního serveru (Run)
Aplikace obsahuje připravené automatické skripty. V terminálu spusťte:

* **Na Windows:**
  Napíšte `start.bat` a stiskněte Enter.

* **Na Linuxu / macOS:**
  Napište `./start.sh` a stiskněte Enter.

_Poznámka: Windows verze je zcela automatická. Na Linuxu/macOS musíte mít nainstalovaný Python (`sudo apt install python3`)._

Skript vám vypíše do konzole odkaz (typicky `http://localhost:8080`), který se buď sám otevře ve vašem prohlížeči, nebo si jej zkopírujte do prohlížeče ručně. Hotovo!

---

## Architektura projektu

Projekt využívá striktní oddělení uživatelského rozhraní, lokalizačních dat a výpočetního jádra.

### Struktura adresářů
```text
modulation-lab/
├── index.html                # Hlavní vstupní bod
├── main.js                   # Hlavní orchestrátor aplikace
├── core/                     # DSP jádro (výpočetní logika)
│   └── engine.js
├── ui/                       # UI komponenty & správa
│   ├── themes/               # Modulární barevná schémata (založeno na JS)
│   ├── styles/               # Globální CSS (struktura)
│   └── charts.js             # Wrappery pro grafy Plotly
├── modulations/              # Pluginy modulačních schémat
├── i18n/                     # Lokalizační slovníky
├── plotly-basic.min.js       # Přibalená knihovna pro vykreslování grafů
├── deploy.sh                 # Nasazovací skript pro Pico W
├── start.sh / .bat           # Spouštěcí skripty (lokální server)
└── README.md                 # Dokumentace
```

---

## Rozšiřitelnost

### Přidávání nových modulací
Architektura umožňuje plynulé přidávání nových modulačních schémat:

1. Vytvořte nový modul uvnitř `modulations/bpsk.js`:
```javascript
export default {
    id: 'bpsk',
    name: 'Binary PSK',
    params: ['M', 'FC', 'RB', 'ALPHA'],
    // ... logika ...
};
```
2. Zaregistrujte modul v `modulations/index.js`.

### Přidávání nových témat
Témata jsou plně modulární. Chcete-li přidat nový vizuální styl:

1. Vytvořte soubor v `ui/themes/neon.js`:
```javascript
export default {
    id: 'neon',
    name: 'Neon Night',
    cssVars: { '--primary': '#00ff00', ... },
    plotTheme: { ... },
    presCssVars: { ... }
};
```
2. Zaregistrujte jej v `ui/themes/index.js`. Tlačítko tématu jej začne automaticky cyklicky přepínat.

---

## Nasazení na Pico W

Tato verze je optimalizována pro **[Modulation Pico Server](https://github.com/MarciPhan/modulation-pico-server)**.

Pro nasazení:
1. Spusťte `./deploy.sh`. Tento skript zkopíruje všechny potřebné soubory do adresáře `../modulation-pico-server/www/`.
2. Nahrajte obsah složky `www/` do vašeho Raspberry Pi Pico W.

---

## Technické specifikace

Simulační jádro provádí transformace signálu v reálném čase pomocí třídy `ModulationEngine`.
- **Filtrování**: Implementace RRC filtru (Root Raised Cosine) iterovaná v reálném čase.
- **Analýza**: Odvození rozvinuté fáze ("unwrapped phase") pro analýzu okamžité frekvence.
- **Témata**: Dynamické skinování založené na CSS proměnných.

---

## Vývoj a přispívání

Vyvinul Jakub Marcinka pro Fakultu mechatroniky, informatiky a mezioborových studií (**FM TUL**).

---

## Licence

Distribuováno pod licencí **ISC**.

---
© 2026 Jakub Marcinka | Projekt Digitální modulační laboratoř