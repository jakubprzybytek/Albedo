package jp.albedo.jpl.impl;

import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.JPLException;
import jp.albedo.jpl.math.ChebyshevPolynomialExpander;
import jp.albedo.jpl.math.XYZCoefficients;

import java.util.Map;

public class PositionCalculator {

    private Map<TimeSpan, XYZCoefficients> coefficientsByTime;

    public PositionCalculator(Map<TimeSpan, XYZCoefficients> coefficientsByTime) {
        this.coefficientsByTime = coefficientsByTime;
    }

    public RectangularCoordinates compute(double jde) throws JPLException {
        final TimeSpan timeSpan = this.coefficientsByTime.keySet().stream()
                .filter(ts -> ts.inside(jde))
                .findFirst()
                .orElseThrow(() -> new JPLException(String.format("Couldn't find coefficients for T=%f", jde)));

        final XYZCoefficients coefficients = this.coefficientsByTime.get(timeSpan);

        final double normalizedTime = timeSpan.normalizeFor(jde);

        return new RectangularCoordinates(
                new ChebyshevPolynomialExpander(coefficients.x).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(coefficients.y).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(coefficients.z).computeFor(normalizedTime)
        );
    }

}
