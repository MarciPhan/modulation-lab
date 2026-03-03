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
    id: 'thss',
    name: 'THSS (Time Hopping)',
    params: ['FC', 'RB', 'SLOTS'],
    requiredBits: (engine) => 40,
    help: 'modm_thss_desc',
    info2: 'chart_2_thss',
    info3: 'chart_3_thss',
    info4: 'chart_4_thss',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_th = bits.length;
        const Np = 4; // rámců na bit (jako v referenční verzi)
        const N_frames = Nc_th * Np;

        // LFSR PN sekvence pro TH kód
        const pn = lfsr(7, [7, 1], N_frames, true);
        // Kumulativní mod pro slot indexy (jako v referenci: cumsum(pn) % N_th)
        const th_code = new Int32Array(N_frames);
        let cumsum = 0;
        for (let i = 0; i < N_frames; i++) {
            cumsum += pn[i] & 1;
            th_code[i] = cumsum % engine.SLOTS;
        }

        const sps_slot = 64;
        const Ns_slot = sps_slot;
        const Ns_frame = Ns_slot * engine.SLOTS;
        const Ns_bit = Ns_frame * Np;
        const Ntotal = Ns_bit * Nc_th;

        const Tf = 1.0 / (engine.Rb * Np); // délka rámce
        const Tc = Tf / engine.SLOTS;       // šířka slotu
        const Fs = sps_slot / Tc;

        // Parametry pulzu (monocycle)
        const pulse_width = 0.18 * Tc;
        const sigma = pulse_width / 2.8;
        const K = 5;

        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal).fill(engine.fc);

        // Naplnění časové osy
        for (let i = 0; i < Ntotal; i++) {
            t[i] = i / Fs;
        }

        // Syntéza basebandu s monocycle pulzy
        for (let b_idx = 0; b_idx < Nc_th; b_idx++) {
            const bit = bits[b_idx];
            const data = 2 * bit - 1;
            for (let j = 0; j < Np; j++) {
                const frame_idx = b_idx * Np + j;
                const t_frame_start = frame_idx * Ns_frame;
                const c_j = th_code[frame_idx];
                const pulse_center = t_frame_start + c_j * Ns_slot + Math.floor(Ns_slot / 2);
                const half_span = Math.floor(K * sigma * Fs);

                const i_start = Math.max(0, pulse_center - half_span);
                const i_end = Math.min(Ntotal, pulse_center + half_span + 1);

                for (let idx = i_start; idx < i_end; idx++) {
                    const tt = (idx - pulse_center) / Fs;
                    // Monocycle (1. derivace Gaussova pulzu)
                    const p = -(tt / (sigma * sigma)) * Math.exp(-(tt * tt) / (2 * sigma * sigma));
                    bbI[idx] += data * p;
                }
            }
        }

        const w_fc = 2 * Math.PI * engine.fc;

        // Pásmový signál
        for (let i = 0; i < Ntotal; i++) {
            pb[i] = bbI[i] * Math.cos(w_fc * t[i]);
        }

        // Data pro graf 2: TH kód (prvních 40 rámců)
        const nh_show = Math.min(40, N_frames);
        const plot2_x = new Float32Array(nh_show);
        const plot2_y = new Float32Array(nh_show);
        for (let i = 0; i < nh_show; i++) {
            plot2_x[i] = i;
            plot2_y[i] = th_code[i];
        }

        // Data pro graf 4: detail 1 bitu
        const detail_len = Math.min(Ns_bit, Ntotal);
        const detail_t = new Float32Array(detail_len);
        const detail_bb = new Float32Array(detail_len);

        const t0 = t[0] || 0;
        for (let i = 0; i < detail_len; i++) {
            detail_t[i] = t[i] - t0;
            detail_bb[i] = bbI[i];
        }

        const symbols = new Array(Nc_th);
        for (let i = 0; i < Nc_th; i++) symbols[i] = { val: bits[i] };

        return {
            t, bbI, bbQ, pb, fInst, bits,
            symbols,
            extras: {
                plot2_x, plot2_y,
                detail_t, detail_bb
            },
            plot2Type: 'markers'
        };
    }
};
