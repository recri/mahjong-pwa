/**
 */

import { LitElement, html, css, unsafeCSS } from 'lit';
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
      margin: none;
    }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Number }) width!: number;

  @property({ type: Number }) height!: number;

  @property({ type: Array }) playTiles!: Tile[];

  @property({ type: Array }) discardTiles!: Tile[];

  resolveOrientation() {
    // console.log(`portrait disc ${Constant.portraitDiscardAspect} play ${Constant.playAspect}`);
    // console.log(`landscape disc ${Constant.landscapeDiscardAspect} play ${Constant.playAspect}`);
    const width = this.offsetWidth - 2 * this.offsetLeft;
    const height = this.offsetHeight - 2 * this.offsetTop;
    const obj = { gap: 10 };
    if (width <= height) {
      this.play.remodelDiscardSlots(Constant.portraitDiscardRows);
      // portrait
      obj.orientation = 'portrait';
      obj.direction = 'column';
      // main aspect inverted to height/width
      // the discard and play tableau will be drawn at the same width
      const mainAspect =
        1 / Constant.portraitDiscardAspect +
        1 / Constant.playAspect;
      // menu, discard, and play size in per cent
      obj.menuPct = 5;
      obj.discardPct = Math.floor((95 / Constant.portraitDiscardAspect) / mainAspect);
      obj.playPct = Math.floor((95 / Constant.playAspect) / mainAspect);
      // compute the height specified by the per cent
      obj.contentHeight = height - 2 * obj.gap;
      obj.discardHeight = obj.contentHeight * obj.discardPct / 100;
      obj.playHeight = obj.contentHeight * obj.playPct / 100;
      // compute the scales
      obj.discardScale = Math.min(width/Constant.portraitDiscardWidth,
			      obj.discardHeight/Constant.portraitDiscardHeight);
      obj.playScale = Math.min(width/Constant.playWidth,
			       obj.playHeight / Constant.playHeight);
      // now adjust the width with padding so it fits in the height
      obj.paddingLeft = Math.max(0, (width - obj.playScale * Constant.playWidth) / 2);
      obj.paddingTop = 0;
    } else {
      this.play.remodelDiscardSlots(Constant.landscapeDiscardRows);
      // landscape orientation      
      obj.orientation = 'landscape';
      obj.direction = 'row'
      // main aspect, tableaux drawn at same height
      const mainAspect =
	Constant.landscapeDiscardAspect + Constant.playAspect;
      // menu, discard, and play size in per cent
      obj.menuPct = 5;
      obj.discardPct = Math.floor((95 * Constant.landscapeDiscardAspect) / mainAspect);
      obj.playPct = Math.floor((95 * Constant.playAspect) / mainAspect);
      // compute the width specified by the per cent
      obj.contentWidth = width - 2 * obj.gap;
      obj.discardWidth = obj.contentWidth * obj.discardPct / 100;
      obj.playWidth = obj.contentWidth * obj.playPct / 100;
      // compute the scales
      obj.discardScale = Math.min(height/Constant.landscapeDiscardHeight,
			      obj.discardWidth/Constant.landscapeDiscardWidth);
      obj.playScale = Math.min(height/Constant.playHeight,
			       obj.playWidth / Constant.playWidth);
      // now adjust the height with padding so it fits in the width
      obj.paddingTop = Math.max(0, (height - obj.playScale * Constant.playHeight) / 2);
      obj.paddingLeft = 0;
    }
    obj.style =  css`
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

  override render() {
    // console.log(`view render ${this.play.playTiles.length} playTiles`);
    // console.log(`view render ${this.play.discardTiles.length} discardTiles`);
    // console.log(`view render ${this.width}x${this.height}`);
    console.log(`view render ${this.offsetLeft} ${this.offsetTop} ${this.offsetWidth} ${this.offsetHeight}`);
    const obj = this.resolveOrientation();
    return html`
      <style>
        ${obj.style}
      </style>
      <mahjong-menu-view
        .play=${this.play}
        .discardarrange=${this.play.discardArrange}
        .paddingLeft=${obj.paddingLeft}
        .paddingTop=${obj.paddingTop}
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
        .scale=${obj.playScale}
        .paddingLeft=${obj.paddingLeft}
        .paddingTop=${obj.paddingTop}
      ></mahjong-play-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mahjong-view': MahjongView;
  }
}
