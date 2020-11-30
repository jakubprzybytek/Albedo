package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.ChebyshevRecord;
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

public class StateSolverFactoryTest_AberrationCorrecting {

    private final static List<ChebyshevRecord> firstChebyshevList = new ArrayList<>();

    private final static List<ChebyshevRecord> secondChebyshevList = new ArrayList<>();

    private final static List<ChebyshevRecord> thirdChebyshevList = new ArrayList<>();

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
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();

        assertThat(stateSolver).isInstanceOf(StarAberrationCorrectingStateSolver.class);
        StarAberrationCorrectingStateSolver stStateSolver = ((StarAberrationCorrectingStateSolver) stateSolver);

        Assertions.assertAll(
                () -> assertThat(stStateSolver.observerStateSolver).isInstanceOf(DirectStateSolver.class),
                () -> assertThat(stStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(stStateSolver.observerStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(stStateSolver.observerStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(stStateSolver.observerStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(secondChebyshevList));

        assertThat(stStateSolver.targetStateSolver).isInstanceOf(LightTimeCorrectingStateSolver.class);
        LightTimeCorrectingStateSolver targetStateSolver = (LightTimeCorrectingStateSolver) stStateSolver.targetStateSolver;

        Assertions.assertAll(
                () -> assertThat(targetStateSolver.targetStateSolver).isInstanceOf(DirectStateSolver.class),
                () -> assertThat(targetStateSolver.targetStateSolver.negate).isFalse(),
                () -> assertThat(targetStateSolver.targetStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(targetStateSolver.targetStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(targetStateSolver.targetStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(thirdChebyshevList),
                () -> assertThat(targetStateSolver.observerStateSolver).isInstanceOf(DirectStateSolver.class),
                () -> assertThat(targetStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(targetStateSolver.observerStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(targetStateSolver.observerStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(targetStateSolver.observerStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(secondChebyshevList));
    }

}
