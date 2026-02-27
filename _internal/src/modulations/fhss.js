import { utils } from './utils.js';

export default {
    id: 'fhss',
    name: 'FHSS (Freq. Hopping)',
    params: ['M', 'FC', 'RB', 'BW', 'RH'],
    requiredBits: (engine) => 100,
    help: 'modm_fhss_desc',
    info2: 'chart_2_hop_code',
    info3: 'chart_3_baseband',
    info4: 'chart_4_tech_freq',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_fh = bits.length;
        const M_fh = engine.M;
        const df = (engine.BW / engine.M);
        const sps_fh = 16;
        const Fs_fh = engine.Rb * sps_fh;
        const hop_len = Math.max(1, Math.floor(engine.Rb / engine.Rh));

        const pn = utils.lfsr(8, [8, 4, 3, 2], Math.ceil(Nc_fh / hop_len));

        const Ntotal = Nc_fh * sps_fh;
        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal);

        for (let i = 0; i < Nc_fh; i++) {
            const hop_idx = Math.floor(i / hop_len);
            const chan = pn[hop_idx] % M_fh;
            const fi = (chan - (M_fh - 1) / 2) * df;
            const data = 2 * bits[i] - 1;
            for (let s = 0; s < sps_fh; s++) {
                const idx = i * sps_fh + s;
                t[idx] = idx / Fs_fh;
                bbI[idx] = data * Math.cos(2 * Math.PI * fi * idx / Fs_fh);
                bbQ[idx] = data * Math.sin(2 * Math.PI * fi * idx / Fs_fh);
                fInst[idx] = engine.fc + fi;
                pb[idx] = bbI[idx] * Math.cos(2 * Math.PI * engine.fc * t[idx]) - bbQ[idx] * Math.sin(2 * Math.PI * engine.fc * t[idx]);
            }
        }
        return { t, bbI, bbQ, pb, fInst, bits, symbols: bits.map(b => ({ val: b })), extras: { plot2_x: Array.from({ length: pn.slice(0, 60).length }, (_, i) => i), plot2_y: pn.slice(0, 60) }, plot2Type: 'markers+lines' };
    }
};
