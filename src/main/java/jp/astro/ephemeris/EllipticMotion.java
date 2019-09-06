package jp.astro.ephemeris;

import jp.astro.common.AstronomicalCoordinates;
import jp.astro.ephemeris.common.*;
import jp.astro.vsop87.VSOP87Calculator;
import jp.astro.vsop87.VSOPException;

public class EllipticMotion {

    static public AstronomicalCoordinates compute(double JDE, OrbitParameters orbitParams) throws VSOPException {

        // Sun's geocentric rectangular equatorial coordinates J2000 for JDE
        SphericalCoordinates sunEclipticSphericalCoordinatesJ2000 = VSOP87Calculator.computeSunEclipticSphericalCoordinatesJ2000(JDE);
        RectangularCoordinates sunEclipticRectangularCoordinatesJ2000 = RectangularCoordinates.fromSphericalCoordinates(sunEclipticSphericalCoordinatesJ2000);
        RectangularCoordinates sunEquatorialRectangularCoordinatesFK5J2000 = VSOP87Calculator.toFK5(sunEclipticRectangularCoordinatesJ2000);

        OrbitCalculator orbitCalculator = new OrbitCalculator(orbitParams);
        RectangularCoordinates objectHeliocentricCoordinatesJ2000 = orbitCalculator.computeForDay(JDE);

        // ???  - 0.00476
        double xi = sunEquatorialRectangularCoordinatesFK5J2000.x + objectHeliocentricCoordinatesJ2000.x;
        double eta = sunEquatorialRectangularCoordinatesFK5J2000.y + objectHeliocentricCoordinatesJ2000.y;
        double zeta = sunEquatorialRectangularCoordinatesFK5J2000.z + objectHeliocentricCoordinatesJ2000.z;

        final double distanceFromEarth = Math.sqrt(xi * xi + eta * eta + zeta * zeta);

        // correction for light travel
        objectHeliocentricCoordinatesJ2000 = orbitCalculator.computeForDay(JDE - LightTime.fromDistance(distanceFromEarth));

        xi = sunEquatorialRectangularCoordinatesFK5J2000.x + objectHeliocentricCoordinatesJ2000.x;
        eta = sunEquatorialRectangularCoordinatesFK5J2000.y + objectHeliocentricCoordinatesJ2000.y;
        zeta = sunEquatorialRectangularCoordinatesFK5J2000.z + objectHeliocentricCoordinatesJ2000.z;

        // Object's geocentric spherical equatorial coordinates
        final double rightAscension = Math.toDegrees(Math.atan2(eta, xi));
        final double declination = Math.toDegrees(Math.atan2(zeta, Math.sqrt(xi * xi + eta * eta)));

        return AstronomicalCoordinates.fromDegreeses(rightAscension, declination);
    }

    static private class OrbitCalculator {

        final OrbitParameters orbitParams;
        final double meanMotion;

        final double a;
        final double b;
        final double c;
        final double A;
        final double B;
        final double C;

        public OrbitCalculator(OrbitParameters orbitParams) {
            this.orbitParams = orbitParams;
            this.meanMotion = MeanMotion.fromSemiMajorAxis(orbitParams.getSemiMajorAxis());

            final double sinEpsilon = Math.sin(Obliquity.J2000_RAD);
            final double cosEpsilon = Math.cos(Obliquity.J2000_RAD);
            final double sinOmega = Math.sin(orbitParams.getLongitudeOfAscendingNodeInRadians());
            final double cosOmega = Math.cos(orbitParams.getLongitudeOfAscendingNodeInRadians());
            final double cosI = Math.cos(orbitParams.getInclinationInRadians());
            final double sinI = Math.sin(orbitParams.getInclinationInRadians());

            final double F = cosOmega;
            final double G = sinOmega * cosEpsilon;
            final double H = sinOmega * sinEpsilon;
            final double P = -sinOmega * cosI;
            final double Q = cosOmega * cosI * cosEpsilon - sinI * sinEpsilon;
            final double R = cosOmega * cosI * sinEpsilon + sinI * cosEpsilon;
            this.a = Math.sqrt(F * F + P * P);
            this.b = Math.sqrt(G * G + Q * Q);
            this.c = Math.sqrt(H * H + R * R);
            this.A = Math.atan2(F, P);
            this.B = Math.atan2(G, Q);
            this.C = Math.atan2(H, R);
        }

        public RectangularCoordinates computeForDay(double JDE) {
            final double meanAnomaly = meanMotion * (JDE - orbitParams.getTime());
            final double eccentricAnomaly = Kepler.resolve(meanAnomaly, orbitParams.getEccentricity());
            final double trueAnomaly = TrueAnomaly.fromEccentricAnomaly(eccentricAnomaly, orbitParams.getEccentricity());
            final double distance = orbitParams.getSemiMajorAxis() * (1 - orbitParams.getEccentricity() * Math.cos(eccentricAnomaly));

            // Object's heliocentric rectangular equatorial coordinates
            final double x = distance * a * Math.sin(A + orbitParams.getArgumentOfPerihelionInRadians() + trueAnomaly);
            final double y = distance * b * Math.sin(B + orbitParams.getArgumentOfPerihelionInRadians() + trueAnomaly);
            final double z = distance * c * Math.sin(C + orbitParams.getArgumentOfPerihelionInRadians() + trueAnomaly);

            return new RectangularCoordinates(x, y, z);
        }
    }
}
