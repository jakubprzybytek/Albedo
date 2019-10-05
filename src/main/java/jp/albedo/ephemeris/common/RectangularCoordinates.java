package jp.albedo.ephemeris.common;

public class RectangularCoordinates {

    public double x;

    public double y;

    public double z;

    public RectangularCoordinates(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static public RectangularCoordinates fromSphericalCoordinates(SphericalCoordinates sphericalCoordinates) {
        double x = sphericalCoordinates.distance * Math.cos(sphericalCoordinates.latitude) * Math.cos(sphericalCoordinates.longitude);
        double y = sphericalCoordinates.distance * Math.cos(sphericalCoordinates.latitude) * Math.sin(sphericalCoordinates.longitude);
        double z = sphericalCoordinates.distance * Math.sin(sphericalCoordinates.latitude);

        return new RectangularCoordinates(x, y, z);
    }

    public double getDistance() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    @Override
    public String toString() {
        return String.format("[x=%s, y=%s, z=%s]", x, y, z);
    }
}
