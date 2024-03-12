/**
 */
import { stride } from './utility.js';
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
  discardArrange: boolean;

  // how the discard slots may be arranged, indexed by bool
  discardArrangeOptions = ['byTileOrder', 'byDiscardOrder'];

  constructor() {
    this.discardRows = 3;
    this.discardArrange = false;
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
    this._discardTiles = this.discardSlots
      .filter(s => s.tile !== undefined)
      .map(s => s.tile!);
  }

  // tiles for occupied play slots sorted in slot order
  private _playTiles!: Tile[];

  get playTiles(): Tile[] {
    if (Tile.updated) {
      this._updateTiles();
    }
    return this._playTiles;
  }

  get canPlayTiles(): Tile[] {
    return this.playTiles.filter(t => t.canPlay);
  }

  // tiles for occupied discard slots sorted in slot order
  private _discardTiles!: Tile[];

  get discardTiles(): Tile[] {
    if (Tile.updated) {
      this._updateTiles();
    }
    return this._discardTiles;
  }

  remodelDiscardSlots(newDiscardRows: number) {
    if (newDiscardRows !== this.discardRows) {
      const discardedTilesInDiscardOrder: Tile[] = this.discardTiles.sort(
        (tile1, tile2) => tile1.discardOrder - tile2.discardOrder
      );
      // undiscard the played tiles
      discardedTilesInDiscardOrder.forEach(tile => tile.undiscard());
      this.discardRows = newDiscardRows;
      this.discardSlots = makeDiscardSlots(newDiscardRows);
      // rediscard the played tiles
      discardedTilesInDiscardOrder.forEach(tile => this.tileDiscard(tile));
    }
  }

  rearrangeDiscardSlots() {
      const discardedTilesInDiscardOrder: Tile[] = this.discardTiles.sort(
        (tile1, tile2) => tile1.discardOrder - tile2.discardOrder
      );
      // undiscard the played tiles
      discardedTilesInDiscardOrder.forEach(tile => tile.undiscard());
      // reset the discard ordering
      this.discardArrange = ! this.discardArrange;
      // rediscard the played tiles
      discardedTilesInDiscardOrder.forEach(tile => this.tileDiscard(tile));
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

  // remap slotIds to fill from left-to-right and top-to-bottom
  remap(discardId: number): Slot | undefined {
    if (discardId < 0 || discardId > 35) {
      console.log(`invalid discardId ${discardId}`);
      return undefined;
    }
    if (this.discardRows === 3) {
      // reverse the order of layout in each row
      const rem = discardId % 12;
      const div = Math.floor(discardId / 12);
      const map = div * 12 + (11 - rem);
      return this.discardSlots[map];
    }
    if (this.discardRows === 12) {
      // reverse the order of layout in each column
      // and reverse the order of the columns
      const rem = discardId % 12;
      // eslint-disable no-bitwise
      const div = [2, 1, 0][Math.floor(discardId / 12)];
      // eslint-enable no-bitwise
      const map = div * 12 + rem;
      if ( ! this.discardArrange) {
        // and now exchange N with W and S with E
        if (map === 34) return this.discardSlots[21]; // N -> W
        if (map === 21) return this.discardSlots[34]; // W -> N
        if (map === 23) return this.discardSlots[10]; // E -> S
        if (map === 10) return this.discardSlots[23]; // S -> E
      }
      return this.discardSlots[map];
      // return discardId;
    }
    console.log(`unknown discardRows ${this.discardRows}`);
    return undefined;
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
    if (this.discardArrange) {
      for (const slotId of stride(0, 36 - 1, 1)) {
        if (this.remap(slotId)!.isDiscardSlotEmpty) {
          return this.remap(slotId);
        }
      }
      console.log(`fell out of slot search`);
      return undefined;
    }
    return this.remap(tile.face);
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
