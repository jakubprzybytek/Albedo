package jp.albedo.jpl;

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
    void computeEphemersForVenus() throws JPLException {

        final double jde = 2433264.5;

        Ephemeris ephemeris = this.stateCalculator.computeEphemeridesForJds(Body.Venus, jde);
        System.out.printf("Venus ephemeris: %s%n", ephemeris.toStringHighPrecision());

        assertEquals(2433264.5, ephemeris.jde);
        // WGC: 310.03355061
        assertEquals(310.03355060701824, Math.toDegrees(ephemeris.coordinates.rightAscension));
        // WGC: -20.40548613
        assertEquals(-20.40548612581231, Math.toDegrees(ephemeris.coordinates.declination));
    }

}