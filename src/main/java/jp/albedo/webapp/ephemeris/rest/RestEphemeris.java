package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import org.apache.commons.math3.util.Precision;

import java.time.LocalDateTime;

public class RestEphemeris {

    @JsonProperty
    private LocalDateTime jde;

    @JsonProperty
    private AstronomicalCoordinates coordinates;

    @JsonProperty
    private double distanceFromSun;

    @JsonProperty
    private double distanceFromEarth;

    @JsonProperty
    private double apparentMagnitude;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Double angularSize;

    private RestEphemeris(LocalDateTime jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double apparentMagnitude, Double angularSize) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.apparentMagnitude = apparentMagnitude;
        this.angularSize = angularSize;
    }

    public static RestEphemeris fromEphemeris(Ephemeris ephemeris) {
        AstronomicalCoordinates coordsInDegrees = new AstronomicalCoordinates(
                Math.toDegrees(ephemeris.coordinates.rightAscension),
                Math.toDegrees(ephemeris.coordinates.declination));

        return new RestEphemeris(
                JulianDay.toDateTime(ephemeris.jde),
                coordsInDegrees,
                Precision.round(ephemeris.distanceFromSun, 6),
                Precision.round(ephemeris.distanceFromEarth, 6),
                ephemeris.apparentMagnitude,
                ephemeris.angularSize != null ? Precision.round(Math.toDegrees(ephemeris.angularSize), 6) : null);
    }

}
