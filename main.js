import { ModulationEngine } from './core/engine.js';
import { elements, helpPanel, infoSlots, welcomeModal, closeModalBtn, overlay, focusContainer, closeBtn } from './ui/dom.js';
import { getTranslation, updateInterface } from './i18n/index.js';
import { UI_PARAMS } from './modulations/index.js';
import { themeManager } from './ui/themeManager.js';
import { getPlotTheme, getPlotColors, renderPlot, updateInfoSlots } from './ui/charts.js';
import { setupFullscreen, initTooltips } from './ui/utils.js';
import { setupSyncInputs, setupMainEvents } from './ui/events.js';

/**
 * Digital Modulation Lab - Modular Presentation Engine
 */

const engine = new ModulationEngine();

// Inicializace dynamického seznamu modulací
const initModulationList = () => {
    const selector = elements.mod;
    if (!selector) {
        console.error("Critical: Modulation selector not found in DOM!");
        return;
    }
    selector.innerHTML = '';
    const available = engine.getAvailableModulations();
    available.forEach(mod => {
        const option = document.createElement('option');
        option.value = mod.id;
        option.textContent = mod.name;
        selector.appendChild(option);
    });
};

// Render Orchestrator
let renderPending = false;
let needsForcedRegen = false;

function getPythonTitles(type, engine) {
    const M = engine.M;
    const fc = engine.fc / 1000;
    switch (type) {
        case 'qam': return ['Bity (prvních 120)', `Konstelace ${M}-QAM (Gray), normalizace Es=1`, 'Základní pásmo (RRC tvarování) – I/Q, ~10 symbolů', 'Obálka základního pásma |s_BB(t)| – ~10 symbolů', `Pásmový ${M}-QAM na nosné f_c = ${fc.toFixed(1)} kHz – časový průběh`];
        case 'psk': return ['Bity (prvních 120)', `Konstelace M=${M}-PSK (Gray), globální posun fáze π/M`, 'Základní pásmo (RRC tvarování) – I/Q, ~10 symbolů', 'Fáze signálu', `Pásmový M-PSK s posunem fáze π/M, f_c = ${fc.toFixed(1)} kHz – časový průběh`];
        case 'ask': return ['Bity (prvních 100)', `Symboly M=${M} (Gray) – normalizované amplitudy`, 'Základní pásmo (RRC tvarování) – časový průběh ~10 symbolů', 'Fáze signálu', `Pásmový M-ASK na nosné f_c = ${fc.toFixed(1)} kHz – časový průběh`];
        case 'fsk': return ['Bity (prvních 120)', `Symboly (Gray) – prvních 40`, 'Základní pásmo – I/Q, ~10 symbolů', 'Okamžitá frekvence (kHz)', `Pásmový M-FSK (cpfsk), f_c = ${fc.toFixed(1)} kHz – časový průběh`];
        case 'css': return ['Bity (prvních 120)', 'Indexy symbolů m (Chirp)', 'Základní pásmo (CSS) – I/Q', 'Instantánní frekvence chirpu (kHz)', `Pásmový LoRa CSS na nosné f_c = ${fc.toFixed(1)} kHz – časový průběh`];
        case 'dsss': return ['Bity (prvních 120)', 'PN čipová sekvence (±1)', 'Rozprostřené čipy (data × PN)', 'Základní pásmo DSSS – I(t)', `Pásmový DSSS na nosné f_c = ${fc.toFixed(1)} kHz – časový průběh`];
        case 'fhss': return ['Bity (prvních 120)', 'Index kanálu (FHSS hop)', 'Základní pásmo – I/Q', 'Instantánní frekvence z basebandu (kHz)', `Pásmový FHSS na nosné f_c = ${fc.toFixed(1)} kHz – časový průběh (~6 hopů)`];
        case 'thss': return ['Bity (prvních 40)', `Time-hopping kód – prvních rámců (N_th=${engine.SLOTS} slotů)`, 'Základní pásmo THSS – několik rámců (~4 bity)', 'Detail 1 bitu – pulzy s TH (μs)', `Pásmový THSS na nosné f_c = ${(engine.fc / 1000000).toFixed(2)} MHz – několik rámců`];
    }
    return ['1) Zdrojová data', '2) Mapování / Kód', '3) Základní pásmo', '4) Technická analýza', '5) Výstup RF kanálu'];
}

function requestUpdate(forceRegen = false) {
    if (forceRegen) needsForcedRegen = true;
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
        runSimulation(needsForcedRegen || elements.randomCheck.checked);
        needsForcedRegen = false;
        renderPending = false;
    });
}

