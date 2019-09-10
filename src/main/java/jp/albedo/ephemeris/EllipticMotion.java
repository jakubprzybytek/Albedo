package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.common.LightTime;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.ephemeris.common.SphericalCoordinates;
import jp.albedo.ephemeris.impl.OrbitCalculator;
import jp.albedo.vsop87.VSOP87Calculator;
import jp.albedo.vsop87.VSOPException;
import org.apache.commons.math3.util.MathUtils;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class EllipticMotion {

    /**
     * Computes astronomical coordinates for given orbit elements and time point.
     *
     * @param JDE
     * @param orbitParams
     * @return
     * @throws VSOPException
     */
    static public Ephemeris compute(double JDE, OrbitElements orbitParams) throws VSOPException {
        return compute(Arrays.asList(JDE), orbitParams).get(0);
    }

    static public List<Ephemeris> compute(List<Double> JDEs, OrbitElements orbitParams) throws VSOPException {
        OrbitCalculator orbitCalculator = new OrbitCalculator(orbitParams);

        List<Ephemeris> ephemerisList = new LinkedList<>();

        for (Double day : JDEs) {
            RectangularCoordinates objectHeliocentricCoordinatesJ2000 = orbitCalculator.computeForDay(day);

            // Sun's geocentric rectangular equatorial coordinates J2000 for JDE
            SphericalCoordinates sunEclipticSphericalCoordinatesJ2000 = VSOP87Calculator.computeSunEclipticSphericalCoordinatesJ2000(day);
            RectangularCoordinates sunEclipticRectangularCoordinatesJ2000 = RectangularCoordinates.fromSphericalCoordinates(sunEclipticSphericalCoordinatesJ2000);
            RectangularCoordinates sunEquatorialRectangularCoordinatesFK5J2000 = VSOP87Calculator.toFK5(sunEclipticRectangularCoordinatesJ2000);

            // ???
            double xi = sunEquatorialRectangularCoordinatesFK5J2000.x + objectHeliocentricCoordinatesJ2000.x;
            double eta = sunEquatorialRectangularCoordinatesFK5J2000.y + objectHeliocentricCoordinatesJ2000.y;
            double zeta = sunEquatorialRectangularCoordinatesFK5J2000.z + objectHeliocentricCoordinatesJ2000.z;

            // correction for light travel
            final double distanceFromEarth = Math.sqrt(xi * xi + eta * eta + zeta * zeta);
            objectHeliocentricCoordinatesJ2000 = orbitCalculator.computeForDay(day - LightTime.fromDistance(distanceFromEarth));

            xi = sunEquatorialRectangularCoordinatesFK5J2000.x + objectHeliocentricCoordinatesJ2000.x;
            eta = sunEquatorialRectangularCoordinatesFK5J2000.y + objectHeliocentricCoordinatesJ2000.y;
            zeta = sunEquatorialRectangularCoordinatesFK5J2000.z + objectHeliocentricCoordinatesJ2000.z;

            // Object's geocentric spherical equatorial coordinates
            final double rightAscension = MathUtils.normalizeAngle(Math.atan2(eta, xi), Math.PI);
            final double declination = Math.atan2(zeta, Math.sqrt(xi * xi + eta * eta));

            ephemerisList.add(new Ephemeris(day, new AstronomicalCoordinates(rightAscension, declination)));
        }

        return ephemerisList;
    }
}
