package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;

public class SimpleEphemeris {

    final public double jde;

    final public AstronomicalCoordinates coordinates;

    final public double distanceToBody;

    public SimpleEphemeris(double jde, AstronomicalCoordinates coordinates, double distanceToBody) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceToBody = distanceToBody;
    }

    @Override
    public String toString() {
        return String.format("T=%.4fTD, Coords: %s",
                this.jde, this.coordinates);
    }

    public String toStringHighPrecision() {
        return String.format("T=%.8fTD, Coords: %s",
                this.jde, this.coordinates.toStringHighResolution());
    }

}
