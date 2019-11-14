package jp.albedo.jpl.state;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jeanmeeus.ephemeris.common.SphericalCoordinates;
import jp.albedo.jpl.files.AsciiFileLoader;
import jp.albedo.jpl.Constant;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.SPKernel;
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

/**
 * Validated using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class StateCalculatorTest {

    private SPKernel spKernel;

    private StateCalculator stateCalculator;

    @BeforeAll
    void loadKernels() throws URISyntaxException, IOException, JplException {
        final URL headerFileULR = StateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = StateCalculatorTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        AsciiFileLoader asciiFileLoader = new AsciiFileLoader();
        asciiFileLoader.loadHeader(new File(headerFileULR.toURI()));
        asciiFileLoader.load(new File(fileULR.toURI()));

        this.spKernel = asciiFileLoader.createSpKernel();
        this.stateCalculator = new StateCalculator(spKernel);
    }

    @Test
    void computeForSun() throws JplException {
        double jde = JulianDay.fromDate(2019, 10, 9);
        RectangularCoordinates coordsKm = this.stateCalculator.compute(JplBody.Sun, jde);

        System.out.printf("T [JDE]: %f%n", jde);
        System.out.printf("Sun coords [km]: %s, distance=%f%n", coordsKm, coordsKm.getDistance());

        assertEquals(-462237.15572104, coordsKm.x, 0.00000001);
        assertEquals(1038587.57185744, coordsKm.y, 0.00000001);
        assertEquals(450869.39130956, coordsKm.z, 0.00000001);

    }

    @Test
    void computeForVenusWithVariousTimeSpanPoints() throws JplException {

        final double beginningJde = 2433264.5;
        final RectangularCoordinates beginningCoordsKm = this.stateCalculator.compute(JplBody.Venus, beginningJde);
        System.out.printf("Venus coords [km] for %.1f [JDE]: %s, distance=%f%n", beginningJde, beginningCoordsKm, beginningCoordsKm.getDistance());

        assertEquals(64381880.39107707, beginningCoordsKm.x, 0.00000001);
        assertEquals(81043957.05098076, beginningCoordsKm.y, 0.00000002);
        assertEquals(32359613.66602598, beginningCoordsKm.z, 0.00000001);

        final double middleJde = 2433280.5;
        final RectangularCoordinates middleCoordsKm = this.stateCalculator.compute(JplBody.Venus, middleJde);
        System.out.printf("Venus coords [km] for %.1f [JDE]: %s, distance=%f%n", middleJde, middleCoordsKm, middleCoordsKm.getDistance());

        assertEquals(20230700.80839136, middleCoordsKm.x);
        assertEquals(97367801.62804152, middleCoordsKm.y);
        assertEquals(42496398.48356129, middleCoordsKm.z);

        final double endingJde = 2433296.5;
        final RectangularCoordinates endingCoordsKm = this.stateCalculator.compute(JplBody.Venus, endingJde);
        System.out.printf("Venus coords [km] for %.1f [JDE]: %s, distance=%f%n", endingJde, endingCoordsKm, endingCoordsKm.getDistance());

        assertEquals(-27913817.75063300, endingCoordsKm.x, 0.00000001);
        assertEquals(94357865.39334433, endingCoordsKm.y, 0.00000003);
        assertEquals(44191400.46568169, endingCoordsKm.z, 0.00000002);
    }

    @Test
    void computeForVenus() throws JplException {
        double jde = JulianDay.fromDate(2019, 10, 9);
        RectangularCoordinates coordsKm = this.stateCalculator.compute(JplBody.Venus, jde);

        System.out.printf("T [JDE]: %f%n", jde);
        System.out.printf("Venus coords [km]: %s, distance=%f%n", coordsKm, coordsKm.getDistance());

        assertEquals(-68662675.63881429, coordsKm.x, 0.00000002);
        assertEquals(-77239788.61925617, coordsKm.y, 0.00000003);
        assertEquals(-30455268.59037707, coordsKm.z, 0.00000001);
    }

    @Test
    void computeForMercuryToVenus() throws JplException {
        final double jde = JulianDay.fromDate(2019, 10, 9);
        System.out.printf("T [JDE]: %f%n", jde);

        final RectangularCoordinates mercuryCoordsKm = this.stateCalculator.compute(JplBody.Mercury, jde);
        System.out.printf("Mercury coords [km]: %s, distance=%f%n", mercuryCoordsKm, mercuryCoordsKm.getDistance());

        final RectangularCoordinates venusCoordsKm = this.stateCalculator.compute(JplBody.Venus, jde);
        System.out.printf("Venus coords [km]: %s, distance=%f%n", venusCoordsKm, venusCoordsKm.getDistance());

        final RectangularCoordinates venusMercurycentricCoords = venusCoordsKm.subtract(mercuryCoordsKm);
        System.out.printf("Venus from Mercury coords [km]: %s, distance=%f%n", venusMercurycentricCoords, venusMercurycentricCoords.getDistance());

        // WGC: -72039776.31409962
        assertEquals(-72039776.31409962, venusMercurycentricCoords.x, 0.00000002);
        // WGC: -17562170.09386544
        assertEquals(-17562170.09386544, venusMercurycentricCoords.y, 0.00000003);
        // WGC: 1925977.06750864
        assertEquals(1925977.06750864, venusMercurycentricCoords.z, 0.00000001);
    }

    @Test
    void computeForEarthAndCompareWithVSOP() throws JplException, VSOPException {

        final double jde = 2433264.5;
        final SphericalCoordinates earthVSOPCoords = VSOP87Calculator.computeEarthEclipticSphericalCoordinatesJ2000(jde);
        RectangularCoordinates earthVSOPRectCoords = RectangularCoordinates.fromSpherical(earthVSOPCoords);
        earthVSOPRectCoords = VSOP87Calculator.toFK5(earthVSOPRectCoords);
        System.out.printf("Earth VSOP87 coords: %s%n", earthVSOPCoords);
        System.out.printf("Earth VSOP87 coords: %s, distance=%f%n", earthVSOPRectCoords, earthVSOPRectCoords.getDistance());

        final RectangularCoordinates earthJPLCoordsKm = this.stateCalculator.compute(JplBody.EarthMoonBarycenter, jde);
        final RectangularCoordinates earthJPLCoordsAu = earthJPLCoordsKm.divideBy(this.spKernel.getConstant(Constant.AU));
        System.out.printf("Earth JLP coords: %s, distance=%f%n", earthJPLCoordsKm, earthJPLCoordsKm.getDistance());

        assertEquals(0.13156325736639987, earthJPLCoordsAu.x);
        assertEquals(0.8973838323183663, earthJPLCoordsAu.y);
        assertEquals(0.3891009866482363, earthJPLCoordsAu.z);

        final RectangularCoordinates moonGeocentricJplCoordsKm = this.stateCalculator.compute(JplBody.Moon, jde);
        final RectangularCoordinates moonGeocentricJplCoordsAu = moonGeocentricJplCoordsKm.divideBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Moon JLP coords [AU]: %s, distance=%f%n", moonGeocentricJplCoordsAu, moonGeocentricJplCoordsAu.getDistance());
        System.out.printf("Moon JLP coords [km]: %s, distance=%f%n", moonGeocentricJplCoordsKm, moonGeocentricJplCoordsKm.getDistance());

        final double earthToBarycenterDistance = moonGeocentricJplCoordsKm.getDistance() / (1 + this.spKernel.getConstant(Constant.EarthMoonMassRatio));
        System.out.printf("Earth to earth-moon barycenter distance: %f%n", earthToBarycenterDistance);
    }

    @Test
    void computeForMoonFromEarth() throws JplException {

        final double jde = JulianDay.fromDate(2019, 10, 9);
        System.out.printf("T [JDE]: %.1f%n", jde);

        final RectangularCoordinates moonCoordsKm = this.stateCalculator.compute(JplBody.Moon, jde);
        System.out.printf("Moon coords [km]: %s, distance=%f%n", moonCoordsKm, moonCoordsKm.getDistance());

        assertEquals(317255.79347754, moonCoordsKm.x, 0.00000001);
        assertEquals(-220341.79908000, moonCoordsKm.y, 0.00000001);
        assertEquals(-119833.86836880, moonCoordsKm.z, 0.00000001);
    }

    @Test
    void computeForMars() throws JplException {

        RectangularCoordinates coordsKm = this.stateCalculator.compute(JplBody.Mars, 2433264.5);
        System.out.printf("Mars coords [AU]: %s, distance=%f%n", coordsKm, coordsKm.getDistance());

        assertEquals(-187457046.10650298, coordsKm.x, 0.00000001);
        assertEquals(145981298.92539105, coordsKm.y, 0.00000003);
        assertEquals(72025357.62742841, coordsKm.z, 0.00000002);
    }

}