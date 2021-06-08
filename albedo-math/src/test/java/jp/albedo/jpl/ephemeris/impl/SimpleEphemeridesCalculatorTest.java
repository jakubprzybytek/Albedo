package jp.albedo.jpl.ephemeris.impl;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.TestData;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.testutils.AlbedoAssertions;
import org.assertj.core.data.Offset;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static jp.albedo.common.AstronomicalCoordinates.fromDegrees;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

/**
 * Tests based on: https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SimpleEphemeridesCalculatorTest {

    private static final SpkKernelRepository kernel = TestData.KERNEL;

    @ParameterizedTest
    @MethodSource
    void test(JplBody target, double jde, AstronomicalCoordinates expectedCoords, double expectedElongation) throws JplException {
        SimpleEphemeridesCalculator ephemeridesCalculator = new SimpleEphemeridesCalculator(kernel, target);

        Ephemeris ephemeris = ephemeridesCalculator.computeFor(jde);
        System.out.printf("%s ephemeris: %s%n", target, ephemeris.toStringHighPrecision());

        assertAll(
                () -> assertThat(ephemeris.jde).isEqualTo(jde),
                () -> AlbedoAssertions.assertThat(ephemeris.coordinates).isEqualTo(expectedCoords),
                () -> assertThat(Math.toDegrees(ephemeris.elongation)).isEqualTo(expectedElongation, Offset.offset(0.0001)),
                () -> assertThat(ephemeris.apparentMagnitude).isEqualTo(0.0)
        );
    }

    private static Stream<Arguments> test() {
        return Stream.of(
                Arguments.of(JplBody.Moon, JulianDay.fromDate(2019, 10, 9), fromDegrees(325.21890191, -17.23583637), 126.5750),
                Arguments.of(JplBody.Venus, JulianDay.fromDate(2019, 10, 9), fromDegrees(208.22422699, -10.89348428), 14.9579),
                Arguments.of(JplBody.Jupiter, JulianDay.fromDate(2019, 10, 9), fromDegrees(258.14467374, -22.74534376), 63.9376)
        );
    }
}