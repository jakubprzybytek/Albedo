export * from './SimpleOrientationModelCalculator';
export * from './NutationPrecessionOrientationModelCalculator';

export function calculatePolynomials(coefficients: number[], x: number): number {
  let result = coefficients[0];
  let currentX = x;
  for (let i = 1; i < coefficients.length; i++) {
    result += coefficients[i] * currentX;
    currentX *= x;
  }
  return result;
}