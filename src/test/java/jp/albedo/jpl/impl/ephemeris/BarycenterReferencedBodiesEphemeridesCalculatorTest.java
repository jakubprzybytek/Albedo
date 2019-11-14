package jp.albedo.jpl.impl.ephemeris;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jpl.AsciiFileLoader;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
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

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException, JplException {
        final URL headerFileULR = BarycenterReferencedBodiesEphemeridesCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = BarycenterReferencedBodiesEphemeridesCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(headerFileULR.toURI()));
        asciiFileLoader.load(new File(fileULR.toURI()));

        this.spKernel = asciiFileLoader.createSpKernel();
    }

    @Test
    void computeEphemeridesForSun() throws JplException {
        double jde = JulianDay.fromDate(1949, 12, 14);

        BarycenterReferencedBodiesEphemeridesCalculator ephemeridesCalculator = new BarycenterReferencedBodiesEphemeridesCalculator(JplBody.Sun, this.spKernel);
        Ephemeris ephemeris = ephemeridesCalculator.computeEphemeridesForJds(jde);
        System.out.printf("Sun ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC no correction: 261.69588889
        assertEquals(261.69589038, Math.toDegrees(ephemeris.coordinates.rightAscension), 0.00000001);
        // WGC no correction: -23.22635324
        assertEquals(-23.22635334, Math.toDegrees(ephemeris.coordinates.declination), 0.00000001);
        assertEquals(-26.78, ephemeris.apparentMagnitude);
    }

    @Test
    void computeEphemeridesForMercury() throws JplException {
        double jde = JulianDay.fromDate(1949, 12, 14);

        BarycenterReferencedBodiesEphemeridesCalculator ephemeridesCalculator = new BarycenterReferencedBodiesEphemeridesCalculator(JplBody.Mercury, this.spKernel);
        Ephemeris ephemeris = ephemeridesCalculator.computeEphemeridesForJds(jde);
        System.out.printf("Venus ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC no correction: 274.97869316
        assertEquals(274.97165424, Math.toDegrees(ephemeris.coordinates.rightAscension), 0.00000001);
        // WGC no correction: -25.54654902
        assertEquals(-25.54648377, Math.toDegrees(ephemeris.coordinates.declination), 0.00000001);
        // Horisons: -0.68
        assertEquals(-0.68, ephemeris.apparentMagnitude);
    }

    @Test
    void computeEphemeridesForVenus() throws JplException {

        double jde = JulianDay.fromDate(1949, 12, 14);

        BarycenterReferencedBodiesEphemeridesCalculator ephemeridesCalculator = new BarycenterReferencedBodiesEphemeridesCalculator(JplBody.Venus, this.spKernel);
        Ephemeris ephemeris = ephemeridesCalculator.computeEphemeridesForJds(jde);
        System.out.printf("Venus ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC no correction: 310.03355061
        assertEquals(310.03557722, Math.toDegrees(ephemeris.coordinates.rightAscension), 0.00000001);
        // WGC no correction: -20.40548613
        assertEquals(-20.40513256, Math.toDegrees(ephemeris.coordinates.declination), 0.00000001);
        // Horisons: -4.80 FixMe
        assertEquals(-3.04, ephemeris.apparentMagnitude);
    }

    @Test
    void computeEphemeridesForMars() throws JplException {

        double jde = JulianDay.fromDate(1949, 12, 14);

        BarycenterReferencedBodiesEphemeridesCalculator ephemeridesCalculator = new BarycenterReferencedBodiesEphemeridesCalculator(JplBody.Mars, this.spKernel);
        Ephemeris ephemeris = ephemeridesCalculator.computeEphemeridesForJds(jde);
        System.out.printf("Mars ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WGC no correction: 176.75777302
        assertEquals(176.75475337, Math.toDegrees(ephemeris.coordinates.rightAscension), 0.00000001);
        // WGC no correction: 3.80993121
        assertEquals(3.81133954, Math.toDegrees(ephemeris.coordinates.declination), 0.00000001);
        // Horisons: 0.88
        assertEquals(0.88, ephemeris.apparentMagnitude);
    }

}