export default {
    // UI Menu a Ovládací prvky
    'menu_params': 'Parametry',
    'menu_presentation': 'Prezentace & Výuka',
    'lbl_modulation': 'Modulační cesta',
    'lbl_random_data': 'Náhodná data',
    'btn_regen': 'Regen',
    'lbl_order': 'Řád [M]',
    'lbl_carrier': 'Nosná [fc] kHz',
    'lbl_bitrate': 'Bitová rychlost [Rb] kbps',
    'lbl_pulse': 'Alfa pulzu α',
    'lbl_sf': 'LoRa SF',
    'lbl_bw': 'Šířka pásma [BW]',
    'lbl_chips': 'Čipy [L]',
    'lbl_slots': 'TH Sloty',
    'lbl_hop': 'Hop [Rh]',
    'lbl_samples': 'Vzorků/Sym',
    'lbl_symbol_count': 'Počet symbolů',
    'btn_guide': 'PRŮVODCE APLIKACÍ',
    'btn_presentation': 'PRESENTATION MODE',

    // Lab Header & Status
    'header_title': 'Modulation Lab',
    'header_status': 'Status systému: SIGNAL LOCK v4.0',
    'divider_legend': 'LEGENDA / NÁPOVĚDA',
    'divider_engine': 'NASTAVENÍ ENGINU',
    'help_initial': 'Vyberte modulaci pro zobrazení detailů.',

    // Info Slot Keys
    'info_source': 'Zdroj: Rb = {rb} kbps | Bit t = {t} ms',
    'info_baseband': 'Baseband: SPS = {sps} | f_sampling = {fs} kHz',

    // Tooltipy Fyzikálních parametrů
    'tt_random_data': "Zaškrtnutím bude aplikace při každém překreslení generovat nová náhodná datová slova. Tlačítkem Regen můžete ručně vygenerovat novou zprávu a vynutit překreslení nezávisle na změnách v parametrech.",
    'tt_order': "Řád modulace. Udává celkový počet distinktních (jedinečných) stavů symbolů v konstelaci. Čím vyšší řád, tím více bitů přeneseme jedním symbolem, roste ale riziko chyb (BER).",
    'tt_carrier': "Nosná frekvence. Základní (oscilační) kmitočet sinusovky, tzv. nosné vlny. Právě do změn její fáze, amplitudy či frekvence je podle zvolené modulace ukryta samotná zpráva.",
    'tt_bitrate': "Přenosová (bitová) rychlost. Udává počet přenesených informačních bitů za sekundu (zde v tisících - kbps). Na základě Rb a řádu modulační abecedy M lze spočítat výslednou modulační (vzorkovací) rychlost.",
    'tt_pulse': "Koeficient zaoblení (Rolloff) u RRC filtru. Tento filtr před odesláním pásmově omezuje signál zaoblením původně obdélníkových pulzů. Slouží k prevenci mezisymbolové interference (ISI) a omezení rušení v sousedních kanálech (ACI).",
    'tt_sf': "Spreading Factor u LoRy. Určuje strmost a dobu trvání chirpu. Vyšší SF zásadně zvyšuje odolnost proti šumu a prodlužuje dosah, ale zároveň exponenciálně snižuje užitečnou přenosovou rychlost dat.",
    'tt_bw': "Frekvenční šířka pásma u LoRy (Chirp Spread Spectrum). Zvyšuje-li se BW, rozšíří se frekvenční rozsah chirpu a tím se zkrátí délka symbolu. BW má přímý vliv na kapacitu kanálu a rozprostření.",
    'tt_chips': "Délka rozprostíracího PRN kódu (počet čipů) na jeden informační bit. Původní pomalý datový symbol je vynásoben vysokorychlostní sekvencí úzkých čipů, což má za následek širokopásmové rozprostření jeho frekvenčního spektra.",
    'tt_slots': "Počet úzkých pevných časových 'oken' (slotů), do kterých se trefuje velmi krátký, leč energeticky silný pulz o ostaním čase v tichu (Pulse Position a Time Hopping rádio).",
    'tt_hop': "Rychlost přeskakování u FHSS rádio modulací. Udává, kolik přeskoků nosné frekvence provede vysílač s přijímačem za jednu sekundu, čímž unikají zarušení na jednom z kanálů.",
    'tt_samples': "Čistě matematický parametr, udávající kolik drobných bodů/vzorků vykresluje náš JavaScript simulátor pro znázornění jediné modulační vlnky. Více bodů = hladší průběh grafu, těžší na procesor prohlížeče.",
    'tt_symbol_count': "Kolik symbolů napočítáme pro celkovou velikost prováděné simulační dávky. Pokud snížíte toto číslo, odlehčíte webovému prohlížeči, jelikož signálová trasa bude krátká a rychlá na výpočet.",

    // Názvy grafů
    'chart_1_title': "1) Zdrojová data (Bity)",
    'chart_1_tt': "Náhodně vygenerovaná binární informace (1 a 0), kterou chceme přenést komunikačním systémem. Představuje surová data připravená k modulačnímu mapování na fyzické symboly.",
    'chart_2_title': "2) Mapování / Kód",
    'chart_2_tt': "Ukazuje způsob zobrazení (mapování) série binárních dat do diskrétních stavů ('symbolů'). U formátů s nosnou se obvykle mapuje do komplexní roviny (fáze/amplituda), u dalších může určovat fázové zdvihy nebo posloupnosti šumu.",
    'chart_3_title': "3) Základní pásmo",
    'chart_3_tt': "Reprezentace signálu v tzv. základním (nízkofrekvenčním) pásmu před převodem nahoru (upkonverzí) k vysílání. Pomocí komplexních časových průběhů složek I (fázová) a Q (kvadraturní) se znázorňují formované hrany.",
    'chart_4_title': "4) Technická analýza / Konstelace",
    'chart_4_tt': "Analytický (vektorový nebo spektrální) pohled. Konstelace zobrazuje stavy symbolů pomocí I a Q, okamžitá frekvence pak chování spojité fáze (CPFSK, CSS), případně můžeme pozorovat modulovou obálku určující zatížení zesilovače.",
    'chart_5_title': "5) Výstup RF kanálu",
    'chart_5_tt': "Výsledný časový průběh RF (Radio Frequency) modulovaného signálu. Představuje vysokofrekvenční nosnou frekvenci vlny přenášenou prostorem, do jejíchž změn amplitudy, fáze nebo kmitočtu je zakódována informace.",
    // Per-module názvy grafů (odpovídají referenčním Python skriptům)
    // QAM
    'chart_2_qam': "2) Konstelace M-QAM (Gray)",
    'chart_3_qam': "3) Základní pásmo (RRC tvarování) – I/Q",
    'chart_4_qam': "4) Obálka základního pásma |s_BB(t)|",
    // PSK
    'chart_2_psk': "2) Konstelace M-PSK (Gray)",
    'chart_3_psk': "3) Základní pásmo (RRC tvarování) – I/Q",
    'chart_4_psk': "4) Fáze signálu",
    // ASK
    'chart_2_ask': "2) Symboly (Gray) – normalizované amplitudy",
    'chart_3_ask': "3) Základní pásmo (RRC tvarování)",
    'chart_4_ask': "4) Fáze signálu",
    // FSK
    'chart_2_fsk': "2) Symboly (Gray)",
    'chart_3_fsk': "3) Základní pásmo – I/Q",
    'chart_4_fsk': "4) Okamžitá frekvence (kHz)",
    // CSS
    'chart_2_css': "2) Indexy symbolů m (Chirp)",
    'chart_3_css': "3) Základní pásmo (CSS) – I/Q",
    'chart_4_css': "4) Instantánní frekvence chirpu (kHz)",
    // DSSS
    'chart_2_dsss': "2) PN čipová sekvence (±1)",
    'chart_3_dsss': "3) Rozprostřené čipy (data × PN)",
    'chart_4_dsss': "4) Základní pásmo DSSS – I(t)",
    // FHSS
    'chart_2_fhss': "2) Index kanálu (FHSS hop)",
    'chart_3_fhss': "3) Základní pásmo – I/Q",
    'chart_4_fhss': "4) Instantánní frekvence z basebandu (kHz)",
    // THSS
    'chart_2_thss': "2) Time-hopping kód (TH sloty)",
    'chart_3_thss': "3) Základní pásmo THSS",
    'chart_4_thss': "4) Detail 1 bitu – pulzy s TH",

    // Sekce Modulu Popisů
    'modm_qam_desc': "<strong>M-QAM (Kvadraturní amplitudová modulace):</strong> Pokročilá modulační technika tvořící stavy symbolů kombinací změny amplitudy a fáze nosné vlny ve složkách I a Q. Používá se pro dosažení vysoké spektrální efektivity v systémech jako 5G, Wi-Fi nebo DVB. Konstelační diagram (graf 2) ukazuje rozložení symbolů. S rostoucím řádem M lze přenést více bitů jedním symbolem, ale stavy jsou v rovině blíže k sobě, což zásadně zvyšuje požadavky na odstup signálu od šumu (SNR).",
    'modm_psk_desc': "<strong>M-PSK (Fázové klíčování):</strong> Modulace, při které se informace přenáší přesně odstupňovaným fázovým posunem nosné vlny. Amplituda stacionárních stavů symbolů ve fázi zůstává konstantní. Proto všechny modulační stavy (body) leží v koncentrické kružnici v I/Q rovině, jak ukazuje graf 2. Metoda je odolnější vůči nelinearitám koncových stupňů, využívaná například v satelitních komunikacích.",
    'modm_ask_desc': "<strong>M-ASK (Amplitudové klíčování):</strong> Základní forma digitální modulace. Zpravodajská informace je kódována čistě do změny úrovně amplitudy nosné vlny, zatímco fáze a frekvence jsou konstantní. Varianta pro M=2, zvaná On-Off Keying (OOK), vysílá energii jen pro log. 1. Je náchylnější na rušení a změny útlumu prostředí, využívá se však např. pro jednoduché bezdrátové ovládání nebo v optických sítích.",
    'modm_fsk_desc': "<strong>M-FSK (Frekvenční klíčování):</strong> Místo úprav amplitudy měníme kmitočet nosné vlny skokově (orthogonal), anebo plynulou změnou fáze (CPFSK). Okamžitou modulaci do frekvencí znázorňuje graf 4. Konstantní obálka zaručuje vynikající imunitu vůči amplitudovým propadům (fading) a nelineárním zesilovačům, proto M-FSK často najdeme v systémech Bluetooth, pagerech a telemetrii.",
    'modm_css_desc': "<strong>CSS (LoRa Chirp Spread Spectrum):</strong> Širokopásmová technika primárně nasazovaná u dálkových nízkoenergetických zařízení (IoT). Typickým znakem je nosná s lineárně rozmítanou frekvencí, na kterou navazují časově zpožděné cyklické rozmítání (chirps). Rozprostření signálu umožňuje robustní komunikaci i při signálech nacházejících se hluboko pod úrovní šumu (tj. SNR < 0 dB), avšak na úkor velmi nízké bitové propustnosti.",
    'modm_dsss_desc': "<strong>DSSS (Přímé rozprostření spektra):</strong> Metoda rozprostřeného spektra, kdy je každý informační bit násoben pseudonáhodnou sekvencí úzkých čipů s extrémní šířkou pásma. Ve výsledném spektru výkonová spektrální hustota (PSD) klesá a maskuje se pod úroveň běžného šumu. V přijímači s příslušným dekódovacím klíčem se korelační shodou nad šumem signál obnoví. Zvyšuje odolnost chránící proti rušení a odposlechu (dnes využívané např. GPS).",
    'modm_fhss_desc': "<strong>FHSS (Frekvenční přeskokování):</strong> Širokopásmová metoda, u které při přenosu dat dochází k synchronnímu ladění úzkopásmové nosné vlny podle složitého pseudonáhodného klíče (tzv. skákání, hopping). Silné lokální úzkopásmové rušení či interfence ovlivní jen zanedbatelnou část přenosu, než systém okamžitě frekvenčně přeskočí na jiný kanál. Používáno historicky ve vojenství či v současnosti protokolem Bluetooth.",
    'modm_thss_desc': "<strong>THSS (Časově-přeskokové spektrum / UWB):</strong> Metoda, kde se informace (např. Pulzně-poziční modulací) posílá uvnitř časových oken volených pseudonáhodným kódem namísto přeskoků frekvence. Pracuje na principu kratičkých impulsů energie (tím obsazují ultra-širokou šířku pásma - UWB). Výhodou je velká odolnost proti vícecestnému šíření a schopnost koexistence velkého počtu zařízení bez rušení. <br><br><strong>Upozornění:</strong> U THSS simulace je vzorkování statické. Pokud nastavíte nosnou frekvenci fc vysoko (nad Fs/2), dojde k tzv. aliasingu. Pro tento model doporučujeme držet fc níže vzhledem k omezenému rozsahu SPS a Rb prohlížeče.",
    // Modal Průvodce
    'modal_welcome_title': "Vítejte v Modulation Lab",
    'modal_welcome_intro': "Tato aplikace slouží k interaktivnímu pochopení principů fungování digitálních rádiových modulací pro studenty.",
    'modal_section_1_title': "Levé menu (Parametry Modulace)",
    'modal_section_1_body': "Nahoře můžete vybrat libovolný <strong>modulační formát</strong> (QAM, PSK, LoRa...). Pod ním naleznete všechny fyzikální parametry vysílače. <strong>Zkuste najet myší na tyrkysové symboly <span class=\"info-icon\" style=\"position:static; margin:0 2px; vertical-align: middle;\">?</span> vedle názvů</strong>, kde ihned zjistíte, co se stane, když parametr posuvníkem změníte!",
    'modal_section_2_title': "Pravá sekce (Grafické panely)",
    'modal_section_2_body': "Aplikace okamžitě krokově simuluje signál tak, jak putuje obvody k anténě: od počítačových nul a jedniček (Graf 1), přes jejich mapování (Graf 2), zpracování frekvenčními filtry do základního pásma (Graf 3), až po výslednou oscilující nosnou rádiovou vlnu putující z antény 299 792 km/s vesmírem (Graf 5).",
    'modal_section_2_footer': "U každého z grafů můžete kliknout na ikonu <strong>⛶ pro zvětšení (fullscreen)</strong> zobrazení.",
    'modal_section_3_title': "Prezentace a Výuka",
    'modal_section_3_body': "Pro promítání třídě je vlevo k dispozici <strong>PRESENTATION MODE</strong>. Aplikace ztlumí prvky na pozadí a nabere vysokokontrastní neonou paletu, která je na projektorech perfektní pro ukázku i ze vzdálenějších lavic.",
    'modal_close_btn': "Zavřít a začít experimentovat"
};
