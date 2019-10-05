package jp.albedo.jpl;

import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.ephemeris.common.SphericalCoordinates;
import jp.albedo.jpl.files.Body;
import jp.albedo.vsop87.VSOP87Calculator;
import jp.albedo.vsop87.VSOPException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class StateCalculatorTest {

    private StateCalculator stateCalculator;

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException {
        final URL headerFileULR = StateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = StateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        this.stateCalculator = new StateCalculator();
        this.stateCalculator.loadKernels(new File(headerFileULR.toURI()), new File(fileULR.toURI()));
    }

    @Test
    void computeForJdMars() throws JPLException {

        RectangularCoordinates coords = this.stateCalculator.computeForJd(Body.Mars, 2433264.5);

        coords.x /= 149597870.699999988;
        coords.y /= 149597870.699999988;
        coords.z /= 149597870.699999988;

        System.out.printf("Mars coords: %s, distance=%f%n", coords, coords.getDistance());

        assertEquals(-1.3803320089150373, coords.x);
        assertEquals(0.8300671661081752, coords.y);
        assertEquals(0.41806472150122326, coords.z);
    }

    @Test
    void computeForJdEarth() throws JPLException, VSOPException {

        final double jde = 2433264.5;
        RectangularCoordinates earthJPLCoords = this.stateCalculator.computeForJd(Body.Earth, jde);
        SphericalCoordinates earthVSOPCoords = VSOP87Calculator.computeEarthEclipticSphericalCoordinatesJ2000(jde);
        RectangularCoordinates earthVSOPRectCoords = RectangularCoordinates.fromSphericalCoordinates(earthVSOPCoords);
        earthVSOPRectCoords = VSOP87Calculator.toFK5(earthVSOPRectCoords);

        earthJPLCoords.x /= 149597870.699999988;
        earthJPLCoords.y /= 149597870.699999988;
        earthJPLCoords.z /= 149597870.699999988;

        System.out.printf("Earth JLP coords: %s, distance=%f%n", earthJPLCoords, earthJPLCoords.getDistance());
        System.out.printf("Earth VSOP87 coords: %s%n", earthVSOPCoords);
        System.out.printf("Earth VSOP87 coords: %s, distance=%f%n", earthVSOPRectCoords, earthVSOPRectCoords.getDistance());

        assertEquals(-0.007977043189703777, earthJPLCoords.x);
        assertEquals(0.9047130563174, earthJPLCoords.y);
        assertEquals(0.39227868260621407, earthJPLCoords.z);
    }

}