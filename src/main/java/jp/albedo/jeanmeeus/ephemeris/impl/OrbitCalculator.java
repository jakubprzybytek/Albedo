package jp.albedo.jeanmeeus.ephemeris.impl;

import jp.albedo.jeanmeeus.ephemeris.common.Obliquity;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jeanmeeus.ephemeris.common.TrueAnomaly;

public class OrbitCalculator {

    final OrbitElements orbitParams;

    final double a, b, c, A, B, C;

    public OrbitCalculator(OrbitElements orbitParams) {
        this.orbitParams = orbitParams;

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

    public RectangularCoordinates computeForDay(double jde) {
        final double meanAnomaly = orbitParams.getMeanAnomalyAtEpochInRadians() +
                orbitParams.getMeanMotionInRadians() * (jde - orbitParams.getMeanAnomalyEpoch());
        final double eccentricAnomaly = Kepler.solve(meanAnomaly, orbitParams.getEccentricity());
        final double trueAnomaly = TrueAnomaly.fromEccentricAnomaly(eccentricAnomaly, orbitParams.getEccentricity());
        final double distance = orbitParams.getSemiMajorAxis() * (1 - orbitParams.getEccentricity() * Math.cos(eccentricAnomaly));

        // Object's heliocentric rectangular equatorial coordinates
        final double x = distance * a * Math.sin(A + orbitParams.getArgumentOfPerihelionInRadians() + trueAnomaly);
        final double y = distance * b * Math.sin(B + orbitParams.getArgumentOfPerihelionInRadians() + trueAnomaly);
        final double z = distance * c * Math.sin(C + orbitParams.getArgumentOfPerihelionInRadians() + trueAnomaly);

        return new RectangularCoordinates(x, y, z);
    }

}