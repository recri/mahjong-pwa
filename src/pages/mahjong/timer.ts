export class Timer {
  private start_time: number;

  private stop_time: number;

  constructor() {
    this.start_time = 0;
    this.stop_time = 0;
  }

  static clock_millis(): number {
    return Date.now();
  }

  static clock_seconds(): number {
    return Math.floor(Timer.clock_millis() / 1000);
  }

  reset() {
    this.start_time = 0;
    this.stop_time = 0;
  }

  start() {
    if (this.start_time === 0) {
      this.start_time = Timer.clock_millis();
    }
  }

  stop() {
    if (this.stop_time === 0) {
      this.stop_time = Timer.clock_millis();
    }
  }

  pause() {
    if (this.stop_time === 0) {
      this.stop_time = Timer.clock_millis();
    }
  }

  unpause() {
    if (this.stop_time !== 0) {
      this.start_time =
        Timer.clock_millis() - (this.stop_time - this.start_time);
      this.stop_time = 0;
    }
  }

  elapsed(): number {
    if (this.start_time === 0) return 0;
    if (this.stop_time !== 0) return this.stop_time - this.start_time;
    return Timer.clock_millis() - this.start_time;
  }
}
