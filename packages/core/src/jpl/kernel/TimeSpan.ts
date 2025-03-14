export class TimeSpan {

    from: number;

    to: number;

    constructor(from: number, to: number) {
        this.from = from;
        this.to = to;
    }


    inside(jd: number): boolean {
        return jd >= this.from && jd <= this.to;
    }

    overlaps(timeSpan: TimeSpan): boolean {
        return this.from <= timeSpan.to && timeSpan.from <= this.to;
    }

    normalizeFor(jd: number): number {

        if (jd < this.from || jd > this.to) {
            throw new Error(`Cannot normalize ${jd} for ${this}`);
        }

        return (jd - this.from) * 2 / (this.to - this.from) - 1;
    }
}
