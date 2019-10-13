package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;

public class Ephemeris {

    public double jde;

    public AstronomicalCoordinates coordinates;

    public double distanceFromSun;

    public double distanceFromEarth;

    public double apparentMagnitude;

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double apparentMagnitude) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.apparentMagnitude = apparentMagnitude;
    }

    @Override
    public String toString() {
        return String.format("T=%.4fTD, Coords: %s, distSub=%.2f, distEarth=%.2f, mag=%.2fmag", this.jde, this.coordinates, this.distanceFromSun, this.distanceFromEarth, this.apparentMagnitude);
    }

    public String toStringHighPrecision() {
        return String.format("T=%.8fTD, Coords: %s, distSub=%.2f, distEarth=%.2f, mag=%.2fmag", this.jde, this.coordinates.toStringHighPrecision(), this.distanceFromSun, this.distanceFromEarth, this.apparentMagnitude);
    }
}
