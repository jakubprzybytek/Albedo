package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;

public class SimpleEphemeris {

    final public double jde;

    final public AstronomicalCoordinates coordinates;

    /**
     * Distance to body in AU.
     */
    final public double distanceToBody;

    /**
     * Constructs simple ephemeris object that holds information about coordinates and distance only.
     * @param jde Time moment for the ephemeris.
     * @param coordinates Astronomical coordinates of the body.
     * @param distanceToBody Distance to body in AU.
     */
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
