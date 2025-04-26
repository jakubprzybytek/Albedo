export class ChebyshevPolynomialExpander {

    readonly coefficients: number[];

    constructor(coefficients: number[]) {
        this.coefficients = coefficients;
    }

    computeFor(x: number): number {
        let value: number = 0.0;
        for (let i: number = 0; i < this.coefficients.length; i++) {
            value += this.coefficients[i] * this.T(x, i);
        }
        return value;
    }

    private T(x: number, n: number): number {
        return (n == 0) ? 1 : (n == 1) ? x : 2 * x * this.T(x, n - 1) - this.T(x, n - 2);
    }

}
