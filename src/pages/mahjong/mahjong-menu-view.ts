/**
 */

import { LitElement, html, css } from 'lit';
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

  @property({ type: Object }) scale!: number;

  @property({ type: String }) discardarrange!: string;

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
    const edge = this.scale * 0.6;
    const padding = this.scale * 0.2;
    const style = css`
      button,
      .dropbtn {
        margin: 0px;
        border: none;
        padding: 0px;
        background-color: transparent;
        color: gray;
        cursor: pointer;
      }

      .svgbtn {
        padding: ${padding}px;
      }

      svg {
        width: ${edge};
        height: ${edge};
        fill: gray;
      }

      .dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 160px;
        overflow: auto;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
      }

      .show {
        display: block;
      }
    `;

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
            Restart Game</button
          ><br />
          <button id="nextGame" class="menu-item" @click=${this.selectTap}>
            Next Game
          </button>
          <button id="previousGame" class="menu-item" @click=${this.selectTap}>
            Previous Game
          </button>
          <button id="randomGame" class="menu-item" @click=${this.selectTap}>
            Random Game
          </button>
          <hr />
          <button id="byTileOrder" class="menu-item" @click=${this.selectTap}>
            ${this.check('byTileOrder')}Discard By Tile
          </button>
          <button
            id="byDiscardOrder"
            class="menu-item"
            @click=${this.selectTap}
          >
            ${this.check('byDiscardOrder')}Discard By Order
          </button>
          <button id="noDiscard" class="menu-item" @click=${this.selectTap}>
            ${this.check('noDiscard')}No Discard
          </button>
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
