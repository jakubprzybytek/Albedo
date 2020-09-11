package jp.albedo.jeanmeeus.sidereal;

import org.apache.commons.math3.util.MathUtils;

/**
 * Based on Jean Meeus' 'Astronomical Algorithms', Chapter 12 'Sidereal Time at Greenwich'
 */
public class SiderealTime {

    /**
     * Return Mean Greenwich Sidereal time for given UT.
     *
     * @param ut UT instant in Julian Days.
     * @return Sidereal time in radians. Normalized to <0,2*Pi).
     */
    public static double getGreenwichMean(double ut) {
        return MathUtils.normalizeAngle(Math.toRadians(computeGreenwichMeanInDegrees(ut)), Math.PI);
    }

    /**
     * Return mean local Sidereal time for given UT and longitude on Earth.
     *
     * @param ut UT instant in Julian Days.
     * @param longitude Longitude of the observer in radians. Positive westwards.
     * @return Sidereal time in radians. Normalized to <0,2*Pi).
     */
    public static double getLocalMean(double ut, double longitude) {
        return MathUtils.normalizeAngle(Math.toRadians(computeGreenwichMeanInDegrees(ut)) - longitude, Math.PI);
    }

    private static double computeGreenwichMeanInDegrees(double ut) {
        final double T = (ut - 2451545.0) / 36525.0;
        double result = 280.46061837 + 360.98564736629 * (ut - 2451545.0);
        final double tSquare = T * T;
        result += 0.000387933 * tSquare;
        return result - (tSquare * T) / 38710000.0;
    }

}
