/*
 *
 */

import { Constant } from './constant.js';
import { stride } from './utility.js';
import { Slot } from './mahjong-slot.js';

export class Tile {
  tileId: number;

  playSlot: Slot | undefined;

  discardSlot: Slot | undefined;

  discardOrder: number;

  isSelected: boolean;

  static updated: boolean = true;

  constructor(tileId: number) {
    this.tileId = tileId;
    this.playSlot = undefined;
    this.discardSlot = undefined;
    this.discardOrder = -1;
    this.isSelected = false;
  }

  // for all of the following, this.playSlot !== undefined is assumed
  // since that is the way the game is played, the playSlot is set in
  // the deal and only the discardSlot is modified

  toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  get name() {
    return Constant.tileNames[this.face];
  }

  get title() {
    return Constant.tileTitles[this.face];
  }

  get face() {
    return Math.floor(this.tileId / 4);
  }

  get isInDiscard() {
    return this.discardSlot !== undefined;
  }

  get isInPlay() {
    return this.playSlot !== undefined && this.discardSlot === undefined;
  }

  get canPlay() {
    return this.playSlot!.canPlay;
  }

  matches(tile: Tile) {
    return this.face === tile.face;
  }

  get canUndiscard() {
    return this.discardSlot !== undefined && this.discardSlot.canUndiscard;
  }

  discard(discardSlot: Slot, discardOrder: number) {
    this.discardSlot = discardSlot;
    this.discardOrder = discardOrder;
    this.discardSlot.tile = this;
    Tile.updated = true;
  }

  undiscard() {
    this.discardSlot!.tile = undefined;
    this.discardSlot = undefined;
    // this.discardOrder = -1;
    Tile.updated = true;
  }

  deal(playSlot: Slot) {
    this.playSlot = playSlot;
    this.playSlot.tile = this;
    Tile.updated = true;
  }

  undeal() {
    if (this.playSlot !== undefined) {
      this.playSlot!.tile = undefined;
    }
    this.playSlot = undefined;
    Tile.updated = true;
  }
}

export const makeTiles = (): Tile[] =>
  stride(0, Constant.nTiles - 1, 1).map(id => new Tile(id));
