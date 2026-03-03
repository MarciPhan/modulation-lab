// UI Mapping Base Config
export const controls = {
    mod: 'mod-type',
    mRange: 'm-order', mNum: 'm-in',
    fcRange: 'fc', fcNum: 'fc-in',
    rbRange: 'rb', rbNum: 'rb-in',
    rollRange: 'rolloff', rollNum: 'rolloff-in',
    sfRange: 'sf', sfNum: 'sf-in',
    bwRange: 'bw', bwNum: 'bw-in',
    lRange: 'l-chips', lNum: 'l-in',
    slotsRange: 'th-slots', slotsNum: 'slots-in',
    rhRange: 'rh', rhNum: 'rh-in',
    spsRange: 'sps', spsNum: 'sps-in',
    ncRange: 'nc', ncNum: 'nc-in',
    randomCheck: 'random-data',
    regenBtn: 'regen-data',
    themeBtn: 'theme-toggle',
    presBtn: 'pres-toggle',
    menuBtn: 'menu-toggle',
    helpBtn: 'show-help-btn',
    langToggle: 'lang-toggle'
};

export const elements = {};
Object.keys(controls).forEach(key => {
    const el = document.getElementById(controls[key]);
    if (!el) {
        console.warn(`Warning: Element with ID "${controls[key]}" not found for key "${key}"`);
    }
    elements[key] = el;
});

const getSafe = (id) => {
    const el = document.getElementById(id);
    if (!el) console.warn(`Warning: Static element "${id}" not found!`);
    return el;
};

export const helpPanel = getSafe('help-panel');
export const infoSlots = [1, 2, 3, 4, 5].map(i => getSafe(`info-${i}`));
export const appContainer = getSafe('app');
export const welcomeModal = getSafe('welcome-modal');
export const closeModalBtn = getSafe('close-modal-btn');
export const overlay = getSafe('focus-overlay');
export const closeBtn = getSafe('focus-close');
export const focusContainer = getSafe('focus-plot-container');

