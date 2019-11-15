package jp.albedo.jeanmeeus.topocentric;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.jeanmeeus.sidereal.HourAngle;
import jp.albedo.jeanmeeus.sidereal.SiderealTime;

/**
 * Based on Jean Meeus' 'Astronomical Algorithms':
 * Chapter 11, 'The Earth's Globe'
 * Chapter 40, 'Correction for Parallax'
 */
public class Parallax {

    private static final double EARTH_EQUATORIAL_RADIUS = 6378.14;

    private static final double EARTH_POLAR_RADIUS = 6356.755;

    /**
     * @param distance Object's distance to Earth in AU.
     */
    public static AstronomicalCoordinates correct(GeographicCoordinates observer, double height, double ut, AstronomicalCoordinates object, double distance) {
        final double sinPi = Math.sin(Math.toRadians(8.794 / 3600.0)) / distance;

        final double phoSinPhiPrim = computeRhoSinPhiPrim(observer.latitude, height);
        final double phoCosPhiPrim = computeRhoCosPhiPrim(observer.latitude, height);

        final double objectLocalHourAngle = HourAngle.getLocal(SiderealTime.getGreenwichMean(ut), observer.longitude, object.rightAscension);

        final double deltaRightAscension = Math.atan2(
                -phoCosPhiPrim * sinPi * Math.sin(objectLocalHourAngle),
                Math.cos(object.declination) - phoCosPhiPrim * sinPi * Math.cos(objectLocalHourAngle));
        final double newDeclination = Math.atan2(
                (Math.sin(object.declination) - phoSinPhiPrim * sinPi) * Math.cos(deltaRightAscension),
                Math.cos(object.declination) - phoCosPhiPrim * sinPi * Math.cos(objectLocalHourAngle));

        return new AstronomicalCoordinates(object.rightAscension + deltaRightAscension, newDeclination);
    }

    /**
     * @param geographicalLatitude Observer's geographical latitude in radians.
     * @param height               Observer's height above sea level in meters.
     * @return
     */
    static double computeRhoSinPhiPrim(double geographicalLatitude, double height) {
        final double u = Math.atan(EARTH_POLAR_RADIUS / EARTH_EQUATORIAL_RADIUS * Math.tan(geographicalLatitude));
        return EARTH_POLAR_RADIUS / EARTH_EQUATORIAL_RADIUS * Math.sin(u) + height / (EARTH_EQUATORIAL_RADIUS * 1000.0) * Math.sin(geographicalLatitude);
    }

    /**
     * @param geographicalLatitude Observer's geographical latitude in radians.
     * @param height               Observer's height above sea level in meters.
     * @return
     */
    static double computeRhoCosPhiPrim(double geographicalLatitude, double height) {
        final double u = Math.atan(EARTH_POLAR_RADIUS / EARTH_EQUATORIAL_RADIUS * Math.tan(geographicalLatitude));
        return Math.cos(u) + height / (EARTH_EQUATORIAL_RADIUS * 1000.0) * Math.cos(geographicalLatitude);
    }

}
