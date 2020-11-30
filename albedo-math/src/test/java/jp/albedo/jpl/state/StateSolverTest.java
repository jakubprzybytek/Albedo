package jp.albedo.jpl.state;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.TestData;
import jp.albedo.jpl.WebGeocalc;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;
import static org.assertj.core.api.Assertions.within;

public class StateSolverTest {

    private static SpkKernelRepository kernel;

    @BeforeAll
    public static void setUp() {
        kernel = new SpkKernelRepository();
        Stream.of(
                TestData.SUN_FOR_2019_10_09,
                TestData.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
                TestData.EARTH_FOR_2019_10_09,
                TestData.MOON_FOR_2019_10_09,
                TestData.VENUS_BARYCENTER_FOR_2019_10_09,
                TestData.VENUS_FOR_2019_10_09)
                .forEach(kernel::registerSpkKernelRecord);
    }

    @ParameterizedTest
    @MethodSource
    public void testUncorrected(JplBody target, JplBody observer, double jde, RectangularCoordinates expected) throws JplException {
        RectangularCoordinates coordinates = kernel.stateSolver()
                .target(target)
                .observer(observer)
                .build()
                .forDate(jde);

        assertThat(coordinates).isEqualTo(expected, WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    private static Stream<Arguments> testUncorrected() {
        return Stream.of(
                Arguments.of(JplBody.Sun, JplBody.SolarSystemBarycenter, JulianDay.fromDate(2019, 10, 9), new RectangularCoordinates(-462237.15572104, 1038587.57185744, 450869.39130956)),
                Arguments.of(JplBody.Moon, JplBody.Earth, JulianDay.fromDate(2019, 10, 9), new RectangularCoordinates(317255.79347754, -220341.79908000, -119833.86836880)),
                Arguments.of(JplBody.Moon, JplBody.Earth, JulianDay.fromDate(2019, 10, 12), new RectangularCoordinates(403416.94296321, -3557.23337044, -38713.71153300))
        );
    }

    @ParameterizedTest
    @MethodSource
    public void testCorrected(JplBody target, JplBody observer, double jde, RectangularCoordinates expected) throws JplException {
        RectangularCoordinates coordinates = kernel.stateSolver()
                .target(target)
                .observer(observer)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build()
                .forDate(jde);

        assertThat(coordinates).isEqualTo(expected, within(0.0004));
    }

    private static Stream<Arguments> testCorrected() {
        return Stream.of(
                Arguments.of(JplBody.Moon, JplBody.Earth, JulianDay.fromDate(2019, 10, 9), new RectangularCoordinates(317280.56635748, -220360.54136869, -119843.85649981)),
                Arguments.of(JplBody.Moon, JplBody.Earth, JulianDay.fromDate(2019, 10, 11), new RectangularCoordinates(391713.63540155, -80656.65353891, -69341.70116295)),
                Arguments.of(JplBody.Venus, JplBody.Earth, JulianDay.fromDate(2019, 10, 9), new RectangularCoordinates(-212508057.87354735, -114061538.56867133, -46416268.67949757))
        );
    }

}
