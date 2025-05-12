const omega = (3 - Math.sqrt(5)) / 2;

export type LocalMinimumOptions = {
  maxResultRangeWidth: number,
  maxIterations: number
}

const DEFAULT_OPTIONS: LocalMinimumOptions = {
  maxResultRangeWidth: 0.001,
  maxIterations: 20
}

export function localMinimum(f: (x: number) => number, a: number, b: number, c: number, options?: Partial<LocalMinimumOptions>): number[] {

  const effectiveOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  let f_a = f(a);
  let f_b = f(b);
  let f_c = f(c);

  if (a > b || b > c) {
    throw new Error(`Parameters don't meet the condition: a=${a} < b=${b} && c=${c} > b=${b}`);
  }

  if (f_b > f_a || f_b > f_c) {
    throw new Error(`Parameters don't meet the condition: f(a=${a})=${f_a} > f(b=${b})=${f_b} && f(c=${c})=${f_c} > f(b=${b})=${f_b}`);
  }

  let iteration = 0;
  do {
    let d = (b - a) > (c - b) ? a + omega * (b - a) : b + omega * (c - b);
    let f_d = f(d);

    if (f_d < f_b) {
      if (d < b) {
        c = b; f_c = f_b;
        b = d; f_b = f_d;
      } else {
        a = b; f_a = f_b;
        b = d; f_b = f_d;
      }
    } else
      if (d < b) {
        a = d; f_a = f_d;
      } else {
        c = d; f_c = f_d;
      }

  } while (iteration++ < effectiveOptions.maxIterations && (c - a) > effectiveOptions.maxResultRangeWidth);

  const result = (a + c) / 2;
  const f_result = f(result);

  console.log(`result midle point: f(${result})=${f_result}`);
  console.log(`result range: ${c - a}`);

  return [result, f_result, c - a, iteration];
}