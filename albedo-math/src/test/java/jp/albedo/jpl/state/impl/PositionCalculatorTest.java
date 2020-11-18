package jp.albedo.jpl.state.impl;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.ChebyshevRecord;
import jp.albedo.jpl.state.TestData;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class PositionCalculatorTest {

    private static List<ChebyshevRecord> records;

    @BeforeAll
    public static void setup() {
        records = TestData.MOON_EARTH_BARYCENTER_FOR_2019_10_09.getChebyshevRecords();
    }

    @Test
    public void test() throws JplException {
        PositionCalculator positionCalculator = new PositionCalculator(records);
        final RectangularCoordinates coordinates = positionCalculator.compute(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));

        assertAll(
                () -> assertEquals(1.4381528622865087E8, coordinates.x),
                () -> assertEquals(3.685395897885629E7, coordinates.y),
                () -> assertEquals(1.5976402576868005E7, coordinates.z));
    }
}
