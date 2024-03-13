/* UI icon definitions converted to svg`` */

import { html, TemplateResult } from 'lit'; // html,

interface ObjectMap {
  [index: string]: TemplateResult<1>;
}

// Icons from https://fonts.google.com/icons
const icons: ObjectMap = {
    // menu
    hamburgerMenu: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
</svg>`,
    // play
    restartGame: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M320-200v-560l440 280-440 280Z"/>
</svg>`,
    // skip_previous
    previousGame: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Z"/>
</svg>`,
    // skip_next
    nextGame: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z"/>
</svg>`,
    // shuffle
    randomGame: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M560-160v-80h104L537-367l57-57 126 126v-102h80v240H560Zm-344 0-56-56 504-504H560v-80h240v240h-80v-104L216-160Zm151-377L160-744l56-56 207 207-56 56Z"/>
</svg>`,
    // toggle_off
    uncheckedBox: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm200-120Z"/>
</svg>`,
    // toggle_on
    checkedBox: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm400-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM480-480Z"/>
</svg>`,
    // thumb_up
    youWin: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
</svg>`,
    // thumb_down
    youLose: html`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/>
</svg>`,
    // undo
    undoLastMove: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
  <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/>
</svg>`,
};

export const getIconImageNames = (): string[] => Object.keys(icons);

export const getIconImage = (name: string): any => icons[name];
