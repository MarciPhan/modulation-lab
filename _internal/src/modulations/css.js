export default {
    id: 'css',
    name: 'CSS (LoRa Chirp)',
    params: ['FC', 'RB', 'SF', 'BW'],
    requiredBits: (engine) => 4 * engine.SF,
    help: 'modm_css_desc',
    info2: 'chart_2_sym_mapping',
    info3: 'chart_3_baseband',
    info4: 'chart_4_tech_freq',
    showConstellation: false,
    simulate: (engine, bits) => {
        const SF_eff = engine.SF;
        const M_css = Math.pow(2, SF_eff);
        const BW_css = engine.BW;
        const Ts_css = M_css / BW_css;

        const Nc_c = Math.floor(bits.length / SF_eff);
        const symbols = [];
        for (let i = 0; i < Nc_c; i++) {
            const chunk = bits.slice(i * SF_eff, (i + 1) * SF_eff);
            symbols.push({ shift: chunk.reduce((A, B, j) => A + (B << (SF_eff - 1 - j)), 0), val: chunk.reduce((A, B, j) => A + (B << (SF_eff - 1 - j)), 0) });
        }

        const Ntotal = Nc_c * M_css;
        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal);

        for (let i = 0; i < Nc_c; i++) {
            const m = symbols[i].shift;
            for (let s = 0; s < M_css; s++) {
                const idx = i * M_css + s;
                const tr = s / BW_css;
                t[idx] = idx / BW_css;
                const f_curr = -BW_css / 2 + (BW_css / Ts_css) * ((tr + m * Ts_css / M_css) % Ts_css);
                bbI[idx] = Math.cos(2 * Math.PI * f_curr * tr);
                bbQ[idx] = Math.sin(2 * Math.PI * f_curr * tr);
                fInst[idx] = engine.fc + f_curr;
                pb[idx] = bbI[idx] * Math.cos(2 * Math.PI * engine.fc * t[idx]) - bbQ[idx] * Math.sin(2 * Math.PI * engine.fc * t[idx]);
            }
        }
        return { t, bbI, bbQ, pb, fInst, bits, symbols, extras: { m_indices: symbols.map(s => s.shift) }, plot2Type: 'markers' };
    }
};
