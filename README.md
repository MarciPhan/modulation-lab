# Digital Modulation Lab v3.0 (Raw JS Edition)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/version-3.0.0-orange.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-Not_Required-red.svg)]()
[![JS](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Pico_W_/_Web-brightgreen.svg)]()

Interactive virtual laboratory for simulating and analyzing digital radio modulations. This platform serves as a demonstration and experimental tool for understanding the principles of Digital Signal Processing (DSP) within academic communication systems courses. 

**This version is built as "Raw JS" (native ES modules), meaning it runs directly in the browser without any build process, Node.js, or complex dependencies.**

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

The application is entirely portable and does not require Node.js or npm.

### Prerequisites
- A modern web browser with **ES6 module** support (Chrome, Firefox, Edge, etc.)
- (Optional) Python for local hosting (to handle strict CORS/Module policies in some browsers)

### Startup Procedure
Navigate to the project's root directory and run the included scripts for a local preview:
- **Unix (Linux/macOS)**: `./start.sh`
- **Windows**: `start.bat`

The application will be accessible at `http://localhost:8080`. Alternatively, you can simply open `index.html` via a local web server (e.g., VS Code Live Server).

---

## Project Architecture

The project employs strict separation of the user interface, localization data, and the computational core. Since the transition to **Raw JS**, the source code is identical to the production code.

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
Themes are now fully modular. To add a new visual style:

1. Create a file in `ui/themes/neon.js`:
```javascript
export default {
    id: 'neon',
    name: 'Neon Night',
    cssVars: { '--primary': '#00ff00', ... },
    plotTheme: { ... },
    presCssVars: { ... } // High contrast for Presentation Mode
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