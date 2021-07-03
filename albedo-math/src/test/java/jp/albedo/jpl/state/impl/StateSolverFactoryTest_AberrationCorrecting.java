package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.state.impl.chebyshev.PositionAndVelocitySolvingCalculator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StateSolverFactoryTest_AberrationCorrecting {

    private final static List<PositionChebyshevRecord> firstChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> secondChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> thirdChebyshevList = new ArrayList<>();

    private static SpkKernelRepository spkKernel;

    @BeforeAll
    private static void setup() throws JplException {
        final SpkKernelCollection first = new SpkKernelCollection(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, firstChebyshevList, Collections.emptyList());
        final SpkKernelCollection second = new SpkKernelCollection(JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, secondChebyshevList, Collections.emptyList());
        final SpkKernelCollection third = new SpkKernelCollection(JplBody.Moon, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, thirdChebyshevList, Collections.emptyList());

        spkKernel = mock(SpkKernelRepository.class);
        when(spkKernel.getAllTransientSpkKernelCollections(JplBody.Earth)).thenReturn(Arrays.asList(first, second));
        when(spkKernel.getAllTransientSpkKernelCollections(JplBody.Moon)).thenReturn(Arrays.asList(first, third));
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
                () -> assertThat(stStateSolver.observerStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(stStateSolver.observerStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) stStateSolver.observerStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(stStateSolver.observerStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) stStateSolver.observerStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                }
        );

        assertThat(stStateSolver.targetStateSolver).isInstanceOf(LightTimeCorrectingStateSolver.class);
        LightTimeCorrectingStateSolver targetStateSolver = (LightTimeCorrectingStateSolver) stStateSolver.targetStateSolver;

        Assertions.assertAll(
                () -> assertThat(targetStateSolver.targetStateSolver).isInstanceOf(DirectStateSolver.class),
                () -> assertThat(targetStateSolver.targetStateSolver.negate).isFalse(),
                () -> assertThat(targetStateSolver.targetStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(targetStateSolver.targetStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) targetStateSolver.targetStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(targetStateSolver.targetStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) targetStateSolver.targetStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(thirdChebyshevList);
                },
                () -> assertThat(targetStateSolver.observerStateSolver).isInstanceOf(DirectStateSolver.class),
                () -> assertThat(targetStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(targetStateSolver.observerStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(stStateSolver.observerStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) stStateSolver.observerStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(stStateSolver.observerStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) stStateSolver.observerStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                }
        );
    }

}
