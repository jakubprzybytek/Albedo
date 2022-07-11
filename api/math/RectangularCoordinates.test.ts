import { describe, it, expect } from "vitest";
import { RectangularCoordinates } from '.';

describe("RectangularCoordinates", () => {
    it("should add", () => {
        expect(new RectangularCoordinates(1, 2, 3).add(new RectangularCoordinates(10, 20, 30))).toEqual(new RectangularCoordinates(11, 22, 33));
    });

    it("should negate", () => {
        expect(new RectangularCoordinates(1, 2, 3).negate()).toEqual(new RectangularCoordinates(-1, -2, -3));
    });

    it("should substract", () => {
        expect(new RectangularCoordinates(1, 2, 3).subtract(new RectangularCoordinates(10, 20, 30))).toEqual(new RectangularCoordinates(-9, -18, -27));
    });

    it("should compute length", () => {
        expect(new RectangularCoordinates(1, 2, 3).length()).toEqual(3.7416573867739413);
    });
});
