package jp.albedo.common;

import jp.albedo.testutils.Degrees;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SiderealTimeTest {


    @Test
    void getGreenwichMean() {
        assertEquals(
                Math.toDegrees(Radians.fromHours(13, 10, 46.3668)),
                Math.toDegrees(SiderealTime.getGreenwichMean(JulianDay.fromDate(1987, 4, 10))),
                Degrees.ONE_HUNDREDTH_SECOND);

        // Meeus
        assertEquals(
                Math.toDegrees(Radians.fromHours(8, 34, 57.0896)),
                Math.toDegrees(SiderealTime.getGreenwichMean(JulianDay.fromDateTime(1987, 4, 10, 19, 21, 0.0))),
                Degrees.ONE_HUNDREDTH_SECOND);

        assertEquals(
                41.96862608990873,
                Math.toDegrees(SiderealTime.getGreenwichMean(JulianDay.fromDate(2019, 11, 3))));
    }

    @Test
    void getLocalMean() {
        final double observerLongitude = Radians.fromDegrees(77, 3, 56.0);

        assertEquals(
                Math.toDegrees(Radians.fromHours(8, 02, 30.63)), // Stellarium: 8h02m31.6s
                Math.toDegrees(SiderealTime.getLocalMean(JulianDay.fromDate(1987, 4, 10), observerLongitude)),
                Degrees.ONE_HUNDREDTH_SECOND);

        assertEquals(
                Math.toDegrees(Radians.fromHours(3, 26, 41.36)), // Stellarium: 3h26m42.4s
                Math.toDegrees(SiderealTime.getLocalMean(JulianDay.fromDateTime(1987, 4, 10, 19, 21, 0.0), observerLongitude)),
                Degrees.ONE_HUNDREDTH_SECOND);
    }

}