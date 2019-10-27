package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;

public class Ephemeris {

    final public double jde;

    final public AstronomicalCoordinates coordinates;

    final public double distanceFromSun;

    final public double distanceFromEarth;

    final public double apparentMagnitude;

    public Double angularSize;

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double apparentMagnitude) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.apparentMagnitude = apparentMagnitude;
    }

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double apparentMagnitude, double angularSize) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.apparentMagnitude = apparentMagnitude;
        this.angularSize = angularSize;
    }

    @Override
    public String toString() {
        return String.format("T=%.4fTD, Coords: %s, distSun=%.2f, distEarth=%.2f, mag=%.2fmag", this.jde, this.coordinates, this.distanceFromSun, this.distanceFromEarth, this.apparentMagnitude);
    }

    public String toStringHighPrecision() {
        return String.format("T=%.8fTD, Coords: %s, distSun=%.2f, distEarth=%.2f, mag=%.2fmag", this.jde, this.coordinates.toStringHighPrecision(), this.distanceFromSun, this.distanceFromEarth, this.apparentMagnitude);
    }
}
