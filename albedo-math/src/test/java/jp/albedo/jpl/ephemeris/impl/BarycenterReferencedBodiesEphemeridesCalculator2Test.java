package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.TestData;
import jp.albedo.testutils.AlbedoAssertions;
import org.assertj.core.data.Offset;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

/**
 * Validated with: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class BarycenterReferencedBodiesEphemeridesCalculator2Test {

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
    void testMoon() throws JplException {
        double jde = JulianDay.fromDate(2019, 10, 9);

        BarycenterReferencedBodiesEphemeridesCalculator2 ephemeridesCalculator = new BarycenterReferencedBodiesEphemeridesCalculator2(kernel, JplBody.Moon);
        Ephemeris ephemeris = ephemeridesCalculator.computeFor(jde);
        System.out.printf("Moon ephemeris: %s", ephemeris.toStringHighPrecision());

        assertAll(
                () -> assertThat(ephemeris.jde).isEqualTo(jde),
                () -> AlbedoAssertions.assertThat(ephemeris.coordinates)
                        .isEqualTo(AstronomicalCoordinates.fromDegrees(325.21908914, -17.23578781)),
                () -> assertThat(Math.toDegrees(ephemeris.elongation)).isEqualTo(126.5752, Offset.offset(0.0001)),
                () -> assertThat(ephemeris.apparentMagnitude).isEqualTo(0.0)
        );
    }

}