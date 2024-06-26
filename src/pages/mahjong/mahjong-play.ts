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

  selectedTile: Tile | undefined;

  get discardArrange(): boolean {
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

  constructor(gameNumber: number) {
    this.game = new Game();
    this.deal = new GameDeal();
    this.gameIsCompleted = false;
    this.gameIsDeadlocked = false;
    this.newGame(gameNumber);
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
    // not sure why the gameApp can't just have getters to update these properties
    if (this.gameApp !== undefined) {
      //      [
      //        'playTiles',
      //        'discardTiles',
      //        'selectedTile',
      //        'discardArrange',
      //        'gameIsCompleted',
      //        'gameIsDeadlocked',
      //      ].forEach(prop => {
      //        if (this.gameApp[prop] !== this[prop]) this.gameApp[prop] = this[prop];
      //      });
      if (this.gameApp.playTiles !== this.playTiles) {
        this.gameApp.playTiles = this.playTiles;
      }
      if (this.gameApp.discardTiles !== this.discardTiles) {
        this.gameApp.discardTiles = this.discardTiles;
      }
      if (this.gameApp.selectedTile !== this.selectedTile) {
        this.gameApp.selectedTile = this.selectedTile;
      }
      if (this.gameApp.discardArrange !== this.discardArrange) {
        this.gameApp.discardArrange = this.discardArrange;
      }
      if (this.gameApp.gameIsCompleted !== this.gameIsCompleted) {
        this.gameApp.gameIsCompleted = this.gameIsCompleted;
      }
      if (this.gameApp.gameIsDeadlocked !== this.gameIsDeadlocked) {
        this.gameApp.gameIsDeadlocked = this.gameIsDeadlocked;
      }
    }
  }

  // delegations

  remodelDiscardSlots(rows: number) {
    this.game.remodelDiscardSlots(rows);
    this.updateTiles();
  }

  // deal a new game
  newGame(gameNumber: number = 0) {
    /* eslint-disable no-bitwise */
    this.gameNumber = gameNumber & 0x7fffffff;
    /* eslint-enable no-bitwise */
    // window.location.hash = `#${this.gameNumber}`;
    this.deal.dealGame(this.gameNumber);
    this.game.newGame(this.deal.tiles);
    this.updateTiles();
    MahjongApp.putIntProp('gameNumber', this.gameNumber);
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

  // toggle the selected tile
  toggleSelected(tile: Tile) {
    if (tile.isSelected) {
      this.selectedTile = undefined;
    } else {
      this.selectedTile = tile;
    }
    tile.toggleSelected();
  }

  //  tap on a tile in the play tableau
  playTileTap(tile: Tile) {
    if (tile !== undefined && tile.canPlay) {
      if (this.selectedTile === undefined) {
        this.toggleSelected(tile);
      } else {
        const { selectedTile } = this;
        if (selectedTile === tile) {
          this.toggleSelected(tile);
        } else if (!tile.matches(selectedTile)) {
          this.toggleSelected(selectedTile);
          this.toggleSelected(tile);
        } else {
          // deselect selected tile
          this.toggleSelected(selectedTile);
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
    if (this.selectedTile !== undefined) {
      this.toggleSelected(this.selectedTile);
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
  // or tap on a completion dialog item
  selectTap(id: string) {
    switch (id) {
      case 'restartGame':
        this.newGame(this.gameNumber + 0);
        break;
      case 'nextGame':
        this.newGame(this.gameNumber + 1);
        break;
      case 'previousGame':
        this.newGame(this.gameNumber - 1);
        break;
      case 'randomGame':
        this.newGame(this.gameNumber + this.random());
        break;
      case 'discardArrange':
        this.game.rearrangeDiscardSlots();
        this.updateTiles();
        MahjongApp.putBoolProp('discardArrange', this.discardArrange);
        break;
      case 'shareGame': {
        const location = `${window.location.protocol}//${window.location.host}/#${this.gameNumber}`;
        // console.log(`shareGame ${location}`);
        navigator.clipboard.writeText(location);
        break;
      }
      case 'youWin':
        this.gameIsCompleted = true;
        this.updateTiles();
        break;
      case 'youLose':
        this.gameIsDeadlocked = true;
        this.updateTiles();
        break;
      case 'undoLastMove':
        this.game
          .tileUndiscardOrderList(this.discardTiles.length - 2)
          .forEach(t => t.undiscard());
        this.updateTiles();
        break;
      default:
        console.log(`??selectTap('${id}')??`);
    }
  }

  // result of an end of game dialog
  dialogTap(msg: string) {
    this.gameIsDeadlocked = false;
    this.gameIsCompleted = false;
    this.selectTap(msg);
  }
}
