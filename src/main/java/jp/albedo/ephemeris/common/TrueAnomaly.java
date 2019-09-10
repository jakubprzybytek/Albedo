package jp.albedo.ephemeris.common;

public class TrueAnomaly {

    /**
     *
     * @param eccentricAnomaly in radians.
     * @param eccentricity
     * @return
     */
    static public double fromEccentricAnomaly(double eccentricAnomaly, double eccentricity) {
        return 2 * Math.atan(Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(eccentricAnomaly / 2));
    }

}
