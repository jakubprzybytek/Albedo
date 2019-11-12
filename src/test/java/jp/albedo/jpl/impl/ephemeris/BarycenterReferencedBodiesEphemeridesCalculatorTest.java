package jp.albedo.jpl.impl.ephemeris;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jpl.AsciiFileLoader;
import jp.albedo.jpl.JPLException;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.SPKernel;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Validated with: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class BarycenterReferencedBodiesEphemeridesCalculatorTest {

    private SPKernel spKernel;

    private BarycenterReferencedBodiesEphemeridesCalculator ephemeridesCalculator;

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException, JPLException {
        final URL headerFileULR = BarycenterReferencedBodiesEphemeridesCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = BarycenterReferencedBodiesEphemeridesCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(headerFileULR.toURI()));
        asciiFileLoader.load(new File(fileULR.toURI()));

        this.spKernel = asciiFileLoader.createSpKernel();
        this.ephemeridesCalculator = new BarycenterReferencedBodiesEphemeridesCalculator(spKernel);
    }

    @Test
    void computeEphemeridesForSun() throws JPLException {

        double jde = JulianDay.fromDate(1949, 12, 14);

        Ephemeris ephemeris = this.ephemeridesCalculator.computeEphemeridesForJds(JplBody.Sun, jde);
        System.out.printf("Sun ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC: 274.97869316
        assertEquals(261.69588889, Math.toDegrees(ephemeris.coordinates.rightAscension), 0.00000001);
        // WGC: -25.54654902
        assertEquals(-23.22635324, Math.toDegrees(ephemeris.coordinates.declination), 0.00000001);
        // Horisons: -0.68
        assertEquals(-26.78, ephemeris.apparentMagnitude);
    }

    @Test
    void computeEphemeridesForMercury() throws JPLException {

        double jde = JulianDay.fromDate(1949, 12, 14);

        Ephemeris ephemeris = this.ephemeridesCalculator.computeEphemeridesForJds(JplBody.Mercury, jde);
        System.out.printf("Venus ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC: 274.97869316
        assertEquals(274.9786931621818, Math.toDegrees(ephemeris.coordinates.rightAscension));
        // WGC: -25.54654902
        assertEquals(-25.546549020057533, Math.toDegrees(ephemeris.coordinates.declination));
        // Horisons: -0.68
        assertEquals(-0.68, ephemeris.apparentMagnitude);
    }

    @Test
    void computeEphemeridesForVenus() throws JPLException {

        double jde = JulianDay.fromDate(1949, 12, 14);

        Ephemeris ephemeris = this.ephemeridesCalculator.computeEphemeridesForJds(JplBody.Venus, jde);
        System.out.printf("Venus ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC: 310.03355061
        assertEquals(310.03355060701824, Math.toDegrees(ephemeris.coordinates.rightAscension));
        // WGC: -20.40548613
        assertEquals(-20.40548612581231, Math.toDegrees(ephemeris.coordinates.declination));
        // Horisons: -4.80 FixMe
        assertEquals(-3.04, ephemeris.apparentMagnitude);
    }

    @Test
    void computeEphemeridesForMars() throws JPLException {

        double jde = JulianDay.fromDate(1949, 12, 14);

        Ephemeris ephemeris = this.ephemeridesCalculator.computeEphemeridesForJds(JplBody.Mars, jde);
        System.out.printf("Mars ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC: 176.75777302 - no correction
        assertEquals(176.7577730226194, Math.toDegrees(ephemeris.coordinates.rightAscension));
        // WGC: 3.80993121 - no correction
        assertEquals(3.809931212566189, Math.toDegrees(ephemeris.coordinates.declination));
        // Horisons: 0.88
        assertEquals(0.88, ephemeris.apparentMagnitude);
    }

}