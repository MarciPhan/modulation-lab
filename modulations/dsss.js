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
    id: 'dsss',
    name: 'DSSS (Direct Sequence)',
    params: ['FC', 'RB', 'L'],
    requiredBits: (engine) => 10,
    help: 'modm_dsss_desc',
    info2: 'chart_2_dsss',
    info3: 'chart_3_dsss',
    info4: 'chart_4_dsss',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_ds = bits.length;
        const L = engine.L;
        const totalChips = Nc_ds * L;

        // PN sekvence (LFSR m=7, polynom x^7+x+1) – vrací bity 0/1
        const pn_bits = lfsr(7, [7, 1], totalChips);
        const pn_chips = new Int8Array(totalChips);

        const spread_chips = new Int8Array(totalChips);

        // Data NRZ: 0->-1, 1->+1, roztažené na čipy
        for (let i = 0; i < Nc_ds; i++) {
            const val = 2 * bits[i] - 1;
            for (let j = 0; j < L; j++) {
                const idx = i * L + j;
                pn_chips[idx] = 2 * pn_bits[idx] - 1;
                spread_chips[idx] = val * pn_chips[idx];
            }
        }

        const sps_chip = 16; // vzorků na čip (jako v referenci)
        const Rc = engine.L * engine.Rb; // čipová rychlost
        const Fs_ds = sps_chip * Rc;
        const Ntotal = totalChips * sps_chip;

        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal).fill(engine.fc);
        const w_fc = 2 * Math.PI * engine.fc / Fs_ds;

        // Oversampling – obdélníkový držák na čip
        for (let i = 0; i < totalChips; i++) {
            const chipVal = spread_chips[i];
            for (let s = 0; s < sps_chip; s++) {
                const idx = i * sps_chip + s;
                t[idx] = idx / Fs_ds;
                bbI[idx] = chipVal;
                pb[idx] = chipVal * Math.cos(w_fc * idx);
            }
        }

        // Data pro graf 2: PN čipy ±1 (prvních 128)
        const nc2 = Math.min(128, totalChips);
        const plot2_x = new Float32Array(nc2);
        const plot2_y = new Float32Array(nc2);
        for (let i = 0; i < nc2; i++) {
            plot2_x[i] = i;
            plot2_y[i] = pn_chips[i];
        }

        // Data pro graf 4: detail ~3 bitů basebandu
        const chips_3bits = Math.min(3 * engine.L, totalChips);
        const samp_3bits = chips_3bits * sps_chip;
        const detail_t = new Float32Array(samp_3bits);
        const detail_bb = new Float32Array(samp_3bits);
        for (let i = 0; i < samp_3bits; i++) {
            detail_t[i] = t[i];
            detail_bb[i] = bbI[i];
        }

        const symbols = new Array(bits.length);
        for (let i = 0; i < bits.length; i++) symbols[i] = { val: bits[i] };

        return {
            t, bbI, bbQ, pb, fInst, bits,
            symbols,
            extras: {
                plot2_x, plot2_y,
                detail_t, detail_bb
            },
            plot2Type: 'markers+lines'
        };
    }
};
