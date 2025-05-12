import { describe, it, expect } from 'vitest';
import { localMinimum } from "../localMinimumUsingGoldenRatio";

function polynomial(a: number, b: number, c: number, d: number) {
  return (x: number) => a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
}

describe("localMinimumUsingGoldenRatio", () => {
  it("should find local minimum", () => {

    const [result1, f_result1, rangeWidth1] = localMinimum(polynomial(0, 4, -6, 5), -2, 0, 2, { maxResultRangeWidth: 0.001, maxIterations: 25 });
    expect(result1, 'Result').approximately(0.75, 0.001);
    expect(f_result1, 'Function value').approximately(2.75, 0.01);
    expect(rangeWidth1, 'Result range width').toBeLessThanOrEqual(0.001);

    const [result2, f_result2, rangeWidth2] = localMinimum(polynomial(1, 4, 1, -2), -2, 0, 2);
    expect(result2, 'Result').approximately(-0.13148, 0.001);
    expect(f_result2, 'Function value').approximately(-2.0646, 0.01);
    expect(rangeWidth2, 'Result range width').toBeLessThanOrEqual(0.01);
  });
});
