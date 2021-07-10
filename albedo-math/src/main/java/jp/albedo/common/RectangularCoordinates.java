package jp.albedo.common;

import jp.albedo.jeanmeeus.ephemeris.common.SphericalCoordinates;

public class RectangularCoordinates {

    public static final RectangularCoordinates ZERO = new RectangularCoordinates(0.0, 0.0, 0.0);

    public final double x;

    public final double y;

    public final double z;

    public RectangularCoordinates(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static public RectangularCoordinates fromSpherical(SphericalCoordinates sphericalCoordinates) {
        double x = sphericalCoordinates.distance * Math.cos(sphericalCoordinates.latitude) * Math.cos(sphericalCoordinates.longitude);
        double y = sphericalCoordinates.distance * Math.cos(sphericalCoordinates.latitude) * Math.sin(sphericalCoordinates.longitude);
        double z = sphericalCoordinates.distance * Math.sin(sphericalCoordinates.latitude);

        return new RectangularCoordinates(x, y, z);
    }

    public RectangularCoordinates negate() {
        return new RectangularCoordinates(-this.x, -this.y, -this.z);
    }

    public RectangularCoordinates normalize() {
        final double d = length();
        return new RectangularCoordinates(x / d, y / d, z / d);
    }

    public RectangularCoordinates add(RectangularCoordinates second) {
        return new RectangularCoordinates(
                this.x + second.x,
                this.y + second.y,
                this.z + second.z
        );
    }

    public RectangularCoordinates subtract(RectangularCoordinates second) {
        return new RectangularCoordinates(
                this.x - second.x,
                this.y - second.y,
                this.z - second.z
        );
    }

    public RectangularCoordinates multiplyBy(double value) {
        return new RectangularCoordinates(
                this.x * value,
                this.y * value,
                this.z * value
        );
    }

    public RectangularCoordinates divideBy(double value) {
        return new RectangularCoordinates(
                this.x / value,
                this.y / value,
                this.z / value
        );
    }

    public double length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public double scalarProduct(RectangularCoordinates other) {
        return x * other.x + y * other.y + z * other.z;
    }

    public RectangularCoordinates crossProduct(RectangularCoordinates other) {
        return new RectangularCoordinates(
                y * other.z - z * other.y,
                z * other.x - x * other.z,
                x * other.y - y * other.x
        );
    }

    /**
     * From https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
     *
     * @param axis  Vector to rotate about.
     * @param angle Rotation angle.
     * @return New vector after rotation.
     */
    public RectangularCoordinates rotate(RectangularCoordinates axis, double angle) {
        final RectangularCoordinates k = axis.normalize();
        final RectangularCoordinates first = multiplyBy(Math.cos(angle));
        final RectangularCoordinates second = k.multiplyBy(scalarProduct(k)).multiplyBy(1 - Math.cos(angle));
        final RectangularCoordinates third = k.crossProduct(this).multiplyBy(Math.sin(angle));
        return first.add(second).add(third);
    }

    @Override
    public String toString() {
        return String.format("[x=%s, y=%s, z=%s]", x, y, z);
    }
}
