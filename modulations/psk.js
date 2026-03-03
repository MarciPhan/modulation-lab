function getRRC(span, sps, rolloff) {
    const N = span * sps;
    const h = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) {
        const t = (i - N / 2) / sps;
        if (Math.abs(t) < 1e-10) h[i] = 1.0 - rolloff + 4 * rolloff / Math.PI;
        else if (rolloff !== 0 && Math.abs(Math.abs(t) - 1 / (4 * rolloff)) < 1e-10) {
            h[i] = (rolloff / Math.sqrt(2)) * (((1 + 2 / Math.PI) * Math.sin(Math.PI / (4 * rolloff))) + ((1 - 2 / Math.PI) * Math.cos(Math.PI / (4 * rolloff))));
        } else {
            const num = Math.sin(Math.PI * t * (1 - rolloff)) + 4 * rolloff * t * Math.cos(Math.PI * t * (1 + rolloff));
            const den = Math.PI * t * (1 - Math.pow(4 * rolloff * t, 2));
            h[i] = num / den;
        }
    }
    return h;
}

function convolve(signal, filter) {
    const lenSig = signal.length;
    const lenFilt = filter.length;
    const res = new Float32Array(lenSig);
    const half = Math.floor(lenFilt / 2);
    for (let i = 0; i < lenSig; i++) {
        let sum = 0;
        const jStart = Math.max(0, i + half - lenSig + 1);
        const jEnd = Math.min(lenFilt, i + half + 1);
        for (let j = jStart; j < jEnd; j++) sum += signal[i - j + half] * filter[j];
        res[i] = sum;
    }
    return res;
}

export default {
    id: 'psk',
    name: 'M-PSK (Phase Shift)',
    params: ['M', 'FC', 'RB', 'ALPHA'],
    requiredBits: (engine) => engine.Nc * Math.max(1, Math.log2(engine.M)),
    help: 'modm_psk_desc',
    info2: 'chart_2_psk',
    info3: 'chart_3_psk',
    info4: 'chart_4_psk',
    showConstellation: true,
    simulate: (engine, bits) => {
        const Nc = engine.Nc;
        const M = engine.M;
        const k = Math.max(1, Math.log2(M));
        const symbols = new Array(Nc);

        for (let i = 0; i < Nc; i++) {
            let val = 0;
            for (let j = 0; j < k; j++) val += bits[i * k + j] << (k - 1 - j);
            const gray = val ^ (val >> 1);
            const phase = (2 * Math.PI * gray) / M + Math.PI / M;
            symbols[i] = { I: Math.cos(phase), Q: Math.sin(phase), val: gray };
        }

        const Rs = Math.max(1, engine.Rb / k);
        const Fs = Rs * engine.sps;
        const Ntotal = Nc * engine.sps;
        const pb = new Float32Array(Ntotal);
        const t = new Float32Array(Ntotal);
        const w_fc = 2 * Math.PI * engine.fc / Fs;

        for (let i = 0; i < Ntotal; i++) t[i] = i / Fs;

        const h = getRRC(engine.span, engine.sps, engine.rolloff);
        let sumPwr = 0;
        for (let i = 0; i < Nc; i++) sumPwr += symbols[i].I * symbols[i].I + symbols[i].Q * symbols[i].Q;
        const scale = 1 / Math.sqrt(sumPwr / Nc);

        const upI = new Float32Array(Ntotal);
        const upQ = new Float32Array(Ntotal);
        for (let i = 0; i < Nc; i++) {
            upI[i * engine.sps] = symbols[i].I * scale;
            upQ[i * engine.sps] = symbols[i].Q * scale;
        }

        const bbI = convolve(upI, h);
        const bbQ = convolve(upQ, h);
        const fInst = new Float32Array(Ntotal).fill(engine.fc);

        for (let i = 0; i < Ntotal; i++) {
            const carrierPhase = w_fc * i;
            pb[i] = bbI[i] * Math.cos(carrierPhase) - bbQ[i] * Math.sin(carrierPhase);
        }

        return { t, bbI, bbQ, pb, fInst, bits, symbols, isVector: true };
    }
};
