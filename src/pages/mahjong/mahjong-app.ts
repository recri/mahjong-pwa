/**
 */

import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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
