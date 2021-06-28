package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StateSolverFactoryTest_LightTimeCorrecting {

    private final static List<PositionChebyshevRecord> firstChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> secondChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> thirdChebyshevList = new ArrayList<>();

    private static SpkKernelRepository spkKernel;

    @BeforeAll
    private static void setup() throws JplException {
        final SpkKernelRecord first = new SpkKernelRecord(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, firstChebyshevList);
        final SpkKernelRecord second = new SpkKernelRecord(JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, secondChebyshevList);
        final SpkKernelRecord third = new SpkKernelRecord(JplBody.Moon, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, thirdChebyshevList);

        spkKernel = mock(SpkKernelRepository.class);
        when(spkKernel.getAllTransientSpkKernelRecords(JplBody.Earth)).thenReturn(Arrays.asList(first, second));
        when(spkKernel.getAllTransientSpkKernelRecords(JplBody.Moon)).thenReturn(Arrays.asList(first, third));
    }

    @Test
    public void test() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.Moon)
                .observer(JplBody.Earth)
                .corrections(Correction.LightTime)
                .build();

        assertThat(stateSolver).isInstanceOf(LightTimeCorrectingStateSolver.class);

        LightTimeCorrectingStateSolver ltStateSolver = ((LightTimeCorrectingStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(ltStateSolver.targetStateSolver).isInstanceOf(DirectStateSolver.class),
                () -> assertThat(ltStateSolver.targetStateSolver.negate).isFalse(),
                () -> assertThat(ltStateSolver.targetStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(ltStateSolver.targetStateSolver.positionCalculators.get(0).positionChebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(ltStateSolver.targetStateSolver.positionCalculators.get(1).positionChebyshevRecords).isSameAs(thirdChebyshevList),
                () -> assertThat(ltStateSolver.observerStateSolver).isInstanceOf(DirectStateSolver.class),
                () -> assertThat(ltStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(ltStateSolver.observerStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(ltStateSolver.observerStateSolver.positionCalculators.get(0).positionChebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(ltStateSolver.observerStateSolver.positionCalculators.get(1).positionChebyshevRecords).isSameAs(secondChebyshevList)
        );
    }

}
