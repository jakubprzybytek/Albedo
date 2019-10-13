package jp.albedo.ephemeris.common;

public class RectangularCoordinates {

    final public double x;

    final public double y;

    final public double z;

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

    public RectangularCoordinates add(RectangularCoordinates second) {
        return new RectangularCoordinates(
                this.x + second.x,
                this.y + second.y,
                this.z + second.z
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

    public double getDistance() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    @Override
    public String toString() {
        return String.format("[x=%s, y=%s, z=%s]", x, y, z);
    }
}
