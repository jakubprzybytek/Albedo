package jp.albedo.ephemeris;

import jp.albedo.common.Epoch;
import jp.albedo.common.JulianDate;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.ephemeris.common.OrbitElementsBuilder;
import jp.albedo.vsop87.VSOPException;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EllipticMotionTest {

    @Test
    void ephemerisForEnckeTest() throws VSOPException {

        System.out.println("\nEncke");

        double jde = JulianDate.fromDate(1990, 10, 6.0);

        OrbitElements enckeOrbitElements = new OrbitElementsBuilder()
                .orbitShape(0.8502196, 2.2091404)
                .orbitPosition(Epoch.J2000, 186.23352, 334.75006, 11.94524)
                .bodyPosition(JulianDate.fromDate(1990, 10, 28.54502), 0.0)
                .build();

        System.out.println("Orbit: " + enckeOrbitElements.toString());

        Ephemeris ephemeris = EllipticMotion.compute(jde, enckeOrbitElements);

        System.out.println("Ephemeris: " + ephemeris.toString());

        assertEquals(jde, ephemeris.jde, 0.000001);
        assertEquals(158.558966, Math.toDegrees(ephemeris.coordinates.rightAscension), 0.000001);
        assertEquals(19.158495, Math.toDegrees(ephemeris.coordinates.declination), 0.000001);
    }

    @Test
    void ephemerisForCeresTest() throws VSOPException {

        System.out.println("\nCeres");

        double jde = JulianDate.fromDate(2019, 9, 6.0);

        // https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=ceres&full-prec=true
        OrbitElements ceresOrbitElementsJPL = new OrbitElementsBuilder()
                .orbitShape(0.07600902910070946, 2.76916515450648)
                .orbitPosition(Epoch.J2000, 73.597694115971, 80.30553156826473, 10.59406704424526)
                .bodyPosition(JulianDate.fromDate(2018, 4, 30.25413581), 0.0)
                .build();

        // https://www.minorplanetcenter.net/data
        OrbitElements ceresOrbitElementsMPC = new OrbitElementsBuilder()
                .orbitShape(0.0760091, 2.7691652, 0.21388522)
                .orbitPosition(Epoch.J2000, 73.59764, 80.30553, 10.59407)
                .bodyPosition(JulianDate.fromDate(2019, 4, 27.0), 77.37215)
                .build();

        System.out.println("Orbit JPL: " + ceresOrbitElementsJPL.toStringHighPrecision());
        System.out.println("Orbit MPC: " + ceresOrbitElementsMPC.toStringHighPrecision());

        Ephemeris ephemerisJPL = EllipticMotion.compute(jde, ceresOrbitElementsJPL);
        Ephemeris ephemerisMPC = EllipticMotion.compute(jde, ceresOrbitElementsMPC);

        System.out.println("Ephemeris JPC: " + ephemerisJPL.toStringHighPrecision());
        System.out.println("Ephemeris MPC: " + ephemerisMPC.toStringHighPrecision());

        assertEquals(jde, ephemerisJPL.jde, 0.000001);
        assertEquals(244.76501519, Math.toDegrees(ephemerisJPL.coordinates.rightAscension), 0.00000001);
        assertEquals(-22.82033339, Math.toDegrees(ephemerisJPL.coordinates.declination), 0.00000001);

        assertEquals(jde, ephemerisMPC.jde, 0.000001);
        assertEquals(244.76501953, Math.toDegrees(ephemerisMPC.coordinates.rightAscension), 0.00000001);
        assertEquals(-22.82033521, Math.toDegrees(ephemerisMPC.coordinates.declination), 0.00000001);
    }

    @Test
    void ephemerisListForCeres() throws VSOPException {
        System.out.println("\nCeres ephemeris list");

        List<Double> JDEs = JulianDate.forRange(
                JulianDate.fromDate(2019, 9, 6.0),
                JulianDate.fromDate(2019, 9, 10.0),
                1.0);

        // https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=ceres&full-prec=true
        OrbitElements ceresOrbitElements = new OrbitElementsBuilder()
                .orbitShape(0.07600902910070946, 2.76916515450648)
                .orbitPosition(Epoch.J2000, 73.597694115971, 80.30553156826473, 10.59406704424526)
                .bodyPosition(JulianDate.fromDate(2018, 4, 30.25413581), 0.0)
                .build();

        System.out.println("Orbit: " + ceresOrbitElements.toString());

        List<Ephemeris> ephemerisList = EllipticMotion.compute(JDEs, ceresOrbitElements);

        for (Ephemeris ephemeris : ephemerisList) {
            System.out.println(ephemeris);
        }
    }
}