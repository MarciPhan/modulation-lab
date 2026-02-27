import Plotly from 'plotly.js-dist-min';
import { getTranslation } from '../i18n/index.js';

export function getPlotTheme(isLight, isPres) {
    const textColor = isPres ? (isLight ? '#000000' : '#ffffff') : (isLight ? '#1f2937' : '#ea7603');
    const gridColor = isPres ? (isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)') : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(234,118,3,0.08)');
    const zeroLineColor = isPres ? (isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)') : (isLight ? 'rgba(0,0,0,0.25)' : 'rgba(234,118,3,0.2)');

    return {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: isLight ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0.1)',
        font: {
            color: textColor, size: isPres ? 12 : 10, family: 'JetBrains Mono',
            weight: (isLight || isPres) ? 'bold' : 'normal'
        },
        margin: { t: 10, r: 15, l: 45, b: 30 },
        xaxis: { gridcolor: gridColor, zerolinecolor: zeroLineColor, tickfont: { size: isPres ? 10 : 9 }, linecolor: textColor, linewidth: isPres ? 2 : 1 },
        yaxis: { gridcolor: gridColor, zerolinecolor: zeroLineColor, tickfont: { size: isPres ? 10 : 9 }, linecolor: textColor, linewidth: isPres ? 2 : 1 }
    };
}

export function getPlotColors(isLight, isPres) {
    return {
        trace1: isPres ? (isLight ? '#0000cc' : '#00ffff') : (isLight ? '#6b7280' : '#8ca4b5'),
        trace2: isPres ? (isLight ? '#cc00cc' : '#ff00ff') : (isLight ? '#005a9e' : '#4ba3e3'),
        trace3: isPres ? (isLight ? '#008800' : '#00ff00') : (isLight ? '#a3a3a3' : '#737373'),
        trace4: isPres ? (isLight ? '#cc5500' : '#ff9900') : (isLight ? '#ea7603' : '#ea7603')
    };
}

export function renderPlot(id, plotData, layout, config) {
    Plotly.react(id, plotData, Object.assign({ autosize: true }, layout), Object.assign({ responsive: true }, config));
}

export function updateInfoSlots(slots, engine) {
    slots[0].textContent = getTranslation('info_source')
        .replace('{rb}', (engine.Rb / 1000).toString())
        .replace('{t}', (1000 / engine.Rb).toFixed(3));

    slots[2].textContent = getTranslation('info_baseband')
        .replace('{sps}', engine.sps.toString())
        .replace('{fs}', (engine.Rb * engine.sps / 1000).toFixed(1));
}
