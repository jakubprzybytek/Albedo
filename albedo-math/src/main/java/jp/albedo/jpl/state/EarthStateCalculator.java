package jp.albedo.jpl.state;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SPKernel;
import jp.albedo.jpl.state.impl.PositionCalculator;

/**
 * JPL's Kernel based states calculator specific for Earth (true Earth, not Earth-Moon barycenter).
 */
public class EarthStateCalculator {

    private final double earthMoonMassRatio;

    private final PositionCalculator moonPositionCalculator;

    private final PositionCalculator earthBarycenterPositionCalculator;

    public EarthStateCalculator(SPKernel spKernel) throws JplException {
        this.earthMoonMassRatio = spKernel.getConstant(JplConstant.EarthMoonMassRatio);

        this.moonPositionCalculator = spKernel.getPositionCalculatorFor(JplBody.Moon);
        this.earthBarycenterPositionCalculator = spKernel.getPositionCalculatorFor(JplBody.EarthMoonBarycenter);
    }

    /**
     * Computes state for Earth for single time instant based on available Earth-Moon barycenter polynomial coefficients.
     *
     * @param jde
     * @return
     * @throws JplException
     */
    public RectangularCoordinates compute(double jde) throws JplException {
        final RectangularCoordinates moonGeocentricCoordsKm = this.moonPositionCalculator.compute(jde);
        final RectangularCoordinates earthBarycenterHeliocentricCoordsKm = this.earthBarycenterPositionCalculator.compute(jde);
        final double earthToEarthMoonBarycenterDistance = moonGeocentricCoordsKm.getDistance() / (1.0 + this.earthMoonMassRatio);
        final RectangularCoordinates earthMoonBarycenterGeocentricCoords = moonGeocentricCoordsKm.multiplyBy(earthToEarthMoonBarycenterDistance / moonGeocentricCoordsKm.getDistance());
        return earthBarycenterHeliocentricCoordsKm.subtract(earthMoonBarycenterGeocentricCoords);
    }

}
