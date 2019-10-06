package jp.albedo.jpl;

import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.impl.PositionCalculator;
import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;

import java.util.List;
import java.util.Map;

public class StateCalculator {

    private SPKernel spKernel;

    public StateCalculator(SPKernel spKernel) {
        this.spKernel = spKernel;
    }

    public RectangularCoordinates computeForJd(Body body, double jde) throws JPLException {
        Map<TimeSpan, List<XYZCoefficients>> coefficientsByTime = this.spKernel.getCoefficientsForBody(body)
                .orElseThrow(() -> new JPLException(String.format("No coefficients for %s found in SPKernel", body)));

        PositionCalculator positionCalculator = new PositionCalculator(coefficientsByTime);
        return positionCalculator.compute(jde);
    }

}
