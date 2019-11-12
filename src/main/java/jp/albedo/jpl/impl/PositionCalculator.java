package jp.albedo.jpl.impl;

import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.JPLException;
import jp.albedo.jpl.impl.math.ChebyshevPolynomialExpander;
import jp.albedo.jpl.impl.math.XYZCoefficients;

import java.util.Map;

public class PositionCalculator {

    final private Map<TimeSpan, XYZCoefficients> coefficientsByTime;

    private TimeSpan cachedTimeSpan;

    private XYZCoefficients cachedCoefficients;

    public PositionCalculator(Map<TimeSpan, XYZCoefficients> coefficientsByTime) {
        this.coefficientsByTime = coefficientsByTime;
    }

    public RectangularCoordinates compute(double jde) throws JPLException {

        if (this.cachedTimeSpan == null || !this.cachedTimeSpan.inside(jde)) {
            this.cachedTimeSpan = this.coefficientsByTime.keySet().stream()
                    .filter(ts -> ts.inside(jde))
                    .reduce((a, b) -> b) // find last
                    .orElseThrow(() -> new JPLException(String.format("Couldn't find coefficients for T=%f", jde)));

            this.cachedCoefficients = this.coefficientsByTime.get(this.cachedTimeSpan);
        }

        final double normalizedTime = this.cachedTimeSpan.normalizeFor(jde);

        return new RectangularCoordinates(
                new ChebyshevPolynomialExpander(this.cachedCoefficients.x).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(this.cachedCoefficients.y).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(this.cachedCoefficients.z).computeFor(normalizedTime)
        );
    }

}
