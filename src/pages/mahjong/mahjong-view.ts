/**
 */

import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js'; //
import { Constant } from './constant.js';
import { getIconImage } from './mahjong-icon-images.js';
import { Tile } from './mahjong-tile.js';
import { Play } from './mahjong-play.js';
import './mahjong-menu-view.js';
import './mahjong-discard-view.js';
import './mahjong-play-view.js';

/**
 * An object type used to communicate page shape
 */
interface CSSOptions {
  gap: number;
  orientation?: string;
  direction?: string;
  menuPct?: number;
  discardPct?: number;
  playPct?: number;
  contentHeight?: number;
  discardHeight?: number;
  playHeight?: number;
  contentWidth?: number;
  discardWidth?: number;
  playWidth?: number;
  discardScale?: number;
  playScale?: number;
  paddingLeft?: number;
  paddingTop?: number;
  style?: any;
}
/**
 * the top level view web component for mahjong
 * hosts the three view web components of the game
 * and the class which adapts the game model itself
 */
@customElement('mahjong-view')
export class MahjongView extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      border: none;
      padding: 0px;
      margin: none;
    }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Number }) gameNumber!: number;

  @property({ type: Number }) width!: number;

  @property({ type: Number }) height!: number;

  @property({ type: Array }) playTiles!: Tile[];

  @property({ type: Array }) discardTiles!: Tile[];

  @property({ type: Object }) selectedTile!: Tile | undefined;

  @property({ type: Boolean }) discardArrange!: boolean;
   
  @property({ type: Boolean }) gameIsCompleted!: boolean;
   
  @property({ type: Boolean }) gameIsDeadlocked!: boolean;

  resolveOrientation() {
    const width = this.offsetWidth - 2 * this.offsetLeft;
    const height = this.offsetHeight - 2 * this.offsetTop;
    const obj: CSSOptions = { gap: 10 };
    if (width <= height) {
      this.play.remodelDiscardSlots(Constant.portraitDiscardRows);
      // portrait
      obj.orientation = 'portrait';
      obj.direction = 'column';
      // main aspect inverted to height/width
      // the discard and play tableau will be drawn at the same width
      const mainAspect =
        1 / Constant.portraitDiscardAspect + 1 / Constant.playAspect;
      // menu, discard, and play size in per cent
      obj.menuPct = 5;
      obj.discardPct = Math.floor(
        95 / Constant.portraitDiscardAspect / mainAspect
      );
      obj.playPct = Math.floor(95 / Constant.playAspect / mainAspect);
      // compute the height specified by the per cent
      obj.contentHeight = height - 2 * obj.gap;
      obj.discardHeight = (obj.contentHeight * obj.discardPct) / 100;
      obj.playHeight = (obj.contentHeight * obj.playPct) / 100;
      // compute the scales
      obj.discardScale = Math.min(
        width / Constant.portraitDiscardWidth,
        obj.discardHeight / Constant.portraitDiscardHeight
      );
      obj.playScale = Math.min(
        width / Constant.playWidth,
        obj.playHeight / Constant.playHeight
      );
      // now adjust the width with padding so it fits in the height
      obj.paddingLeft = Math.max(
        0,
        (width - obj.playScale * Constant.playWidth) / 2
      );
      obj.paddingTop = 0;
    } else {
      this.play.remodelDiscardSlots(Constant.landscapeDiscardRows);
      // landscape orientation
      obj.orientation = 'landscape';
      obj.direction = 'row';
      // main aspect, tableaux drawn at same height
      const mainAspect = Constant.landscapeDiscardAspect + Constant.playAspect;
      // menu, discard, and play size in per cent
      obj.menuPct = 5;
      obj.discardPct = Math.floor(
        (95 * Constant.landscapeDiscardAspect) / mainAspect
      );
      obj.playPct = Math.floor((95 * Constant.playAspect) / mainAspect);
      // compute the width specified by the per cent
      obj.contentWidth = width - 2 * obj.gap;
      obj.discardWidth = (obj.contentWidth * obj.discardPct) / 100;
      obj.playWidth = (obj.contentWidth * obj.playPct) / 100;
      // compute the scales
      obj.discardScale = Math.min(
        height / Constant.landscapeDiscardHeight,
        obj.discardWidth / Constant.landscapeDiscardWidth
      );
      obj.playScale = Math.min(
        height / Constant.playHeight,
        obj.playWidth / Constant.playWidth
      );
      // now adjust the height with padding so it fits in the width
      obj.paddingTop = Math.max(
        0,
        (height - obj.playScale * Constant.playHeight) / 2
      );
      obj.paddingLeft = 0;
    }
    obj.style = css`
      :host {
        flex-direction: ${unsafeCSS(obj.direction)};
        gap: ${unsafeCSS(obj.gap)}px;
      }
      mahjong-menu-view {
        flex: ${unsafeCSS(obj.menuPct)}%;
      }
      mahjong-discard-view {
        flex: ${unsafeCSS(obj.discardPct)}%;
      }
      mahjong-play-view {
        flex: ${unsafeCSS(obj.playPct)}%;
      }
    `;
    return obj;
  }

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
	while (target && target instanceof Element && ! target.id && target.parentElement) {
	    // console.log(`selectTap ${target.tagName} has no id`);
	    target = target.parentElement;
	}
	// console.log(`selectTap ${target.tagName} has id ${target.id}`);
	if (target && target.id) {
	    this.play.dialogTap(target.id);
	}
    }
  }

  youloseTap(e: MouseEvent) {
      this.dialogClose(this.youlose, e);
  }

  youwinTap(e: MouseEvent) {
    this.dialogClose(this.youwin, e);
  }

  override render() {
    const obj = this.resolveOrientation();
    const edge = obj.playScale! * Constant.tileWidth;
    // console.log('view render');
    // console.log(`view render ${this.play.discardArrange}`);
    if (this.gameIsCompleted) {
      this.dialogShowModal(this.youwin);
    }
    if (this.gameIsDeadlocked) {
      this.dialogShowModal(this.youlose);
    }
    return html`
      <style>
        ${obj.style}
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
      </style>
      <mahjong-menu-view
        .play=${this.play}
	.discardArrange=${this.discardArrange}
        .paddingLeft=${obj.paddingLeft}
        .paddingTop=${obj.paddingTop}
	.scale=${obj.playScale}
      ></mahjong-menu-view>
      <mahjong-discard-view
        .play=${this.play}
        .tiles=${this.discardTiles}
        .scale=${obj.discardScale}
        .paddingLeft=${obj.paddingLeft}
        .paddingTop=${obj.paddingTop}
      ></mahjong-discard-view>
      <mahjong-play-view
        .play=${this.play}
        .tiles=${this.playTiles}
        .selectedTile=${this.selectedTile}
        .scale=${obj.playScale}
        .paddingLeft=${obj.paddingLeft}
        .paddingTop=${obj.paddingTop}
      ></mahjong-play-view>

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
    'mahjong-view': MahjongView;
  }
}
