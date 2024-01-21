/**
 */

import { Tile, makeTiles } from './mahjong-tile.js';
import { Slot, makePlaySlots, makeDiscardSlots } from './mahjong-slot.js';

/**
 */
export class Game {
  // the tiles in the game
  tiles: Tile[];

  // the play tableau
  playSlots: Slot[];

  // the discard tableau
  discardSlots: Slot[];

  // the rows in the current discard tableau
  discardRows: number;

  // how to arrange the discard slots on screen
  discardArrange: string;

  // how the discard slots may be arranged
  discardArrangeOptions = ['byTileOrder', 'byDiscardOrder', 'noDiscard'];

  constructor() {
    this.discardRows = 3;
    this.discardArrange = 'byTileOrder';
    this.tiles = makeTiles();
    this.playSlots = makePlaySlots();
    this.discardSlots = makeDiscardSlots(this.discardRows);
    this.emptyAllSlots();
  }

  _updateTiles() {
    Tile.updated = false;
    this._playTiles = this.playSlots
      .filter(s => s.tile !== undefined && s.tile.isInPlay)
      .map(s => s.tile!);
    this._canPlayTiles = this.playTiles.filter(t => t.canPlay);
    this._discardTiles = this.discardSlots
      .filter(s => s.tile !== undefined)
      .map(s => s.tile!);
    this._canUndiscardTiles = this.discardTiles.filter(t => t.canUndiscard);
  }

  // tiles for occupied play slots sorted in slot order
  private _playTiles!: Tile[];

  get playTiles(): Tile[] {
    if (Tile.updated) {
      this._updateTiles();
    }
    return this._playTiles;
  }

  // tiles for playable play slots sorted in slot order
  private _canPlayTiles!: Tile[];

  get canPlayTiles(): Tile[] {
    if (Tile.updated) {
      this._updateTiles();
    }
    return this._canPlayTiles;
  }

  // tiles for occupied discard slots sorted in slot order
  private _discardTiles!: Tile[];

  get discardTiles(): Tile[] {
    if (Tile.updated) {
      this._updateTiles();
    }
    return this._discardTiles;
  }

  // tiles for undiscardable discard slots sorted in slot order
  private _canUndiscardTiles!: Tile[];

  get canUndiscardTiles(): Tile[] {
    if (Tile.updated) {
      this._updateTiles();
    }
    return this._canUndiscardTiles;
  }

  remodelDiscardSlots(newDiscardRows: number) {
    if (newDiscardRows !== this.discardRows) {
      this.discardRows = newDiscardRows;
      const newDiscardSlots: Slot[] = makeDiscardSlots(newDiscardRows).map(
        slot => {
          const newSlot = slot;
          newSlot.tile = this.discardSlots[newSlot.slotId].tile;
	  if (newSlot.tile !== undefined) {
	    newSlot.tile.discardSlot = newSlot;
	  }
          return newSlot;
        }
      );
      this.discardSlots = newDiscardSlots;
    }
  }

  rearrangeDiscardSlots(arrange: string) {
    if (this.discardArrange !== arrange) {
      this.discardArrange = arrange;
      const discardedTilesInDiscardOrder: Tile[] = this.discardTiles.sort(
        (tile1, tile2) => tile1.discardOrder - tile2.discardOrder
      );
      // undiscard the played tiles
      discardedTilesInDiscardOrder.forEach(tile => tile.undiscard());
      // rediscard the played tiles
      discardedTilesInDiscardOrder.forEach(tile => this.tileDiscard(tile));
    }
  }

  //
  //
  //

  tileDiscard(tile: Tile) {
    tile.discard(this.pickDiscardSlot(tile)!, this.discardTiles.length);
  }

  //
  //
  //

  tileUndiscardOrderList(limitOrder: number) {
    return this.discardTiles
      .filter(t => t.discardOrder >= limitOrder)
      .sort((t1, t2) => -(t1.discardOrder - t2.discardOrder));
  }

  tileUndiscardAllList() {
    return this.tileUndiscardOrderList(0);
  }

  // find the discard slot id for a discarded tile
  pickDiscardSlot(tile: Tile): Slot | undefined {
    // discards stack similar tiles in piles of four
    const matchTile: Tile | undefined = this.discardTiles.findLast(tile2 =>
      tile.matches(tile2)
    );

    // if we found a similar tile, stack on it
    if (matchTile !== undefined) {
      return this.discardSlots[matchTile.discardSlot!.slotId + 36];
    }

    // decide where to put the first tile of this sort
    switch (this.discardArrange) {
      case 'byDiscardOrder': {
        const lastTile = this.discardTiles
          .filter(t => t.discardSlot!.slotId < 36)
          .pop();
        return this.discardSlots[
          lastTile === undefined ? 0 : lastTile.discardSlot!.slotId + 1
        ];
      }
      case 'byTileOrder':
      case 'noDiscard':
        return this.discardSlots[tile.face];

      default:
        console.log(`unknown arrangement ${this.discardArrange}`);
        return undefined;
    }
  }

  // deal a new game
  newGame(tiles: Tile[]) {
    // copy back
    this.emptyAllSlots();
    this.tiles.forEach(tile => {
      const newTile = tiles[tile.tileId];
      const newSlot = this.playSlots[newTile.playSlot!.slotId];
      tile.deal(newSlot);
    });
  }

  // empty all slots
  /* eslint no-param-reassign: ["error", { "props": false }] */
  /* eslint-disable no-return-assign */
  emptyAllSlots() {
    this.tiles.forEach(t => {
      t.playSlot = undefined;
      t.discardSlot = undefined;
    });
    this.playSlots.forEach(s => (s.tile = undefined));
    this.discardSlots.forEach(s => (s.tile = undefined));
  }
}
