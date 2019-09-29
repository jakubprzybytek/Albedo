package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;

public class Ephemeris {

    public double jde;

    public AstronomicalCoordinates coordinates;

    public double distanceFromEarth;

    public double apparentMagnitude;

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromEarth, double apparentMagnitude) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromEarth = distanceFromEarth;
        this.apparentMagnitude = apparentMagnitude;
    }

    @Override
    public String toString() {
        return String.format("T=%.4fTD, Coords: %s, dist=%.2f, mag=%.2fmag", this.jde, this.coordinates, this.distanceFromEarth, this.apparentMagnitude);
    }

    public String toStringHighPrecision() {
        return String.format("T=%.8fTD, Coords: %s, dist=%.2f, mag=%.2fmag", this.jde, this.coordinates.toStringHighPrecision(), this.distanceFromEarth, this.apparentMagnitude);
    }
}
