/* UI icon definitions converted to svg`` */

import { svg, TemplateResult } from 'lit'; // html,

interface ObjectMap {
  [index: string]: TemplateResult<2>;
}

// from old qian style="stroke-width:0.264583"

// SVG Icons from https://openmoji.org/
// OpenMoji is published under the Creative Commons Share Alike License 4.0 (CC BY-SA 4.0). 
const icons: ObjectMap = {
    // <svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    // <svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    hamburgerMenu: svg`
    <line x1="16" x2="56" y1="26" y2="26" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
    <line x1="16" x2="56" y1="36" y2="36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
    <line x1="16" x2="56" y1="46" y2="46" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
`,
    restartGame: svg`
    <path fill="none" stroke-linejoin="round"  d="m19.5816,55.6062c.4848.1782,1.0303.297,1.5758.297.8485,0,1.697-.297,2.4242-.7722l30-15.9793.303-.297c.7879-.7722,1.2121-1.7227,1.2121-2.7919s-.4242-2.0791-1.2121-2.7919l-.303-.297-30-16.0981c-1.0909-.8316-2.6667-1.0098-4-.4752-1.5152.594-2.4848,2.0791-2.4848,3.683v31.8397c0,1.6039.9696,3.0889,2.4848,3.6829Z"/>
`,
    previousGame: svg`
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M42.5161,55l-16.976-9.111l-14.2864-7.6675c-1.6717-0.8972-1.6717-3.5456,0-4.4428l14.2864-7.6675L42.5161,17"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M66,55l-17.0551-9.1111L34.592,38.2214c-1.6795-0.8972-1.6795-3.5456,0-4.4428l14.3529-7.6675L66,17"/>
    <line x1="6" x2="6" y1="55" y2="17" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
`,
    nextGame: svg`
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M29.4839,17l16.976,9.1111l14.2864,7.6675c1.6717,0.8972,1.6717,3.5456,0,4.4428l-14.2864,7.6675L29.4839,55"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M6,17l17.0551,9.1111l14.3529,7.6675c1.6795,0.8972,1.6795,3.5456,0,4.4428l-14.3529,7.6675L6,55"/>
    <line x1="66" x2="66" y1="17" y2="55" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
`,
    randomGame: svg`
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M40.3774,40.4583l6.9093,6.9332c1.6139,1.6195,4.0955,2.5668,6.7244,2.5668h12.7749"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M5,21.9583h12.7749c2.6288,0,5.1104,0.9473,6.7244,2.5668l7.0229,7.0473"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M5,49.9583h12.7749c2.6288,0,5.1104-0.9473,6.7244-2.5668l22.7874-22.8664c1.6139-1.6195,4.0955-2.5668,6.7244-2.5668h12.7749"/>
    <line x1="66.7859" x2="58.6005" y1="21.9583" y2="13.7444" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
    <line x1="58.6005" x2="66.7859" y1="30.1722" y2="21.9583" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
    <line x1="66.7859" x2="58.6005" y1="49.9583" y2="41.7444" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
    <line x1="58.6005" x2="66.7859" y1="58.1722" y2="49.9583" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" />
`,
    uncheckedBox: svg`
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M45,29.0772V50.318c0,0.2541-0.2059,0.46-0.46,0.46H22.46c-0.254,0-0.46-0.2059-0.46-0.46v-22.08c0-0.254,0.2059-0.46,0.46-0.46 h13.9961h0.3953"/>
`,
    checkedBox: svg`
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M51.2308,14.778c-15.2308,18-18,30.4615-18,30.4615s-2.7692-6.9231-5.5385-9.6923"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"  d="M45,29.0772V50.318c0,0.2541-0.2059,0.46-0.46,0.46H22.46c-0.254,0-0.46-0.2059-0.46-0.46v-22.08c0-0.254,0.2059-0.46,0.46-0.46 h13.9961h0.3953"/>
`,
    youWin: svg`
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M35.236,59.6006h-9 c-8.321,0-14-6.681-14-15c0.0204-4.7991,1.7993-9.4241,5-13"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M34.625,31.6006h-4.389 l7-18c0.811-2.084-2.79-3.8-5-1l-15,19"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M37.448,35.1006 c0.1527,2.0638,1.9342,3.6226,4,3.5h13c1.933,0.2578,3.709-1.1001,3.9669-3.0331s-1.1001-3.709-3.0331-3.9669 c-0.3099-0.0413-0.6238-0.0413-0.9337,0h-13C39.3822,31.478,37.6007,33.0368,37.448,35.1006z"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M38.305,56.4366 c0.1527,2.0638,1.9342,3.6226,4,3.5h7c1.933,0.2578,3.709-1.1001,3.9669-3.0331s-1.1001-3.709-3.0331-3.9669 c-0.3099-0.0413-0.6238-0.0413-0.9337,0h-7C40.2392,52.814,38.4577,54.3728,38.305,56.4366z"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M33.236,42.4366 c0.1527,2.0638,1.9342,3.6226,4,3.5h19c1.933,0.2578,3.709-1.1001,3.9669-3.0331s-1.1001-3.709-3.0331-3.9669 c-0.3099-0.0413-0.6238-0.0413-0.9337,0h-19C35.1702,38.814,33.3887,40.3728,33.236,42.4366z"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M35.236,49.4366 c0.1527,2.0638,1.9342,3.6226,4,3.5h15c1.933,0.2578,3.709-1.1001,3.9669-3.0331s-1.1001-3.709-3.0331-3.9669 c-0.3099-0.0413-0.6238-0.0413-0.9337,0h-15C37.1702,45.814,35.3887,47.3728,35.236,49.4366z"/>
    <path fill="none" stroke-miterlimit="10"  d="M14.136,36.2626 c-1.176,2.4511-1.8253,5.1215-1.906,7.839c0,8.56,4.625,15.5,15.125,15.5"/>
`,
    youLose: svg`
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M17.236,40.3161 c-3.2007-3.5759-4.9796-8.2009-5-13c0-8.319,5.679-15,14-15h9"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M17.236,40.3161l15,19 c2.21,2.8,5.811,1.084,5-1l-7-18h4.389"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M41.448,40.3161h13 c0.3099,0.0413,0.6238,0.0413,0.9337,0c1.933-0.2578,3.291-2.0339,3.0331-3.9669s-2.0339-3.291-3.9669-3.0331h-13 c-2.0658-0.1226-3.8473,1.4362-4,3.5C37.6007,38.8799,39.3822,40.4387,41.448,40.3161z"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M42.305,18.9801h7 c0.3099,0.0413,0.6238,0.0413,0.9337,0c1.933-0.2578,3.291-2.0339,3.0331-3.9669s-2.0339-3.291-3.9669-3.0331h-7 c-2.0658-0.1226-3.8473,1.4362-4,3.5C38.4577,17.5439,40.2392,19.1027,42.305,18.9801z"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M37.236,32.9801h19 c0.3099,0.0413,0.6238,0.0413,0.9337,0c1.933-0.2578,3.291-2.0339,3.0331-3.9669s-2.0339-3.291-3.9669-3.0331h-19 c-2.0658-0.1226-3.8473,1.4362-4,3.5C33.3887,31.5439,35.1702,33.1027,37.236,32.9801z"/>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round"  d="M39.236,25.9801h15 c0.3099,0.0413,0.6238,0.0413,0.9337,0c1.933-0.2578,3.291-2.0339,3.0331-3.9669s-2.0339-3.291-3.9669-3.0331h-15 c-2.0658-0.1226-3.8473,1.4362-4,3.5C35.3887,24.5439,37.1702,26.1027,39.236,25.9801z"/>
    <path fill="none" stroke-miterlimit="10"  d="M27.355,12.315c-10.5,0-15.125,6.94-15.125,15.5 c0.0807,2.7175,0.73,5.3879,1.906,7.839"/>
`,
    goBack: svg`
    <path fill="none" stroke-linejoin="round" d="m52.6119,16.3937c-.4848-.1782-1.0303-.297-1.5758-.297-.8485,0-1.697.297-2.4242.7722l-30,15.9793-.303.297c-.7879.7722-1.2121,1.7227-1.2121,2.7919s.4242,2.0791,1.2121,2.7919l.303.297,30,16.0981c1.0909.8316,2.6667,1.0098,4,.4752,1.5152-.594,2.4848-2.0791,2.4848-3.683v-31.8396c0-1.6039-.9697-3.0889-2.4848-3.683Z"/>
`,
};

export const getIconImageNames = (): string[] => Object.keys(icons);

export const getIconImage = (name: string): any => icons[name];
