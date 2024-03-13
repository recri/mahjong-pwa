
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Constant } from './constant.js';
import { getIconImage } from './mahjong-icon-images.js';
import { Play } from './mahjong-play.js';

/**
 * The menu button which displays the menu
 * which controls the game
 */
@customElement('mahjong-menu-view')
export class MahjongMenuView extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Boolean }) discardArrange!: boolean;

  @property({ type: Number }) scale!: number;
    
  @property({ type: String }) orientation!: string;
    
// this menu unposting from stray clicks did not work well
//  menuIsPosted: boolean = false;
    
  menuTap() {
//      console.log("menuTap");
//    if ( ! this.menuIsPosted) {
//      this.menuIsPosted = true;
//      window.onclick = this.menuUntap;
      this.shadowRoot!.getElementById('the-dropdown')!.classList.toggle('show');
//    }
  }

  menuUntap() {
//      console.log("menuUntap");
//    if (this.menuIsPosted) {
      this.shadowRoot!.getElementById('the-dropdown')!.classList.toggle('show');
//      window.onclick = null;
//      this.menuIsPosted = false;
//    }
  }

  selectTap(e: MouseEvent) {
      if (e !== null && e.target !== null && e.target instanceof Element) {
	  let { target } = e;
	  while (target && target instanceof Element && ! target.id && target.parentElement) {
	      // console.log(`selectTap ${target.tagName} has no id`);
	      target = target.parentElement;
	  }
	  // console.log(`selectTap ${target.tagName} has id ${target.id}`);
	  if (target && target.id) {
	      this.play.selectTap(target.id);
	  }
      }
      this.menuUntap()
  }

  iconImageName(id: string): string {
    if (id === 'discardArrange')
      return this.discardArrange ? "checkedBox" : "uncheckedBox"
    return id;
  }

  menu() {
    return [
      [ 'undoLastMove', 'Undo Last Move' ],
      [ 'restartGame', 'Restart Game' ],
      [ 'previousGame', 'Previous Game' ],
      [ 'randomGame', 'Random Game' ],
      [ 'nextGame', 'Next Game' ],
      [ 'discardArrange', 'Discard Arrange' ],
//      [ 'youWin', 'Trigger You Win' ],
//      [ 'youLose', 'Trigger You Lose' ],
    ].map(([id, alt]) =>
      html`
        <button class="menu-item" @click=${this.selectTap} alt="${alt}" id="${id}">
          ${getIconImage(this.iconImageName(id))}
        </button>
      `);
  }

  override render() {
    const edge = Constant.tileWidth * this.scale;
    const padding = Constant.tileWidth * 0.2 * this.scale;
    const style = css`

      .dropdown {
        position: relative;
        display: inline-block;
        border: none;
        margin: 0px;
        padding: 0px;
        background-color: ${unsafeCSS(Constant.background)};
        color: white;
      }

      .dropdown-content {
        display: none;
	top: 16px;
	left: 16px;
	padding: 10px
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      }

      .show {
        display: inline-block;
      }

      button {
        border: none;
        margin: 0px;
	padding: ${padding}px;
        background-color: ${unsafeCSS(Constant.background)};
      }

      svg {
        width: ${edge}px;
        height: ${edge}px;
	fill: white;
      }

    `;
    // console.log(`menu view render ${this.discardArrange}`);
    return html`
      <style>
        ${style}
      </style>
      <div class="dropdown">
        <button @click=${this.menuTap} title="menu">
          ${getIconImage('hamburgerMenu')}
        </button>
        <div id="the-dropdown" class="dropdown-content">
	  ${this.menu()}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mahjong-menu-view': MahjongMenuView;
  }
}
