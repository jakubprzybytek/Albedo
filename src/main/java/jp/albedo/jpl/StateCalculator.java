package jp.albedo.jpl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.impl.PositionCalculator;
import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * JPL's Kernel based states calculator for main Solar System objects.
 */
public class StateCalculator {

    final private SPKernel spKernel;

    final double au;

    final double earthMoonMassRatio;

    public StateCalculator(SPKernel spKernel) {
        this.spKernel = spKernel;
        this.au = this.spKernel.getConstant(Constant.AU);
        this.earthMoonMassRatio = this.spKernel.getConstant(Constant.EarthMoonMassRatio);
    }

    /**
     * Computes state for single time instant.
     *
     * @param body
     * @param jde
     * @return
     * @throws JPLException
     */
    public RectangularCoordinates computeForJd(Body body, double jde) throws JPLException {
        Map<TimeSpan, XYZCoefficients> coefficientsByTime = this.spKernel.getCoefficientsForBody(body)
                .orElseThrow(() -> new JPLException(String.format("No coefficients for %s found in SPKernel", body)));

        PositionCalculator positionCalculator = new PositionCalculator(coefficientsByTime);
        Double au = this.spKernel.getConstant(Constant.AU);

        final RectangularCoordinates coordinates = positionCalculator.compute(jde);
        return coordinates.divideBy(au);
    }

    /**
     * Computes Earth based ephemeris for given body and for single time instant.
     *
     * @param body
     * @param jde  Time instant.
     * @return
     * @throws JPLException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    public Ephemeris computeEphemeridesForJds(Body body, double jde) throws JPLException {
        return computeEphemeridesForJds(body, Arrays.asList(jde)).get(0);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param body
     * @param jdes Array of JDEs.
     * @return
     * @throws JPLException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    public List<Ephemeris> computeEphemeridesForJds(Body body, List<Double> jdes) throws JPLException {
        final Map<TimeSpan, XYZCoefficients> bodyCoefficients = this.spKernel.getCoefficientsForBody(body)
                .orElseThrow(() -> new JPLException(String.format("No coefficients for %s found in SPKernel", body)));

        final Map<TimeSpan, XYZCoefficients> earthBarycenterCoefficients = this.spKernel.getCoefficientsForBody(Body.EarthMoonBarycenter)
                .orElseThrow(() -> new JPLException(String.format("No coefficients for %s found in SPKernel", Body.EarthMoonBarycenter)));

        final Map<TimeSpan, XYZCoefficients> moonCoefficients = this.spKernel.getCoefficientsForBody(Body.Moon)
                .orElseThrow(() -> new JPLException(String.format("No coefficients for %s found in SPKernel", Body.Moon)));

        final PositionCalculator bodyPositionCalculator = new PositionCalculator(bodyCoefficients);
        final PositionCalculator earthBarycenterPositionCalculator = new PositionCalculator(earthBarycenterCoefficients);
        final PositionCalculator moonPositionCalculator = new PositionCalculator(moonCoefficients);

        final List<Ephemeris> ephemerides = new ArrayList<>(jdes.size());

        for (double jde : jdes) {
            final RectangularCoordinates bodyHeliocentricCoords = bodyPositionCalculator.compute(jde);
            final RectangularCoordinates earthBarycenterHeliocentricCoords = earthBarycenterPositionCalculator.compute(jde);
            final RectangularCoordinates moonGeocentricCoords = moonPositionCalculator.compute(jde);

            final double earthToEarthMoonBarycenterDistance = moonGeocentricCoords.getDistance() / (1.0 + this.earthMoonMassRatio);
            final RectangularCoordinates earthFromEarthMoonBarycenterCoords = moonGeocentricCoords.multiplyBy(earthToEarthMoonBarycenterDistance / moonGeocentricCoords.getDistance());
            final RectangularCoordinates earthHeliocentricCoords = earthBarycenterHeliocentricCoords.subtract(earthFromEarthMoonBarycenterCoords);

            final RectangularCoordinates bodyGeocentricCoords = bodyHeliocentricCoords.subtract(earthHeliocentricCoords);

            ephemerides.add(new Ephemeris(
                    jde,
                    AstronomicalCoordinates.fromRectangular(bodyGeocentricCoords),
                    bodyHeliocentricCoords.divideBy(this.au).getDistance(),
                    bodyGeocentricCoords.divideBy(this.au).getDistance(),
                    0.0
            ));
        }

        return ephemerides;
    }
}
