package jp.albedo.jpl.state.impl;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.state.TestData;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;

/**
 * Tests written using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
public class DirectStateSolverTest {

    @Test
    public void testSolarSystemBarycenterToEarth() {
        List<SpkKernelRecord> spkRecords = Arrays.asList(
                TestData.MOON_EARTH_BARYCENTER_FOR_2019_10_09,
                TestData.EARTH_FOR_2019_10_09);

        StateSolver solver = new DirectStateSolver(spkRecords);
        final RectangularCoordinates coordinates = solver.forDate(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));

        assertAll(
                () -> Assertions.assertThat(coordinates.x).isEqualTo(143811431.38536263, TestData.WEB_GEOCALC_OFFSET),
                () -> Assertions.assertThat(coordinates.y).isEqualTo(36856636.26047815, TestData.WEB_GEOCALC_OFFSET),
                () -> Assertions.assertThat(coordinates.z).isEqualTo(15977858.62839704, TestData.WEB_GEOCALC_OFFSET));
    }

}
