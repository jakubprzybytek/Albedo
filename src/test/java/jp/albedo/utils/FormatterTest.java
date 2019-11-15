package jp.albedo.utils;

import jp.albedo.common.Radians;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FormatterTest {

    @Test
    void testHourAngle() {
        assertEquals("0h00m00.00s", Formatter.HOUR_ANGLE.apply(0.0));
        assertEquals("8h03m45.98s", Formatter.HOUR_ANGLE.apply(Radians.fromHours(8, 3, 45.98)));
        assertEquals("23h00m10.00s", Formatter.HOUR_ANGLE.apply(Radians.fromHours(23, 0, 10.0)));
    }

    @Test
    void testHourAngleHighResolution() {
        assertEquals("0h00m00.000000s", Formatter.HOUR_ANGLE_HIGH_RESOLUTION.apply(0.0));
        assertEquals("8h03m45.981235s", Formatter.HOUR_ANGLE_HIGH_RESOLUTION.apply(Radians.fromHours(8, 3, 45.9812347)));
        assertEquals("23h00m10.001234s", Formatter.HOUR_ANGLE_HIGH_RESOLUTION.apply(Radians.fromHours(23, 0, 10.0012344)));
    }

    @Test
    void testSeconds() {
        assertEquals("0.00s", Formatter.SECONDS.apply(0.0));
        assertEquals("1.29s", Formatter.SECONDS.apply(Radians.fromHours(0, 0, 1.29)));
    }

    @Test
    void testDegrees() {
        assertEquals("0°00'00.0\"", Formatter.DEGREES.apply(0.0));
        assertEquals("89°03'45.9\"", Formatter.DEGREES.apply(Radians.fromDegrees(89, 3, 45.9)));
        assertEquals("-127°56'00.9\"", Formatter.DEGREES.apply(Radians.fromDegrees(-127, 56, 0.9)));
        assertEquals("301°59'59.5\"", Formatter.DEGREES.apply(Radians.fromDegrees(301, 59, 59.5)));
    }

    @Test
    void testDegreesHighResolution() {
        assertEquals("0°00'00.00000\"", Formatter.DEGREES_HIGH_RESOLUTION.apply(0.0));
        assertEquals("89°03'45.91235\"", Formatter.DEGREES_HIGH_RESOLUTION.apply(Radians.fromDegrees(89, 3, 45.912347)));
        assertEquals("301°59'59.51234\"", Formatter.DEGREES_HIGH_RESOLUTION.apply(Radians.fromDegrees(301, 59, 59.512344)));
    }

    @Test
    void testArcSeconds() {
        assertEquals("0.0\"", Formatter.ARCSECONDS.apply(0.0));
        assertEquals("1.3\"", Formatter.ARCSECONDS.apply(Radians.fromDegrees(0, 0, 1.29)));
    }

}