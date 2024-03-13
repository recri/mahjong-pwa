/**
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Tile } from './mahjong-tile.js';
import { Play } from './mahjong-play.js';
import './mahjong-view.js';

/* eslint-disable no-bitwise */
const hashCode = (s: string): number =>
  s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
/* eslint-disable no-bitwise */

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
    // possibilities:
    // 1) https://host.domain/
    // 2) https://host.domain/#hash
    // 3) saved game in progress
    if (window.location.hash) {
      const hash = parseInt(window.location.hash.substr(1), 10);
      if (Number.isNaN(hash)) {
        // console.log(`integer hash ${hash}`);
        this.play = new Play(hash);
      } else {
        const hash2 = hashCode(window.location.hash.substr(1));
        // console.log(`hashed hash ${hash2}`);
        this.play = new Play(hash2);
      }
    } else {
      // console.log(`no hash`);
      this.play = new Play(0);
    }
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

  //
  //
  //
  override render() {
    const style = css`
      mahjong-view {
        width: ${this.width - 2 * MahjongApp.padding}px;
        height: ${this.height - 2 * MahjongApp.padding}px;
      }
    `;
    // console.log('app render');
    return html`
      <style>
        ${style}
      </style>

      <mahjong-view
        .play=${this.play}
        .gameNumber=${this.play.gameNumber}
        .discardArrange=${this.discardArrange}
        .gameIsDeadlocked=${this.gameIsDeadlocked}
        .gameIsCompleted=${this.gameIsCompleted}
        .playTiles=${this.playTiles}
        .discardTiles=${this.discardTiles}
        .selectedTile=${this.selectedTile}
        .width=${this.width}
        .height=${this.height}
      ></mahjong-view>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'mahjong-app': MahjongApp;
  }
}
