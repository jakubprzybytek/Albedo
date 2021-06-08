package jp.albedo.jpl.state;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
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
 * Validated using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
@Deprecated
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class EarthStateCalculatorTest {

    private EarthStateCalculator stateCalculator;

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException, JplException {
        final URL headerFileULR = EarthStateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = EarthStateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(headerFileULR.toURI()));
        asciiFileLoader.load(new File(fileULR.toURI()));

        final SPKernel spKernel = asciiFileLoader.createSpKernel();
        this.stateCalculator = new EarthStateCalculator(spKernel);
    }

    @Test
    void computeForEarth() throws JplException {

        final double jde = JulianDay.fromDate(2019, 10, 9);
        System.out.printf("T [JDE]: %.1f%n", jde);

        final RectangularCoordinates earthHeliocentricCoordsKm = this.stateCalculator.compute(jde);
        System.out.printf("Earth coords: %s, distance=%f%n", earthHeliocentricCoordsKm, earthHeliocentricCoordsKm.getDistance());

        assertEquals(143811431.38536263, earthHeliocentricCoordsKm.x, 0.0000001);
        assertEquals(36856636.26047815, earthHeliocentricCoordsKm.y, 0.00000001);
        assertEquals(15977858.62839704, earthHeliocentricCoordsKm.z, 0.00000001);
    }


}