import { MersenneTwister } from './mersenne-twister.js';

export class Random {
  seed: number;

  r: any;

  constructor(seed: number = 0) {
    this.seed = seed || Date.now();
    this.r = new MersenneTwister(this.seed);
  }

  randomize() {
    this.srandom(Date.now());
  }

  srandom(seed: number) {
    this.seed = seed;
    this.r.reseed(this.seed);
  }

  random(): number {
    return this.r.random();
  }

  getSeed(): number {
    return this.seed;
  }

  shuffle(_array: any[]): any[] {
    const array = _array.slice(0); // copy array
    const n = array.length;
    for (let i = 0; i < n; i += 1) {
      const j = i + Math.floor(this.random() * (n - i));
      if (i !== j) {
        const ai = array[i];
        const aj = array[j];
        array[i] = aj;
        array[j] = ai;
      }
    }
    return array;
  }
}
