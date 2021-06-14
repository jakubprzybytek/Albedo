package jp.albedo.common;

import jp.albedo.testutils.Degrees;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RadiansTest {

    @Test
    void fromHours() {
        assertEquals(15.0, Math.toDegrees(Radians.fromHours(1, 0, 0)), Degrees.ONE_HUNDREDTH_SECOND);
        assertEquals(15.254167, Math.toDegrees(Radians.fromHours(1, 1, 1)), Degrees.ONE_HUNDREDTH_SECOND);
        assertEquals(213.9154, Math.toDegrees(Radians.fromHours(14, 15, 39.7)), Degrees.ONE_HUNDREDTH_SECOND);
        assertEquals(201.2983, Math.toDegrees(Radians.fromHours(13, 25, 11.6)), Degrees.ONE_HUNDREDTH_SECOND);
    }

    @Test
    void fromDegrees() {
        assertEquals(1.0, Math.toDegrees(Radians.fromDegrees(1, 0, 0)), Degrees.ONE_TENTH_ARCSECOND);
        assertEquals(1.016944, Math.toDegrees(Radians.fromDegrees(1, 1, 1)), Degrees.ONE_TENTH_ARCSECOND);
        assertEquals(19.1825, Math.toDegrees(Radians.fromDegrees(19, 10, 57.0)), Degrees.ONE_TENTH_ARCSECOND);
        assertEquals(-11.1614, Math.toDegrees(Radians.fromDegrees(-11, 9, 41.0)), Degrees.ONE_TENTH_ARCSECOND);
        assertEquals(52.3944028, Math.toDegrees(Radians.fromDegrees(52, 23, 39.85)), Degrees.ONE_TENTH_ARCSECOND);
        assertEquals(-16.8745, Math.toDegrees(Radians.fromDegrees(-16, 52, 28.2)), Degrees.ONE_TENTH_ARCSECOND);
    }

    @Test
    void separation() {
        List<AstronomicalCoordinates> first = Arrays.asList(
                AstronomicalCoordinates.fromDegrees(213.9154, 19.1825),
                new AstronomicalCoordinates(Radians.fromHours(10, 23, 17.65), Radians.fromDegrees(11, 31, 46.3)),
                new AstronomicalCoordinates(Radians.fromHours(10, 29, 44.27), Radians.fromDegrees(11, 2, 5.9)),
                new AstronomicalCoordinates(Radians.fromHours(10, 36, 19.63), Radians.fromDegrees(10, 29, 51.7)),
                new AstronomicalCoordinates(Radians.fromHours(10, 43, 1.75), Radians.fromDegrees(9, 55, 16.7)),
                new AstronomicalCoordinates(Radians.fromHours(10, 49, 48.85), Radians.fromDegrees(9, 18, 34.7))
        );

        List<AstronomicalCoordinates> second = Arrays.asList(
                AstronomicalCoordinates.fromDegrees(201.2983, -11.1614),
                new AstronomicalCoordinates(Radians.fromHours(10, 33, 1.23), Radians.fromDegrees(10, 42, 53.5)),
                new AstronomicalCoordinates(Radians.fromHours(10, 33, 29.64), Radians.fromDegrees(10, 40, 13.2)),
                new AstronomicalCoordinates(Radians.fromHours(10, 33, 57.97), Radians.fromDegrees(10, 37, 33.4)),
                new AstronomicalCoordinates(Radians.fromHours(10, 34, 26.22), Radians.fromDegrees(10, 34, 53.9)),
                new AstronomicalCoordinates(Radians.fromHours(10, 34, 54.39), Radians.fromDegrees(10, 32, 14.9))
        );

        List<Double> expected = Arrays.asList(
                32.7930,
                2.5211,
                0.9917,
                0.5943,
                2.2145,
                3.8710
        );

        for (int i = 0; i < first.size(); i++) {
            assertEquals(expected.get(i), Math.toDegrees(Radians.separation(first.get(i), second.get(i))), 0.0001);
        }
    }

    @Test
    void between() {
        final RectangularCoordinates second = new RectangularCoordinates(1.0, 0.0, 0.0);
        assertEquals(45.0, Math.toDegrees(Radians.between(new RectangularCoordinates(1.0, 1.0, 0.0), second)), 0.00000000000001);
        assertEquals(90.0, Math.toDegrees(Radians.between(new RectangularCoordinates(0.0, 1.0, 0.0), second)));
        assertEquals(135.0, Math.toDegrees(Radians.between(new RectangularCoordinates(-1.0, 1.0, 0.0), second)));
        assertEquals(180.0, Math.toDegrees(Radians.between(new RectangularCoordinates(-1.0, 0.0, 0.0), second)));
        assertEquals(135.0, Math.toDegrees(Radians.between(new RectangularCoordinates(-1.0, -1.0, 0.0), second)));
        assertEquals(90.0, Math.toDegrees(Radians.between(new RectangularCoordinates(0.0, -1.0, 0.0), second)));
        assertEquals(45.0, Math.toDegrees(Radians.between(new RectangularCoordinates(1.0, -1.0, 0.0), second)), 0.00000000000001);
    }

    @Test
    void positionAngle() {
        assertEquals(0.0, Math.toDegrees(Radians.positionAngle(
                AstronomicalCoordinates.fromDegrees(100.0, 55.0),
                AstronomicalCoordinates.fromDegrees(100.0, 45.0)
        )), 0.00000000000001);

        assertEquals(90.0, Math.toDegrees(Radians.positionAngle(
                AstronomicalCoordinates.fromDegrees(100.0, 0.0),
                AstronomicalCoordinates.fromDegrees(90.0, 0.0)
        )), 0.00000000000001);

        assertEquals(90.0, Math.toDegrees(Radians.positionAngle(
                AstronomicalCoordinates.fromDegrees(5.0, 0.0),
                AstronomicalCoordinates.fromDegrees(355.0, 0.0)
        )), 0.00000000000001);

        assertEquals(180.0, Math.toDegrees(Radians.positionAngle(
                AstronomicalCoordinates.fromDegrees(100.0, 55.0),
                AstronomicalCoordinates.fromDegrees(100.0, 65.0)
        )), 0.00000000000001);

        assertEquals(-90.0, Math.toDegrees(Radians.positionAngle(
                AstronomicalCoordinates.fromDegrees(100.0, 0.0),
                AstronomicalCoordinates.fromDegrees(110.0, 0.0)
        )), 0.00000000000001);
    }
}