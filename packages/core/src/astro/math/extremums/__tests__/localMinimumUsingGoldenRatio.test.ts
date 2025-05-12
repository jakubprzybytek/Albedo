import { describe, it, expect } from 'vitest';
import { localMinimum } from "../localMinimumUsingGoldenRatio";

function polynomial(a: number, b: number, c: number, d: number) {
  return (x: number) => a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
}

describe("localMinimumUsingGoldenRatio", () => {
  it("should find local minimum", () => {
    expect(localMinimum(polynomial(0, 4, -6, 5), -2, 0, 2)).approximately(0.75, 0.001);
    expect(localMinimum(polynomial(1, 4, 1, -2), -2, 0, 2)).approximately(-0.13148, 0.001);
  });
});
