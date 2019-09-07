package jp.astro.ephemeris.impl;

import jp.astro.ephemeris.Kepler;
import jp.astro.ephemeris.common.*;

public class OrbitCalculator {

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