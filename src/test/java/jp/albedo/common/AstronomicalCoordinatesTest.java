package jp.albedo.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AstronomicalCoordinatesTest {

    @Test
    void testSubtract() {
        AstronomicalCoordinates first = AstronomicalCoordinates.fromDegrees(15.25, 220.75);
        AstronomicalCoordinates second = AstronomicalCoordinates.fromDegrees(16.25, 210.25);
        AstronomicalCoordinates subtract = second.subtract(first);

        assertEquals(1.0, Math.toDegrees(subtract.rightAscension), 0.000000000000002);
        assertEquals(-10.5, Math.toDegrees(subtract.declination), 0.000000000000009);
    }

    @Test
    void testToString() {
        assertEquals("[α=1h02m03.45s (15.514375°), δ=6°07'08.9\" (6.119139°)]", new AstronomicalCoordinates(
                Radians.fromHours(1, 2, 3.45),
                Radians.fromDegrees(6, 7, 8.9)
        ).toString());
    }

    @Test
    void testToStringHighResolution() {
        assertEquals("[α=1h02m03.456789s (15.5144032875°), δ=6°07'08.90123\" (6.1191392306°)]", new AstronomicalCoordinates(
                Radians.fromHours(1, 2, 3.456789),
                Radians.fromDegrees(6, 7, 8.90123)
        ).toStringHighResolution());
    }
}