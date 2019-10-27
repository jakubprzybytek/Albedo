package jp.albedo.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class EphemeridesStateCalculatorTest {

    private SPKernel spKernel;

    private StateCalculator stateCalculator;

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException, JPLException {
        final URL headerFileULR = EphemeridesStateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = EphemeridesStateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(headerFileULR.toURI()));
        asciiFileLoader.load(new File(fileULR.toURI()));

        this.spKernel = asciiFileLoader.createSpKernel();
        this.stateCalculator = new StateCalculator(spKernel);
    }

    @Test
    void computeEphemeridesForMercury() throws JPLException {

        double jde = JulianDay.fromDate(1949, 12, 14);

        Ephemeris ephemeris = this.stateCalculator.computeEphemeridesForJds(JplBody.Mercury, jde);
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

        Ephemeris ephemeris = this.stateCalculator.computeEphemeridesForJds(JplBody.Venus, jde);
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

        Ephemeris ephemeris = this.stateCalculator.computeEphemeridesForJds(JplBody.Mars, jde);
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