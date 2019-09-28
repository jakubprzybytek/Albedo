package jp.albedo.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.common.*;
import jp.albedo.ephemeris.impl.OrbitCalculator;
import jp.albedo.vsop87.VSOP87Calculator;
import jp.albedo.vsop87.VSOPException;
import org.apache.commons.math3.util.MathUtils;
import org.apache.commons.math3.util.Precision;

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
    static public Ephemeris compute(double JDE, MagnitudeParameters magnitudeParameters, OrbitElements orbitParams) throws VSOPException {
        return compute(Arrays.asList(JDE), magnitudeParameters, orbitParams).get(0);
    }

    static public List<Ephemeris> compute(List<Double> JDEs, MagnitudeParameters magnitudeParameters, OrbitElements orbitParams) throws VSOPException {
        OrbitCalculator orbitCalculator = new OrbitCalculator(orbitParams);

        List<Ephemeris> ephemerisList = new LinkedList<>();

        for (Double day : JDEs) {
            OrbitCalculator.OrbitPosition objectHeliocentricPositionJ2000 = orbitCalculator.computeForDay(day);

            // Sun's geocentric rectangular equatorial coordinates J2000 for JDE
            final SphericalCoordinates sunEclipticSphericalCoordinatesJ2000 = VSOP87Calculator.computeSunEclipticSphericalCoordinatesJ2000(day);
            final RectangularCoordinates sunEclipticRectangularCoordinatesJ2000 = RectangularCoordinates.fromSphericalCoordinates(sunEclipticSphericalCoordinatesJ2000);
            final RectangularCoordinates sunEquatorialRectangularCoordinatesFK5J2000 = VSOP87Calculator.toFK5(sunEclipticRectangularCoordinatesJ2000);

            // ???
            double xi = sunEquatorialRectangularCoordinatesFK5J2000.x + objectHeliocentricPositionJ2000.coordinates.x;
            double eta = sunEquatorialRectangularCoordinatesFK5J2000.y + objectHeliocentricPositionJ2000.coordinates.y;
            double zeta = sunEquatorialRectangularCoordinatesFK5J2000.z + objectHeliocentricPositionJ2000.coordinates.z;

            // correction for light travel
            final double distanceFromEarth = Math.sqrt(xi * xi + eta * eta + zeta * zeta);
            objectHeliocentricPositionJ2000 = orbitCalculator.computeForDay(day - LightTime.fromDistance(distanceFromEarth));

            xi = sunEquatorialRectangularCoordinatesFK5J2000.x + objectHeliocentricPositionJ2000.coordinates.x;
            eta = sunEquatorialRectangularCoordinatesFK5J2000.y + objectHeliocentricPositionJ2000.coordinates.y;
            zeta = sunEquatorialRectangularCoordinatesFK5J2000.z + objectHeliocentricPositionJ2000.coordinates.z;

            // Object's geocentric spherical equatorial coordinates
            final double rightAscension = MathUtils.normalizeAngle(Math.atan2(eta, xi), Math.PI);
            final double declination = Math.atan2(zeta, Math.sqrt(xi * xi + eta * eta));

            // Object's apparent magnitude
            final double phaseAngle = MathUtils.normalizeAngle(Math.acos((xi * objectHeliocentricPositionJ2000.coordinates.x
                    + eta * objectHeliocentricPositionJ2000.coordinates.y
                    + zeta * objectHeliocentricPositionJ2000.coordinates.z) / (objectHeliocentricPositionJ2000.distance * distanceFromEarth)), Math.PI);

            final double phi1 = Math.exp(-3.33 * Math.pow(Math.tan(phaseAngle / 2), 0.63));
            final double phi2 = Math.exp(-1.87 * Math.pow(Math.tan(phaseAngle / 2), 1.22));

            // valid only for phase angle between 0 and 120 deg
            final double mag = Precision.round(magnitudeParameters.H
                    + 5 * Math.log10(objectHeliocentricPositionJ2000.distance * distanceFromEarth)
                    - 2.5 * Math.log10((1 - magnitudeParameters.G) * phi1 + magnitudeParameters.G * phi2), 2);

            ephemerisList.add(new Ephemeris(day, new AstronomicalCoordinates(rightAscension, declination), distanceFromEarth, mag));
        }

        return ephemerisList;
    }
}
