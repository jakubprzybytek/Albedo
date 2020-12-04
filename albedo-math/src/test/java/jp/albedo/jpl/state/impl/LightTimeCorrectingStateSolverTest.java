package jp.albedo.jpl.state.impl;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.TestDataSpk;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;
import static org.assertj.core.api.Assertions.within;

/**
 * Tests written using: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
public class LightTimeCorrectingStateSolverTest {

    private static final List<SpkKernelRecord> EARTH_SPK_RECORDS = Arrays.asList(
            TestDataSpk.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk.EARTH_FOR_2019_10_09);

    private static final List<SpkKernelRecord> MOON_SPK_RECORDS = Arrays.asList(
            TestDataSpk.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
            TestDataSpk.MOON_FOR_2019_10_09);

    private static final List<SpkKernelRecord> VENUS_SPK_RECORDS = Arrays.asList(
            TestDataSpk.VENUS_BARYCENTER_FOR_2019_10_09,
            TestDataSpk.VENUS_FOR_2019_10_09);

    @Test
    public void testForMoon() {
        final StateSolver solver = new LightTimeCorrectingStateSolver(MOON_SPK_RECORDS, EARTH_SPK_RECORDS);
        final RectangularCoordinates coordinates = solver.forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(317266.14970616, -220378.20030437, -119849.55153195), within(0.0003));
    }

    @Test
    public void testForVenus() {
        final StateSolver solver = new LightTimeCorrectingStateSolver(VENUS_SPK_RECORDS, EARTH_SPK_RECORDS);
        final RectangularCoordinates coordinates = solver.forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-212496177.20393000, -114080326.63575213, -46424486.94776109), within(0.0003));
    }

}
