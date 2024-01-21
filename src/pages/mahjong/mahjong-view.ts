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
      display: inline;
      border: none;
      padding: 0px;
    }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Number }) width!: number;

  @property({ type: Number }) height!: number;

  @property({ type: Number }) padding!: number;

  @property({ type: Array }) playTiles!: Tile[];

  @property({ type: Array }) discardTiles!: Tile[];

  // fit the tableaux into a portrait shaped
  // window, ie stack the components vertically
  resolvePortrait(): any {
    const w = this.width;
    const h = this.height;
    const menuScale = (Constant.faceWidth * w) / Constant.portraitDiscardWidth;
    const menuHeight = menuScale;
    const discardScale = w / Constant.portraitDiscardWidth;
    const discardHeight = discardScale * Constant.portraitDiscardHeight;
    const playScale = w / Constant.playWidth;
    const playHeight = playScale * Constant.playHeight;
    const totalHeight = menuHeight + discardHeight + playHeight;
    // does the tableau adapted to the width fit within the height?
    if (totalHeight <= h) {
      const surplusHeight = h - totalHeight;
      const verticalMargin = surplusHeight / 4;
      const menuX = 0;
      const menuY = verticalMargin;
      const discardX = 0;
      const discardY = menuY + menuHeight + verticalMargin;
      const playX = 0;
      const playY = discardY + discardHeight + verticalMargin;
      return {
        orientation: 'portrait',
        horizontalMargin: 0,
        verticalMargin,
        menu: {
          scale: menuScale,
          width: w,
          height: menuHeight,
          x: menuX,
          y: menuY,
        },
        discard: {
          scale: discardScale,
          width: w,
          height: discardHeight,
          x: discardX,
          y: discardY,
        },
        play: {
          scale: playScale,
          width: w,
          height: playHeight,
          x: playX,
          y: playY,
        },
      };
    }
    // the tableaux adapted to the width exceeds the height
    const scaleFactor = h / totalHeight;
    const horizontalMargin = (w - scaleFactor * w) / 2;
    const menuX = horizontalMargin;
    const menuY = 0;
    const discardX = horizontalMargin;
    const discardY = menuY + scaleFactor * menuHeight;
    const playX = horizontalMargin;
    const playY = discardY + scaleFactor * discardHeight;
    return {
      orientation: 'portrait',
      horizontalMargin,
      verticalMargin: 0,
      menu: {
        scale: scaleFactor * menuScale,
        width: scaleFactor * w,
        height: scaleFactor * menuHeight,
        x: menuX,
        y: menuY,
      },
      discard: {
        scale: scaleFactor * discardScale,
        width: scaleFactor * w,
        height: scaleFactor * discardHeight,
        x: discardX,
        y: discardY,
      },
      play: {
        scale: scaleFactor * playScale,
        width: scaleFactor * w,
        height: scaleFactor * playHeight,
        x: playX,
        y: playY,
      },
    };
  }

  // fit the tableaux into a landscape shaped
  // window, ie stack the components horizontally
  //
  // this can be done by solving for portrait with
  // width and height reversed and then reversing all
  // the results
  //
  resolveLandscape(): any {
    const w = this.width;
    const h = this.height;
    const menuScale =
      (Constant.faceWidth * h) / Constant.landscapeDiscardHeight;
    const menuWidth = menuScale;
    const discardScale = h / Constant.landscapeDiscardHeight;
    const discardWidth = discardScale * Constant.landscapeDiscardWidth;
    const playScale = h / Constant.playHeight;
    const playWidth = playScale * Constant.playWidth;
    const totalWidth = menuWidth + discardWidth + playWidth;
    // does the tableau adapted to the height fit within the width
    if (totalWidth <= w) {
      const surplusWidth = w - totalWidth;
      const horizontalMargin = surplusWidth / 4;
      const menuX = horizontalMargin;
      const menuY = 0;
      const discardX = menuX + menuWidth + horizontalMargin;
      const discardY = 0;
      const playX = discardX + discardWidth + horizontalMargin;
      const playY = 0;
      return {
        orientation: 'landscape',
        horizontalMargin,
        verticalMargin: 0,
        menu: {
          scale: menuScale,
          height: h,
          width: menuWidth,
          x: menuX,
          y: menuY,
        },
        discard: {
          scale: discardScale,
          height: h,
          width: discardWidth,
          x: discardX,
          y: discardY,
        },
        play: {
          scale: playScale,
          height: h,
          width: playWidth,
          x: playX,
          y: playY,
        },
      };
    }
    const scaleFactor = w / totalWidth;
    const verticalMargin = (h - scaleFactor * h) / 2;
    const menuX = 0;
    const menuY = verticalMargin;
    const discardX = menuX + scaleFactor * menuWidth;
    const discardY = verticalMargin;
    const playX = discardX + scaleFactor * discardWidth;
    const playY = verticalMargin;
    return {
      orientation: 'landscape',
      horizontalMargin: 0,
      verticalMargin,
      menu: {
        scale: scaleFactor * menuScale,
        width: scaleFactor * menuWidth,
        height: scaleFactor * h,
        x: menuX,
        y: menuY,
      },
      discard: {
        scale: scaleFactor * discardScale,
        height: scaleFactor * h,
        width: scaleFactor * discardWidth,
        x: discardX,
        y: discardY,
      },
      play: {
        scale: scaleFactor * playScale,
        height: scaleFactor * h,
        width: scaleFactor * playWidth,
        x: playX,
        y: playY,
      },
    };
  }

  resolveSizePositionAndScale() {
    // console.log(`view resolve ${this.width}x${this.height}`);
    if (this.width <= this.height) {
      this.play.remodelDiscardSlots(Constant.portraitDiscardRows);
      return this.resolvePortrait();
    }
    this.play.remodelDiscardSlots(Constant.landscapeDiscardRows);
    return this.resolveLandscape();
  }

  override render() {
    const obj = this.resolveSizePositionAndScale();
    const style = css`
      mahjong-menu-view {
        position: absolute;
        top: ${obj.menu.y}px;
        left: ${obj.menu.x}px;
        width: ${obj.menu.width}px;
        height: ${obj.menu.height}px;
      }
      mahjong-discard-view {
        position: absolute;
        top: ${obj.discard.y}px;
        left: ${obj.discard.x}px;
        width: ${obj.discard.width}px;
        height: ${obj.discard.height}px;
      }
      mahjong-play-view {
        position: absolute;
        top: ${obj.play.y}px;
        left: ${obj.play.x}px;
        width: ${obj.play.width}px;
        height: ${obj.play.height}px;
      }
    `;
    // console.log(`view render ${this.play.playTiles.length} playTiles`);
    // console.log(`view render ${this.play.discardTiles.length} discardTiles`);
    return html`
      <style>
        ${style}
      </style>
      <mahjong-menu-view
        .play=${this.play}
        .scale=${obj.menu.scale}
        .discardarrange=${this.play.discardArrange}
      ></mahjong-menu-view>
      <mahjong-discard-view
        .play=${this.play}
        .tiles=${this.discardTiles}
        .scale=${obj.discard.scale}
      ></mahjong-discard-view>
      <mahjong-play-view
        .play=${this.play}
        .tiles=${this.playTiles}
        .scale=${obj.play.scale}
      ></mahjong-play-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mahjong-view': MahjongView;
  }
}
