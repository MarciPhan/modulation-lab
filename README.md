# Digital Modulation Lab

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-Not_Required-red.svg)]()
[![JS](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Pico_W_/_Web-brightgreen.svg)]()

Interactive virtual laboratory for simulating and analyzing digital radio modulations. This platform serves as a demonstration and experimental tool for understanding the principles of Digital Signal Processing (DSP) within academic communication systems courses.

---

## Table of Contents
- [Installation and Run](#installation-and-run)
- [Project Architecture](#project-architecture)
- [Extensibility](#extensibility)
  - [Adding New Modulations](#adding-new-modulations)
  - [Adding New Themes](#adding-new-themes)
  - [Internationalization (i18n)](#internationalization-i18n)
- [Technical Specifications](#technical-specifications)
- [Presentation Mode](#presentation-mode)
- [Deployment to Pico W](#deployment-to-pico-w)
- [License](#license)

---

## Installation and Run

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

## Project Architecture

The project employs strict separation of the user interface, localization data, and the computational core.

### Directory Structure
```text
modulation-lab/
├── index.html                # Main entry point
├── main.js                   # Main application orchestrator
├── core/                     # DSP Core (computational logic)
│   └── engine.js
├── ui/                       # UI components & management
│   ├── themes/               # Modular color schemes (JS based)
│   ├── styles/               # Global CSS (structural)
│   └── charts.js             # Plotly wrappers
├── modulations/              # Modulation scheme plugins
├── i18n/                     # Localization dictionaries
├── plotly-basic.min.js       # Required plotting library (local)
├── deploy.sh                 # Deployment script for Pico W
├── start.sh / .bat           # Launch scripts (local Python server)
└── README.md                 # Documentation
```

---

## Extensibility

### Adding New Modulations
The architecture allows for the seamless addition of new modulation schemes:

1. Create a new module inside `modulations/bpsk.js`:
```javascript
export default {
    id: 'bpsk',
    name: 'Binary PSK',
    params: ['M', 'FC', 'RB', 'ALPHA'],
    // ... logic ...
};
```
2. Register the module in `modulations/index.js`.

### Adding New Themes
Themes are fully modular. To add a new visual style:

1. Create a file in `ui/themes/neon.js`:
```javascript
export default {
    id: 'neon',
    name: 'Neon Night',
    cssVars: { '--primary': '#00ff00', ... },
    plotTheme: { ... },
    presCssVars: { ... }
};
```
2. Register it in `ui/themes/index.js`. The theme button will automatically cycle through it.

---

## Deployment to Pico W

This version is optimized for the **[Modulation Pico Server](https://github.com/MarciPhan/modulation-pico-server)**.

To deploy:
1. Run `./deploy.sh`. This copies all necessary files to the `../modulation-pico-server/www/` directory.
2. Upload the `www/` content to your Raspberry Pi Pico W.

---

## Technical Specifications

The simulation core performs real-time signal transformations using the `ModulationEngine` class.
- **Filtering**: Real-time Root Raised Cosine (RRC) implementation.
- **Analysis**: Unwrapped phase derivation for instant frequency analysis.
- **Themes**: CSS Variable based dynamic skinning.

---

## Contributing and Development

Developed by Jakub Marcinka for the Faculty of Mechatronics, Informatics and Interdisciplinary Studies (**FM TUL**).

---

## License

Distributed under the **ISC** License.

---
© 2026 Jakub Marcinka | Digital Modulation Lab Project