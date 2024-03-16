/**
 */

import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Tile } from './mahjong-tile.js';
import { Play } from './mahjong-play.js';
import { Constant } from './constant.js';

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
  static override styles = css`
    :host {
      display: block;
      border: none;
      /* ${Constant.mahjongAppPadding} */
      padding: 0px;
    }
    .largest-contentful-paint {
      color: ${unsafeCSS(Constant.background)};
      position: relative;
      top: -100px;
      z-index: -1;
    }
  `;

  static hasProp = (name: string): boolean =>
    window.localStorage.getItem(name) !== null;

  static getProp = (name: string): string =>
    MahjongApp.hasProp(name) ? window.localStorage.getItem(name)! : '';

  static putProp = (name: string, value: string) =>
    window.localStorage.setItem(name, value);

  static getIntProp = (name: string): number =>
    MahjongApp.hasProp(name)
      ? parseInt(window.localStorage.getItem(name)!, 10)
      : 0;

  static putIntProp = (name: string, value: number) =>
    window.localStorage.setItem(name, `${value}`);

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

    let gameNumber = MahjongApp.hasProp('gameNumber')
      ? MahjongApp.getIntProp('gameNumber')
      : 0;

    if (window.location.hash) {
      const content = window.location.hash.substr(1);
      const hash = parseInt(content, 10);
      gameNumber = !Number.isNaN(hash) ? hash : hashCode(content);
    }

    this.play = new Play(gameNumber);
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

  override render() {
    const style = css`
      mahjong-view {
        width: ${this.width - 2 * Constant.mahjongAppPadding}px;
        height: ${this.height - 2 * Constant.mahjongAppPadding}px;
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
      <span class="largest-contentful-paint">Largest Contentful Paint</span>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'mahjong-app': MahjongApp;
  }
}
