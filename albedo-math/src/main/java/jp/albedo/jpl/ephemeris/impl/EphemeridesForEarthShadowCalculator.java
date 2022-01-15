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
 * JPL's Kernel based ephemerides calculator for main Solar System objects .
 */
public class EphemeridesForEarthShadowCalculator implements EphemeridesCalculator<Ephemeris> {

    private final double bodyEquatorialRadius;

    private final StateSolver earthToSunStateSolver;

    private final StateSolver earthToMoonStateSolver;

//    private final StateSolver sunToBodyStateSolver;

    public EphemeridesForEarthShadowCalculator(SpkKernelRepository kernel) throws JplException {
        this.earthToSunStateSolver = kernel.stateSolver()
                .target(JplBody.Sun)
                .observer(JplBody.Earth)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();
        this.earthToMoonStateSolver = kernel.stateSolver()
                .target(JplBody.Moon)
                .observer(JplBody.Earth)
                .build();
//        this.sunToBodyStateSolver = kernel.stateSolver()
//                .target(JplBody.Moon)
//                .observer(JplBody.Sun)
//                .build();
        this.bodyEquatorialRadius = BodyInformation.Earth.equatorialRadius;
    }

    /**
     * Computes ephemeris for given body and for multiple time instants.
     *
     * @param jdes Array of JDEs.
     * @return Ephemerides for provided parameters.
     * @throws JplException when cannot compute due to missing coefficients.
     */
    public List<Ephemeris> computeFor(List<Double> jdes) throws JplException {
        final List<Ephemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final double ephemerisSeconds = EphemerisSeconds.fromJde(jde);

            final RectangularCoordinates earthToSunCoordsKm = earthToSunStateSolver.positionFor(ephemerisSeconds);
            final RectangularCoordinates earthToEarthShadowCoordsKm = earthToSunCoordsKm.negate();
            final AstronomicalCoordinates earthToEarthShadowAstroCoords = AstronomicalCoordinates.fromRectangular(earthToEarthShadowCoordsKm);

            final RectangularCoordinates earthToMoonCoordsKm = earthToMoonStateSolver.positionFor(ephemerisSeconds);
            final RectangularCoordinates earthToMoonCoordsAu = earthToMoonCoordsKm.divideBy(JplConstant.AU);

            ephemerides.add(new Ephemeris(
                    jde,
                    earthToEarthShadowAstroCoords,
                    0.0, // not used
                    earthToMoonCoordsAu.length(),
                    Math.toRadians(180.0),
                    0.0,
                    AngularSize.fromRadiusAndDistance(this.bodyEquatorialRadius, earthToMoonCoordsKm.length())
            ));
        }

        return ephemerides;
    }

}
