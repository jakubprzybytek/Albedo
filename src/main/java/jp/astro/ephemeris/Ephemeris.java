package jp.astro.ephemeris;

import jp.astro.common.AstronomicalCoordinates;

public class Ephemeris {

    public double jde;

    public AstronomicalCoordinates coordinates;

    public Ephemeris(double jde, AstronomicalCoordinates coordinates) {
        this.jde = jde;
        this.coordinates = coordinates;
    }

    @Override
    public String toString() {
        return String.format("T=%.4fTD, Coords: %s", this.jde, this.coordinates);
    }
}
