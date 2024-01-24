/**
 */

import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Constant } from './constant.js';
import { getTileImage } from './mahjong-tile-images.js';
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

  @property({ type: String }) discardarrange!: string;

  @property({ type: Number }) paddingLeft!: number;

  @property({ type: Number }) paddingTop!: number;

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["menuTap"] }] */
  menuTap() {
    this.shadowRoot!.getElementById('myDropdown')!.classList.toggle('show');
  }

  selectTap(e: MouseEvent) {
    if (e !== null && e.target !== null && e.target instanceof Element) {
      this.play.selectTap(e.target.id);
    }
    this.shadowRoot!.getElementById('myDropdown')!.classList.toggle('show');
  }

  check(match: string) {
    return match !== this.discardarrange ? '\u2610' : '\u2611';
  }

  override render() {
    const scale = Math.min(this.offsetHeight, this.offsetWidth) / Constant.tileWidth;
    const edge = Constant.tileWidth * 0.6 * scale;
    const padding = Constant.tileWidth * 0.2 * scale;
    const style = css`
      .dropbtn {
        margin: 0px;
        border: none;
        padding: 0px;
        background-color: transparent;
      }

      .svgbtn {
        padding: ${padding}px;
      }

      svg {
        width: ${edge};
        height: ${edge};
        fill: white;
      }

      .dropdown {
        position: absolute;
        display: inline-block;
        top: ${this.offsetTop + this.paddingTop}px;
        left: ${this.offsetLeft + this.paddingLeft}px;
      }

      .dropdown-content {
        display: none;
        position: relative;
        background-color: ${unsafeCSS(Constant.background)};
        color: white;
	padding: 5px;
	border-width: 2px;
	border-color: white;
        left: 32px;
        min-width: 160px;
        overflow: auto;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      .dropdown-content button {
        margin: 0px;
        border: none;
        padding: 0px;
        background-color: ${unsafeCSS(Constant.background)};
        color: white;
      }
      .show {
        display: block;
      }
    `;
    // console.log(`menu render ${this.offsetLeft} ${this.offsetTop} ${this.offsetWidth} ${this.offsetHeight}`);
    return html`
      <style>
        ${style}
      </style>
      <div class="dropdown">
        <button @click=${this.menuTap} class="dropbtn svgbutton" title="menu">
          <svg
            viewBox="0 0 ${Constant.qianWidth} ${Constant.qianHeight}"
            width=${edge}
            height=${edge}
          >
            ${getTileImage('qian')}
          </svg>
        </button>
        <div id="myDropdown" class="dropdown-content">
          <button id="restartGame" class="menu-item" @click=${this.selectTap}>
            Restart Game
          </button><br />
          <button id="nextGame" class="menu-item" @click=${this.selectTap}>
            Next Game
          </button><br />
          <button id="previousGame" class="menu-item" @click=${this.selectTap}>
            Previous Game
          </button><br />
          <button id="randomGame" class="menu-item" @click=${this.selectTap}>
            Random Game
          </button><br />
          <hr />
          <button id="byTileOrder" class="menu-item" @click=${this.selectTap}>
            ${this.check('byTileOrder')} Discard By Tile
          </button><br />
          <button
            id="byDiscardOrder"
            class="menu-item"
            @click=${this.selectTap}
          >
            ${this.check('byDiscardOrder')} Discard By Order
          </button><br />
          <button id="noDiscard" class="menu-item" @click=${this.selectTap}>
            ${this.check('noDiscard')} No Discard
          </button><br />
          <hr />
          <button id="youWin" class="menu-item" @click=${this.selectTap}>
            Trigger You Win
          </button><br />
          <button id="youLose" class="menu-item" @click=${this.selectTap}>
            Trigger You Lose
          </button><br />
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
