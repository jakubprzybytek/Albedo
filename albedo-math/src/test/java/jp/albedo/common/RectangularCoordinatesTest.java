package jp.albedo.common;

import jp.albedo.jeanmeeus.ephemeris.common.SphericalCoordinates;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.junit.jupiter.api.Assertions.assertEquals;

class RectangularCoordinatesTest {

    @Test
    public void fromSphericalCoordinates() {
        SphericalCoordinates sphericalCoordinates = new SphericalCoordinates(-40.49149668145844, -3.3750780548053626E-6, 0.9976085216575783);
        System.out.println("Spherical coordinates: " + sphericalCoordinates.toString());

        RectangularCoordinates rectangularCoordinates = RectangularCoordinates.fromSpherical(sphericalCoordinates);

        System.out.println("Rectangular coordinates: " + rectangularCoordinates.toString());

        Assertions.assertAll(
                () -> assertThat(rectangularCoordinates.x).isEqualTo(-0.9373969180760959),
                () -> assertThat(rectangularCoordinates.y).isEqualTo(-0.34133529037285215),
                () -> assertThat(rectangularCoordinates.z).isEqualTo(-3.3670066287269203E-6)
        );
    }

    @Test
    public void negating() {
        RectangularCoordinates first = new RectangularCoordinates(1.0, 2.0, 3.0);
        RectangularCoordinates negative = first.negate();

        Assertions.assertAll(
                () -> assertThat(negative.x).isEqualTo(-1.0),
                () -> assertThat(negative.y).isEqualTo(-2.0),
                () -> assertThat(negative.z).isEqualTo(-3.0)
        );
    }

    @Test
    public void normalize() {
        RectangularCoordinates first = new RectangularCoordinates(3.0, 4.0, 5.0);
        RectangularCoordinates normalized = first.normalize();

        Assertions.assertAll(
                () -> assertThat(normalized.length()).isEqualTo(1.0, within(0.0000000000000002)),
                () -> assertThat(normalized.x).isEqualTo(0.4242640687119285),
                () -> assertThat(normalized.y).isEqualTo(0.565685424949238),
                () -> assertThat(normalized.z).isEqualTo(0.7071067811865475)
        );
    }

    @Test
    public void adding() {
        RectangularCoordinates first = new RectangularCoordinates(1.0, 2.0, 3.0);
        RectangularCoordinates second = new RectangularCoordinates(4.0, 5.0, 6.0);
        RectangularCoordinates sum = first.add(second);

        Assertions.assertAll(
                () -> assertThat(sum.x).isEqualTo(5.0),
                () -> assertThat(sum.y).isEqualTo(7.0),
                () -> assertThat(sum.z).isEqualTo(9.0)
        );
    }

    @Test
    public void subtracting() {
        RectangularCoordinates first = new RectangularCoordinates(1.0, 2.0, 3.0);
        RectangularCoordinates second = new RectangularCoordinates(4.0, 5.0, 6.0);
        RectangularCoordinates sum = first.subtract(second);

        Assertions.assertAll(
                () -> assertThat(sum.x).isEqualTo(-3.0),
                () -> assertThat(sum.y).isEqualTo(-3.0),
                () -> assertThat(sum.z).isEqualTo(-3.0)
        );
    }

    @Test
    public void distance() {
        RectangularCoordinates first = new RectangularCoordinates(1.0, 2.0, 3.0);

        assertEquals(3.7416573867739413, first.length());
    }

    @Test
    public void scalarProduct() {
        RectangularCoordinates first = new RectangularCoordinates(1.0, 3.0, -5.0);
        RectangularCoordinates second = new RectangularCoordinates(4.0, -2.0, -1.0);

        assertThat(first.scalarProduct(second)).isEqualTo(3.0);
    }

    @Test
    public void crossProduct() {
        RectangularCoordinates first = new RectangularCoordinates(2.0, 3.0, 4.0);
        RectangularCoordinates second = new RectangularCoordinates(5.0, 6.0, 7.0);

        RectangularCoordinates crossProduct = first.crossProduct(second);

        Assertions.assertAll(
                () -> assertThat(crossProduct.x).isEqualTo(-3.0),
                () -> assertThat(crossProduct.y).isEqualTo(6.0),
                () -> assertThat(crossProduct.z).isEqualTo(-3.0)
        );
    }

    @Test
    public void rotate() {
        RectangularCoordinates v = new RectangularCoordinates(0.0, -1.0, 0.0);
        RectangularCoordinates axis = new RectangularCoordinates(0.0, 0.0, 1.0);

        RectangularCoordinates rotated = v.rotate(axis, Math.toRadians(90.0));

        Assertions.assertAll(
                () -> assertThat(rotated.x).isEqualTo(1.0, within(0.0000000000000002)),
                () -> assertThat(rotated.y).isEqualTo(0.0, within(0.0000000000000002)),
                () -> assertThat(rotated.z).isEqualTo(0.0, within(0.0000000000000002))
        );
    }

}