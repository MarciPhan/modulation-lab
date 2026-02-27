import { utils } from './utils.js';

export default {
    id: 'thss',
    name: 'THSS (Time Hopping)',
    params: ['FC', 'RB', 'SLOTS'],
    requiredBits: (engine) => 40,
    help: 'modm_thss_desc',
    info2: 'chart_2_hop_code',
    info3: 'chart_3_baseband',
    info4: 'chart_4_tech_freq',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_th = bits.length;
        const codes = utils.lfsr(7, [7, 3], Nc_th);
        const sps_th = 200;
        const Ts_th = 0.001;
        const Fs_th = sps_th / Ts_th;
        const Ntotal = Nc_th * sps_th;
        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal).fill(engine.fc);
        for (let i = 0; i < Nc_th; i++) {
            const slot = codes[i] % engine.SLOTS; // Fixed to use SLOTS from engine correctly
            const data = 2 * bits[i] - 1;
            const start = i * sps_th + Math.floor(slot * (sps_th / engine.SLOTS));
            for (let s = 0; s < sps_th; s++) t[i * sps_th + s] = (i * sps_th + s) / Fs_th;
            const p_len = 5;
            for (let p = 0; p < p_len; p++) {
                if (start + p < Ntotal) {
                    bbI[start + p] = data * Math.exp(-p);
                    pb[start + p] = bbI[start + p] * Math.cos(2 * Math.PI * engine.fc * t[start + p]);
                }
            }
        }
        const codesMod = codes.slice(0, 40).map(c => c % engine.SLOTS);
        return { t, bbI, bbQ, pb, fInst, bits, symbols: bits.map(b => ({ val: b })), extras: { plot2_x: Array.from({ length: codesMod.length }, (_, i) => i), plot2_y: codesMod }, plot2Type: 'markers' };
    }
};
