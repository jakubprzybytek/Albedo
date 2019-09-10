package jp.albedo.sandbox;

import jp.albedo.common.Angles;
import jp.albedo.common.Epoch;
import jp.albedo.common.JulianDate;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.ephemeris.common.OrbitElementsBuilder;
import jp.albedo.vsop87.VSOPException;

import java.util.List;

public class AsteroidsConjunctions {

    public static void main(String args[]) throws VSOPException {
        // https://www.minorplanetcenter.net/data
        OrbitElements ceresOrbitElementsMPC = new OrbitElementsBuilder()
                .orbitShape(0.0760091, 2.7691652, 0.21388522)
                .orbitPosition(Epoch.J2000, 73.59764, 80.30553, 10.59407)
                .bodyPosition(JulianDate.fromDate(2019, 4, 27.0), 77.37215)
                .build();

        OrbitElements junoOrbitElementsMPC = new OrbitElementsBuilder()
                .orbitShape(0.2569423, 2.6691496, 0.22601887)
                .orbitPosition(Epoch.J2000, 248.13861, 169.85274, 12.98892)
                .bodyPosition(JulianDate.fromDate(2019, 4, 27.0), 34.92503)
                .build();

        List<Double> JDEs = JulianDate.forRange(
                JulianDate.fromDate(2010, 1, 1.0),
                JulianDate.fromDate(2030, 12, 31.0),
                10.0);

        List<Ephemeris> ceresEphemerisList = EllipticMotion.compute(JDEs, ceresOrbitElementsMPC);
        List<Ephemeris> junoEphemerisList = EllipticMotion.compute(JDEs, junoOrbitElementsMPC);

        for (int i = 0; i < ceresEphemerisList.size(); i++) {
            Ephemeris ceresEphemeris = ceresEphemerisList.get(i);
            Ephemeris junoEphemeris = junoEphemerisList.get(i);
            double separation = Math.toDegrees(Angles.separation(ceresEphemeris.coordinates, junoEphemeris.coordinates));
            System.out.println(String.format("T=%.1f, Ceres:%s, Juno:%s, separation=%.4f°",
                    ceresEphemeris.jde, ceresEphemeris.coordinates, junoEphemeris.coordinates, separation));
        }
    }

}
