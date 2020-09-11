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

        final Transit transit = rtsEventCalculator.computeTransit();
        final RiseSet riseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SMALL_BODIES);

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

        final Transit transit = rtsEventCalculator.computeTransit();
        final RiseSet riseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SUN);

        System.out.printf("   Sun rise: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.risingTime), Formatter.DEGREES.apply(riseSet.risingAzimuth));
        System.out.printf("Sun transit: %s, at %s%n", JulianDay.toDateTime(ut + transit.time), Formatter.DEGREES.apply(transit.altitude));
        System.out.printf("    Sun set: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.settingTime), Formatter.DEGREES.apply(riseSet.settingAzimuth));

        assertEquals(0.25301, riseSet.risingTime, 0.00001);
        assertEquals(117.88084, Math.toDegrees(riseSet.risingAzimuth), 0.00001);

        assertEquals(0.44122, transit.time, 0.00001);
        assertEquals(20.28465, Math.toDegrees(transit.altitude), 0.00001);

        assertEquals(0.62899, riseSet.settingTime, 0.00001);
        assertEquals(241.93358, Math.toDegrees(riseSet.settingAzimuth), 0.00001);
    }

    @Test
    void computeForSunDuringEquinox() {
        final double ut = JulianDay.fromDate(2020, 3, 20);

        final List<AstronomicalCoordinates> coords = Arrays.asList(
                new AstronomicalCoordinates(Radians.fromHours(23, 54, 46.21), Radians.fromDegrees(0, 34, 08.52)),
                new AstronomicalCoordinates(Radians.fromHours(23, 58, 25.15), Radians.fromDegrees(0, 10, 25.31)),
                new AstronomicalCoordinates(Radians.fromHours(00, 02, 03.96), Radians.fromDegrees(0, 13, 17.35)));

        final GeographicCoordinates observerCoords = new GeographicCoordinates(
                Radians.fromDegrees(-16, 52, 28.2),
                Radians.fromDegrees(52, 23, 39.85)
        );

        final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(ut);
        final double apparentGreenwichSiderealTime = meanGreenwichSiderealTime; // FixMe

        final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coords, observerCoords, apparentGreenwichSiderealTime, 56.0);

        final Transit transit = rtsEventCalculator.computeTransit();
        final RiseSet riseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SUN);

        System.out.printf("Date: %s%n", JulianDay.toDateTime(ut));
        System.out.printf("   Sun rise: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.risingTime), Formatter.DEGREES.apply(riseSet.risingAzimuth));
        System.out.printf("Sun transit: %s, at %s%n", JulianDay.toDateTime(ut + transit.time), Formatter.DEGREES.apply(transit.altitude));
        System.out.printf("    Sun set: %s, at %s%n", JulianDay.toDateTime(ut + riseSet.settingTime), Formatter.DEGREES.apply(riseSet.settingAzimuth));

        assertEquals(0.20325, riseSet.risingTime, 0.00001);
        assertEquals(88.6763, Math.toDegrees(riseSet.risingAzimuth), 0.00001);

        assertEquals(0.45753, transit.time, 0.00001);
        assertEquals(37.74619, Math.toDegrees(transit.altitude), 0.00001);

        assertEquals(0.71185, riseSet.settingTime, 0.00001);
        assertEquals(271.34803, Math.toDegrees(riseSet.settingAzimuth), 0.00001);
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

        final Transit transit = rtsEventCalculator.computeTransit();
        final RiseSet riseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_MOON);

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
    void computeForMoon2() {
        final double ut12 = JulianDay.fromDate(2019, 12, 12);
        final double ut13 = JulianDay.fromDate(2019, 12, 13);
        final double ut14 = JulianDay.fromDate(2019, 12, 14);

        final AstronomicalCoordinates coords11 = new AstronomicalCoordinates(Radians.fromHours(4, 07, 19.75), Radians.fromDegrees(17, 22, 27.05));
        final AstronomicalCoordinates coords12 = new AstronomicalCoordinates(Radians.fromHours(5, 02, 05.27), Radians.fromDegrees(20, 20, 30.26));
        final AstronomicalCoordinates coords13 = new AstronomicalCoordinates(Radians.fromHours(5, 59, 52.26), Radians.fromDegrees(22, 12, 57.34));
        final AstronomicalCoordinates coords14 = new AstronomicalCoordinates(Radians.fromHours(6, 59, 45.95), Radians.fromDegrees(22, 46, 02.53));
        final AstronomicalCoordinates coords15 = new AstronomicalCoordinates(Radians.fromHours(8, 00, 21.41), Radians.fromDegrees(21, 52, 44.82));

        final GeographicCoordinates observerCoords = new GeographicCoordinates(
                Radians.fromDegrees(-16, 52, 28.2),
                Radians.fromDegrees(52, 23, 39.85)
        );

        final double meanGreenwichSiderealTime12 = SiderealTime.getGreenwichMean(ut12);
        final double apparentGreenwichSiderealTime12 = meanGreenwichSiderealTime12; // FixMe

        final double meanGreenwichSiderealTime13 = SiderealTime.getGreenwichMean(ut13);
        final double apparentGreenwichSiderealTime13 = meanGreenwichSiderealTime13; // FixMe

        final double meanGreenwichSiderealTime14 = SiderealTime.getGreenwichMean(ut14);
        final double apparentGreenwichSiderealTime14 = meanGreenwichSiderealTime14; // FixMe

        final RiseTransitSetEventCalculator rtsEventCalculator12 = new RiseTransitSetEventCalculator(
                Arrays.asList(coords11, coords12, coords13),
                observerCoords,
                apparentGreenwichSiderealTime12,
                56.0);

        final Transit transit12 = rtsEventCalculator12.computeTransit();
        final RiseSet riseSet12 = rtsEventCalculator12.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_MOON);

        System.out.printf("Date: %s%n", JulianDay.toDateTime(ut12));
        System.out.printf("   Moon rise: %s (%f), at %s azimuth%n", JulianDay.toDateTime(ut12 + riseSet12.risingTime), riseSet12.risingTime, Formatter.DEGREES.apply(riseSet12.risingAzimuth));
        System.out.printf("Moon transit: %s (%f), at %s altitude%n", JulianDay.toDateTime(ut12 + transit12.time), transit12.time, Formatter.DEGREES.apply(transit12.altitude));
        System.out.printf("    Moon set: %s (%f), at %s azimuth%n%n", JulianDay.toDateTime(ut12 + riseSet12.settingTime), riseSet12.settingTime, Formatter.DEGREES.apply(riseSet12.settingAzimuth));

        final RiseTransitSetEventCalculator rtsEventCalculator13 = new RiseTransitSetEventCalculator(
                Arrays.asList(coords12, coords13, coords14),
                observerCoords,
                apparentGreenwichSiderealTime13,
                56.0);

        final Transit transit13 = rtsEventCalculator13.computeTransit();
        final RiseSet riseSet13 = rtsEventCalculator13.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_MOON);

        System.out.printf("Date: %s%n", JulianDay.toDateTime(ut13));
        System.out.printf("   Moon rise: %s (%f), at %s azimuth%n", JulianDay.toDateTime(ut13 + riseSet13.risingTime), riseSet13.risingTime, Formatter.DEGREES.apply(riseSet13.risingAzimuth));
        System.out.printf("Moon transit: %s (%f), at %s altitude%n", JulianDay.toDateTime(ut13 + transit13.time), transit13.time, Formatter.DEGREES.apply(transit13.altitude));
        System.out.printf("    Moon set: %s (%f), at %s azimuth%n%n", JulianDay.toDateTime(ut13 + riseSet13.settingTime), riseSet13.settingTime, Formatter.DEGREES.apply(riseSet13.settingAzimuth));

        final RiseTransitSetEventCalculator rtsEventCalculator14 = new RiseTransitSetEventCalculator(
                Arrays.asList(coords13, coords14, coords15),
                observerCoords,
                apparentGreenwichSiderealTime14,
                56.0);

        final Transit transit14 = rtsEventCalculator14.computeTransit();
        final RiseSet riseSet14 = rtsEventCalculator14.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_MOON);

        System.out.printf("Date: %s%n", JulianDay.toDateTime(ut14));
        System.out.printf("   Moon rise: %s (%f), at %s azimuth%n", JulianDay.toDateTime(ut14 + riseSet14.risingTime), riseSet14.risingTime, Formatter.DEGREES.apply(riseSet14.risingAzimuth));
        System.out.printf("Moon transit: %s (%f), at %s altitude%n", JulianDay.toDateTime(ut14 + transit14.time), transit14.time, Formatter.DEGREES.apply(transit14.altitude));
        System.out.printf("    Moon set: %s (%f), at %s azimuth%n%n", JulianDay.toDateTime(ut14 + riseSet14.settingTime), riseSet14.settingTime, Formatter.DEGREES.apply(riseSet14.settingAzimuth));

        assertEquals(0.66213, riseSet13.risingTime, 0.00001);
        assertEquals(51.31872, Math.toDegrees(riseSet13.risingAzimuth), 0.00001);

        assertEquals(1.01491, transit13.time, 0.00001);
        assertEquals(60.37508, Math.toDegrees(transit13.altitude), 0.00001);

        assertEquals(0.32854, riseSet13.settingTime, 0.00001);
        assertEquals(308.61411, Math.toDegrees(riseSet13.settingAzimuth), 0.00001);
    }

    @Test
    void bringToZeroOneRange() {
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(-1.75));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(-0.75));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(0.25));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(1.25));
    }
}