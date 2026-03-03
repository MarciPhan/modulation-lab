export default {
    id: 'fsk',
    name: 'M-FSK (Frequency)',
    params: ['M', 'FC', 'RB'],
    requiredBits: (engine) => engine.Nc * Math.max(1, Math.log2(engine.M)),
    help: 'modm_fsk_desc',
    info2: 'chart_2_fsk',
    info3: 'chart_3_fsk',
    info4: 'chart_4_fsk',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc = engine.Nc;
        const M = engine.M;
        const k = Math.max(1, Math.log2(M));
        const symbols = new Array(Nc);

        for (let i = 0; i < Nc; i++) {
            let val = 0;
            for (let j = 0; j < k; j++) val += bits[i * k + j] << (k - 1 - j);
            symbols[i] = { f_idx: val, val: val };
        }

        const Rs = Math.max(1, engine.Rb / k);
        const Fs = Rs * engine.sps;
        const Ntotal = Nc * engine.sps;
        const pb = new Float32Array(Ntotal);
        const t = new Float32Array(Ntotal);
        const w_fc = 2 * Math.PI * engine.fc / Fs;

        for (let i = 0; i < Ntotal; i++) t[i] = i / Fs;

        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal);
        const normF = 2 * Math.PI / Fs;

        for (let i = 0; i < Nc; i++) {
            const fi = (symbols[i].f_idx - (M - 1) / 2) * Rs;
            const phaseStep = fi * normF;
            let basePhase = 0;

            for (let s = 0; s < engine.sps; s++) {
                const idx = i * engine.sps + s;
                bbI[idx] = Math.cos(basePhase);
                bbQ[idx] = Math.sin(basePhase);
                fInst[idx] = engine.fc + fi;

                const carrierPhase = w_fc * idx;
                pb[idx] = bbI[idx] * Math.cos(carrierPhase) - bbQ[idx] * Math.sin(carrierPhase);

                basePhase += phaseStep;
            }
        }

        return { t, bbI, bbQ, pb, fInst, bits, symbols, isVector: false };
    }
};
