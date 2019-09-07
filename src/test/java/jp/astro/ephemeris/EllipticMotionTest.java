package jp.astro.ephemeris;

import jp.astro.common.AstronomicalCoordinates;
import jp.astro.common.Epoch;
import jp.astro.common.JulianDate;
import jp.astro.ephemeris.common.OrbitParameters;
import jp.astro.vsop87.VSOPException;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EllipticMotionTest {

    @Test
    void ephemerisForEnckeTest() throws VSOPException {

        System.out.println("Encke");

        double jde = JulianDate.fromDate(1990, 10, 6.0);
        OrbitParameters enckeOrbitParams = new OrbitParameters(Epoch.J2000,
                2.2091404,
                0.8502196,
                11.94524,
                186.23352,
                334.75006,
                JulianDate.fromDate(1990, 10, 28.54502));

        System.out.println("Orbit: " + enckeOrbitParams.toString());

        Ephemeris ephemeris = EllipticMotion.compute(jde, enckeOrbitParams);

        System.out.println("Ephemeris: " + ephemeris.toString());

        assertEquals(jde, ephemeris.jde, 0.000001);
        assertEquals(158.558965 / 15.0, ephemeris.coordinates.rightAscension, 0.000001);
        assertEquals(19.158495, ephemeris.coordinates.declination, 0.000001);
    }

    @Test
    void ephemerisForCeresTest() throws VSOPException {

        System.out.println("\nCeres");

        double jde = JulianDate.fromDate(2019, 9, 6.0);
        OrbitParameters ceresOrbitParams = new OrbitParameters(Epoch.J2000,
                2.76916515450648,
                0.07600902910070946,
                10.59406704424526,
                73.597694115971,
                80.30553156826473,
                JulianDate.fromDate(2018, 4, 30.25413581));

        System.out.println("Orbit: " + ceresOrbitParams.toString());

        Ephemeris ephemeris = EllipticMotion.compute(jde, ceresOrbitParams);

        System.out.println("Ephemeris: " + ephemeris.toString());

        assertEquals(jde, ephemeris.jde, 0.000001);
        assertEquals(244.76501519 / 15.0, ephemeris.coordinates.rightAscension, 0.00000001);
        assertEquals(-22.82033339, ephemeris.coordinates.declination, 0.00000001);
    }

    @Test
    void ephemerisListForCeresTest() throws VSOPException {
        System.out.println("\nCeres ephemeris list");

        List<Double> JDEs = JulianDate.forRange(
                JulianDate.fromDate(2019, 9, 6.0),
                JulianDate.fromDate(2019, 9, 10.0),
                1.0);

        OrbitParameters ceresOrbitParams = new OrbitParameters(Epoch.J2000,
                2.76916515450648,
                0.07600902910070946,
                10.59406704424526,
                73.597694115971,
                80.30553156826473,
                JulianDate.fromDate(2018, 4, 30.25413581));

        System.out.println("Orbit: " + ceresOrbitParams.toString());

        List<Ephemeris> ephemerisList = EllipticMotion.compute(JDEs, ceresOrbitParams);

        for (Ephemeris ephemeris : ephemerisList) {
            System.out.println(ephemeris);
        }
    }
}