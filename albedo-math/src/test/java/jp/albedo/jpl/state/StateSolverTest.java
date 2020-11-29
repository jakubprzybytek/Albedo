package jp.albedo.jpl.state;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.TestData;
import jp.albedo.jpl.WebGeocalc;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.StateSolver;
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
                TestData.SUN_FOR_2019_10_09,
                TestData.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
                TestData.EARTH_FOR_2019_10_09,
                TestData.MOON_FOR_2019_10_09)
                .forEach(kernel::registerSpkKernelRecord);
    }

    @Test
    public void testSunFromSSB() throws JplException {
        RectangularCoordinates coordinates = kernel.stateSolver()
                .target(JplBody.Sun)
                .observer(JplBody.SolarSystemBarycenter)
                .build()
                .forDate(JulianDay.fromDate(2019, 10, 9));

        assertThat(coordinates)
                .isEqualTo(new RectangularCoordinates(-462237.15572104, 1038587.57185744, 450869.39130956), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @Test
    public void testMoonFromEarth() throws JplException {
        StateSolver stateSolver = kernel.stateSolver()
                .target(JplBody.Moon)
                .observer(JplBody.Earth)
                .build();

        assertThat(stateSolver.forDate(JulianDay.fromDate(2019, 10, 9)))
                .isEqualTo(new RectangularCoordinates(317255.79347754, -220341.79908000, -119833.86836880), WebGeocalc.WEB_GEOCALC_OFFSET);
        assertThat(stateSolver.forDate(JulianDay.fromDate(2019, 10, 12)))
                .isEqualTo(new RectangularCoordinates(403416.94296321, -3557.23337044, -38713.71153300), WebGeocalc.WEB_GEOCALC_OFFSET);
    }

}
