package jp.albedo.jpl.impl.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.Constant;
import jp.albedo.jpl.EphemeridesCalculator;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.SPKernel;
import jp.albedo.jpl.impl.PositionCalculator;
import jp.albedo.jpl.impl.magnitude.ApparentMagnitudeCalculator;
import jp.albedo.jpl.impl.magnitude.MagnitudeCalculatorFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for main Solar System objects.
 */
public class BarycenterReferencedBodiesEphemeridesCalculator implements EphemeridesCalculator {

    final private SPKernel spKernel;

    private final double au;

    private final double earthMoonMassRatio;

    public BarycenterReferencedBodiesEphemeridesCalculator(SPKernel spKernel) {
        this.spKernel = spKernel;
        this.au = this.spKernel.getConstant(Constant.AU);
        this.earthMoonMassRatio = this.spKernel.getConstant(Constant.EarthMoonMassRatio);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param body JPL body.
     * @param jdes Array of JDEs.
     * @return Ephemerides for provided parameters.
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    public List<Ephemeris> computeEphemeridesForJds(JplBody body, List<Double> jdes) throws JplException {
        final PositionCalculator bodyPositionCalculator = this.spKernel.getPositionCalculatorFor(body);
        final PositionCalculator earthBarycenterPositionCalculator = this.spKernel.getPositionCalculatorFor(JplBody.EarthMoonBarycenter);
        final PositionCalculator moonPositionCalculator = this.spKernel.getPositionCalculatorFor(JplBody.Moon);

        final ApparentMagnitudeCalculator magnitudeCalculator = MagnitudeCalculatorFactory.getFor(body);

        final List<Ephemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final RectangularCoordinates bodyHeliocentricCoords = bodyPositionCalculator.compute(jde);
            final RectangularCoordinates bodyHeliocentricCoordsAu = bodyHeliocentricCoords.divideBy(this.au);
            final RectangularCoordinates earthBarycenterHeliocentricCoords = earthBarycenterPositionCalculator.compute(jde);
            final RectangularCoordinates moonGeocentricCoords = moonPositionCalculator.compute(jde);

            final double earthToEarthMoonBarycenterDistance = moonGeocentricCoords.getDistance() / (1.0 + this.earthMoonMassRatio);
            final RectangularCoordinates earthFromEarthMoonBarycenterCoords = moonGeocentricCoords.multiplyBy(earthToEarthMoonBarycenterDistance / moonGeocentricCoords.getDistance());
            final RectangularCoordinates earthHeliocentricCoords = earthBarycenterHeliocentricCoords.subtract(earthFromEarthMoonBarycenterCoords);

            final RectangularCoordinates bodyGeocentricCoords = bodyHeliocentricCoords.subtract(earthHeliocentricCoords);
            final RectangularCoordinates bodyGeocentricCoordsAu = bodyGeocentricCoords.divideBy(this.au);

            ephemerides.add(new Ephemeris(
                    jde,
                    AstronomicalCoordinates.fromRectangular(bodyGeocentricCoords),
                    bodyHeliocentricCoordsAu.getDistance(),
                    bodyGeocentricCoordsAu.getDistance(),
                    magnitudeCalculator.compute(bodyHeliocentricCoordsAu, bodyGeocentricCoordsAu),
                    AngularSize.fromRadiusAndDistance(BodyInformation.valueOf(body.name()).equatorialRadius, bodyGeocentricCoords.getDistance())
            ));
        }

        return ephemerides;
    }

}
