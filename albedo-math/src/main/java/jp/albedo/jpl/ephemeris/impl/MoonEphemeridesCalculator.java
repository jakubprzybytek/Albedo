package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jpl.JplConstantEnum;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SPKernel;
import jp.albedo.jpl.ephemeris.EphemeridesCalculator;
import jp.albedo.jpl.state.EarthStateCalculator;
import jp.albedo.jpl.state.StateCalculator;

import java.util.ArrayList;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for main Solar System objects.
 */
@Deprecated
public class MoonEphemeridesCalculator implements EphemeridesCalculator {

    private final double speedOfLight;

    private final double au;

    private final double earthMoonMassRatio;

    private final double moonEquatorialRadius;

    private final StateCalculator moonStateCalculator;

    private final EarthStateCalculator earthStateCalculator;

    public MoonEphemeridesCalculator(SPKernel spKernel) throws JplException {
        this.speedOfLight = spKernel.getConstant(JplConstantEnum.SpeedOfLight);
        this.au = spKernel.getConstant(JplConstantEnum.AU);
        this.earthMoonMassRatio = spKernel.getConstant(JplConstantEnum.EarthMoonMassRatio);

        this.moonEquatorialRadius = BodyInformation.Moon.equatorialRadius;

        this.moonStateCalculator = new StateCalculator(JplBody.Moon, spKernel);
        this.earthStateCalculator = new EarthStateCalculator(spKernel);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param jdes Array of JDEs.
     * @return
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    public List<Ephemeris> computeFor(List<Double> jdes) throws JplException {

        final List<Ephemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final RectangularCoordinates moonGeocentricCoordsKm = this.moonStateCalculator.compute(jde);
            final RectangularCoordinates earthHeliocentricCoords = this.earthStateCalculator.compute(jde);

            // light time correction
            final double lightTime = moonGeocentricCoordsKm.length() / this.speedOfLight;
            final double correctedJde = jde - lightTime / (24.0 * 60.0 * 60.0);

            final RectangularCoordinates pastMoonGeocentricCoordsKm = this.moonStateCalculator.compute(correctedJde);
            final RectangularCoordinates correctedEarthHeliocentricCoords = this.earthStateCalculator.compute(correctedJde);

            final RectangularCoordinates earthCorrectionKm = correctedEarthHeliocentricCoords.subtract(earthHeliocentricCoords);

            final RectangularCoordinates correctedMoonGeocentricCoordsKm = earthCorrectionKm.add(pastMoonGeocentricCoordsKm);
            final RectangularCoordinates correctedMoonGeocentricCooddsAu = correctedMoonGeocentricCoordsKm.divideBy(this.au);

            ephemerides.add(new Ephemeris(
                    jde,
                    AstronomicalCoordinates.fromRectangular(correctedMoonGeocentricCooddsAu),
                    0.0,
                    correctedMoonGeocentricCooddsAu.length(),
                    0.0,
                    0.0,
                    AngularSize.fromRadiusAndDistance(this.moonEquatorialRadius, correctedMoonGeocentricCoordsKm.length())
            ));
        }

        return ephemerides;
    }

}
