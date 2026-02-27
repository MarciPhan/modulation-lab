# Digital Modulation Lab v3.0

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/version-3.0.0-orange.svg)]()
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

Interactive virtual laboratory for simulating and analyzing digital radio modulations. This platform serves as a demonstration and experimental tool for understanding the principles of Digital Signal Processing (DSP) within academic communication systems courses.

---

## Table of Contents
- [Installation and Run](#installation-and-run)
- [Project Architecture](#project-architecture)
- [Extensibility](#extensibility)
  - [Adding New Modulations](#adding-new-modulations)
  - [Internationalization (i18n)](#internationalization-i18n)
- [Technical Specifications](#technical-specifications)
- [Presentation Mode](#presentation-mode)
- [Connected Projects](#connected-projects)
- [License](#license)

---

## Connected Projects

This project is available in two variants:
1. **[Web/Desktop Lab Edition](https://github.com/MarciPhan/modulation-lab)** (this repository) – Full, highly modular version for teaching and development.
2. **[Pico W Server Edition](https://github.com/MarciPhan/modulation-lab-pico_server)** – Lightweight, optimized version specifically designed to run directly on the Raspberry Pi Pico W microcontroller via Wi-Fi.

---

## Installation and Run

The application is built on the Vite framework and requires minimal environment configuration.

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- A web browser with ES6 module support

### Startup Procedure
Navigate to the project's root directory and run the included scripts:
- **Unix (Linux/macOS)**: `./start.sh`
- **Windows**: `start.bat`

The application will then be accessible at `http://localhost:5173`.

---

## Project Architecture

The project employs strict separation of the user interface, localization data, and the computational core. All core technological assets are organized within the `_internal` directory to maintain a clean root structure for the end user.

### Directory Structure
```text
lab/
├── start.sh / .bat           # Launch scripts
├── README.md                 # Documentation
├── .gitignore                # Version control configuration
└── _internal/                # Source code and configuration
    ├── vite.config.js        # Build configuration
    └── src/                  # Implementation
        ├── main.js           # Main application orchestrator
        ├── engine.js         # DSP Core (computational logic)
        ├── ui/               # User interface components
        ├── modulations/      # Modulation scheme implementations
        └── i18n/             # Localization dictionaries
```

---

## Extensibility

### Adding New Modulations
The architecture allows for the seamless addition of new modulation schemes via a plugin-like system.

1. Create a new module inside `_internal/src/modulations/bpsk.js`:
```javascript
import { utils } from './utils.js';

export default {
    id: 'bpsk',
    name: 'Binary PSK',
    params: ['M', 'FC', 'RB', 'ALPHA'],
    requiredBits: (engine) => engine.Nc,
    help: 'mod_bpsk_desc',
    showConstellation: true,
    simulate: (engine, bits) => {
        const res = utils.simulateLinearGeneric(
            bits, engine.M, engine.Rb, engine.fc, 
            engine.sps, engine.Nc, engine.rolloff, 
            engine.span, 'psk'
        );
        return { ...res };
    }
};
```

2. Register the module in `_internal/src/modulations/index.js`:
```javascript
import bpsk from './bpsk.js';
export const MODULATIONS = [..., bpsk];
```

### Internationalization (i18n)
The system supports dynamic language switching without requiring an application restart.

1. Create a new dictionary in `_internal/src/i18n/de.js`:
```javascript
export default {
    header_title: "Modulationslabor",
    lbl_modulation: "Modulationstyp",
    btn_regen: "Regenerieren",
    // ...
};
```

2. Add the dictionary to the orchestrator in `_internal/src/i18n/index.js`:
```javascript
import de from './de.js';
export const translations = { cs, en, de };
```

---

## Technical Specifications

The simulation core performs real-time signal transformations in both the time and frequency domains. Parameters adjusted in the UI directly manipulate the internal state of the `ModulationEngine` class:

- **Symbol Rate**: `Rs = Rb / log2(M)`
- **Sampling Frequency**: `Fs = Rs * sps`
- **Filtering**: Application of a Root Raised Cosine (RRC) filter to minimize Intersymbol Interference (ISI).

---

## Presentation Mode

To accommodate lectures in auditoriums, a **Presentation Mode** is implemented. When activated, it applies a high-contrast color scheme and scales up rendered elements for enhanced legibility on projectors.

Example CSS color configuration (see `_internal/src/ui/styles/main.css`):
```css
body.presentation {
    --bg-main: #000000;
    --primary: #ff9900;
    --text-primary: #ffffff;
}
```

---

## Contributing and Development

This project is developed by Jakub Marcinka for the Faculty of Mechatronics, Informatics and Interdisciplinary Studies (FM TUL). Feedback, suggestions, or improvements are welcome—please submit them exclusively via Issues or Pull Requests.

---

## License

This project is distributed under the **ISC** License. See the `package.json` file for more details.

---
© 2026 Jakub Marcinka | Digital Modulation Lab Project