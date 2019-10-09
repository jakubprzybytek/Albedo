package jp.albedo.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.ephemeris.common.SphericalCoordinates;
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

    private SPKernel spKernel;
    private StateCalculator stateCalculator;

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException, JPLException {
        final URL headerFileULR = StateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = StateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(headerFileULR.toURI()));
        asciiFileLoader.load(new File(fileULR.toURI()));

        this.spKernel = asciiFileLoader.createSpKernel();
        this.stateCalculator = new StateCalculator(spKernel);
    }

    @Test
    void computeForJdVenusTimeSpanBegin() throws JPLException {

        RectangularCoordinates coordsAU = this.stateCalculator.computeForJd(Body.Venus, 2433264.5);
        RectangularCoordinates coordsKm = coordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Venus coords [AU]: %s, distance=%f%n", coordsAU, coordsAU.getDistance());
        System.out.printf("Venus coords [km]: %s, distance=%f%n", coordsKm, coordsKm.getDistance());

        assertEquals(0.43036628856962117, coordsAU.x);
        assertEquals(0.5417453916406629, coordsAU.y);
        assertEquals(0.21631065679349926, coordsAU.z);
    }

    @Test
    void computeForJdVenus() throws JPLException {
        double jde = JulianDay.fromDate(2019, 10, 9);
        RectangularCoordinates coordsAU = this.stateCalculator.computeForJd(Body.Venus, jde);
        RectangularCoordinates coordsKm = coordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("T [JDE]: %f%n", jde);
        System.out.printf("Venus coords [AU]: %s, distance=%f%n", coordsAU, coordsAU.getDistance());
        System.out.printf("Venus coords [km]: %s, distance=%f%n", coordsKm, coordsKm.getDistance());

        assertEquals(-0.45898163735571323, coordsAU.x);
        assertEquals(-0.5163160963310165, coordsAU.y);
        assertEquals(-0.20358089622446124, coordsAU.z);
    }

    @Test
    void computeForJdEarth() throws JPLException, VSOPException {

        final double jde = 2433264.5;
        final SphericalCoordinates earthVSOPCoords = VSOP87Calculator.computeEarthEclipticSphericalCoordinatesJ2000(jde);
        RectangularCoordinates earthVSOPRectCoords = RectangularCoordinates.fromSphericalCoordinates(earthVSOPCoords);
        earthVSOPRectCoords = VSOP87Calculator.toFK5(earthVSOPRectCoords);
        System.out.printf("Earth VSOP87 coords: %s%n", earthVSOPCoords);
        System.out.printf("Earth VSOP87 coords: %s, distance=%f%n", earthVSOPRectCoords, earthVSOPRectCoords.getDistance());

        final RectangularCoordinates earthJPLCoords = this.stateCalculator.computeForJd(Body.EarthMoonBarycenter, jde);
        System.out.printf("Earth JLP coords: %s, distance=%f%n", earthJPLCoords, earthJPLCoords.getDistance());

        assertEquals(0.13156325736639987, earthJPLCoords.x);
        assertEquals(0.8973838323183663, earthJPLCoords.y);
        assertEquals(0.3891009866482363, earthJPLCoords.z);

        final RectangularCoordinates moonGeocentricJPLCoordsAu = this.stateCalculator.computeForJd(Body.Moon, jde);
        final RectangularCoordinates moonGeocentricJplCoordsKm = moonGeocentricJPLCoordsAu.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Moon JLP coords [AU]: %s, distance=%f%n", moonGeocentricJPLCoordsAu, moonGeocentricJPLCoordsAu.getDistance());
        System.out.printf("Moon JLP coords [km]: %s, distance=%f%n", moonGeocentricJplCoordsKm, moonGeocentricJplCoordsKm.getDistance());

        final double earthToBarycenterDistance = moonGeocentricJplCoordsKm.getDistance() / (1 + this.spKernel.getConstant(Constant.EarthMoonMassRatio));
        System.out.printf("Earth to earth-moon barycenter distance: %f%n", earthToBarycenterDistance);
    }

    @Test
    void computeForJdMars() throws JPLException {

        RectangularCoordinates coordsAU = this.stateCalculator.computeForJd(Body.Mars, 2433264.5);
        RectangularCoordinates coordsKm = coordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Mars coords [AU]: %s, distance=%f%n", coordsAU, coordsAU.getDistance());
        System.out.printf("Mars coords [km]: %s, distance=%f%n", coordsKm, coordsKm.getDistance());

        assertEquals(-1.2530729563820122, coordsAU.x);
        assertEquals(0.9758247108886894, coordsAU.y);
        assertEquals(0.4814597780730875, coordsAU.z);
    }

}