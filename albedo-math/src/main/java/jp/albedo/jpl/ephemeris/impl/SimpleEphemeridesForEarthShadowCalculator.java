package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.ephemeris.SimpleEphemeris;
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
 * JPL's Kernel based ephemerides calculator for main Solar System objects .
 */
public class SimpleEphemeridesForEarthShadowCalculator implements EphemeridesCalculator<SimpleEphemeris> {

    private final StateSolver earthToBodyStateSolver;

    public SimpleEphemeridesForEarthShadowCalculator(SpkKernelRepository kernel) throws JplException {
        this.earthToBodyStateSolver = kernel.stateSolver()
                .target(JplBody.Sun)
                .observer(JplBody.Earth)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();
    }

    /**
     * Computes ephemeris for given body and for multiple time instants.
     *
     * @param jdes Array of JDEs.
     * @return Ephemerides for provided parameters.
     * @throws JplException when cannot compute due to missing coefficients.
     */
    public List<SimpleEphemeris> computeFor(List<Double> jdes) throws JplException {
        final List<SimpleEphemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final double ephemerisSeconds = EphemerisSeconds.fromJde(jde);

            final RectangularCoordinates earthToSunCoordsKm = earthToBodyStateSolver.positionFor(ephemerisSeconds);
            final RectangularCoordinates earthToShadowCoordsKm = earthToSunCoordsKm.negate();
            final AstronomicalCoordinates earthToShadowsAstroCoords = AstronomicalCoordinates.fromRectangular(earthToShadowCoordsKm);

            ephemerides.add(new SimpleEphemeris(
                    jde,
                    earthToShadowsAstroCoords,
                    earthToShadowCoordsKm.length() / JplConstant.AU)); // distance is clearly wrong
        }

        return ephemerides;
    }

}