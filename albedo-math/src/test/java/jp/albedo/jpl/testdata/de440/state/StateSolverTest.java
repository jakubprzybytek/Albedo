package jp.albedo.jpl.testdata.de440.state;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.WebGeocalc;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.de440.TestData_de440;
import jp.albedo.jpl.utils.JdeFromDateStringConverter;
import jp.albedo.jpl.utils.OffsetFromStringConverter;
import jp.albedo.jpl.utils.RectangularCoordinatesFromStringConverter;
import org.assertj.core.data.Offset;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.converter.ConvertWith;
import org.junit.jupiter.params.provider.CsvFileSource;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;
import static org.assertj.core.api.Assertions.within;

public class StateSolverTest {

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/de440/uncorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testUncorrected_de440(JplBody target,
                                      JplBody observer,
                                      @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                      @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected) throws JplException {

        StateSolver stateSolver = TestData_de440.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .build();

        assertThat(stateSolver.positionFor(EphemerisSeconds.fromJde(jde))).isEqualTo(expected, WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/de440/lightTravelCorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testLTCorrected_de440(JplBody target,
                                      JplBody observer,
                                      @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                      @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected,
                                      @ConvertWith(OffsetFromStringConverter.class) Offset<Double> offset) throws JplException {

        StateSolver stateSolver = TestData_de440.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .corrections(Correction.LightTime)
                .build();

        assertThat(stateSolver.positionFor(EphemerisSeconds.fromJde(jde))).isEqualTo(expected, offset);
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/de440/lightTravelAndStarAbberationCorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testCorrected_de440(JplBody target,
                                    JplBody observer,
                                    @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                    @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected,
                                    @ConvertWith(OffsetFromStringConverter.class) Offset<Double> offset) throws JplException {

        StateSolver stateSolver = TestData_de440.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();

        assertThat(stateSolver.positionFor(EphemerisSeconds.fromJde(jde))).isEqualTo(expected, offset);
    }
}
