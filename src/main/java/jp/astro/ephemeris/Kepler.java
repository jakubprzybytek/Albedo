package jp.astro.ephemeris;

public class Kepler {

    /**
     *
     * @param meanAnomaly in radians.
     * @param eccentricity
     * @return Eccentric anomaly for given mean anomaly in radians.
     */
    static public double resolve(double meanAnomaly, double eccentricity) {
        return resolve(meanAnomaly, eccentricity, 53);
    }

    /**
     *
     * @param meanAnomaly in radians.
     * @param eccentricity
     * @param iterations
     * @return Eccentric anomaly for given mean anomaly in radians.
     */
    static private double resolve(double meanAnomaly, double eccentricity, int iterations) {

        double normalizedMeanAnomaly = meanAnomaly;

        double F = normalizedMeanAnomaly >= 0 ? 1 : -1;
        normalizedMeanAnomaly = Math.abs(normalizedMeanAnomaly) / (2 * Math.PI);
        normalizedMeanAnomaly = (normalizedMeanAnomaly - Math.floor(normalizedMeanAnomaly)) * 2 * Math.PI * F;
        if (normalizedMeanAnomaly < 0) {
            normalizedMeanAnomaly += 2 * Math.PI;
        }
        F = 1;
        if (normalizedMeanAnomaly > Math.PI) {
            F = -1;
            normalizedMeanAnomaly = 2 * Math.PI - normalizedMeanAnomaly;
        }

        double E0 = Math.PI / 2;
        double scale = Math.PI / 4;

        for (int i = 0; i < iterations; i++) {
            final double M1 = E0 - eccentricity * Math.sin(E0);
            E0 += normalizedMeanAnomaly > M1 ? scale : -scale;
            scale /= 2;
        }

        return E0 * F;
    }
}