function updateGUIByModule(modDef) {
    const allClasses = Object.values(UI_PARAMS).map(v => v.containerClass).filter(Boolean);
    const requiredClasses = modDef.params.map(pKey => UI_PARAMS[pKey].containerClass).filter(Boolean);

    allClasses.forEach(cls => {
        const el = document.querySelector(`.` + cls);
        if (el) el.style.display = requiredClasses.includes(cls) ? 'flex' : 'none';
    });

    if (helpPanel) helpPanel.innerHTML = getTranslation(modDef.help);

    const titles = getPythonTitles(modDef.id, engine);

    const t1 = document.getElementById('title-1-text');
    if (t1) t1.textContent = titles[0];

    const t2 = document.getElementById('title-2-text');
    if (t2) t2.textContent = titles[1];

    const t3 = document.getElementById('title-3-text');
    if (t3) t3.textContent = titles[2];

    const t4 = document.getElementById('title-4-text');
    if (t4) t4.textContent = titles[3];

    const t5 = document.getElementById('title-5-text');
    if (t5) t5.textContent = titles[4];

    const constBtn = document.querySelector('.focus-btn[data-plot="plot-const"]');
    if (constBtn) constBtn.style.display = modDef.showConstellation ? 'inline-block' : 'none';
}

function runSimulation(forceRegen = false) {
    const type = elements.mod.value;
    const modDef = engine.getModulationDef(type);
    if (!modDef) return;

    const themeObj = themeManager.getCurrentTheme();
    const isLight = themeObj.id === 'light';
    const isPres = document.body.classList.contains('presentation');

    const theme = getPlotTheme(themeObj, isPres);
    const { trace1, trace2, trace3, trace4 } = getPlotColors(themeObj, isPres);

    updateGUIByModule(modDef);

    // Sync Engine Params
    engine.M = parseInt(elements.mNum.value) || 2;
    engine.fc = parseFloat(elements.fcNum.value) * 1000;
    engine.Rb = Math.max(0.1, parseFloat(elements.rbNum.value)) * 1000;
    engine.rolloff = parseFloat(elements.rollNum.value);
    engine.SF = parseInt(elements.sfNum.value);
    engine.BW = parseFloat(elements.bwNum.value) * 1000;
    engine.L = parseInt(elements.lNum.value);
    engine.SLOTS = parseInt(elements.slotsNum.value);
    engine.Rh = parseFloat(elements.rhNum.value);
    engine.sps = parseInt(elements.spsNum.value);
    engine.Nc = parseInt(elements.ncNum.value);

    updateInfoSlots(infoSlots, engine);

    const data = engine.simulate(type, forceRegen);
    if (!data) return;



    const sliceView = 3000;
    const lineWidth = isPres ? 3 : 2;

    // Plot 1: Source
    const len1 = data.bits.length;
    const xArr1 = new Float32Array(len1);
    const yArr1 = new Float32Array(len1);
    for (let i = 0; i < len1; i++) { xArr1[i] = i; yArr1[i] = data.bits[i]; }

    renderPlot('plot-1', [{
        x: xArr1, y: yArr1,
        mode: 'lines', line: { shape: 'hv', color: trace1, width: lineWidth },
        fill: 'tozeroy', fillcolor: isLight ? 'rgba(0, 90, 158, 0.15)' : 'rgba(139, 233, 253, 0.08)'
    }], { ...theme, yaxis: { range: [-0.2, 1.2], dtick: 1, gridcolor: theme.xaxis.gridcolor, zerolinecolor: theme.xaxis.zerolinecolor } }, { displayModeBar: false });

    // Plot 2: Mapping / Constellation
    let p2Data = [];
    let p2Layout = { ...theme };
    if (modDef.showConstellation) {
        p2Layout = { ...theme, xaxis: { range: [-2, 2], dtick: 0.5, linewidth: 2, linecolor: theme.xaxis.linecolor }, yaxis: { range: [-2, 2], dtick: 0.5, linewidth: 2, linecolor: theme.yaxis.linecolor } };

        if (data.symbols[0] && data.symbols[0].I !== undefined) {
            const symLen = data.symbols.length;
            const xSym = new Float32Array(symLen);
            const ySym = new Float32Array(symLen);
            for (let i = 0; i < symLen; i++) { xSym[i] = data.symbols[i].I; ySym[i] = data.symbols[i].Q; }
            p2Data = [{ x: xSym, y: ySym, mode: 'markers', type: 'scatter', marker: { color: trace4, size: isPres ? 14 : 10, line: { color: isLight ? '#fff' : '#000', width: 1 } } }];
        } else {
            p2Data = [{ x: data.bbI.subarray(0, 1000), y: data.bbQ.subarray(0, 1000), mode: 'lines', line: { color: trace4, width: lineWidth } }];
        }
    } else if (data.plot2Type) {
        const symLen = data.symbols.length;
        const xArr = (data.extras && data.extras.plot2_x) ? data.extras.plot2_x : new Float32Array(symLen).map((_, i) => i);
        let yArr = data.extras && data.extras.plot2_y ? data.extras.plot2_y : null;
        if (!yArr) {
            yArr = new Float32Array(symLen);
            for (let i = 0; i < symLen; i++) yArr[i] = data.symbols[i].val;
        }
        p2Data = [{ x: xArr, y: yArr, mode: data.plot2Type, line: { width: lineWidth - 0.5, color: trace2 }, marker: { color: trace2, size: isPres ? 8 : 6 } }];
    } else {
        const symLen = data.symbols.length;
        const xArr = new Float32Array(symLen);
        const yArr = new Float32Array(symLen);
        const yErr = new Float32Array(symLen); // array of 0s
        for (let i = 0; i < symLen; i++) { xArr[i] = i; yArr[i] = data.symbols[i].val; }

        p2Data = [{ x: xArr, y: yArr, mode: 'markers', marker: { color: trace2, size: isPres ? 8 : 6 }, error_y: { type: 'data', array: yErr, arrayminus: yArr, color: trace2, width: lineWidth - 1 } }];
    }
    renderPlot('plot-2', p2Data, p2Layout, { displayModeBar: false });

    // Plot 3: Baseband
    renderPlot('plot-3', [
        { x: data.t.subarray(0, sliceView), y: data.bbI.subarray(0, sliceView), name: 'I', line: { color: trace3, width: lineWidth } },
        { x: data.t.subarray(0, sliceView), y: data.bbQ.subarray(0, sliceView), name: 'Q', line: { color: trace2, width: lineWidth } }
    ], { ...theme }, { displayModeBar: false });

    // Plot 4 Analysis
    let p4Data = [];
    if (data.extras && data.extras.detail_t && data.extras.detail_bb) {
        // Detail bitu – přiblížený baseband (THSS, DSSS)
        p4Data = [{ x: data.extras.detail_t, y: data.extras.detail_bb, line: { color: trace4, width: lineWidth } }];
    } else if (modDef.isVector || data.isVector) {
        if (data.extras && data.extras.envelope) {
            p4Data = [{ x: data.t.subarray(0, sliceView), y: data.extras.envelope.subarray(0, sliceView), line: { color: trace4, width: lineWidth } }];
        } else {
            const phase = new Float32Array(sliceView);
            for (let i = 0; i < sliceView; i++) phase[i] = Math.atan2(data.bbQ[i], data.bbI[i]);
            p4Data = [{ x: data.t.subarray(0, sliceView), y: phase, line: { color: trace4, width: lineWidth - 0.5 } }];
        }
    } else {
        const freq = new Float32Array(sliceView);
        for (let i = 0; i < sliceView; i++) freq[i] = data.fInst[i] / 1000;
        p4Data = [{ x: data.t.subarray(0, sliceView), y: freq, line: { color: trace4, width: lineWidth } }];
    }
    renderPlot('plot-4', p4Data, { ...theme }, { displayModeBar: false });

    // Plot 5: RF
    renderPlot('plot-5', [{ x: data.t.subarray(0, 5000), y: data.pb.subarray(0, 5000), line: { color: trace1, width: lineWidth - 0.5 } }], { ...theme }, { displayModeBar: false });
}

// Inicializace
initModulationList();
updateInterface();
initTooltips();
const { enterFocus, exitFocus } = setupFullscreen(overlay, focusContainer, requestUpdate);
setupSyncInputs(elements, requestUpdate);
setupMainEvents(elements, engine, requestUpdate, updateInterface, enterFocus, exitFocus);

// Welcome Modal
if (!localStorage.getItem('modulationLabGuided')) {
    welcomeModal.classList.remove('hidden');
}

elements.helpBtn.addEventListener('click', () => {
    welcomeModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    welcomeModal.classList.add('hidden');
    localStorage.setItem('modulationLabGuided', 'true');
});

// Event pro změnu jazyka (překreslení GUI)
window.addEventListener('languageChanged', requestUpdate);
window.addEventListener('themeChanged', requestUpdate);

if (closeBtn) closeBtn.addEventListener('click', exitFocus);

// Spustit simulaci
requestUpdate(true);
