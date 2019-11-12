package jp.albedo.jeanmeeus.topocentric;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.Radians;
import jp.albedo.testutils.Degrees;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RiseTransitSetEventCalculatorTest {

    @Test
    void compute() {
        List<AstronomicalCoordinates> coords = Arrays.asList(
                AstronomicalCoordinates.fromDegrees(40.68021, 18.04761),
                AstronomicalCoordinates.fromDegrees(41.73129, 18.44092),
                AstronomicalCoordinates.fromDegrees(42.78204, 18.82742));

        GeographicCoordinates observerCoords = GeographicCoordinates.fromDegrees(71.0833, 42.3333);

        //double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(JulianDay.fromDate(1988, 3, 20));
        double apparentGreenwichSiderealTime = Radians.fromHours(11, 50, 58.10);
        assertEquals(
                Math.toDegrees(Radians.fromHours(11, 50, 58.10)), // Meeus: 11h50m58.10s
                Math.toDegrees(apparentGreenwichSiderealTime),
                Degrees.ONE_HUNDREDTH_SECOND
        );

        RiseTransitSet riseTransitSet = RiseTransitSetEventCalculator.compute(coords, observerCoords, apparentGreenwichSiderealTime, 56.0);
        assertEquals(0.51766, riseTransitSet.risingTime, 0.00001);
        assertEquals(0.81980, riseTransitSet.transitTime, 0.00001);
        assertEquals(0.12130, riseTransitSet.settingTime, 0.00001);
    }

    @Test
    void bringToZeroOneRange() {
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(-1.75));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(-0.75));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(0.25));
        assertEquals(0.25, RiseTransitSetEventCalculator.bringToZeroOneRange(1.25));
    }
}