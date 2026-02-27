import { utils } from './utils.js';

export default {
    id: 'dsss',
    name: 'DSSS (Direct Sequence)',
    params: ['FC', 'RB', 'L'],
    requiredBits: (engine) => 10,
    help: 'modm_dsss_desc',
    info2: 'chart_2_spread_code',
    info3: 'chart_3_spread_sig',
    info4: 'chart_4_tech_freq',
    showConstellation: false,
    simulate: (engine, bits) => {
        const Nc_ds = bits.length;
        const pn = utils.lfsr(7, [7, 3], Nc_ds * engine.L).map(b => 2 * b - 1);
        const data_expanded = [];
        bits.forEach(b => {
            const val = 2 * b - 1;
            for (let i = 0; i < engine.L; i++) data_expanded.push(val);
        });
        const chips = data_expanded.map((d, i) => d * pn[i]);

        const sps_chip = 8;
        const Ntotal = chips.length * sps_chip;
        const Fs_ds = (engine.Rb * engine.L) * sps_chip;

        const t = new Float32Array(Ntotal);
        const bbI = new Float32Array(Ntotal);
        const bbQ = new Float32Array(Ntotal);
        const pb = new Float32Array(Ntotal);
        const fInst = new Float32Array(Ntotal).fill(engine.fc);

        for (let i = 0; i < chips.length; i++) {
            for (let s = 0; s < sps_chip; s++) {
                const idx = i * sps_chip + s;
                t[idx] = idx / Fs_ds;
                bbI[idx] = chips[i];
                pb[idx] = bbI[idx] * Math.cos(2 * Math.PI * engine.fc * t[idx]);
            }
        }
        return { t, bbI, bbQ, pb, fInst, bits, symbols: bits.map(b => ({ val: b })), extras: { plot2_x: Array.from({ length: pn.slice(0, 128).length }, (_, i) => i), plot2_y: pn.slice(0, 128) }, plot2Type: 'markers+lines' };
    }
};
