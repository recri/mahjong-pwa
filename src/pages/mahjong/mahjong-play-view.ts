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

  @property({ type: Number }) paddingLeft!: number;

  @property({ type: Number }) paddingTop!: number;

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
        left: ${this.offsetLeft +
        this.paddingLeft +
        tile.playSlot.x * this.scale}px;
        top: ${this.offsetTop +
        this.paddingTop +
        tile.playSlot.y * this.scale}px;
      }
    `;
  }

  override render() {
    const style = css`
      mahjong-tile-view {
        position: absolute;
        width: ${Constant.tileWidth * this.scale}px;
        height: ${Constant.tileHeight * this.scale}px;
      }
    `;
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
