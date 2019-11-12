package jp.albedo.jeanmeeus.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.jeanmeeus.ephemeris.common.*;
import jp.albedo.jeanmeeus.ephemeris.impl.MagnitudeCalculator;
import jp.albedo.jeanmeeus.ephemeris.impl.OrbitCalculator;
import jp.albedo.vsop87.VSOP87Calculator;
import jp.albedo.vsop87.VSOPException;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class EllipticMotion {

    /**
     * Computes astronomical coordinates for given orbit elements and epoch (TDB).
     *
     * @param jde
     * @param orbitParams
     * @return
     * @throws VSOPException
     */
    static public Ephemeris compute(double jde, MagnitudeParameters magnitudeParameters, OrbitElements orbitParams) throws VSOPException {
        return compute(Arrays.asList(jde), magnitudeParameters, orbitParams).get(0);
    }

    /**
     * Computes astronomical coordinates for given orbit elements and list of epochs (TDB).
     * <p>
     * All computations to J2000!
     *
     * @param jdes
     * @param magnitudeParameters
     * @param orbitParams
     * @return
     * @throws VSOPException
     */
    static public List<Ephemeris> compute(List<Double> jdes, MagnitudeParameters magnitudeParameters, OrbitElements orbitParams) throws VSOPException {
        OrbitCalculator orbitCalculator = new OrbitCalculator(orbitParams);
        MagnitudeCalculator magnitudeCalculator = new MagnitudeCalculator(magnitudeParameters);

        List<Ephemeris> ephemerisList = new LinkedList<>();

        for (Double day : jdes) {
            final RectangularCoordinates bodyHeliocentricEquatorialCoords = orbitCalculator.computeForDay(day);

            // Sun's geocentric rectangular equatorial coordinates J2000 for JDE
            final SphericalCoordinates sunEclipticSphericalCoordsFK4 = VSOP87Calculator.computeSunEclipticSphericalCoordinatesJ2000(day);
            final RectangularCoordinates sunEclipticCoordsFK4 = RectangularCoordinates.fromSpherical(sunEclipticSphericalCoordsFK4);
            final RectangularCoordinates sunGeocentricEquatorialCoords = VSOP87Calculator.toFK5(sunEclipticCoordsFK4);

            // Body geocentric equatorial coords
            final RectangularCoordinates bodyGeocentricEquatorialCoords = sunGeocentricEquatorialCoords.add(bodyHeliocentricEquatorialCoords);

            // correction for light travel
            final double distanceFromEarth = bodyGeocentricEquatorialCoords.getDistance();
            final RectangularCoordinates bodyHeliocentricEquatorialTCCoords = orbitCalculator.computeForDay(day - LightTime.fromDistance(distanceFromEarth));

            final RectangularCoordinates bodyGeocentricEquatorialTCCoords = sunGeocentricEquatorialCoords.add(bodyHeliocentricEquatorialTCCoords);

            ephemerisList.add(new Ephemeris(
                    day,
                    AstronomicalCoordinates.fromRectangular(bodyGeocentricEquatorialTCCoords),
                    bodyHeliocentricEquatorialTCCoords.getDistance(),
                    distanceFromEarth,
                    magnitudeCalculator.compute(bodyHeliocentricEquatorialTCCoords, bodyGeocentricEquatorialTCCoords)));
        }

        return ephemerisList;
    }
}
