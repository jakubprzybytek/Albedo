const omega = (3 - Math.sqrt(5)) / 2;

export function localMinimum(f: (x: number) => number, a: number, b: number, c: number): number {
  let f_a = f(a);
  let f_b = f(b);
  let f_c = f(c);

  if (a > b || b > c) {
    throw new Error(`Parameters don't meet the condition: a=${a} < b=${b} && c=${c} > b=${b}`);
  }

  if (f_b > f_a || f_b > f_c) {
    throw new Error(`Parameters don't meet the condition: f(a=${a})=${f_a} > f(b=${b})=${f_b} && f(c=${c})=${f_c} > f(b=${b})=${f_b}`);
  }

  for (let i = 0; i < 20; i++) {
    let d = (b - a) > (c - b)
      ? a + omega * (b - a)
      : b + omega * (c - b);

    let f_d = f(d);

    // console.log('\n');
    // console.log(`f(a=${a})=${f_a}`);
    // console.log(`f(b=${b})=${f_b}`);
    // console.log(`f(c=${c})=${f_c}`);
    // console.log(`f(d=${d})=${f_d}`);
    console.log(`c-a=${c - a}`);

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
  }

  console.log('\n');
  console.log(`f(a=${a})=${f_a}`);
  console.log(`f(b=${b})=${f_b}`);
  console.log(`f(c=${c})=${f_c}`);

  console.log(`result=${(a + c) / 2}`);

  return (a + c) / 2;
}