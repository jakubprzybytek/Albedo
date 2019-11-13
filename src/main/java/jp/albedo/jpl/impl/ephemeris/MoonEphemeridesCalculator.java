package jp.albedo.jpl.impl.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.Constant;
import jp.albedo.jpl.EphemeridesCalculator;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.SPKernel;
import jp.albedo.jpl.impl.PositionCalculator;

import java.util.ArrayList;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for main Solar System objects.
 */
public class MoonEphemeridesCalculator implements EphemeridesCalculator {

    final double au;

    private final double moonEquatorialRadius;

    private final PositionCalculator moonPositionCalculator;

    public MoonEphemeridesCalculator(SPKernel spKernel) throws JplException {
        this.au = spKernel.getConstant(Constant.AU);

        this.moonEquatorialRadius = BodyInformation.Moon.equatorialRadius;

        this.moonPositionCalculator = spKernel.getPositionCalculatorFor(JplBody.Moon);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param jdes Array of JDEs.
     * @return
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    public List<Ephemeris> computeEphemeridesForJds(List<Double> jdes) throws JplException {

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
                    AngularSize.fromRadiusAndDistance(this.moonEquatorialRadius, moonGeocentricCoordsKm.getDistance())
            ));
        }

        return ephemerides;
    }

}
