package jp.albedo.vsop87;

import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jeanmeeus.ephemeris.common.SphericalCoordinates;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VSOP87CalculatorTest {

    @Test
    void computeEarthSphericalCoordinatesJ2000() throws VSOPException {
        final double jde = 2448908.5;
        System.out.println("Earth's spherical coordinates for JDE = " + jde);

        SphericalCoordinates earthCoordinates = VSOP87Calculator.computeEarthEclipticSphericalCoordinatesJ2000(jde);

        System.out.println(earthCoordinates.toString());

        assertEquals(-43.63308933504823, earthCoordinates.longitude, 0.00000000000001);
        assertEquals(3.3750780548053626E-6, earthCoordinates.latitude, 0.0000000000000001E-6);
        assertEquals(0.9976085216575783, earthCoordinates.distance, 0.0000000000000001);
    }

    @Test
    void computeSunSphericalCoordinatesJ2000() throws VSOPException {
        final double jde = 2448908.5;
        System.out.println("Sun's spherical coordinates for JDE = " + jde);

        SphericalCoordinates sunCoordinates = VSOP87Calculator.computeSunEclipticSphericalCoordinatesJ2000(jde);

        System.out.println(sunCoordinates.toString());

        assertEquals(-40.49149668145844, sunCoordinates.longitude, 0.00000000000001);
        assertEquals(-3.3750780548053626E-6, sunCoordinates.latitude, 0.0000000000000001E-6);
        assertEquals(0.9976085216575783, sunCoordinates.distance, 0.0000000000000001);
    }

    @Test
    void toFK5() {
        RectangularCoordinates rcVSOP = new RectangularCoordinates(-0.93739575, -0.34133625, -0.00000385);
        System.out.println("VSOP coordinates: " +rcVSOP.toString());

        RectangularCoordinates rcFK5 = VSOP87Calculator.toFK5(rcVSOP);
        System.out.println("FK5 coordinates: " +rcVSOP.toString());

        assertEquals(-0.9373959003100959, rcFK5.x, 0.0000000000000001);
        assertEquals(-0.3131679307557898, rcFK5.y, 0.0000000000000001);
        assertEquals(-0.1357792359863106, rcFK5.z, 0.0000000000000001);
    }
}