package jp.albedo.jpl.state.impl;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.state.TestData;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;

/**
 * Tests written using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
public class DirectStateSolverTest {

    private static final List<SpkKernelRecord> EARTH_SPK_RECORDS = Arrays.asList(
            TestData.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestData.EARTH_FOR_2019_10_09);

    private static final List<SpkKernelRecord> MOON_SPK_RECORDS = Arrays.asList(
            TestData.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestData.MOON_FOR_2019_10_09);

    @Test
    public void testSolarSystemBarycenterToEarth() {
        final StateSolver solver = new DirectStateSolver(EARTH_SPK_RECORDS, false);
        final RectangularCoordinates coordinates = solver.forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(143811431.38536263, 36856636.26047815, 15977858.62839704), TestData.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testEarthToSolarSystemBarycenter() {
        final StateSolver solver = new DirectStateSolver(EARTH_SPK_RECORDS, true);
        final RectangularCoordinates coordinates = solver.forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-143811431.38536263, -36856636.26047815, -15977858.62839704), TestData.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testSolarSystemBarycenterToMoon() {
        final StateSolver solver = new DirectStateSolver(MOON_SPK_RECORDS, false);
        final RectangularCoordinates coordinates = solver.forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(144128687.17884016, 36636294.46139815, 15858024.76002824), TestData.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testMoonToSolarSystemBarycenter() {
        final StateSolver solver = new DirectStateSolver(MOON_SPK_RECORDS, true);
        final RectangularCoordinates coordinates = solver.forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-144128687.17884016, -36636294.46139815, -15858024.76002824), TestData.WEB_GEOCALC_OFFSET);
    }

}
