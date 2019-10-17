package jp.albedo.webapp.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import org.apache.commons.math3.util.Precision;

import java.time.LocalDateTime;

public class RestEphemeris {

    private LocalDateTime jde;

    private AstronomicalCoordinates coordinates;

    private double distanceFromSun;

    private double distanceFromEarth;

    private double apparentMagnitude;

    private RestEphemeris(LocalDateTime jde, AstronomicalCoordinates coordinates, double distanceFromSun, double distanceFromEarth, double apparentMagnitude) {
        this.jde = jde;
        this.coordinates = coordinates;
        this.distanceFromSun = distanceFromSun;
        this.distanceFromEarth = distanceFromEarth;
        this.apparentMagnitude = apparentMagnitude;
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
                ephemeris.apparentMagnitude);
    }

    public LocalDateTime getJde() {
        return jde;
    }

    public AstronomicalCoordinates getCoordinates() {
        return coordinates;
    }

    public double getDistanceFromSun() {
        return distanceFromSun;
    }

    public double getDistanceFromEarth() {
        return distanceFromEarth;
    }

    public double getApparentMagnitude() {
        return apparentMagnitude;
    }
}
