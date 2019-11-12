package jp.albedo.jeanmeeus.topocentric;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.common.Radians;
import jp.albedo.common.SiderealTime;
import jp.albedo.testutils.Degrees;
import org.apache.commons.math3.util.MathUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HorizontalCoordinatesTest {

    @Test
    void forPoznan() {
        final double observerLongitude = Radians.fromDegrees(-16, 52, 28.20); // positive westwards
        final double observerLatitude = Radians.fromDegrees(52, 23, 39.85);

        final AstronomicalCoordinates objectCoords = new AstronomicalCoordinates(
                Radians.fromHours(2, 9, 11.50),
                Radians.fromDegrees(12, 29, 34.3));

        final double localSiderealTime = SiderealTime.getLocalMean(JulianDay.fromDate(2019, 11, 3), observerLongitude);
        assertEquals(
                Math.toDegrees(Radians.fromHours(3, 55, 22.35)), // Stellarium: 3h55m22.3s
                Math.toDegrees(localSiderealTime),
                Degrees.ONE_HUNDREDTH_SECOND);

        final double localHourAngle = localSiderealTime - objectCoords.rightAscension;
        assertEquals(
                Math.toDegrees(Radians.fromHours(1, 46, 10.85)), // Stellarium: 1h46m08.16s
                Math.toDegrees(localHourAngle),
                Degrees.ONE_HUNDREDTH_SECOND);

        final HorizontalCoordinates azAlt = HorizontalCoordinates.forObserver(objectCoords.declination, localHourAngle, observerLatitude);
        assertEquals(
                Math.toDegrees(Radians.fromDegrees(217, 55, 37.9)), // Stellarium: 270°55'16.7
                Math.toDegrees(azAlt.azimuth),
                Degrees.ONE_TENTH_ARCSECOND);
        assertEquals(
                Math.toDegrees(Radians.fromDegrees(44, 46, 35.2)), // Stellarium: 44°47'42.0
                Math.toDegrees(azAlt.altitude),
                Degrees.ONE_TENTH_ARCSECOND);
    }

    @Test
    void testMeeus() {
        // Jean Meeus p. 95
        final double observerLongitude = Radians.fromDegrees(77, 03, 56.0); // positive westwards
        final double observerLatitude = Radians.fromDegrees(38, 55, 17.0);

        final AstronomicalCoordinates objectCoords = new AstronomicalCoordinates(
                Radians.fromHours(23, 9, 16.641),
                Radians.fromDegrees(-6, 43, 11.61));

        final double localSiderealTime = SiderealTime.getLocalMean(JulianDay.fromDateTime(1987, 4, 10, 19, 21, 0.0), observerLongitude);
        assertEquals(
                Math.toDegrees(Radians.fromHours(3, 26, 41.36)), // Stellarium: 3h26m42.4s
                Math.toDegrees(localSiderealTime),
                Degrees.ONE_HUNDREDTH_SECOND);

        final double localHourAngle = localSiderealTime - objectCoords.rightAscension;
        assertEquals(64.352133, Math.toDegrees(MathUtils.normalizeAngle(localHourAngle, Math.PI)), 0.001);

        final HorizontalCoordinates azAlt = HorizontalCoordinates.forObserver(objectCoords.declination, localHourAngle, observerLatitude);
        assertEquals(68.0337 + 180.0, Math.toDegrees(azAlt.azimuth), 0.01);
        assertEquals(15.1249, Math.toDegrees(azAlt.altitude), 0.001);
    }

}