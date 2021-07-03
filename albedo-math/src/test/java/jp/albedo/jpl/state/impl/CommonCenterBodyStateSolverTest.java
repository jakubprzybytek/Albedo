package jp.albedo.jpl.state.impl;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.de438.TestDataSpk_de438;
import jp.albedo.jpl.WebGeocalc;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;

/**
 * Tests written using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
public class CommonCenterBodyStateSolverTest {

    private static final List<SpkKernelCollection> MOON_SPK_RECORDS = Arrays.asList(
            TestDataSpk_de438.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk_de438.MOON_FOR_2019_10_09);

    private static final List<SpkKernelCollection> EARTH_SPK_RECORDS = Arrays.asList(
            TestDataSpk_de438.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk_de438.EARTH_FOR_2019_10_09);

    @Test
    public void testEarthToMoon() {
        StateSolver solver = new CommonCenterBodyStateSolver(MOON_SPK_RECORDS, EARTH_SPK_RECORDS);
        final RectangularCoordinates coordinates = solver.positionForDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(317255.79347754, -220341.79908000, -119833.86836880), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testMoonToEarth() {
        StateSolver solver = new CommonCenterBodyStateSolver(EARTH_SPK_RECORDS, MOON_SPK_RECORDS);
        final RectangularCoordinates coordinates = solver.positionForDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-317255.79347754, 220341.79908000, 119833.86836880), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

}
