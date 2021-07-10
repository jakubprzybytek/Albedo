package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.WebGeocalc;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.de438.TestDataSpk_de438;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;

/**
 * Tests written using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
public class DirectStateSolverTest {

    private static final List<SpkKernelCollection> EARTH_SPK_RECORDS = Arrays.asList(
            TestDataSpk_de438.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk_de438.EARTH_FOR_2019_10_09);

    private static final List<SpkKernelCollection> MOON_SPK_RECORDS = Arrays.asList(
            TestDataSpk_de438.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk_de438.MOON_FOR_2019_10_09);

    @Test
    public void testSolarSystemBarycenterToEarth() {
        final StateSolver solver = new DirectStateSolver(EARTH_SPK_RECORDS, false);
        final RectangularCoordinates coordinates = solver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(143811431.38536263, 36856636.26047815, 15977858.62839704), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testEarthToSolarSystemBarycenter() {
        final StateSolver solver = new DirectStateSolver(EARTH_SPK_RECORDS, true);
        final RectangularCoordinates coordinates = solver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-143811431.38536263, -36856636.26047815, -15977858.62839704), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testSolarSystemBarycenterToMoon() {
        final StateSolver solver = new DirectStateSolver(MOON_SPK_RECORDS, false);
        final RectangularCoordinates coordinates = solver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(144128687.17884016, 36636294.46139815, 15858024.76002824), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testMoonToSolarSystemBarycenter() {
        final StateSolver solver = new DirectStateSolver(MOON_SPK_RECORDS, true);
        final RectangularCoordinates coordinates = solver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-144128687.17884016, -36636294.46139815, -15858024.76002824), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

}
