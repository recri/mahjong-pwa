/**
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'; //
import { Constant } from './constant.js';
import { Tile } from './mahjong-tile.js';
import { Play } from './mahjong-play.js';
import './mahjong-menu-view.js';
import './mahjong-discard-view.js';
import './mahjong-play-view.js';

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
      /*      justify-content: space-evenly; */
      /*      align-items: stretch; */
      /*      gap: 0px; */
    }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Number }) width!: number;

  @property({ type: Number }) height!: number;

  @property({ type: Array }) playTiles!: Tile[];

  @property({ type: Array }) discardTiles!: Tile[];

  resolveOrientation() {
    if (this.width <= this.height) {
      // portrait orientation
      this.play.remodelDiscardSlots(Constant.portraitDiscardRows);
      // main size in pixels
      const mainSize =
        Constant.faceWidth +
        Constant.portraitDiscardHeight +
        Constant.playHeight;
      // menu, discard, and play size in per cent
      const menuSize = (100 * Constant.faceWidth) / mainSize;
      const discardSize = (100 * Constant.portraitDiscardHeight) / mainSize;
      const playSize = (100 * Constant.playHeight) / mainSize;
      return css`
        :host {
          flex-direction: column;
        }
        mahjong-menu-view {
          flex: 1 1 ${menuSize}%;
        }
        mahjong-discard-view {
          flex: 1 1 ${discardSize}%;
        }
        mahjong-play-view {
          flex: 1 1 ${playSize}%;
        }
      `;
    }
    this.play.remodelDiscardSlots(Constant.landscapeDiscardRows);
    // main size in pixels
    const mainSize =
      Constant.faceWidth + Constant.landscapeDiscardWidth + Constant.playWidth;
    // menu, discard, and play size in per cent
    const menuSize = (100 * Constant.faceWidth) / mainSize;
    const discardSize = (100 * Constant.landscapeDiscardWidth) / mainSize;
    const playSize = (100 * Constant.playWidth) / mainSize;
    return css`
      :host {
        flex-direction: row;
      }
      mahjong-menu-view {
        flex: ${menuSize};
      }
      mahjong-discard-view {
        flex: ${discardSize};
      }
      mahjong-play-view {
        flex: ${playSize};
      }
    `;
  }

  override render() {
    // console.log(`view render ${this.play.playTiles.length} playTiles`);
    // console.log(`view render ${this.play.discardTiles.length} discardTiles`);
    // console.log(`view render ${this.width}x${this.height}`);
    // console.log(`view render ${this.offsetLeft} ${this.offsetTop} ${this.offsetWidth} ${this.offsetHeight}`);
    return html`
      <style>
        ${this.resolveOrientation()}
      </style>
      <mahjong-menu-view
        .play=${this.play}
        .discardarrange=${this.play.discardArrange}
      ></mahjong-menu-view>
      <mahjong-discard-view
        .play=${this.play}
        .tiles=${this.discardTiles}
      ></mahjong-discard-view>
      <mahjong-play-view
        .play=${this.play}
        .tiles=${this.playTiles}
      ></mahjong-play-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mahjong-view': MahjongView;
  }
}
