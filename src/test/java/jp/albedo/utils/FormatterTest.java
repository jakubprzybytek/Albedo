package jp.albedo.utils;

import jp.albedo.common.Radians;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FormatterTest {

    @Test
    void testHourAngleFormatter() {
        assertEquals("0h00m00.00s", Formatter.HOUR_ANGLE.apply(0.0));
        assertEquals("8h03m45.98s", Formatter.HOUR_ANGLE.apply(Radians.fromHours(8, 3, 45.98)));
        assertEquals("23h00m10.00s", Formatter.HOUR_ANGLE.apply(Radians.fromHours(23, 0, 10.0)));
    }

    @Test
    void testDegreesFormatter() {
        assertEquals("0°00'00.0", Formatter.DEGREES.apply(0.0));
        assertEquals("89°03'45.9", Formatter.DEGREES.apply(Radians.fromDegrees(89, 3, 45.9)));
        assertEquals("301°59'59.5", Formatter.DEGREES.apply(Radians.fromDegrees(301, 59, 59.5)));
    }

}