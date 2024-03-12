
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
    
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["menuTap"] }] */
  menuTap() {
      this.shadowRoot!.getElementById('myDropdown')!.classList.toggle('show');
      // register a mouse tap event listener on the root window
      // that calls menuUntap, which means this 
  }

  menuUntap() {
      // unregister mouse tap event listener on the root window
    this.shadowRoot!.getElementById('myDropdown')!.classList.toggle('show');
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

    static items = [
	[ 'restartGame', 'Restart Game' ],
	[ 'nextGame', 'Next Game' ],
	[ 'previousGame', 'Previous Game' ],
	[ 'randomGame', 'Random Game' ],
	[ 'discardArrange', 'Discard Arrange' ],
	[ 'youWin', 'Trigger You Win' ],
	[ 'youLose', 'Trigger You Lose' ],
    ];

  iconImageName(id: string): string {
    if (id === 'discardArrange')
      return this.discardArrange ? "checkedBox" : "uncheckedBox"
    return id;
  }

  menu() {
    const { iconWidth, iconHeight } = Constant;
    const { selectTap } = this;
    return MahjongMenuView.items.map(([id, alt]) =>
      html`
        <button class="menu-item" @click=${selectTap} alt="${alt}" id="${id}">
          <svg viewBox="0 0 ${iconWidth} ${iconHeight}">
	    ${getIconImage(this.iconImageName(id))}
          </svg>
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
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
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
	stroke: white;
	stroke-width: 3;
      }

    `;
    // console.log(`menu view render ${this.discardArrange}`);
    return html`
      <style>
        ${style}
      </style>
      <div class="dropdown">
        <button @click=${this.menuTap} class="dropdown-button svgbutton" title="menu">
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('hamburgerMenu')}
          </svg>
        </button>
        <div id="myDropdown" class="dropdown-content">
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
