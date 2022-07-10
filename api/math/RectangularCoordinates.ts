export class RectangularCoordinates {
    static ZERO = new RectangularCoordinates(0, 0, 0);

    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(other: RectangularCoordinates): RectangularCoordinates {
        return new RectangularCoordinates(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    negate(): RectangularCoordinates {
        return new RectangularCoordinates(-this.x, -this.y, -this.z);
    }

    substract(other: RectangularCoordinates): RectangularCoordinates {
        return new RectangularCoordinates(this.x - other.x, this.y - other.y, this.z - other.z)
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
