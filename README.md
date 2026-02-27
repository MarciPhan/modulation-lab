# Digital Modulation Lab v3.0

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/version-3.0.0-orange.svg)]()
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

Interaktivní virtuální laboratoř pro simulaci a analýzu digitálních rádiových modulací. Tato platforma slouží k demonstraci a experimentálnímu ověření principů digitálního zpracování signálu (DSP) v rámci akademické výuky komunikačních systémů.

---

## Obsah
- [Instalace a spuštění](#instalace-a-spuštění)
- [Architektura projektu](#architektura-projektu)
- [Rozšiřitelnost](#rozšiřitelnost)
  - [Přidání nové modulace](#přidání-nové-modulace)
  - [Internacionalizace (i18n)](#internacionalizace-i18n)
- [Technická specifikace](#technická-specifikace)
- [Prezentační režim](#prezentační-režim)
- [Související projekty](#související-projekty)
- [Licence](#licence)

---

## Související projekty

Tento projekt existuje ve dvou variantách:
1. **[Web/Desktop Lab Edition](https://github.com/jakubmarcinka/modulation-lab)** (tento repozitář) – Plná, vysoce modulární verze pro výuku a vývoj.
2. **[Pico W Server Edition](https://github.com/jakubmarcinka/modulation-pico-server)** – Odlehčená, optimalizovaná verze pro běh přímo na mikrokontroléru Raspberry Pi Pico W.

---

## Instalace a spuštění

Aplikace je postavena na frameworku Vite a nevyžaduje složitou konfiguraci prostředí.

### Požadavky
- [Node.js](https://nodejs.org/) (doporučena verze LTS)
- Webový prohlížeč s podporou ES6 modulů

### Postup spuštění
V kořenovém adresáři projektu využijte připravené skripty:
- **Unix (Linux/macOS)**: `./start.sh`
- **Windows**: `start.bat`

Aplikace bude následně dostupná na adrese `http://localhost:5173`.

---

## Architektura projektu

Projekt využívá striktní oddělení uživatelského rozhraní, lokalizačních dat a výpočetního jádra. Veškeré technologické soubory jsou organizovány v adresáři `_internal`, aby kořen projektu zůstal přehledný pro koncové uživatele.

### Adresářová struktura
```text
lab/
├── start.sh / .bat           # Spouštěcí skripty
├── README.md                 # Dokumentace
├── .gitignore                # Konfigurace verzovacího systému
└── _internal/                # Zdrojové kódy a konfigurace
    ├── vite.config.js        # Konfigurace sestavení
    └── src/                  # Implementace
        ├── main.js           # Hlavní orchestrátor
        ├── engine.js         # DSP jádro (výpočty)
        ├── ui/               # Komponenty uživatelského rozhraní
        ├── modulations/      # Implementace modulačních schémat
        └── i18n/             # Lokalizační slovníky
```

---

## Rozšiřitelnost

### Přidání nové modulace
Architektura umožňuje snadné přidávání nových modulačních formátů pomocí pluginů.

1. Vytvořte nový modul v `_internal/src/modulations/bpsk.js`:
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

2. Zaregistrujte modul v `_internal/src/modulations/index.js`:
```javascript
import bpsk from './bpsk.js';
export const MODULATIONS = [..., bpsk];
```

### Internacionalizace (i18n)
Systém podporuje dynamické přepínání jazyků bez nutnosti restartu aplikace.

1. Vytvořte slovník v `_internal/src/i18n/de.js`:
```javascript
export default {
    header_title: "Modulationslabor",
    lbl_modulation: "Modulationstyp",
    btn_regen: "Regenerieren",
    // ...
};
```

2. Přidejte slovník do orchestrátoru v `_internal/src/i18n/index.js`:
```javascript
import de from './de.js';
export const translations = { cs, en, de };
```

---

## Technická specifikace

Simulační jádro v reálném čase provádí transformace signálu v časové i frekvenční oblasti. Parametry nastavené v UI přímo ovlivňují vnitřní stav třídy `ModulationEngine`:

- **Symbolová rychlost**: `Rs = Rb / log2(M)`
- **Vzorkovací frekvence**: `Fs = Rs * sps`
- **Filtrace**: Použití Root Raised Cosine (RRC) filtru pro minimalizaci ISI.

---

## Prezentační režim

Pro potřeby výuky v posluchárnách je implementován **Presentation Mode**, který aktivuje vysocce kontrastní barevné schéma a zvětšuje vykreslované prvky pro lepší čitelnost na projekci.

Příklad konfigurace barev v CSS (viz `_internal/src/ui/styles/main.css`):
```css
body.presentation {
    --bg-main: #000000;
    --primary: #ff9900;
    --text-primary: #ffffff;
}
```

---

## Přispívání a vývoj

Tento projekt je vyvíjen Jakubem Marcinkou v rámci Fakulty mechatroniky, informatiky a mezioborových studií (FM TUL). Případné připomínky nebo návrhy na vylepšení směřujte do sekce Issues nebo formou Pull Requestu.

---

## Licence

Tento projekt je distribuován pod licencí **ISC**. Více informací naleznete v souboru `package.json`.