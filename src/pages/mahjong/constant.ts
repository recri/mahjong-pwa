// overall constants
const nTileFaces = 36;
const nTiles = 4 * nTileFaces;
const nSlots = 4 * nTileFaces;
const nDiscards = 4 * nTileFaces;

// tile constants
const tileWidth = 64.0; // nominal width of svg tile image
const tileHeight = 88.0; // nominal height of svg tile image
const leftMargin = tileWidth / 10; // left 3d edge of 3d tile
const bottomMargin = tileHeight / 11; // bottom 3d edge of 3d tile
const faceWidth = tileWidth - leftMargin;
const faceHeight = tileHeight - bottomMargin;

// layout constants
const discardSlotJitter = 0.08;
const playWidth = 11 * faceWidth + leftMargin;
const playHeight = 7 * faceHeight + 2 * bottomMargin;
const playAspect = playWidth / playHeight;
const portraitDiscardRows = 3;
const portraitDiscardCols = 36 / portraitDiscardRows;
const portraitDiscardWidth = portraitDiscardCols * faceWidth + 4 * leftMargin;
const portraitDiscardHeight =
  (portraitDiscardRows + 2 * discardSlotJitter) * faceHeight + 4 * bottomMargin;
const landscapeDiscardRows = 12;
const landscapeDiscardCols = 36 / landscapeDiscardRows;
const landscapeDiscardWidth =
  (landscapeDiscardCols + 2 * discardSlotJitter) * faceWidth + 4 * leftMargin;
const landscapeDiscardHeight =
  landscapeDiscardRows * faceHeight + 4 * bottomMargin;

// other
const qianWidth = 19.09;
const qianHeight = 19.09;
const background = '#323657';
const tileNames = [
  'bamboo1',
  'bamboo2',
  'bamboo3',
  'bamboo4',
  'bamboo5',
  'bamboo6',
  'bamboo7',
  'bamboo8',
  'bamboo9',
  'dragonGreen',
  'windNorth',
  'season',
  'character1',
  'character2',
  'character3',
  'character4',
  'character5',
  'character6',
  'character7',
  'character8',
  'character9',
  'windWest',
  'dragonRed',
  'windEast',
  'coin1',
  'coin2',
  'coin3',
  'coin4',
  'coin5',
  'coin6',
  'coin7',
  'coin8',
  'coin9',
  'dragonWhite',
  'windSouth',
  'flower',
];
const tileTitles = [
  '1 bamboo',
  '2 bamboo',
  '3 bamboo',
  '4 bamboo',
  '5 bamboo',
  '6 bamboo',
  '7 bamboo',
  '8 bamboo',
  '9 bamboo',
  'green dragon',
  'north wind',
  'season',
  '1 character',
  '2 character',
  '3 character',
  '4 character',
  '5 character',
  '6 character',
  '7 character',
  '8 character',
  '9 character',
  'west wind',
  'red dragon',
  'east wind',
  '1 coin',
  '2 coin',
  '3 coin',
  '4 coin',
  '5 coin',
  '6 coin',
  '7 coin',
  '8 coin',
  '9 coin',
  'white dragon',
  'south wind',
  'flower',
];

export const Constant = {
  // overall constants
  nTileFaces,
  nTiles,
  nSlots,
  nDiscards,

  // tile constants
  tileWidth,
  tileHeight,
  leftMargin,
  bottomMargin,
  faceWidth,
  faceHeight,

  // layout constants
  discardSlotJitter,
  playWidth,
  playHeight,
  playAspect,
  portraitDiscardRows,
  portraitDiscardCols,
  portraitDiscardWidth,
  portraitDiscardHeight,
  landscapeDiscardRows,
  landscapeDiscardWidth,
  landscapeDiscardHeight,

  // other
  qianWidth,
  qianHeight,
  background,
  tileNames,
  tileTitles,
};
