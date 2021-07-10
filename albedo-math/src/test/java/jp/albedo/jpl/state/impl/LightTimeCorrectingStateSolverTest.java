package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.de438.TestDataSpk_de438;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;
import static org.assertj.core.api.Assertions.within;

/**
 * Tests written using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
public class LightTimeCorrectingStateSolverTest {

    private static final List<SpkKernelCollection> EARTH_SPK_RECORDS = Arrays.asList(
            TestDataSpk_de438.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk_de438.EARTH_FOR_2019_10_09);

    private static final List<SpkKernelCollection> MOON_SPK_RECORDS = Arrays.asList(
            TestDataSpk_de438.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk_de438.MOON_FOR_2019_10_09);

    private static final List<SpkKernelCollection> VENUS_SPK_RECORDS = Arrays.asList(
            TestDataSpk_de438.VENUS_BARYCENTER_FOR_2019_10_09,
            TestDataSpk_de438.VENUS_FOR_2019_10_09);

    @Test
    public void testForMoon() {
        final StateSolver solver = new LightTimeCorrectingStateSolver(MOON_SPK_RECORDS, EARTH_SPK_RECORDS);
        final RectangularCoordinates coordinates = solver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(317266.14970616, -220378.20030437, -119849.55153195), within(0.0003));
    }

    @Test
    public void testForVenus() {
        final StateSolver solver = new LightTimeCorrectingStateSolver(VENUS_SPK_RECORDS, EARTH_SPK_RECORDS);
        final RectangularCoordinates coordinates = solver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-212496177.20393000, -114080326.63575213, -46424486.94776109), within(0.0003));
    }

}
