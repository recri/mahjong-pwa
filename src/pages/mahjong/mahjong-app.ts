/**
 */

import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Constant } from './constant.js';
import { getIconImage } from './mahjong-icon-images.js';
import { Tile } from './mahjong-tile.js';
import { Play } from './mahjong-play.js';
import './mahjong-view.js';

/**
 * the application shell for mahjong
 * hosts the three view web components of the game
 * and the class which adapts the game model itself
 */
@customElement('mahjong-app')
export class MahjongApp extends LitElement {
  static padding = 10;

  static override styles = css`
    :host {
      display: block;
      border: none;
      padding: ${MahjongApp.padding}px;
    }
  `;

  @property({ type: Object }) play: Play;

  @property({ type: Array }) playTiles!: Tile[];

  @property({ type: Array }) discardTiles!: Tile[];

  @property({ type: Object }) selectedTile!: Tile | undefined;

  @property({ type: Boolean }) discardArrange: boolean;
    
  @property({ type: Boolean }) gameIsCompleted: boolean;
    
  @property({ type: Boolean }) gameIsDeadlocked: boolean;
    
  @property({ type: Number }) width: number;

  @property({ type: Number }) height: number;

  constructor() {
    super();
    this.play = new Play();
    this.playTiles = this.play.playTiles;
    this.discardTiles = this.play.discardTiles;
    this.discardArrange = false;
    this.gameIsCompleted = false;
    this.gameIsDeadlocked = false;
    this.width = 200;
    this.height = 200;
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  resizeHandler = () => this.handleResize();

  /* eslint-disable wc/guard-super-call */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.resizeHandler);
    this.handleResize();
    this.play.connectedCallback(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeHandler);
    this.play.disconnectedCallback();
  }
  /* eslint-enable wc/guard-super-call */

  // dialogs
  get youlose(): any {
    return this.shadowRoot!.getElementById('youlose');
  }

  get youwin(): any {
    return this.shadowRoot!.getElementById('youwin');
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["dialogShowModal"] }] */
  dialogShowModal(dialog: any) {
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  }

  dialogClose(dialog: any, e: MouseEvent) {
    if (dialog instanceof HTMLDialogElement) {
      dialog.close();
    }
    if (e !== null && e.target !== null && e.target instanceof Element) {
	let { target } = e;
	while ( ! target.id) target = target.parentElement;
	this.play.dialog(target.id) ;
    }
  }

  youloseTap(e: MouseEvent) {
      this.dialogClose(this.youlose, e);
  }

  youwinTap(e: MouseEvent) {
    this.dialogClose(this.youwin, e);
  }

  //
  //
  //
  override render() {
      const edge = 50;
    const style = css`
      mahjong-view {
        width: ${this.width - 2 * MahjongApp.padding}px;
        height: ${this.height - 2 * MahjongApp.padding}px;
      }
      dialog {
        position: relative;
        background-color: ${unsafeCSS(Constant.background)};
        color: white;
        padding: 5px;
        border-width: 2px;
        border-color: white;
        left: 32px;
        overflow: auto;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }
      dialog > div {
	max-width: fit-content;
	margin-left: auto;
	margin-right: auto;
      }
      dialog > div > svg {
        width: ${2*edge}px;
        height: ${2*edge}px;
	stroke: white;
	stroke-width: 4;
      }
      dialog > div > button {
        margin: 0px;
        border: none;
        padding: 0px;
        background-color: ${unsafeCSS(Constant.background)};
      }
      dialog > div > button > svg {
        width: ${edge}px;
        height: ${edge}px;
	stroke: white;
	stroke-width: 3;
	margin: none;
      }
    `;
    // console.log('app render');
    if (this.gameIsCompleted) {
      this.dialogShowModal(this.youwin);
    }
    if (this.gameIsDeadlocked) {
      this.dialogShowModal(this.youlose);
    }
    return html`
      <style>
        ${style}
      </style>

      <mahjong-view
        .play=${this.play}
	.gameNumber=${this.play.gameNumber}
	.discardArrange=${this.discardArrange}
	.playTiles=${this.playTiles}
        .discardTiles=${this.discardTiles}
        .selectedTile=${this.selectedTile}
        .width=${this.width}
        .height=${this.height}
      ></mahjong-view>

      <dialog id="youlose" modal>
	<div>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
	    ${getIconImage('youLose')}
	  </svg>
	</div>
        <div class="buttons">
          <button raised dialog-confirm id="previousGame" @click=${this.youloseTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('previousGame')}
          </svg>
	  </button>
          <button raised dialog-confirm id="undoLastMove" @click=${this.youloseTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('goBack')}
          </svg>
          </button>
          <button raised dialog-confirm id="randomGame" @click=${this.youloseTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('randomGame')}
          </svg>
          </button>
          <button raised dialog-confirm id="restartGame" @click=${this.youloseTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('restartGame')}
          </svg>
          </button>
          <button raised dialog-confirm id="nextGame" @click=${this.youloseTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('nextGame')}
          </svg>
          </button>
        </div>
      </dialog>

      <dialog id="youwin" modal>
	<div>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('youWin')}
          </svg>
	</div>
        <div class="buttons">
          <button raised dialog-confirm id="previousGame" @click=${this.youwinTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('previousGame')}
          </svg>
	  </button>
          <button raised dialog-confirm id="undoLastMove" @click=${this.youwinTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('goBack')}
          </svg>
          </button>
          <button raised dialog-confirm id="randomGame" @click=${this.youwinTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('randomGame')}
          </svg>
          </button>
          </button>
          <button raised dialog-confirm id="restartGame" @click=${this.youwinTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('restartGame')}
          </svg>
          </button>
          <button raised dialog-confirm id="nextGame" @click=${this.youwinTap}>
          <svg viewBox="0 0 ${Constant.iconWidth} ${Constant.iconHeight}">
            ${getIconImage('nextGame')}
          </svg>
          </button>
        </div>
      </dialog>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'mahjong-app': MahjongApp;
  }
}
