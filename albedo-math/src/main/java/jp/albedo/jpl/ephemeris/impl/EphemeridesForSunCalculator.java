package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.EphemeridesCalculator;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;

import java.util.ArrayList;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for Sun for observer on Earth.
 */
public class EphemeridesForSunCalculator implements EphemeridesCalculator<Ephemeris> {

    private final StateSolver earthToBodyStateSolver;

    public EphemeridesForSunCalculator(SpkKernelRepository kernel) throws JplException {
        this.earthToBodyStateSolver = kernel.stateSolver()
                .target(JplBody.Sun)
                .observer(JplBody.Earth)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();
    }

    /**
     * Computes ephemeris for Sun.
     *
     * @param jdes Array of JDEs.
     * @return Ephemerides for provided parameters.
     * @throws JplException when cannot compute due to missing coefficients.
     */
    public List<Ephemeris> computeFor(List<Double> jdes) throws JplException {
        final List<Ephemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final double ephemerisSeconds = EphemerisSeconds.fromJde(jde);

            final RectangularCoordinates earthToBodyCoordsKm = earthToBodyStateSolver.positionFor(ephemerisSeconds);
            final RectangularCoordinates earthToBodyCoordsAu = earthToBodyCoordsKm.divideBy(JplConstant.AU);

            final AstronomicalCoordinates earthToBodyAstroCoords = AstronomicalCoordinates.fromRectangular(earthToBodyCoordsKm);

            ephemerides.add(new Ephemeris(
                    jde,
                    earthToBodyAstroCoords,
                    0.0,
                    earthToBodyCoordsAu.length(),
                    0.0,
                    -26.74,
                    AngularSize.fromRadiusAndDistance(BodyInformation.Sun.equatorialRadius, earthToBodyCoordsKm.length())
            ));
        }

        return ephemerides;
    }

}
