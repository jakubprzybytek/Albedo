import { Vector3 } from "@astro/math";

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

  static fromVector(vector: Vector3) {
    return new RectangularCoordinates(vector[0], vector[1], vector[2]);
  }

  toVector(): Vector3 {
    return [this.x, this.y, this.z];
  }

  add(other: RectangularCoordinates): RectangularCoordinates {
    return new RectangularCoordinates(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  negate(): RectangularCoordinates {
    return new RectangularCoordinates(-this.x, -this.y, -this.z);
  }

  subtract(other: RectangularCoordinates): RectangularCoordinates {
    return new RectangularCoordinates(this.x - other.x, this.y - other.y, this.z - other.z)
  }

  multiplyBy(value: number): RectangularCoordinates {
    return new RectangularCoordinates(
      this.x * value,
      this.y * value,
      this.z * value
    );
  }

  divideBy(value: number): RectangularCoordinates {
    return new RectangularCoordinates(
      this.x / value,
      this.y / value,
      this.z / value
    );
  }
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): RectangularCoordinates {
    return this.divideBy(this.length());
  }

  scalarProduct(other: RectangularCoordinates): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  crossProduct(other: RectangularCoordinates): RectangularCoordinates {
    return new RectangularCoordinates(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  /*
  * From https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
  *
  * @param axis  Vector to rotate about.
  * @param angle Rotation angle.
  * @return New vector after rotation.
  */
  rotate(axis: RectangularCoordinates, angle: number): RectangularCoordinates {
    const k = axis.normalize();
    const first = this.multiplyBy(Math.cos(angle));
    const second = k.multiplyBy(this.scalarProduct(k)).multiplyBy(1 - Math.cos(angle));
    const third = k.crossProduct(this).multiplyBy(Math.sin(angle));
    return first.add(second).add(third);
  }

  toString() {
    return `{x: ${this.x}, y: ${this.y}, z: ${this.z}}`;
  }
}
