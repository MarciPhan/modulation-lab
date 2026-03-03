// Plotly is expected to be loaded as a global script in index.html for Pico W compatibility
import { getTranslation } from '../i18n/index.js';
const Plotly = window.Plotly;

export function getPlotTheme(theme, isPres) {
    const { textColor, gridColor, zeroLineColor, plotBg } = theme.plotTheme;
    const finalTextColor = isPres ? (theme.id === 'light' ? '#000000' : '#ffffff') : textColor;

    return {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: isPres ? 'rgba(0,0,0,0)' : plotBg,
        font: {
            color: finalTextColor, size: isPres ? 12 : 10, family: 'JetBrains Mono, monospace',
            weight: (theme.id === 'light' || isPres) ? 'bold' : 'normal'
        },
        margin: { t: 10, r: 15, l: 45, b: 30 },
        xaxis: { gridcolor: gridColor, zerolinecolor: zeroLineColor, tickfont: { size: isPres ? 10 : 9 }, linecolor: finalTextColor, linewidth: isPres ? 2 : 1 },
        yaxis: { gridcolor: gridColor, zerolinecolor: zeroLineColor, tickfont: { size: isPres ? 10 : 9 }, linecolor: finalTextColor, linewidth: isPres ? 2 : 1 }
    };
}

export function getPlotColors(theme, isPres) {
    const colors = { ...theme.plotColors };
    if (isPres) {
        if (theme.id === 'light') {
            colors.trace1 = '#0000cc';
            colors.trace2 = '#cc00cc';
            colors.trace3 = '#008800';
            colors.trace4 = '#cc5500';
        } else {
            colors.trace1 = '#00ffff';
            colors.trace2 = '#ff00ff';
            colors.trace3 = '#00ff00';
            colors.trace4 = '#ff9900';
        }
    }
    return colors;
}

export function renderPlot(id, plotData, layout, config) {
    if (!Plotly) {
        console.error("Plotly library not loaded!");
        return;
    }
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
