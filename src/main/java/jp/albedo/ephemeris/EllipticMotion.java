package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.common.*;
import jp.albedo.ephemeris.impl.MagnitudeCalculator;
import jp.albedo.ephemeris.impl.OrbitCalculator;
import jp.albedo.vsop87.VSOP87Calculator;
import jp.albedo.vsop87.VSOPException;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class EllipticMotion {

    /**
     * Computes astronomical coordinates for given orbit elements and epoch (TDB).
     *
     * @param JDE
     * @param orbitParams
     * @return
     * @throws VSOPException
     */
    static public Ephemeris compute(double JDE, MagnitudeParameters magnitudeParameters, OrbitElements orbitParams) throws VSOPException {
        return compute(Arrays.asList(JDE), magnitudeParameters, orbitParams).get(0);
    }

    /**
     * Computes astronomical coordinates for given orbit elements and list of epochs (TDB).
     * <p>
     * All computations to J2000!
     *
     * @param JDEs
     * @param magnitudeParameters
     * @param orbitParams
     * @return
     * @throws VSOPException
     */
    static public List<Ephemeris> compute(List<Double> JDEs, MagnitudeParameters magnitudeParameters, OrbitElements orbitParams) throws VSOPException {
        OrbitCalculator orbitCalculator = new OrbitCalculator(orbitParams);
        MagnitudeCalculator magnitudeCalculator = new MagnitudeCalculator(magnitudeParameters);

        List<Ephemeris> ephemerisList = new LinkedList<>();

        for (Double day : JDEs) {
            final RectangularCoordinates bodyHeliocentricCoords = orbitCalculator.computeForDay(day);

            // Sun's geocentric rectangular equatorial coordinates J2000 for JDE
            final SphericalCoordinates sunEclipticSphericalCoordsFK4 = VSOP87Calculator.computeSunEclipticSphericalCoordinatesJ2000(day);
            final RectangularCoordinates sunEclipticCoordsFK4 = RectangularCoordinates.fromSpherical(sunEclipticSphericalCoordsFK4);
            final RectangularCoordinates sunEquatorialCoords = VSOP87Calculator.toFK5(sunEclipticCoordsFK4);

            // Body geocentric equatorial coords
            final RectangularCoordinates bodyEquatorialCoords = sunEquatorialCoords.add(bodyHeliocentricCoords);

            // correction for light travel
            final double distanceFromEarth = bodyEquatorialCoords.getDistance();
            final RectangularCoordinates bodyHeliocentricTCCoords = orbitCalculator.computeForDay(day - LightTime.fromDistance(distanceFromEarth));

            final RectangularCoordinates bodyEquatorialTCCoords = sunEquatorialCoords.add(bodyHeliocentricTCCoords);

            ephemerisList.add(new Ephemeris(
                    day,
                    AstronomicalCoordinates.fromRectangular(bodyEquatorialTCCoords),
                    bodyHeliocentricTCCoords.getDistance(),
                    distanceFromEarth,
                    magnitudeCalculator.compute(bodyHeliocentricTCCoords, bodyEquatorialTCCoords)));
        }

        return ephemerisList;
    }
}
