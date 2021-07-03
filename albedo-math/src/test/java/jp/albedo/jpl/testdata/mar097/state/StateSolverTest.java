package jp.albedo.jpl.testdata.mar097.state;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.WebGeocalc;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.mar097.TestData_mar097;
import jp.albedo.jpl.utils.JdeFromDateStringConverter;
import jp.albedo.jpl.utils.OffsetFromStringConverter;
import jp.albedo.jpl.utils.RectangularCoordinatesFromStringConverter;
import org.assertj.core.data.Offset;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.converter.ConvertWith;
import org.junit.jupiter.params.provider.CsvFileSource;

import static jp.albedo.testutils.AlbedoAssertions.assertThat;

public class StateSolverTest {

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/mar097/uncorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testUncorrected_de440(JplBody target,
                                      JplBody observer,
                                      @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                      @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected) throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .build();

        assertThat(stateSolver.positionForDate(jde)).isEqualTo(expected, WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/mar097/corrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testCorrected_de440(JplBody target,
                                    JplBody observer,
                                    @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                    @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected,
                                    @ConvertWith(OffsetFromStringConverter.class) Offset<Double> offset) throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();

        assertThat(stateSolver.positionForDate(jde)).isEqualTo(expected, offset);
    }

}
