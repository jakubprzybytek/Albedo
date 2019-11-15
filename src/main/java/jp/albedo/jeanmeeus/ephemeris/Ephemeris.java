package jp.albedo.jeanmeeus.ephemeris;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.webapp.utils.Precision6Serializer;
import jp.albedo.webapp.utils.JulianDayToLocalDateTimeSerializer;
import jp.albedo.webapp.utils.RadiansToDegreesSerializer;

public class Ephemeris {

    @JsonSerialize(using = JulianDayToLocalDateTimeSerializer.class)
    final public double jde;

    final public AstronomicalCoordinates coordinates;

    @JsonSerialize(using = Precision6Serializer.class)
    final public double distanceFromSun;

    @JsonSerialize(using = Precision6Serializer.class)
    final public double distanceFromEarth;

    final public double apparentMagnitude;

    @JsonSerialize(using = RadiansToDegreesSerializer.class)
    public Double angularSize;

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double apparentMagnitude) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.apparentMagnitude = apparentMagnitude;
    }

    public Ephemeris(double jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double apparentMagnitude, Double angularSize) {
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
        return String.format("T=%.8fTD, Coords: %s, distSun=%.2f, distEarth=%.2f, mag=%.2fmag", this.jde, this.coordinates.toStringHighResolution(), this.distanceFromSun, this.distanceFromEarth, this.apparentMagnitude);
    }
}
