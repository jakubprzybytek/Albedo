package jp.albedo.common;

import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.ephemeris.common.SphericalCoordinates;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RectangularCoordinatesTest {

    @Test
    public void fromSphericalCoordinates() {
        SphericalCoordinates sphericalCoordinates = new SphericalCoordinates(-40.49149668145844, -3.3750780548053626E-6, 0.9976085216575783);
        System.out.println("Spherical coordinates: " + sphericalCoordinates.toString());

        RectangularCoordinates rectangularCoordinates = RectangularCoordinates.fromSpherical(sphericalCoordinates);

        System.out.println("Rectangular coordinates: " + rectangularCoordinates.toString());

        assertEquals(-0.9373969180760959, rectangularCoordinates.x, 0.0000000000000001);
        assertEquals(-0.34133529037285215, rectangularCoordinates.y, 0.00000000000000001);
        assertEquals(-3.3670066287269203E-6, rectangularCoordinates.z, 0.0000000000000001E-6);
    }

    @Test
    public void adding() {
        RectangularCoordinates first = new RectangularCoordinates(1.0, 2.0, 3.0);
        RectangularCoordinates second = new RectangularCoordinates(4.0, 5.0, 6.0);
        RectangularCoordinates sum = first.add(second);

        assertEquals(5, sum.x);
        assertEquals(7, sum.y);
        assertEquals(9, sum.z);
    }

    @Test
    public void distance() {
        RectangularCoordinates first = new RectangularCoordinates(1.0, 2.0, 3.0);

        assertEquals(3.7416573867739413, first.getDistance());
    }
}