package jp.albedo.jeanmeeus.ephemeris.impl;

import jp.albedo.jeanmeeus.ephemeris.common.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import org.apache.commons.math3.util.MathUtils;
import org.apache.commons.math3.util.Precision;

public class MagnitudeCalculator {

    final private MagnitudeParameters magnitudeParameters;

    public MagnitudeCalculator(MagnitudeParameters magnitudeParameters) {
        this.magnitudeParameters = magnitudeParameters;
    }

    public double compute(RectangularCoordinates heliocentricCoords, RectangularCoordinates geocentricCoords) {

        final double distancesProduct = heliocentricCoords.getDistance() * geocentricCoords.getDistance();

        // Body apparent magnitude
        final double phaseAngle = MathUtils.normalizeAngle(Math.acos(
                (geocentricCoords.x * heliocentricCoords.x
                        + geocentricCoords.y * heliocentricCoords.y
                        + geocentricCoords.z * heliocentricCoords.z)
                        / distancesProduct), Math.PI);

        final double phi1 = Math.exp(-3.33 * Math.pow(Math.tan(phaseAngle / 2), 0.63));
        final double phi2 = Math.exp(-1.87 * Math.pow(Math.tan(phaseAngle / 2), 1.22));

        // valid only for phase angle between 0 and 120 deg
        return Precision.round(magnitudeParameters.H
                + 5 * Math.log10(distancesProduct)
                - 2.5 * Math.log10((1 - magnitudeParameters.G) * phi1 + magnitudeParameters.G * phi2), 2);
    }
}
