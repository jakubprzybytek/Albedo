package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;

import java.util.Map;

public class PositionCalculator {

    final private Map<TimeSpan, XYZCoefficients> coefficientsByTime;

    private TimeSpan cachedTimeSpan;

    private XYZCoefficients cachedCoefficients;

    public PositionCalculator(Map<TimeSpan, XYZCoefficients> coefficientsByTime) {
        this.coefficientsByTime = coefficientsByTime;
    }

    public RectangularCoordinates compute(double jde) throws JplException {

        if (this.cachedTimeSpan == null || !this.cachedTimeSpan.inside(jde)) {
            this.cachedTimeSpan = this.coefficientsByTime.keySet().stream()
                    .filter(ts -> ts.inside(jde))
                    .reduce((a, b) -> b) // find last
                    .orElseThrow(() -> new JplException(String.format("Couldn't find coefficients for T=%f", jde)));

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
