/**
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Constant } from './constant.js';
import { Tile } from './mahjong-tile.js';
import { Play } from './mahjong-play.js';

import './mahjong-tile-view.js';

/**
 * The tableau in which discarded tiles are displayed
 * and can be selected to backtrack
 */
@customElement('mahjong-discard-view')
export class MahjongDiscardView extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Array }) tiles!: Tile[];

  @property({ type: Number }) scale!: number;

  renderTileView(tile: Tile) {
    if (tile === undefined || tile.discardSlot === undefined) {
      return html``;
    }

    return html`<mahjong-tile-view
      id="t${tile.tileId}"
      .play=${this.play}
      .tile=${tile}
      .disabled="${!tile.canUndiscard}"
      .selected=${tile.isSelected}
    ></mahjong-tile-view>`;
  }

  styleTileView(tile: Tile) {
    if (tile === undefined || tile.discardSlot === undefined) {
      return html``;
    }
    return css`
      #t${tile.tileId} {
        left: ${tile.discardSlot.x * this.scale}px;
        top: ${tile.discardSlot.y * this.scale}px;
        width: ${Constant.tileWidth * this.scale}px;
        height: ${Constant.tileHeight * this.scale}px;
      }
    `;
  }

  override render() {
    const style = css`
      mahjong-tile-view {
        width: ${Constant.tileWidth * this.scale}px;
        height: ${Constant.tileHeight * this.scale}px;
        position: absolute;
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
    'mahjong-discard-view': MahjongDiscardView;
  }
}
