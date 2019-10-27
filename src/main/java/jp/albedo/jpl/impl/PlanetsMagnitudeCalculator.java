package jp.albedo.jpl.impl;

import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.utils.Polynomial;
import org.apache.commons.math3.util.MathUtils;
import org.apache.commons.math3.util.Precision;

public class PlanetsMagnitudeCalculator {

    public static double compute(JplBody body, RectangularCoordinates heliocentricCoords, RectangularCoordinates geocentricCoords) {

        final double distancesProduct = heliocentricCoords.getDistance() * geocentricCoords.getDistance();
        final double phaseAngle = Math.toDegrees(MathUtils.normalizeAngle(Math.acos(
                (geocentricCoords.x * heliocentricCoords.x
                        + geocentricCoords.y * heliocentricCoords.y
                        + geocentricCoords.z * heliocentricCoords.z)
                        / distancesProduct), Math.PI));

        switch (body) {
            case Mercury:
                return Precision.round(5 * Math.log10(distancesProduct) + Polynomial.compute(phaseAngle, -0.42, 0.038, -0.000273, 0.000002), 2);
            case Venus:
                return Precision.round(5 * Math.log10(distancesProduct) + Polynomial.compute(phaseAngle, -4.40, 0.0009, 0.000239, 0.00000065), 2);
            case Mars:
                return Precision.round(-1.52 + 5 * Math.log10(distancesProduct) + 0.016 * phaseAngle, 2);
            case Jupiter:
                return Precision.round(-9.40 + 5 * Math.log10(distancesProduct) + 0.005 * phaseAngle, 2);
            case Saturn:
                return 0.0; // better to return fake value rather than incorrect one
                //return Precision.round(-8.88 + 5 * Math.log10(distancesProduct), 2); // FixMe: use delta U and B
            case Uranus:
                return Precision.round(-7.19 + 5 * Math.log10(distancesProduct), 2);
            case Neptune:
                return Precision.round(-6.87 + 5 * Math.log10(distancesProduct), 2);
        }

        throw new RuntimeException("Cannot compute magnitude for: " + body);
    }

}
