package jp.albedo.jpl.impl.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.Constant;
import jp.albedo.jpl.EphemeridesCalculator;
import jp.albedo.jpl.JPLException;
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
public class MoonEphemeridesCalculator implements EphemeridesCalculator {

    final private SPKernel spKernel;

    final double au;

    public MoonEphemeridesCalculator(SPKernel spKernel) {
        this.spKernel = spKernel;
        this.au = this.spKernel.getConstant(Constant.AU);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param body
     * @param jdes Array of JDEs.
     * @return
     * @throws JPLException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    public List<Ephemeris> computeEphemeridesForJds(JplBody body, List<Double> jdes) throws JPLException {
        final PositionCalculator moonPositionCalculator = this.spKernel.getPositionCalculatorFor(JplBody.Moon);

        final ApparentMagnitudeCalculator magnitudeCalculator = MagnitudeCalculatorFactory.getFor(body);

        final List<Ephemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final RectangularCoordinates moonGeocentricCoordsKm = moonPositionCalculator.compute(jde);
            final RectangularCoordinates moonGeocentricCooddsAu = moonGeocentricCoordsKm.divideBy(this.au);

            ephemerides.add(new Ephemeris(
                    jde,
                    AstronomicalCoordinates.fromRectangular(moonGeocentricCooddsAu),
                    0.0,
                    moonGeocentricCooddsAu.getDistance(),
                    0.0,
                    AngularSize.fromRadiusAndDistance(BodyInformation.valueOf(body.name()).equatorialRadius, moonGeocentricCoordsKm.getDistance())
            ));
        }

        return ephemerides;
    }

}
