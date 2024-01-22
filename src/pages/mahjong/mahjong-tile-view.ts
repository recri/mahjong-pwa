/**
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Play } from './mahjong-play.js';
import { getTileImage } from './mahjong-tile-images.js';
import { Tile } from './mahjong-tile.js';

/**
 * The mahjong tile displayed in the play or discard tableaux
 */
@customElement('mahjong-tile-view')
export class MahjongTileView extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: none;
      padding: none;
      margin: none;
      background-color: transparent;
    }
    :focus { outline-width: 2px; }
  `;

  @property({ type: Object }) play!: Play;

  @property({ type: Object }) tile!: Tile;

  @property({ type: Boolean }) selected: boolean = false;

  @property({ type: Boolean }) disabled: boolean = false;

  tileTap() {
    this.play.tileTap(this.tile);
  }

  tileKeyPress(evt: KeyboardEvent) {
    this.play.tileKeyPress(evt, this.tile);
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["tileFocus"] }] */
  tileFocus(evt: FocusEvent) {
    if (evt.target instanceof HTMLButtonElement && evt.target.tabIndex < 0) {
      evt.target.blur();
    }
  }

  override render() {
    const style = css`
      .bg {
        opacity: ${this.selected ? 0 : 1};
      }
      .mg {
        opacity: ${this.selected ? 1 : 0};
      }
    `;
    /* FIX.ME - div needs keyboard action keys, space newline */
    return html` <style>
        ${style}
      </style>
      <div
        role="button"
        class="tile"
        aria-label="${this.tile.title}"
        tabindex="${this.disabled ? -1 : 0}"
        ${this.disabled ? 'disabled' : ''}
        @click=${this.tileTap}
        @keypress=${this.tileKeyPress}
        @focus=${this.tileFocus}
      >
        <svg aria-hidden="true" viewBox="0 0 64 88">
          <g class="bg img">${getTileImage('plainTile')}</g>
          <g class="mg img">${getTileImage('selectedTile')}</g>
          <g class="fg img">${getTileImage(this.tile.name)}</g>
        </svg>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mahjong-tile-view': MahjongTileView;
  }
}
