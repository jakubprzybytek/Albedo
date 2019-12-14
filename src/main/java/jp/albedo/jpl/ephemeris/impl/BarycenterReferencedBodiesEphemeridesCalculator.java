package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.Constant;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.SPKernel;
import jp.albedo.common.magnitude.ApparentMagnitudeCalculator;
import jp.albedo.jpl.ephemeris.EphemeridesCalculator;
import jp.albedo.jpl.ephemeris.MagnitudeCalculatorFactory;
import jp.albedo.jpl.state.EarthStateCalculator;
import jp.albedo.jpl.state.StateCalculator;

import java.util.ArrayList;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for main Solar System objects.
 */
public class BarycenterReferencedBodiesEphemeridesCalculator implements EphemeridesCalculator {

    private final double speedOfLight;

    private final double au;

    private final double bodyEquatorialRadius;

    private final StateCalculator bodyStateCalculator;

    private final EarthStateCalculator earthStateCalculator;

    private final ApparentMagnitudeCalculator magnitudeCalculator;

    public BarycenterReferencedBodiesEphemeridesCalculator(JplBody body, SPKernel spKernel) throws JplException {
        this.speedOfLight = spKernel.getConstant(Constant.SpeedOfLight);
        this.au = spKernel.getConstant(Constant.AU);

        this.bodyEquatorialRadius = BodyInformation.valueOf(body.name()).equatorialRadius;

        this.bodyStateCalculator = new StateCalculator(body, spKernel);
        this.earthStateCalculator = new EarthStateCalculator(spKernel);

        this.magnitudeCalculator = MagnitudeCalculatorFactory.getFor(body);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param jdes Array of JDEs.
     * @return Ephemerides for provided parameters.
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    public List<Ephemeris> computeEphemeridesForJds(List<Double> jdes) throws JplException {

        final List<Ephemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final RectangularCoordinates earthHeliocentricCoords = this.earthStateCalculator.compute(jde);
            final RectangularCoordinates bodyHeliocentricCoordsKm = this.bodyStateCalculator.compute(jde);
            final RectangularCoordinates bodyGeocentricCoordsKm = bodyHeliocentricCoordsKm.subtract(earthHeliocentricCoords);

            // light time correction
            final double lightTime = bodyGeocentricCoordsKm.getDistance() / this.speedOfLight;
            final double correctedJde = jde - lightTime / (24.0 * 60.0 * 60.0);

            final RectangularCoordinates correctedBodyHeliocentricCoordsKm = this.bodyStateCalculator.compute(correctedJde);
            final RectangularCoordinates correctedBodyGeocentricCoordsKm = correctedBodyHeliocentricCoordsKm.subtract(earthHeliocentricCoords);

            final RectangularCoordinates correctedBodyHeliocentricCoordsAu = correctedBodyHeliocentricCoordsKm.divideBy(this.au);
            final RectangularCoordinates correctedBodyGeocentricCoordsAu = correctedBodyGeocentricCoordsKm.divideBy(this.au);

            ephemerides.add(new Ephemeris(
                    jde,
                    AstronomicalCoordinates.fromRectangular(correctedBodyGeocentricCoordsKm),
                    correctedBodyHeliocentricCoordsAu.getDistance(),
                    correctedBodyGeocentricCoordsAu.getDistance(),
                    this.magnitudeCalculator.compute(correctedBodyHeliocentricCoordsAu, correctedBodyGeocentricCoordsAu),
                    AngularSize.fromRadiusAndDistance(this.bodyEquatorialRadius, correctedBodyGeocentricCoordsKm.getDistance())
            ));
        }

        return ephemerides;
    }

}
