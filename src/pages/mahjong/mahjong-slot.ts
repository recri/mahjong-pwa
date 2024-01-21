/*
 *
 */

import { Constant } from './constant.js';
import { stride } from './utility.js';
import { Tile } from './mahjong-tile.js';

/*
 * no-use-before-define - Slot contains four arrays of Slot references
 * which are only set after the class is defined and the instances
 * of the class have been allocated.
 * eslint no-param-reassign - the primary array of Slot's is allocated
 * once and rewritten in place.
 * Eslint is a prude.
 */

/* eslint no-use-before-define: ["warn", { "classes": true }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

export class Slot {
  slotId: number;

  x: number = 0;

  y: number = 0;

  z: number = 0;

  b: number = 0;

  // eslint-disable no-use-before-define
  toLeft: Slot[] = [];

  toRight: Slot[] = [];

  toAbove: Slot[] = [];

  toBelow: Slot[] = [];
  // eslint-enable no-use-before-define

  tile: Tile | undefined;

  constructor(
    _slotId: number,
    _x: number,
    _y: number,
    _z: number,
    _b: number,
    _toLeft: Slot[] = [],
    _toRight: Slot[] = [],
    _toAbove: Slot[] = [],
    _toBelow: Slot[] = []
  ) {
    this.slotId = _slotId;
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.b = _b;
    this.toLeft = _toLeft;
    this.toRight = _toRight;
    this.toAbove = _toAbove;
    this.toBelow = _toBelow;
    this.tile = undefined;
  }

  get isPlaySlotFilled() {
    return this.tile !== undefined && this.tile.discardSlot === undefined;
  }

  get isDiscardSlotEmpty() {
    return this.tile === undefined;
  }

  get isPlaySlotEmpty() {
    return !this.isPlaySlotFilled;
  }

  get isPlaySlotUncoveredInX() {
    return (
      this.toLeft.every(slot => slot.isPlaySlotEmpty) ||
      this.toRight.every(slot => slot.isPlaySlotEmpty)
    );
  }

  get isPlaySlotUncoveredInZ() {
    return this.toAbove.every(slot => slot.isPlaySlotEmpty);
  }

  get isDiscardSlotUncoveredInZ() {
    return this.toAbove.every(slot => slot.isDiscardSlotEmpty);
  }

  get canUndiscard() {
    return this.tile !== undefined && this.isDiscardSlotUncoveredInZ;
  }

  get canPlay() {
    return (
      this.tile !== undefined &&
      this.tile.isInPlay &&
      this.isPlaySlotUncoveredInX &&
      this.isPlaySlotUncoveredInZ
    );
  }
}

// these are the blocks of the play layout
// zlrtb decodes to:
//   z coordinate,
//   left x coordinate,
//   right x coordinate,
//   top y coordinate
//   bottom y coordinate
// coordinates are inclusive, tiles occupy a 1x1 square where x,y is the lower left corner

const playZlrtb: number[][] = [
  [0, 10.0, 10.0, 3.0, 3.0], // tile x 10 y 3
  [0, 8.5, 9.5, 0.5, 1.5], // block left 8.5 right 9.5 top 0.5 bottom 1.5
  [0, 8.0, 9.0, 2.5, 3.5], // block left 8.0 right 9.0 top 2.5 bottom 3.5
  [0, 8.5, 9.5, 4.5, 5.5], // block left 8.5 right 9.5 top 4.5 bottom 5.5
  [0, 3.0, 7.0, 0.0, 0.0], // row y 0 left 2.5 right 7.5
  [0, 2.5, 7.5, 1.0, 1.0], // row y 1 l3.0 right 7.0 top 2.0 bottom 4.0
  [0, 3.0, 7.0, 2.0, 4.0], // block left eft 3 right 7
  [0, 2.5, 7.5, 5.0, 5.0], // row y 5 left 2.5 right 7.5
  [0, 3.0, 7.0, 6.0, 6.0], // row y 6 left 3 right 7
  [0, 0.5, 1.5, 0.5, 1.5], // block left 0.5 right 1.5 top 0.5 bottom 1.5
  [0, 1.0, 2.0, 2.5, 3.5], // block left 1.0 right 2.0 top 2.5 bottom 3.5
  [0, 0.5, 1.5, 4.5, 5.5], // block left 0.5 right 1.5 top 4.5 bottom 5.5
  [0, 0.0, 0.0, 3.0, 3.0], // tile x 0 y 3
  [1, 6.5, 6.5, 0.0, 0.0], // tile x 6.5 y 0
  [1, 7.0, 9.0, 1.0, 1.0], // row left 7 right 9 y 1
  [1, 7.5, 8.5, 2.0, 4.0], // block left 7.5 top 2 right 8.5 bottom 4
  [1, 7.0, 9.0, 5.0, 5.0], // row left 7 right 9 y 5
  [1, 6.5, 6.5, 6.0, 6.0], // tile x 6.5 y 6
  [1, 4.5, 5.5, 0.5, 0.5], // row y 0.5 left 4.5 right 5.5
  [1, 4.0, 6.0, 1.5, 1.5], // row y 1.5 left 4 right 6
  [1, 3.5, 6.5, 2.5, 3.5], // block top 2.5 left 3.5 bottom 3.5 right 6.5
  [1, 4.0, 6.0, 4.5, 4.5], // row y 4.5 left 4 right 6
  [1, 4.5, 5.5, 5.5, 5.5], // row y 5.5 left 4.5 right 5.5
  [1, 3.5, 3.5, 0.0, 0.0], // tile x 3.5 y 0
  [1, 1.0, 3.0, 1.0, 1.0], // row left 1 right 3 y 1
  [1, 1.5, 2.5, 2.0, 4.0], // block left 1.5 top 2 right 2.5 bottom 4
  [1, 1.0, 3.0, 5.0, 5.0], // row left 1 right 3 y 5
  [1, 3.5, 3.5, 6.0, 6.0], // tile x 3.5 y 6
  [2, 2.5, 7.5, 2.0, 2.0], // row y 2 left 2.5 right 7.5
  [2, 2.0, 8.0, 3.0, 3.0], // row y 3 left 2 right 8
  [2, 2.5, 7.5, 4.0, 4.0], // row y 4 left 2.5 right 7.5
  [3, 7.5, 7.5, 3.0, 3.0], // tile x 7.5 y 3
  [3, 3.5, 6.5, 2.5, 3.5], // block left 3.5 right 6.5 top 2.5 bottom 3.5
  [3, 2.5, 2.5, 3.0, 3.0], // tile x 2.5 y 3
  [4, 4.0, 6.0, 3.0, 3.0], // row z 4 left 4 right 6 y 3
  [5, 4.5, 5.5, 3.0, 3.0], // row z 5 left 4.5 right 5.5 y 3
  [6, 5.0, 5.0, 3.0, 3.0], // tile z 6 x 5 y 3
];

// create the discard zlrtb, a single rectangle which
// adapts to screen orientation in size and changes
// from row to column major ordering as well
// rows should be a factor of 36
const discardZlrtb = (rows: number): number[][] =>
  [0, 1, 2, 3].map(z => [z, 0, 36 / rows - 1, 0, rows - 1]);

// expand a zlrtb block description into an array of slots
const expandZlrtb = (zlrtb: number[][], yfirst: boolean): Slot[] => {
  let slotId = 0;
  function nextSlotId() {
    const next = slotId;
    slotId += 1;
    return next;
  }
  let block = 0;
  function nextBlock() {
    const next = block;
    block += 1;
    return next;
  }
  if (yfirst) {
    return zlrtb.flatMap(zlrtbi => {
      const [z, left, right, top, bottom] = zlrtbi;
      const b = nextBlock();
      return stride(right, left, -1).flatMap(x =>
        stride(top, bottom, 1).map(y => new Slot(nextSlotId(), x, y, z, b))
      );
    });
  }
  return zlrtb.flatMap(zlrtbi => {
    const [z, left, right, top, bottom] = zlrtbi;
    const b = nextBlock();
    return stride(top, bottom, 1).flatMap(y =>
      stride(right, left, -1).map(x => new Slot(nextSlotId(), x, y, z, b))
    );
  });
};

// jitter the x or y coordinate of an array of Slot
const jitterXy = (slots: Slot[], yfirst: boolean, scale: number): Slot[] => {
  const jitter = new Map();
  const jitterAt = (xy: number): number => {
    if (jitter.has(xy)) {
      return jitter.get(xy);
    }
    jitter.set(xy, scale * (Math.random() * 2 - 1));
    return jitter.get(xy);
  };

  return slots.map(s => {
    if (yfirst) {
      s.x += jitterAt(s.y);
    } else {
      s.y += jitterAt(s.x);
    }
    return s;
  });
};

// populate the slot neighbor lists

const findNeighbors = (slots: Slot[]): Slot[] =>
  slots.map(s => {
    s.toLeft = slots.filter(
      (
        n // potential left neighbor
      ) =>
        n.z === s.z && // must be in our layer
        n.x === s.x - 1 && // must be in column directly to the left
        n.y >= s.y - 0.5 && // must be in our row or a row 1/2 below
        n.y <= s.y + 0.5 // or 1/2 above our row
    );
    s.toRight = slots.filter(
      (
        n // potential right neighbor
      ) =>
        n.z === s.z && // must be in our layer
        n.x === s.x + 1 && // must be in column directly to the right
        n.y >= s.y - 0.5 && // must be in our row or a row 1/2 above
        n.y <= s.y + 0.5 // or 1/2 below our row
    );
    s.toAbove = slots.filter(
      n =>
        n.z === s.z + 1 &&
        n.x >= s.x - 0.5 &&
        n.x <= s.x + 0.5 &&
        n.y >= s.y - 0.5 &&
        n.y <= s.y + 0.5
    );
    s.toBelow = slots.filter(
      n =>
        n.z === s.z - 1 &&
        n.x >= s.x - 0.5 &&
        n.x <= s.x + 0.5 &&
        n.y >= s.y - 0.5 &&
        n.y <= s.y + 0.5
    );
    return s;
  });

// scale the slot coordinates to tile size and adjust for 3d effect
const scaleSlots = (slots: Slot[], dx: number, dy: number): Slot[] =>
  slots.map(s => {
    s.x = (s.x + dx) * Constant.faceWidth + (s.z + 1) * Constant.leftMargin;
    s.y =
      (s.y + dy) * Constant.faceHeight - (s.z + 1 - 4) * Constant.bottomMargin;
    return s;
  });

// make the discard slots given the zlrtb block description,
// whether we go column or row major, and scale for the jitter
const _makeDiscardSlots = (
  zlrtb: number[][],
  yfirst: boolean,
  scale: number
): Slot[] =>
  scaleSlots(
    jitterXy(findNeighbors(expandZlrtb(zlrtb, yfirst)), yfirst, scale),
    -0.0,
    -0.0
  );

// make the play slots given the zlrtb block description
const _makePlaySlots = (zlrtb: number[][]): Slot[] =>
  scaleSlots(findNeighbors(expandZlrtb(zlrtb, false)), -0.14, -0.18);

export const makePlaySlots = (): Slot[] => _makePlaySlots(playZlrtb);

export const makeDiscardSlots = (rows: number = 3): Slot[] =>
  _makeDiscardSlots(
    discardZlrtb(rows),
    rows > 36 / rows,
    Constant.discardSlotJitter
  );
