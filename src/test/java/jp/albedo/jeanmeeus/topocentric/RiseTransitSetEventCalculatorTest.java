package jp.albedo.jeanmeeus.topocentric;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.common.Radians;
import jp.albedo.jeanmeeus.sidereal.SiderealTime;
import jp.albedo.testutils.Degrees;
import jp.albedo.utils.Formatter;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RiseTransitSetEventCalculatorTest {

    /**
     * From Meeus, p. 103
     */
    @Test
    void computeForVenus() {
        final List<AstronomicalCoordinates> coords = Arrays.asList(
                AstronomicalCoordinates.fromDegrees(40.68021, 18.04761),
                AstronomicalCoordinates.fromDegrees(41.73129, 18.44092),
                AstronomicalCoordinates.fromDegrees(42.78204, 18.82742));

        final GeographicCoordinates observerCoords = GeographicCoordinates.fromDegrees(71.0833, 42.3333);

        //double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(JulianDay.fromDate(1988, 3, 20));
        final double apparentGreenwichSiderealTime = Radians.fromHours(11, 50, 58.10);
        assertEquals(
                Math.toDegrees(Radians.fromHours(11, 50, 58.10)), // Meeus: 11h50m58.10s
                Math.toDegrees(apparentGreenwichSiderealTime),
                Degrees.ONE_HUNDREDTH_SECOND
        );

        final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coords, observerCoords, apparentGreenwichSiderealTime, 56.0);

        final Transit transit = rtsEventCalculator.computeTransitTime();
        final RiseSet riseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SMALL_BODIES);

        assertEquals(0.51766, riseSet.risingTime, 0.00001);
        assertEquals(63.80345, Math.toDegrees(riseSet.risingAzimuth), 0.00001);

        assertEquals(0.81980, transit.time, 0.00001);
        assertEquals(66.42517, Math.toDegrees(transit.altitude), 0.00001);

        assertEquals(0.12130, riseSet.settingTime, 0.00001);
        assertEquals(295.97657, Math.toDegrees(riseSet.settingAzimuth), 0.00001);
    }

    @Test
    void computeForSun() {
        final double ut = JulianDay.fromDate(2019, 11, 11);

        final List<AstronomicalCoordinates> coords = Arrays.asList(
                new AstronomicalCoordinates(Radians.fromHours(14, 58, 11.20), Radians.fromDegrees(-16, 54, 56.1)),
                new AstronomicalCoordinates(Radians.fromHours(15, 2, 13.21), Radians.fromDegrees(-17, 11, 52.1)),
                new AstronomicalCoordinates(Radians.fromHours(15, 6, 16.05), Radians.fromDegrees(-17, 28, 30.5)));

        final GeographicCoordinates observerCoords = new GeographicCoordinates(
                Radians.fromDegrees(-16, 52, 28.2),
                Radians.fromDegrees(52, 23, 39.85)
        );

        final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(ut);
        final double apparentGreenwichSiderealTime = meanGreenwichSiderealTime; // FixMe
        assertEquals(
                Math.toDegrees(Radians.fromHours(3, 19, 24.91)),
                Math.toDegrees(apparentGreenwichSiderealTime),
                Degrees.ONE_HUNDREDTH_SECOND
        );

        final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coords, observerCoords, apparentGreenwichSiderealTime, 56.0);

        final Transit transit = rtsEventCalculator.computeTransitTime();
        final RiseSet riseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SUN);

        System.out.printf("Sun rise: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.risingTime), Formatter.DEGREES.apply(riseSet.risingAzimuth));
        System.out.printf("Sun transit: %s, at %s%n", JulianDay.toDateTime(ut + transit.time), Formatter.DEGREES.apply(transit.altitude));
        System.out.printf("Sun set: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.settingTime), Formatter.DEGREES.apply(riseSet.settingAzimuth));

        assertEquals(0.25301, riseSet.risingTime, 0.00001);
        assertEquals(117.88084, Math.toDegrees(riseSet.risingAzimuth), 0.00001);

        assertEquals(0.44122, transit.time, 0.00001);
        assertEquals(20.28465, Math.toDegrees(transit.altitude), 0.00001);

        assertEquals(0.62899, riseSet.settingTime, 0.00001);
        assertEquals(241.93358, Math.toDegrees(riseSet.settingAzimuth), 0.00001);
    }

    @Test
    void computeForMoon() {
        final double ut = JulianDay.fromDate(2019, 11, 11);

        final List<AstronomicalCoordinates> coords = Arrays.asList(
                new AstronomicalCoordinates(Radians.fromHours(1, 11, 56.68), Radians.fromDegrees(1, 38, 33.6)),
                new AstronomicalCoordinates(Radians.fromHours(1, 57, 21.76), Radians.fromDegrees(6, 21, 57.5)),
                new AstronomicalCoordinates(Radians.fromHours(2, 44, 28.06), Radians.fromDegrees(10, 53, 45.1)));

        final GeographicCoordinates observerCoords = new GeographicCoordinates(
                Radians.fromDegrees(-16, 52, 28.2),
                Radians.fromDegrees(52, 23, 39.85)
        );

        final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(ut);
        final double apparentGreenwichSiderealTime = meanGreenwichSiderealTime; // FixMe
        assertEquals(
                Math.toDegrees(Radians.fromHours(3, 19, 24.91)),
                Math.toDegrees(apparentGreenwichSiderealTime),
                Degrees.ONE_HUNDREDTH_SECOND
        );

        final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coords, observerCoords, apparentGreenwichSiderealTime, 56.0);

        final Transit transit = rtsEventCalculator.computeTransitTime();
        final RiseSet riseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_MOON);

        System.out.printf("Sun rise: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.risingTime), Formatter.DEGREES.apply(riseSet.risingAzimuth));
        System.out.printf("Moon transit: %s, at %s%n", JulianDay.toDateTime(ut + transit.time), Formatter.DEGREES.apply(transit.altitude));
        System.out.printf("Sun set: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.settingTime), Formatter.DEGREES.apply(riseSet.settingAzimuth));

        assertEquals(0.63158, riseSet.risingTime, 0.00001);
        assertEquals(74.97204, Math.toDegrees(riseSet.risingAzimuth), 0.00001);

        assertEquals(0.92297, transit.time, 0.00001);
        assertEquals(48.04289, Math.toDegrees(transit.altitude), 0.00001);

        assertEquals(0.17656, riseSet.settingTime, 0.00001);
        assertEquals(281.59755, Math.toDegrees(riseSet.settingAzimuth), 0.00001);
    }

    @Test
    void bringToZeroOneRange() {
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(-1.75));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(-0.75));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(0.25));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(1.25));
    }
}