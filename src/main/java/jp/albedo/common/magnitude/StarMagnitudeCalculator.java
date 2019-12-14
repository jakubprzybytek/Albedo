package jp.albedo.common.magnitude;

import jp.albedo.common.Parsec;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import org.apache.commons.math3.util.Precision;

/**
 * Apparent magnitude calculator based on absolute magnitude and the distance.
 * <p>
 * Suitable for all stars, including Sun.
 */
public class StarMagnitudeCalculator implements ApparentMagnitudeCalculator {

    final private double absoluteMagnitude;

    /**
     * @param absoluteMagnitude Absolute Magnitude (10 parsec based).
     */
    public StarMagnitudeCalculator(double absoluteMagnitude) {
        this.absoluteMagnitude = absoluteMagnitude;
    }

    /**
     * Computes Apparent Magnitude for a star with given Absolute Magnitude and in given distance.
     *
     * @param heliocentricCoords Not used.
     * @param geocentricCoords   Equatorial geocentric coordinates for the body in AU.
     * @return Apparent Magnitude.
     */
    @Override
    public double compute(RectangularCoordinates heliocentricCoords, RectangularCoordinates geocentricCoords) {
        return Precision.round(absoluteMagnitude - 5.0 + 5.0 * Math.log10(Parsec.fromAU(geocentricCoords.getDistance())), 2);
    }
}
