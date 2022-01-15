package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jpl.files.AsciiFileLoader;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SPKernel;
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
@Deprecated
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MoonEphemeridesCalculatorTest {

    private SPKernel spKernel;

    private MoonEphemeridesCalculator ephemeridesCalculator;

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException, JplException {
        final URL headerFileULR = MoonEphemeridesCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = MoonEphemeridesCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(headerFileULR.toURI()));
        asciiFileLoader.load(new File(fileULR.toURI()));

        this.spKernel = asciiFileLoader.createSpKernel();
        this.ephemeridesCalculator = new MoonEphemeridesCalculator(spKernel);
    }

    @Test
    void computeEphemeridesForMoon() throws JplException {

        double jde = JulianDay.fromDate(2019, 10, 9);

        Ephemeris ephemeris = this.ephemeridesCalculator.computeFor(jde);
        System.out.printf("Moon ephemeris: %s", ephemeris.toStringHighPrecision());

        assertEquals(jde, ephemeris.jde);
        // WBC no correction: 325.21908914
        assertEquals(325.21553089, Math.toDegrees(ephemeris.coordinates.rightAscension), 0.00000003);
        // WBC no correction: -17.23578781
        assertEquals(-17.23668107, Math.toDegrees(ephemeris.coordinates.declination), 0.00000002);
        assertEquals(0.0027036512818619713, ephemeris.distanceFromEarth);
        //assertEquals(-12.0, ephemeris.apparentMagnitude);
    }

}