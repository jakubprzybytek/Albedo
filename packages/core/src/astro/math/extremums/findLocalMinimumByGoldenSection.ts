/*
 * Reference: https://th-www.if.uj.edu.pl/zfs/gora/metnum23/wyklad11.pdf
 */

const omega = (3 - Math.sqrt(5)) / 2;

export type LocalMinimumOptions = {
  maxResultRangeWidth: number,
  maxIterations: number
}

export type LocalMinimumResult = [
  input: number,
  value: number,
  resultRangeWidth: number,
  iterations: number
]

const DEFAULT_OPTIONS: LocalMinimumOptions = {
  maxResultRangeWidth: 0.001,
  maxIterations: 20
}

/**
 * Approximates the minimum of a continuous numeric function with golden-section search.
 *
 * The points `a < b < c` must bracket a local minimum, meaning `f(b)` is no
 * greater than either `f(a)` or `f(c)`. Returns the estimated input, function
 * value, final bracket width, and iteration count, in that order.
 */
export function findLocalMinimumByGoldenSection(functionToMinimize: (x: number) => number, a: number, b: number, c: number, options?: Partial<LocalMinimumOptions>): LocalMinimumResult {

  const effectiveOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  let fA = functionToMinimize(a);
  let fB = functionToMinimize(b);
  let fC = functionToMinimize(c);

  // try to fix input points
  if (fB > fA) {
    c = b;
    fC = fB;
    b = a + (c - a) / 2;
    fB = functionToMinimize(b);
  }

  if (fB > fC) {
    a = b;
    fA = fB;
    b = a + (c - a) / 2;
    fB = functionToMinimize(b);
  }

  if (a > b || b > c) {
    throw new Error(`Parameters don't meet the condition: a=${a} < b=${b} < c=${c}`);
  }

  if (fB > fA || fB > fC) {
    throw new Error(`Parameters don't meet the condition: f(a=${a})=${fA} > f(b=${b})=${fB} < f(c=${c})=${fC}`);
  }

  let iteration = 0;
  do {
    const d = (b - a) > (c - b) ? a + omega * (b - a) : b + omega * (c - b);
    const fD = functionToMinimize(d);

    if (fD < fB) {
      if (d < b) {
        c = b; fC = fB;
        b = d; fB = fD;
      } else {
        a = b; fA = fB;
        b = d; fB = fD;
      }
    } else
      if (d < b) {
        a = d; fA = fD;
      } else {
        c = d; fC = fD;
      }

    // console.log('\n');
    // console.log(`f(a=${a})=${f_a}`);
    // console.log(`f(b=${b})=${f_b}`);
    // console.log(`f(c=${c})=${f_c}`);
    // console.log(`Iteration: ${iteration}, result range: ${c-a}`);

  } while (++iteration < effectiveOptions.maxIterations && (c - a) > effectiveOptions.maxResultRangeWidth);

  // console.log('\n');
  // console.log(`f(a=${a})=${f_a}`);
  // console.log(`f(b=${b})=${f_b}`);
  // console.log(`f(c=${c})=${f_c}`);

  const result = (a + c) / 2;
  const fResult = functionToMinimize(result);

  // console.log(`result midle point: f(${result})=${f_result}`);
  // console.log(`result range: ${c - a}`);

  return [result, fResult, c - a, iteration];
}