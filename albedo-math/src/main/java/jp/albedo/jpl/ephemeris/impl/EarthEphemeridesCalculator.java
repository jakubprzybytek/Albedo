package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.common.ephemeris.Elongation;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.common.magnitude.ApparentMagnitudeCalculator;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.EphemeridesCalculator;
import jp.albedo.jpl.ephemeris.MagnitudeCalculatorFactory;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;

import java.util.ArrayList;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for main Solar System objects .
 */
public class EarthEphemeridesCalculator implements EphemeridesCalculator {

    private final double bodyEquatorialRadius;

    private final StateSolver earthToBodyStateSolver;

    private final StateSolver earthToSunStateSolver;

    private final StateSolver sunToBodyStateSolver;

    private final ApparentMagnitudeCalculator magnitudeCalculator;

    public EarthEphemeridesCalculator(SpkKernelRepository kernel, JplBody body) throws JplException {
        this.earthToBodyStateSolver = kernel.stateSolver()
                .target(body)
                .observer(JplBody.Earth)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();
        this.earthToSunStateSolver = kernel.stateSolver()
                .target(JplBody.Sun)
                .observer(JplBody.Earth)
                .build();
        this.sunToBodyStateSolver = kernel.stateSolver()
                .target(body)
                .observer(JplBody.Sun)
                .build();
        this.magnitudeCalculator = MagnitudeCalculatorFactory.getFor(body);
        this.bodyEquatorialRadius = BodyInformation.valueOf(body.name()).equatorialRadius;
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

            final RectangularCoordinates earthToBodyCoordsKm = earthToBodyStateSolver.positionFor(ephemerisSeconds);
            final RectangularCoordinates earthToSunCoordsKm = earthToSunStateSolver.positionFor(ephemerisSeconds);
            final RectangularCoordinates sunToBodyCoordsKm = sunToBodyStateSolver.positionFor(ephemerisSeconds);

            final RectangularCoordinates earthToBodyCoordsAu = earthToBodyCoordsKm.divideBy(JplConstant.AU);
            final RectangularCoordinates sunToBodyCoordsAu = sunToBodyCoordsKm.divideBy(JplConstant.AU);

            final AstronomicalCoordinates earthToBodyAstroCoords = AstronomicalCoordinates.fromRectangular(earthToBodyCoordsKm);

            ephemerides.add(new Ephemeris(
                    jde,
                    earthToBodyAstroCoords,
                    sunToBodyCoordsAu.length(),
                    earthToBodyCoordsAu.length(),
                    Elongation.between(
                            AstronomicalCoordinates.fromRectangular(earthToSunCoordsKm),
                            earthToBodyAstroCoords),
                    this.magnitudeCalculator.compute(sunToBodyCoordsAu, earthToBodyCoordsAu),
                    AngularSize.fromRadiusAndDistance(this.bodyEquatorialRadius, earthToBodyCoordsKm.length())
            ));
        }

        return ephemerides;
    }

}
