export class TimeSpan {

  readonly from: number;
  readonly to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  inside(time: number): boolean {
    return time >= this.from && time <= this.to;
  }

  overlaps(timeSpan: TimeSpan): boolean {
    return this.from <= timeSpan.to && timeSpan.from <= this.to;
  }

  normalizeFor(time: number): number {
    if (time < this.from || time > this.to) {
      throw new Error(`Cannot normalize ${time} for [${this.from}, ${this.to}]`);
    }

    return (time - this.from) * 2 / (this.to - this.from) - 1;
  }
}
