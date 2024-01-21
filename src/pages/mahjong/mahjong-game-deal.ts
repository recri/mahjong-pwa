/**
 */

import { stride } from './utility.js';
import { Random } from './random.js';
import { Constant } from './constant.js';
import { Tile } from './mahjong-tile.js';
import { Slot } from './mahjong-slot.js';
import { Game } from './mahjong-game.js';

//
// deal operates in
export class GameDeal extends Game {
  // random number generator and services
  generator: Random = new Random();

  // the playSlots used for the deal in shuffled order
  dealSlots: Slot[] = [];

  // the tiles used for the deal in shuffled order
  dealTiles: Tile[] = [];

  // set random number seed
  srandom(seed: number) {
    this.generator.srandom(seed);
  }

  shuffle(list: any[]): any[] {
    return this.generator.shuffle(list);
  }

  random(): number {
    return this.generator.random();
  }

  tilesPlay(tile1: Tile, tile2: Tile) {
    this.tileDiscard(tile1);
    this.tileDiscard(tile2);
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["tilesSwap"] }] */
  tilesSwap(tile1: Tile, tile2: Tile) {
    const slot1 = tile1.playSlot;
    const slot2 = tile2.playSlot;
    tile1.undeal();
    tile2.undeal();
    tile2.deal(slot1!);
    tile1.deal(slot2!);
  }

  findMatchingTile(tile1: Tile): Tile | undefined {
    for (const tile2 of this.dealTiles) {
      if (tile1 !== tile2 && tile2.isInPlay && tile1.matches(tile2)) {
        return tile2;
      }
    }
    return undefined;
  }

  playNextTile(plays: Slot[]): boolean {
    for (const slot1 of plays) {
      for (const slot2 of plays) {
        if (
          slot1.slotId > slot2.slotId &&
          slot1.tile !== undefined &&
          slot2.tile !== undefined &&
          slot1.tile.matches(slot2.tile)
        ) {
          this.tilesPlay(slot1.tile, slot2.tile);
          return true;
        }
      }
    }
    return false;
  }

  doDealGame(): boolean {
    // shuffle slots and tiles with current rng seeded range
    this.dealSlots = this.shuffle(stride(0, Constant.nSlots - 1, 1)).map(
      i => this.playSlots[i]
    );
    this.dealTiles = this.shuffle(stride(0, Constant.nTiles - 1, 1)).map(
      i => this.tiles[i]
    );

    // match the shuffled slots and tiles
    for (const i of stride(0, Constant.nTiles - 1, 1)) {
      this.dealTiles[i].deal(this.dealSlots[i]);
    }

    while (this.dealSlots.some(slot => slot.isPlaySlotFilled)) {
      const inPlays: Slot[] = this.dealSlots.filter(
        slot => slot.isPlaySlotFilled
      );
      const plays: Slot[] = inPlays.filter(slot => slot.canPlay);
      // console.log(`#inPlays ${inPlays.length}, #plays ${plays.length}`);
      if (!this.playNextTile(plays)) {
        // cheat
        if (plays.length < 2) {
          // this happens with a deadlock, where three tiles are covered by one tile
          // might recover by backing out to 8 tiles, reshuffling, retrying
          console.log(
            `deal failed with one playable tile and ${inPlays.length} tiles`
          );
          return false;
        }
        const tile1 = plays[0].tile!;
        const tile2 = plays[1].tile!;
        const tile3 = this.findMatchingTile(tile1!)!;
        this.tilesSwap(tile2, tile3);
        this.tilesPlay(tile1, tile3);
      }
    }
    this.tileUndiscardAllList().forEach(t => t.undiscard());
    return true;
  }

  dealGame(seed: number) {
    // console.log(`dealGame ${seed}`);
    this.srandom(seed);
    do {
      this.emptyAllSlots();
    } while (!this.doDealGame());
  }
}
