package jp.albedo.jpl.state.impl;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.TestData;
import jp.albedo.jpl.WebGeocalc;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertAll;

/**
 * Tests written using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
public class PositionCalculatorTest {

    @Test
    public void testEarthMoonBarycenterPosition() throws JplException {
        PositionCalculator positionCalculator = new PositionCalculator(TestData.EARTH_MOON_BARYCENTER_FOR_2019_10_09.getChebyshevRecords());
        final RectangularCoordinates coordinates = positionCalculator.compute(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));

        assertAll(
                () -> Assertions.assertThat(coordinates.x).isEqualTo(143815286.22865087, WebGeocalc.WEB_GEOCALC_OFFSET),
                () -> Assertions.assertThat(coordinates.y).isEqualTo(36853958.97885630, WebGeocalc.WEB_GEOCALC_OFFSET),
                () -> Assertions.assertThat(coordinates.z).isEqualTo(15976402.57686801, WebGeocalc.WEB_GEOCALC_OFFSET));
    }

    @Test
    public void testEarthPosition() throws JplException {
        PositionCalculator positionCalculator = new PositionCalculator(TestData.EARTH_FOR_2019_10_09.getChebyshevRecords());
        final RectangularCoordinates coordinates = positionCalculator.compute(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));

        assertAll(
                () -> Assertions.assertThat(coordinates.x).isEqualTo(-3854.84328825, WebGeocalc.WEB_GEOCALC_OFFSET),
                () -> Assertions.assertThat(coordinates.y).isEqualTo(2677.28162186, WebGeocalc.WEB_GEOCALC_OFFSET),
                () -> Assertions.assertThat(coordinates.z).isEqualTo(1456.05152903, WebGeocalc.WEB_GEOCALC_OFFSET));
    }
}
