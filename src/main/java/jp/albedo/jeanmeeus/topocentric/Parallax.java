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
     * Applies parallax correction to provided astronomical coordinates.
     *
     * @param observer Observer's location.
     * @param ut       UT time instant in Julian Days.
     * @param object   Object's astronomical coordinates to correct.
     * @param distance Object's distance to Earth in AU.
     * @return Parallax corrected astronomical coordinates of an object.
     */
    public static AstronomicalCoordinates correct(ObserverLocation observer, double ut, AstronomicalCoordinates object, double distance) {
        final double sinPi = Math.sin(Math.toRadians(8.794 / 3600.0)) / distance;

        final double phoSinPhiPrim = computeRhoSinPhiPrim(observer);
        final double phoCosPhiPrim = computeRhoCosPhiPrim(observer);

        final double objectLocalHourAngle = HourAngle.getLocal(SiderealTime.getGreenwichMean(ut), observer.coords.longitude, object.rightAscension);

        final double deltaRightAscension = Math.atan2(
                -phoCosPhiPrim * sinPi * Math.sin(objectLocalHourAngle),
                Math.cos(object.declination) - phoCosPhiPrim * sinPi * Math.cos(objectLocalHourAngle));
        final double newDeclination = Math.atan2(
                (Math.sin(object.declination) - phoSinPhiPrim * sinPi) * Math.cos(deltaRightAscension),
                Math.cos(object.declination) - phoCosPhiPrim * sinPi * Math.cos(objectLocalHourAngle));

        return new AstronomicalCoordinates(object.rightAscension + deltaRightAscension, newDeclination);
    }

    /**
     * @param observer Observer's location.
     * @return ρ*sin(φ')
     */
    static double computeRhoSinPhiPrim(ObserverLocation observer) {
        final double u = Math.atan(EARTH_POLAR_RADIUS / EARTH_EQUATORIAL_RADIUS * Math.tan(observer.coords.latitude));
        return EARTH_POLAR_RADIUS / EARTH_EQUATORIAL_RADIUS * Math.sin(u) + observer.height / (EARTH_EQUATORIAL_RADIUS * 1000.0) * Math.sin(observer.coords.latitude);
    }

    /**
     * @param observer Observer's location.
     * @return ρ*cos(φ')
     */
    static double computeRhoCosPhiPrim(ObserverLocation observer) {
        final double u = Math.atan(EARTH_POLAR_RADIUS / EARTH_EQUATORIAL_RADIUS * Math.tan(observer.coords.latitude));
        return Math.cos(u) + observer.height / (EARTH_EQUATORIAL_RADIUS * 1000.0) * Math.cos(observer.coords.latitude);
    }

}
