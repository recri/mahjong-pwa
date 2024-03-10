
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

  @property({ type: Number }) scale: number;
    
  @property({ type: Number }) paddingLeft!: number;

  @property({ type: Number }) paddingTop!: number;

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["menuTap"] }] */
  menuTap() {
    this.shadowRoot!.getElementById('myDropdown')!.classList.toggle('show');
  }

  menuUntap() {
    this.shadowRoot!.getElementById('myDropdown')!.classList.toggle('show');
  }

  selectTap(e: MouseEvent) {
      if (e !== null && e.target !== null && e.target instanceof Element) {
	  let { target } = e;
	  while ( ! target.id) {
	      // console.log(`selectTap ${target.tagName} has no id`);
	      target = target.parentElement;
	  }
	  // console.log(`selectTap ${target.tagName} has id ${target.id}`);
	  this.play.selectTap(target.id);
      }
      this.menuUntap()
  }

  override render() {
    const edge = Constant.tileWidth * this.scale;
    const padding = Constant.tileWidth * 0.2 * this.scale;
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
	stroke: white;
	stroke-width: 3;
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
	min-width: ${edge}px;
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
    // console.log(`menu view render ${this.discardArrange}`);
    return html`
      <style>
        ${style}
      </style>
      <div class="dropdown">
        <button @click=${this.menuTap} class="dropbtn svgbutton" title="menu">
          <svg 
            viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
            width=${edge}
            height=${edge}
          >
            ${getIconImage('hamburgerMenu')}
          </svg>
        </button>
        <div id="myDropdown" class="dropdown-content">
          <button class="menu-item" @click=${this.selectTap}
	    alt="Restart Game">
            <svg id="restartGame"
              viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
              width=${edge} height=${edge}
            >
              ${getIconImage('restartGame')}
            </svg>
          </button><br />
          <button class="menu-item" @click=${this.selectTap}
	    alt="Next Game">
            <svg id="nextGame"
              viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
              width=${edge} height=${edge}
            >
              ${getIconImage('nextGame')}
            </svg>
          </button><br />
          <button class="menu-item" @click=${this.selectTap}
            alt="Previous Game">
            <svg id="previousGame"
              viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
              width=${edge} height=${edge}
            >
              ${getIconImage('previousGame')}
            </svg>
          </button><br />
          <button class="menu-item" @click=${this.selectTap}
            alt="Random Game">
            <svg id="randomGame"
              viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
              width=${edge} height=${edge}
            >
              ${getIconImage('randomGame')}
            </svg>
          </button><br />
          <br />
          <button class="menu-item" @click=${this.selectTap}
	    alt="Discard Arrangement">
            <svg id="discardArrange"
              viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
              width=${edge} height=${edge}
            >
	      ${getIconImage(this.discardArrange ? 'uncheckedBox' : 'checkedBox')}
            </svg>
          </button><br />
          <br />
          <button class="menu-item" @click=${this.selectTap}
            alt="Trigger You Win">
            <svg id="youWin"
              viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
              width=${edge} height=${edge}
            >
              ${getIconImage('youWin')}
            </svg>
          </button><br />
          <button class="menu-item" @click=${this.selectTap}
            alt="Trigger You Lose">
            <svg id="youLose"
              viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}"
              width=${edge} height=${edge}
            >
              ${getIconImage('youLose')}
            </svg>
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
