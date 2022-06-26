import { describe, it, expect } from "vitest";
import { ChebyshevPolynomialExpander } from './ChebyshevPolynomialExpander';

describe("ChebyshevPolynomialExpander", () => {

    it("should perform correct calculations", () => {
        const coefficients: number[] = [1.0, 1.0, 1.0, 1.0];

        const expander = new ChebyshevPolynomialExpander(coefficients);

        expect(expander.computeFor(-1.0)).toBe(0);
        expect(expander.computeFor(-0.5)).toBe(1);
        expect(expander.computeFor(0.0)).toBe(0);
        expect(expander.computeFor(0.5)).toBe(0);
        expect(expander.computeFor(1.0)).toBe(4);
    });

});
