package jp.albedo.common.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.Radians;
import jp.albedo.common.RectangularCoordinates;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ElongationTest {

    @Test
    void between() {
        final AstronomicalCoordinates second = AstronomicalCoordinates.fromDegrees(180.0, 0.0);
        assertEquals(0.0, Math.toDegrees(Elongation.between(AstronomicalCoordinates.fromDegrees(180.0, 0.0), second)));
        assertEquals(20.0, Math.toDegrees(Elongation.between(AstronomicalCoordinates.fromDegrees(160.0, 0.0), second)), 0.000000000001);
        assertEquals(-20.0, Math.toDegrees(Elongation.between(AstronomicalCoordinates.fromDegrees(200.0, 0.0), second)), 0.000000000001);

        final AstronomicalCoordinates zero = AstronomicalCoordinates.fromDegrees(0.0, 0.0);
        assertEquals(0.0, Math.toDegrees(Elongation.between(AstronomicalCoordinates.fromDegrees(0.0, 0.0), zero)));
        assertEquals(20.0, Math.toDegrees(Elongation.between(AstronomicalCoordinates.fromDegrees(340.0, 0.0), zero)), 0.000000000001);
        assertEquals(-20.0, Math.toDegrees(Elongation.between(AstronomicalCoordinates.fromDegrees(20.0, 0.0), zero)), 0.000000000001);
    }
}