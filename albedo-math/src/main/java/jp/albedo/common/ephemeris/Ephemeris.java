package jp.albedo.common.ephemeris;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.webapp.utils.Precision6Converter;
import jp.albedo.webapp.utils.RadiansToPrecision1DegreesConverter;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesConverter;

public class Ephemeris {

    final public double jde;

    final public AstronomicalCoordinates coordinates;

    @JsonSerialize(converter = Precision6Converter.class)
    final public double distanceFromSun;

    @JsonSerialize(converter = Precision6Converter.class)
    final public double distanceFromEarth;

    @JsonSerialize(converter = RadiansToPrecision1DegreesConverter.class)
    final public double elongation;

    final public double apparentMagnitude;

    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    public Double angularSize;

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double elongation, double apparentMagnitude) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.elongation = elongation;
        this.apparentMagnitude = apparentMagnitude;
    }

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double elongation, double apparentMagnitude, Double angularSize) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.elongation = elongation;
        this.apparentMagnitude = apparentMagnitude;
        this.angularSize = angularSize;
    }

    @Override
    public String toString() {
        return String.format("T=%.4fTD, Coords: %s, distSun=%.2f, distEarth=%.2f, el=%.2f°, mag=%.2fmag",
                this.jde, this.coordinates, this.distanceFromSun, this.distanceFromEarth, Math.toDegrees(this.elongation), this.apparentMagnitude);
    }

    public String toStringHighPrecision() {
        return String.format("T=%.8fTD, Coords: %s, distSun=%.2f, distEarth=%.2f, el=%.4f°, mag=%.2fmag",
                this.jde, this.coordinates.toStringHighResolution(), this.distanceFromSun, this.distanceFromEarth, Math.toDegrees(this.elongation), this.apparentMagnitude);
    }
}
