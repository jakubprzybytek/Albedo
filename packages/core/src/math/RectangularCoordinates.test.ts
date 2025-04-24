import { describe, it, expect } from "vitest";
import { Radians, RectangularCoordinates } from '.';

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

    it("should normalise", () => {
        const first = new RectangularCoordinates(3.0, 4.0, 5.0);
        const normalized = first.normalize();

        expect(normalized.length()).toBeCloseTo(1, 15);
        expect(normalized).toEqual(new RectangularCoordinates(0.4242640687119285, 0.565685424949238, 0.7071067811865475));
    });

    it("should compute scalar product", () => {
        const first = new RectangularCoordinates(1.0, 3.0, -5.0);
        const second = new RectangularCoordinates(4.0, -2.0, -1.0);

        expect(first.scalarProduct(second)).toEqual(3);
    });

    it("should compute cross product", () => {
        const first = new RectangularCoordinates(2.0, 3.0, 4.0);
        const second = new RectangularCoordinates(5.0, 6.0, 7.0);

        expect(first.crossProduct(second)).toEqual(new RectangularCoordinates(-3, 6, -3));
    });

    it("should rotate", () => {
        const v = new RectangularCoordinates(0.0, -1.0, 0.0);
        const axis = new RectangularCoordinates(0.0, 0.0, 1.0);

        const rotated = v.rotate(axis, Radians.fromDegrees(90));

        expect(rotated.x).toBeCloseTo(1, 15);
        expect(rotated.y).toBeCloseTo(0, 15);
        expect(rotated.z).toBeCloseTo(0, 15);
    });
});
