/*
 *
 */

import { Tile } from './mahjong-tile.js';
import { Game } from './mahjong-game.js';
import { GameDeal } from './mahjong-game-deal.js';
import { MahjongApp } from './mahjong-app.js';

export class Play {
  game: Game;

  deal: GameDeal;

  gameIsCompleted: boolean;

  gameIsDeadlocked: boolean;

  gameNumber: number = 0;

  gameApp!: MahjongApp | undefined;

  get discardArrange(): string {
    return this.game.discardArrange;
  }

  get playTiles(): Tile[] {
    return this.game.playTiles;
  }

  get discardTiles(): Tile[] {
    return this.game.discardTiles;
  }

  get canPlayTiles(): Tile[] {
    return this.game.canPlayTiles;
  }

  constructor() {
    this.game = new Game();
    this.deal = new GameDeal();
    this.gameIsCompleted = false;
    this.gameIsDeadlocked = false;
    this.dealGame();
  }

  // messages from and to the display hierarchy
  connectedCallback(app: MahjongApp) {
    this.gameApp = app;
    this.updateTiles();
  }

  disconnectedCallback() {
    this.gameApp = undefined;
  }

  updateTiles() {
    if (this.gameApp !== undefined) {
      this.gameApp.playTiles = this.playTiles;
      this.gameApp.discardTiles = this.discardTiles;
    }
  }

  // delegations

  remodelDiscardSlots(rows: number) {
    this.game.remodelDiscardSlots(rows);
    this.updateTiles();
  }

  rearrangeDiscardSlots(id: string) {
    this.game.rearrangeDiscardSlots(id);
    this.updateTiles();
  }

  // deal a new game
  dealGame(offset: number = 0) {
    /* eslint-disable no-bitwise */
    this.gameNumber = (this.gameNumber + offset) & 0x7fffffff;
    /* eslint-enable no-bitwise */
    this.deal.dealGame(this.gameNumber);
    this.game.newGame(this.deal.tiles);
    this.updateTiles();
  }

  // intents
  // tap on a tile
  tileTap(tile: Tile) {
    if (tile.isInPlay) this.playTileTap(tile);
    else if (tile.isInDiscard) this.discardTileTap(tile);
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["tileKeyPress"] }] */
  // keypress on a tile
  tileKeyPress(evt: Event, tile: Tile) {
    console.log(`tileKeyPress(${evt}, ${tile})`);
  }

  //  tap on a tile in the play tableau
  playTileTap(tile: Tile) {
    if (tile !== undefined && tile.canPlay) {
      const selected = this.playTiles.filter(tile1 => tile1.isSelected);
      if (selected.length === 0) {
        tile.toggleSelected();
      } else {
        const selectedTile = selected[0];
        if (selectedTile === tile) {
          tile.toggleSelected();
        } else if (!tile.matches(selectedTile)) {
          selectedTile.toggleSelected();
          tile.toggleSelected();
        } else {
          // deselect selected tile
          selectedTile.toggleSelected();
          // move the tiles to the discard tableau
          this.game.tileDiscard(selectedTile);
          this.game.tileDiscard(tile);

          // decide if the game is over or stuck
          if (this.playTiles.length === 0) {
            // there are no tiles in the play tableau
            this.gameIsCompleted = true;
          } else {
            // see if there are any tile matches left to play
            this.gameIsDeadlocked = true;
            const { canPlayTiles } = this;
            for (const tile1 of canPlayTiles) {
              for (const tile2 of canPlayTiles) {
                if (
                  tile1 !== tile2 &&
                  tile1.tileId < tile2.tileId &&
                  tile1.matches(tile2)
                ) {
                  this.gameIsDeadlocked = false;
                  break;
                }
              }
              if (!this.gameIsDeadlocked) {
                break;
              }
            }
          }
        }
      }
      this.updateTiles();
    }
  }

  //  tap on a tile in the discard tableau
  discardTileTap(tile: Tile) {
    // clear any selection
    const selectedTile = this.game.tiles.find(t => t.isSelected);
    if (selectedTile !== undefined) {
      selectedTile.toggleSelected();
    }
    if (tile.canUndiscard) {
      // undiscard to the touched tile and the one under it
      this.game
        .tileUndiscardOrderList(tile.discardOrder - 1)
        .forEach(t => t.undiscard());
    }
    this.updateTiles();
  }

  random(): number {
    return Math.floor(this.deal.random() * 0x7fffffff);
  }

  // tap on a menu item
  selectTap(id: string) {
    switch (id) {
      case 'restartGame':
        this.dealGame(+0);
        break;
      case 'nextGame':
        this.dealGame(+1);
        break;
      case 'previousGame':
        this.dealGame(-1);
        break;
      case 'randomGame': {
        this.dealGame(+this.random());
        break;
      }
      case 'byTileOrder':
      case 'byDiscardOrder':
      case 'noDiscard':
        this.rearrangeDiscardSlots(id);
        break;
      case 'youWin':
        this.gameIsCompleted = true;
        this.updateTiles();
        break;
      case 'youLose':
        this.gameIsDeadlocked = true;
        this.updateTiles();
        break;
      default:
        console.log(`??selectTap(${id})??`);
    }
  }

  // result of an end of game dialog
  dialog(msg: string) {
    this.gameIsDeadlocked = false;
    this.gameIsCompleted = false;
    switch (msg) {
      case 'new':
        this.dealGame(+1);
        break;
      case 'restart':
        this.dealGame(+0);
        break;
      case 'undo':
        this.game
          .tileUndiscardOrderList(this.discardTiles.length - 2)
          .forEach(t => t.undiscard());
        this.updateTiles();
        break;
      default:
        console.log(`unknown message from dialog "${msg}"`);
        break;
    }
  }
}
