package jp.albedo.jpl.testdata.de440.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.impl.EphemeridesForEarthCalculator;
import jp.albedo.jpl.testdata.de440.TestData_de440;
import jp.albedo.jpl.utils.AstronomicalCoordinatesFromStringConverter;
import jp.albedo.jpl.utils.JdeFromDateStringConverter;
import jp.albedo.testutils.AlbedoAssertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.converter.ConvertWith;
import org.junit.jupiter.params.provider.CsvFileSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

public class EarthEphemerisCalculatorTest {

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/de440/ephemerisLigthTravelStarAbberationCorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    void test(JplBody target,
              @ConvertWith(JdeFromDateStringConverter.class) double jde,
              @ConvertWith(AstronomicalCoordinatesFromStringConverter.class) AstronomicalCoordinates expectedCoords,
              double range,
              double magnitude) throws JplException {
        EphemeridesForEarthCalculator ephemeridesCalculator = new EphemeridesForEarthCalculator(TestData_de440.SPK_KERNEL, target);

        Ephemeris ephemeris = ephemeridesCalculator.computeFor(jde);
        System.out.printf("%s ephemeris: %s%n", target, ephemeris.toStringHighPrecision());

        assertAll(
                () -> assertThat(ephemeris.jde).isEqualTo(jde),
                () -> AlbedoAssertions.assertThat(ephemeris.coordinates).isEqualTo(expectedCoords),
                //() -> assertThat(Math.toDegrees(ephemeris.elongation)).isEqualTo(expectedElongation, Offset.offset(0.0001)),
                () -> assertThat(ephemeris.apparentMagnitude).isEqualTo(magnitude)
        );
    }

}
