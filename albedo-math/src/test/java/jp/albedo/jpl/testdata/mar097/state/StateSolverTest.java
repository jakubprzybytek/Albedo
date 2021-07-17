package jp.albedo.jpl.testdata.mar097.state;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.WebGeocalc;
import jp.albedo.jpl.files.util.EphemerisSeconds;
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
    @CsvFileSource(resources = "/WebGeocalc/mar097/statePositionUncorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testUncorrected(JplBody target,
                                JplBody observer,
                                @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected) throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .build();

        assertThat(stateSolver.positionFor(EphemerisSeconds.fromJde(jde))).isEqualTo(expected, WebGeocalc.WEB_GEOCALC_OFFSET);
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/mar097/statePositionLightTravelCorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testLightTravelCorrected(JplBody target,
                                         JplBody observer,
                                         @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                         @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected,
                                         @ConvertWith(OffsetFromStringConverter.class) Offset<Double> offset) throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .corrections(Correction.LightTime)
                .build();

        assertThat(stateSolver.positionFor(EphemerisSeconds.fromJde(jde))).isEqualTo(expected, offset);
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/mar097/statePositionLightTravelAndStarAbberationCorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testLightTravelStarAbberationCorrected(JplBody target,
                                                       JplBody observer,
                                                       @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                                       @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected,
                                                       @ConvertWith(OffsetFromStringConverter.class) Offset<Double> offset) throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();

        assertThat(stateSolver.positionFor(EphemerisSeconds.fromJde(jde))).isEqualTo(expected, offset);
    }

    @ParameterizedTest
    @CsvFileSource(resources = "/WebGeocalc/mar097/stateVelocityUncorrected-2019.10.csv", numLinesToSkip = 1, delimiter = ';')
    public void testVelocityUncorrected(JplBody target,
                                        JplBody observer,
                                        @ConvertWith(JdeFromDateStringConverter.class) double jde,
                                        @ConvertWith(RectangularCoordinatesFromStringConverter.class) RectangularCoordinates expected,
                                        @ConvertWith(OffsetFromStringConverter.class) Offset<Double> offset) throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(target)
                .observer(observer)
                .build();

        assertThat(stateSolver.velocityFor(EphemerisSeconds.fromJde(jde))).isEqualTo(expected, offset);
    }

}
