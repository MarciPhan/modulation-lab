// LFSR Generator
function lfsr(n, taps, length, returnState = false) {
    let state = 0x1;
    const seq = [];
    const mask = (1 << n) - 1;
    for (let i = 0; i < length; i++) {
        let bit = 0;
        for (let j = 0; j < taps.length; j++) {
            bit ^= (state >> (taps[j] - 1)) & 1;
        }
        seq.push(returnState ? state : (state & 1));
        state = ((state << 1) | bit) & mask;
        if (state === 0) state = 1;
    }
    return seq;
}

export default {
    id: 'fhss',
    name: 'FHSS (Freq. Hopping)',
    params: ['M', 'FC', 'RB', 'BW', 'RH'],
    requiredBits: (engine) => 100,
    help: 'modm_fhss_desc',
    info2: 'chart_2_fhss',
    info3: 'chart_3_fhss',
    info4: 'chart_4_fhss',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_fh = bits.length;
        const M_fh = engine.M;
        const df = engine.BW / engine.M; // rozestup kanálů
        const Hps = Math.max(1, Math.floor(engine.Rh / engine.Rb)); // hops per bit
        const sps_hop = 16;
        const Rh = Hps * engine.Rb;
        const Fs_fh = sps_hop * Rh;

        const N_hops = Nc_fh * Hps;

        // LFSR PN sekvence -> kumulativní mod pro kanálové indexy (jako reference)
        const pn_raw = lfsr(7, [7, 1], N_hops);
        const chan_idx = new Array(N_hops);
        let cumsum = 0;
        for (let i = 0; i < N_hops; i++) {
            cumsum += pn_raw[i];
            chan_idx[i] = cumsum % M_fh;
        }

        const Ntotal = N_hops * sps_hop;
        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal);

        // BPSK data na ±1, roztažené na hopy
        const data_bpsk = new Int8Array(Nc_fh);
        for (let i = 0; i < Nc_fh; i++) {
            data_bpsk[i] = 2 * bits[i] - 1;
        }

        // Konstrukce signálu se spojitou fází
        let phase = 0;
        const w_fc = 2 * Math.PI * engine.fc;
        const pi2 = 2 * Math.PI;

        for (let h = 0; h < N_hops; h++) {
            const bit_idx = Math.floor(h / Hps);
            const d = data_bpsk[bit_idx];
            const chan = chan_idx[h];
            const fi = (chan - (M_fh - 1) / 2) * df; // frekvenční offset od fc
            const phaseStep = pi2 * fi / Fs_fh;

            for (let s = 0; s < sps_hop; s++) {
                const idx = h * sps_hop + s;
                const timeStr = idx / Fs_fh;
                t[idx] = timeStr;

                // Spojitá fáze: integrujeme okamžitou frekvenci
                phase += phaseStep;

                bbI[idx] = d * Math.cos(phase);
                bbQ[idx] = d * Math.sin(phase);

                const carrierPhase = w_fc * timeStr;
                pb[idx] = bbI[idx] * Math.cos(carrierPhase) - bbQ[idx] * Math.sin(carrierPhase);
            }
        }

        // Odhad instantánní frekvence z derivace unwrapped fáze basebandu
        // (jako v referenčním Pythonu)
        const fInstEst = new Float32Array(Ntotal);
        let prevAngle = Math.atan2(bbQ[0], bbI[0]);
        fInstEst[0] = engine.fc;
        const normF_fh = Fs_fh / pi2;

        for (let i = 1; i < Ntotal; i++) {
            let angle = Math.atan2(bbQ[i], bbI[i]);
            let dph = angle - prevAngle;
            // Unwrap
            if (dph > Math.PI) dph -= pi2;
            else if (dph < -Math.PI) dph += pi2;

            fInstEst[i] = engine.fc + dph * normF_fh;
            prevAngle = angle;
        }

        // Data pro graf 2: hop kanály (prvních 60)
        const nh = Math.min(60, N_hops);
        const plot2_x = new Float32Array(nh);
        const plot2_y = new Float32Array(nh);
        for (let i = 0; i < nh; i++) {
            plot2_x[i] = i;
            plot2_y[i] = chan_idx[i];
        }

        const symbols = new Array(Nc_fh);
        for (let i = 0; i < Nc_fh; i++) symbols[i] = { val: bits[i] };

        return {
            t, bbI, bbQ, pb,
            fInst: fInstEst,
            bits,
            symbols,
            extras: { plot2_x, plot2_y },
            plot2Type: 'markers+lines'
        };
    }
};
