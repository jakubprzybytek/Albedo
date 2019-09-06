package jp.astro.ephemeris;

import jp.astro.common.AstronomicalCoordinates;
import jp.astro.common.Epoch;
import jp.astro.common.JulianDate;
import jp.astro.ephemeris.common.OrbitParameters;
import jp.astro.vsop87.VSOPException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EllipticMotionTest {

    @Test
    void compute() throws VSOPException {

        double jde = JulianDate.fromDate(1990, 10, 6.0);
        OrbitParameters enckeOrbitParams = new OrbitParameters(Epoch.J2000,
                2.2091404,
                0.8502196,
                11.94524,
                186.23352,
                334.75006,
                JulianDate.fromDate(1990, 10, 28.54502));

        System.out.println("Orbit: " + enckeOrbitParams.toString());
        System.out.println(String.format("Time: %.3fTD", jde));

        AstronomicalCoordinates coords = EllipticMotion.compute(jde, enckeOrbitParams);

        System.out.println("Astro coordinates = " + coords.toString());

        assertEquals(158.558965 / 15.0, coords.rightAscension, 0.000001);
        assertEquals(19.158495, coords.declination, 0.000001);
    }
}