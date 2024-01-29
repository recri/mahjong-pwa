/**
 */

import { LitElement, html, css } from 'lit';
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

  @property({ type: Number }) width: number;

  @property({ type: Number }) height: number;

  constructor() {
    super();
    this.play = new Play();
    this.playTiles = this.play.playTiles;
    this.discardTiles = this.play.discardTiles;
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

  // dialogs
  get youlose(): any {
    return this.shadowRoot!.getElementById('youlose');
  }

  get youwin(): any {
    return this.shadowRoot!.getElementById('youwin');
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["dialogShowModal"] }] */
  dialogShowModal(dialog: any) {
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  }

  dialogClose(dialog: any, msg: string) {
    if (dialog instanceof HTMLDialogElement) {
      dialog.close();
    }
    this.play.dialog(msg);
  }

  youlose_undo() {
    this.dialogClose(this.youlose, 'undo');
  }

  youlose_new() {
    this.dialogClose(this.youlose, 'new');
  }

  youlose_restart() {
    this.dialogClose(this.youlose, 'restart');
  }

  youwin_undo() {
    this.dialogClose(this.youwin, 'undo');
  }

  youwin_new() {
    this.dialogClose(this.youwin, 'new');
  }

  youwin_restart() {
    this.dialogClose(this.youwin, 'restart');
  }

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
    if (this.play.gameIsCompleted) {
      this.dialogShowModal(this.youwin);
    }
    if (this.play.gameIsDeadlocked) {
      this.dialogShowModal(this.youlose);
    }
    return html`
      <style>
        ${style}
      </style>

      <mahjong-view
        .play=${this.play}
        .playTiles=${this.playTiles}
        .discardTiles=${this.discardTiles}
        .selectedTile=${this.selectedTile}
        .width=${this.width}
        .height=${this.height}
      ></mahjong-view>

      <dialog id="youlose" modal>
        <h2>There are no more moves.</h2>
        <div class="buttons">
          <button raised dialog-confirm @click=${() => this.youlose_undo()}>
            Undo
          </button>
          <button raised dialog-confirm @click=${() => this.youlose_restart()}>
            Restart
          </button>
          <button raised dialog-confirm @click=${() => this.youlose_new()}>
            New Game
          </button>
        </div>
      </dialog>

      <dialog id="youwin" modal>
        <h2>You have won the game</h2>
        <div class="buttons">
          <button raised dialog-confirm @click=${() => this.youwin_undo()}>
            Undo
          </button>
          <button raised dialog-confirm @click=${() => this.youwin_restart()}>
            Restart
          </button>
          <button raised dialog-confirm @click=${() => this.youwin_new()}>
            New Game
          </button>
        </div>
      </dialog>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'mahjong-app': MahjongApp;
  }
}
