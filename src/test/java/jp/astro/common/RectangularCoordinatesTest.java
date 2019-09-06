package jp.astro.common;

import jp.astro.ephemeris.common.RectangularCoordinates;
import jp.astro.ephemeris.common.SphericalCoordinates;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RectangularCoordinatesTest {

    @Test
    void fromSphericalCoordinates() {
        SphericalCoordinates sphericalCoordinates = new SphericalCoordinates(-40.49149668145844, -3.3750780548053626E-6, 0.9976085216575783);
        System.out.println("Spherical coordinates: " + sphericalCoordinates.toString());

        RectangularCoordinates rectangularCoordinates = RectangularCoordinates.fromSphericalCoordinates(sphericalCoordinates);

        System.out.println("Rectangular coordinates: " + rectangularCoordinates.toString());

        assertEquals(-0.9373969180760959, rectangularCoordinates.x, 0.0000000000000001);
        assertEquals(-0.34133529037285215, rectangularCoordinates.y, 0.00000000000000001);
        assertEquals(-3.3670066287269203E-6, rectangularCoordinates.z, 0.0000000000000001E-6);
    }
}