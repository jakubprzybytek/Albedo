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
    void computeForJdVenusVariousTimeSpanPoints() throws JPLException {

        final double beginningJde = 2433264.5;
        final RectangularCoordinates beginningCoordsAU = this.stateCalculator.computeForJd(Body.Venus, beginningJde);
        final RectangularCoordinates beginningCoordsKm = beginningCoordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Venus coords [km] for %.1f [JDE]: %s, distance=%f%n", beginningJde, beginningCoordsKm, beginningCoordsKm.getDistance());

        assertEquals(64381880.39107707, beginningCoordsKm.x);
        assertEquals(81043957.05098075, beginningCoordsKm.y);
        //assertEquals(81043957.05098076, beginningCoordsKm.y);
        assertEquals(32359613.666025978, beginningCoordsKm.z);
        //assertEquals(32359613.66602598, beginningCoordsKm.z);

        final double middleJde = 2433280.5;
        final RectangularCoordinates middleCoordsAU = this.stateCalculator.computeForJd(Body.Venus, middleJde);
        final RectangularCoordinates middleCoordsKm = middleCoordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Venus coords [km] for %.1f [JDE]: %s, distance=%f%n", middleJde, middleCoordsKm, middleCoordsKm.getDistance());

        assertEquals(20230700.80839136, middleCoordsKm.x);
        assertEquals(97367801.62804152, middleCoordsKm.y);
        assertEquals(42496398.48356129, middleCoordsKm.z);

        final double endingJde = 2433296.5;
        final RectangularCoordinates endingCoordsAU = this.stateCalculator.computeForJd(Body.Venus, endingJde);
        final RectangularCoordinates endingCoordsKm = endingCoordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Venus coords [km] for %.1f [JDE]: %s, distance=%f%n", endingJde, endingCoordsKm, endingCoordsKm.getDistance());

        assertEquals(-27913817.750632998, endingCoordsKm.x);
        //assertEquals(-27913817.75063300, endingCoordsKm.x);
        assertEquals(94357865.3933443, endingCoordsKm.y);
        //assertEquals(94357865.39334433, endingCoordsKm.y);
        assertEquals(44191400.4656817, endingCoordsKm.z);
        //assertEquals(44191400.46568169, endingCoordsKm.z);
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
    void computeForMercuryToVenus() throws JPLException {
        final double jde = JulianDay.fromDate(2019, 10, 9);
        System.out.printf("T [JDE]: %f%n", jde);

        final RectangularCoordinates mercuryCoordsAU = this.stateCalculator.computeForJd(Body.Mercury, jde);
        final RectangularCoordinates mercuryCoordsKm = mercuryCoordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Mercury coords [km]: %s, distance=%f%n", mercuryCoordsKm, mercuryCoordsKm.getDistance());

        final RectangularCoordinates venusCoordsAU = this.stateCalculator.computeForJd(Body.Venus, jde);
        final RectangularCoordinates venusCoordsKm = venusCoordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Venus coords [km]: %s, distance=%f%n", venusCoordsKm, venusCoordsKm.getDistance());

        final RectangularCoordinates mercurycentricVenusCoords = venusCoordsKm.subtract(mercuryCoordsKm);

        System.out.printf("Venus from Mercury coords [km]: %s, distance=%f%n", mercurycentricVenusCoords, mercurycentricVenusCoords.getDistance());

        assertEquals(-72039776.31409961, mercurycentricVenusCoords.x);
        //assertEquals(-72039776.31409962, mercurycentricVenusCoords.x);
        assertEquals(-17562170.093865402, mercurycentricVenusCoords.y);
        //assertEquals(-17562170.09386544, mercurycentricVenusCoords.y);
        assertEquals(1925977.0675086454, mercurycentricVenusCoords.z);
        //assertEquals(1925977.06750864, mercurycentricVenusCoords.z);
    }

    @Test
    void computeForEarthAndCompareWithVSOP() throws JPLException, VSOPException {

        final double jde = 2433264.5;
        final SphericalCoordinates earthVSOPCoords = VSOP87Calculator.computeEarthEclipticSphericalCoordinatesJ2000(jde);
        RectangularCoordinates earthVSOPRectCoords = RectangularCoordinates.fromSpherical(earthVSOPCoords);
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
    void computeForMoonFromEarth() throws JPLException {

        final double jde = JulianDay.fromDate(2019, 10, 9);
        System.out.printf("T [JDE]: %.1f%n", jde);

        final RectangularCoordinates moonCoordsAu = this.stateCalculator.computeForJd(Body.Moon, jde);
        final RectangularCoordinates moonCoordsKm = moonCoordsAu.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Moon coords [km]: %s, distance=%f%n", moonCoordsKm, moonCoordsKm.getDistance());

        assertEquals(317255.79347753973, moonCoordsKm.x);
        //assertEquals(317255.79347754, moonCoordsKm.x);
        assertEquals(-220341.79908000148, moonCoordsKm.y);
        //assertEquals(-220341.79908000, moonCoordsKm.y);
        assertEquals(-119833.86836880309, moonCoordsKm.z);
        //assertEquals(-119833.86836880, moonCoordsKm.z);
    }

    @Test
    void computeForEarth() throws JPLException {

        final double jde = JulianDay.fromDate(2019, 10, 9);
        System.out.printf("T [JDE]: %.1f%n", jde);

        final RectangularCoordinates earthBarycenterHeliocentricCoords = this.stateCalculator.computeForJd(Body.EarthMoonBarycenter, jde);
        final RectangularCoordinates earthBarycenterHeliocentricCoordsKm = earthBarycenterHeliocentricCoords.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Earth barycenter coords: %s, distance=%f%n", earthBarycenterHeliocentricCoordsKm, earthBarycenterHeliocentricCoordsKm.getDistance());

        assertEquals(143815286.22865084, earthBarycenterHeliocentricCoordsKm.x);
        //assertEquals(143815286.22865087, earthBarycenterCoordsKm.x);
        assertEquals(36853958.97885629, earthBarycenterHeliocentricCoordsKm.y);
        //assertEquals(36853958.97885630, earthBarycenterCoordsKm.y);
        assertEquals(15976402.57686801, earthBarycenterHeliocentricCoordsKm.z);


        final RectangularCoordinates moonGeocentricCoordsAu = this.stateCalculator.computeForJd(Body.Moon, jde);
        final RectangularCoordinates moonGeocentricCoordsKm = moonGeocentricCoordsAu.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Moon coords [km]: %s, distance=%f%n", moonGeocentricCoordsKm, moonGeocentricCoordsKm.getDistance());

        final double earthToBarycenterDistance = moonGeocentricCoordsKm.getDistance() / (1 + this.spKernel.getConstant(Constant.EarthMoonMassRatio));
        System.out.printf("Earth to earth-moon barycenter distance: %f%n", earthToBarycenterDistance);

        final RectangularCoordinates earthFromEarthBarycenterCoordsKm = moonGeocentricCoordsKm.multiplyBy(
                (earthToBarycenterDistance)
                        / moonGeocentricCoordsKm.getDistance());

        System.out.printf("Earth from Earth-Moon barycenter coords [km]: %s, distance=%f%n", earthFromEarthBarycenterCoordsKm, earthFromEarthBarycenterCoordsKm.getDistance());

        final RectangularCoordinates earthHeliocentricCoordsKm = earthBarycenterHeliocentricCoordsKm.subtract(earthFromEarthBarycenterCoordsKm);

        System.out.printf("Earth from Solar System barycenter coords [km]: %s, distance=%f%n", earthHeliocentricCoordsKm, earthHeliocentricCoordsKm.getDistance());

        assertEquals(143811431.3853626, earthHeliocentricCoordsKm.x);
        //assertEquals(143811431.38536263, earthHeliocentricCoordsKm.x);
        assertEquals(36856636.26047815, earthHeliocentricCoordsKm.y);
        assertEquals(15977858.62839704, earthHeliocentricCoordsKm.z);
    }

    @Test
    void computeForMars() throws JPLException {

        RectangularCoordinates coordsAU = this.stateCalculator.computeForJd(Body.Mars, 2433264.5);
        RectangularCoordinates coordsKm = coordsAU.multiplyBy(this.spKernel.getConstant(Constant.AU));

        System.out.printf("Mars coords [AU]: %s, distance=%f%n", coordsAU, coordsAU.getDistance());
        System.out.printf("Mars coords [km]: %s, distance=%f%n", coordsKm, coordsKm.getDistance());

        assertEquals(-1.2530729563820122, coordsAU.x);
        assertEquals(0.9758247108886894, coordsAU.y);
        assertEquals(0.4814597780730875, coordsAU.z);
    }

}