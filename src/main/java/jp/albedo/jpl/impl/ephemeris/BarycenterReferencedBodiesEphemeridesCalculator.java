package jp.albedo.jpl.impl.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.Constant;
import jp.albedo.jpl.EphemeridesCalculator;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
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

    private final double speedOfLight;

    private final double au;

    private final double earthMoonMassRatio;

    private final double bodyEquatorialRadius;

    private final PositionCalculator bodyPositionCalculator;

    private final PositionCalculator earthBarycenterPositionCalculator;

    private final PositionCalculator moonPositionCalculator;

    private final ApparentMagnitudeCalculator magnitudeCalculator;

    public BarycenterReferencedBodiesEphemeridesCalculator(JplBody body, SPKernel spKernel) throws JplException {
        this.speedOfLight = spKernel.getConstant(Constant.SpeedOfLight);
        this.au = spKernel.getConstant(Constant.AU);
        this.earthMoonMassRatio = spKernel.getConstant(Constant.EarthMoonMassRatio);

        this.bodyEquatorialRadius = BodyInformation.valueOf(body.name()).equatorialRadius;

        this.bodyPositionCalculator = spKernel.getPositionCalculatorFor(body);
        this.earthBarycenterPositionCalculator = spKernel.getPositionCalculatorFor(JplBody.EarthMoonBarycenter);
        this.moonPositionCalculator = spKernel.getPositionCalculatorFor(JplBody.Moon);

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
            final RectangularCoordinates earthBarycenterHeliocentricCoordsKm = this.earthBarycenterPositionCalculator.compute(jde);
            final RectangularCoordinates moonGeocentricCoordsKm = this.moonPositionCalculator.compute(jde);
            final double earthToEarthMoonBarycenterDistance = moonGeocentricCoordsKm.getDistance() / (1.0 + this.earthMoonMassRatio);
            final RectangularCoordinates earthFromEarthMoonBarycenterCoords = moonGeocentricCoordsKm.multiplyBy(earthToEarthMoonBarycenterDistance / moonGeocentricCoordsKm.getDistance());
            final RectangularCoordinates earthHeliocentricCoords = earthBarycenterHeliocentricCoordsKm.subtract(earthFromEarthMoonBarycenterCoords);

            final RectangularCoordinates bodyHeliocentricCoordsKm = this.bodyPositionCalculator.compute(jde);
            final RectangularCoordinates bodyGeocentricCoordsKm = bodyHeliocentricCoordsKm.subtract(earthHeliocentricCoords);

            // light time correction
            final double lightTime = bodyGeocentricCoordsKm.getDistance() / this.speedOfLight;
            final double correctedJde = jde - lightTime / (24.0 * 60.0 * 60.0);

            final RectangularCoordinates correctedBodyHeliocentricCoordsKm = this.bodyPositionCalculator.compute(correctedJde);
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
