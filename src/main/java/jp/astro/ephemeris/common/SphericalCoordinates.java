package jp.astro.ephemeris.common;

public class SphericalCoordinates {

    public double longitude;

    public double latitude;

    public double distance;

    public SphericalCoordinates(double longitude, double latitude, double distance) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.distance = distance;
    }

    @Override
    public String toString() {
        return String.format("[long=%s, lat=%s, dist=%s]", longitude, latitude, distance);
    }

}
