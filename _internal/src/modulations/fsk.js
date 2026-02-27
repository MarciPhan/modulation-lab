import { utils } from './utils.js';

export default {
    id: 'fsk',
    name: 'M-FSK (Frequency)',
    params: ['M', 'FC', 'RB'],
    requiredBits: (engine) => engine.Nc * Math.max(1, Math.log2(engine.M)),
    help: 'modm_fsk_desc',
    info2: 'chart_2_sym_mapping',
    info3: 'chart_3_baseband',
    info4: 'chart_4_tech_freq',
    showConstellation: false,
    simulate: (engine, bits) => utils.simulateLinearGeneric(bits, engine.M, engine.Rb, engine.fc, engine.sps, engine.Nc, engine.rolloff, engine.span, 'fsk')
};
