/**
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Constant } from './constant.js';
import { Tile } from './mahjong-tile.js';
import { Play } from './mahjong-play.js';

import './mahjong-tile-view.js';

/**
 * The tableau in which tiles in play are displayed
 * and can be selected to play the game
 */
@customElement('mahjong-play-view')
export class MahjongPlayView extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Array }) tiles!: Tile[];

  @property({ type: Number }) scale!: number = 1;

  renderTileView(tile: Tile) {
    if (tile === undefined || tile.playSlot === undefined) {
      return html``;
    }

    return html`<mahjong-tile-view
      id="t${tile.tileId}"
      .play=${this.play}
      .tile=${tile}
      .disabled="${!tile.canPlay}"
      .selected=${tile.isSelected}
    ></mahjong-tile-view>`;
  }

  styleTileView(tile: Tile) {
    if (tile === undefined || tile.playSlot === undefined) {
      return css``;
    }

    return css`
      #t${tile.tileId} {
        left: ${this.offsetLeft + tile.playSlot.x * this.scale}px;
        top: ${this.offsetTop + tile.playSlot.y * this.scale}px;
        width: ${Constant.tileWidth * this.scale}px;
        height: ${Constant.tileHeight * this.scale}px;
        /*
padding-top: 0px;
padding-right: 0px
padding-bottom: ${-Constant.bottomMargin * this.scale}px;
padding-left: ${-Constant.leftMargin * this.scale}px;
// didn't work with margin either.
*/
      }
    `;
  }

  override render() {
    this.scale = Math.min(
      this.offsetWidth / Constant.playWidth,
      this.offsetHeight / Constant.playHeight
    );
    const style = css`
      mahjong-tile-view {
        width: ${Constant.tileWidth * this.scale}px;
        height: ${Constant.tileHeight * this.scale}px;
        position: absolute;
      }
    `;
    // console.log(`play render width ${this.width} height ${this.height}`);
    // console.log(`play render minWidth ${this.minWidth} minHeight ${this.minHeight}`);
    // console.log(`play render maxWidth ${this.maxWidth} maxHeight ${this.maxHeight}`);
    // console.log(`play render ${this.offsetLeft} ${this.offsetTop} ${this.offsetWidth} ${this.offsetHeight}`);
    return html`
      <style>
        ${style}
        ${this.tiles.map(tile => this.styleTileView(tile))}
      </style>
      ${this.tiles.map(tile => this.renderTileView(tile))}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mahjong-play-view': MahjongPlayView;
  }
}
