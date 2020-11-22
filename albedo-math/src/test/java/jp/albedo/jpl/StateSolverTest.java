package jp.albedo.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.TestData;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.stream.Stream;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;

public class StateSolverTest {

    private static SpkKernelRepository kernel;

    @BeforeAll
    public static void setUp() {
        kernel = new SpkKernelRepository();
        Stream.of(
                TestData.EARTH_FOR_2019_10_09,
                TestData.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
                TestData.MOON_FOR_2019_10_09)
                .forEach(kernel::registerSpkKernelRecord);
    }

    @Test
    public void test() throws JplException {
        RectangularCoordinates coordinates = kernel.stateSolver()
                .target(JplBody.Moon)
                .observer(JplBody.Earth)
                .build()
                .forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(317255.79347754, -220341.79908000, -119833.86836880), TestData.WEB_GEOCALC_OFFSET);
    }

}
