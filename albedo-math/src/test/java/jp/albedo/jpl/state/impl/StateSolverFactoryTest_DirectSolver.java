package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.kernel.SpkKernelRepository;
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

public class StateSolverFactoryTest_DirectSolver {

    private final static List<PositionChebyshevRecord> firstChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> secondChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> thirdChebyshevList = new ArrayList<>();

    private static SpkKernelRepository spkKernel;

    @BeforeAll
    private static void setup() throws JplException {
        final SpkKernelCollection first = new SpkKernelCollection(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, firstChebyshevList, Collections.emptyList());
        final SpkKernelCollection second = new SpkKernelCollection(JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, secondChebyshevList, Collections.emptyList());
        final SpkKernelCollection third = new SpkKernelCollection(JplBody.Pluto, JplBody.Earth, ReferenceFrame.J2000, thirdChebyshevList, Collections.emptyList());

        spkKernel = mock(SpkKernelRepository.class);
        when(spkKernel.getAllTransientSpkKernelCollections(JplBody.Pluto)).thenReturn(Arrays.asList(first, second, third));
        when(spkKernel.getAllTransientSpkKernelCollections(JplBody.Earth)).thenReturn(Arrays.asList(first, second));
    }

    @Test
    public void testTreeBodyPath_1to3() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.Pluto)
                .observer(JplBody.SolarSystemBarycenter)
                .build();

        assertThat(stateSolver).isInstanceOf(DirectStateSolver.class);

        DirectStateSolver directStateSolver = ((DirectStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(directStateSolver.negate).isFalse(),
                () -> assertThat(directStateSolver.calculators.size()).isEqualTo(3),
                () -> {
                    assertThat(directStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(2)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(2);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(thirdChebyshevList);
                }
        );
    }

    @Test
    public void testTreeBodyPathWithOppositeDirection_3to1() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.SolarSystemBarycenter)
                .observer(JplBody.Pluto)
                .build();

        assertThat(stateSolver).isInstanceOf(DirectStateSolver.class);

        DirectStateSolver directStateSolver = ((DirectStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(directStateSolver.negate).isTrue(),
                () -> assertThat(directStateSolver.calculators.size()).isEqualTo(3),
                () -> {
                    assertThat(directStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(2)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(2);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(thirdChebyshevList);
                }
        );
    }

    @Test
    public void testTreeBodyPath_1to2() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.Earth)
                .observer(JplBody.SolarSystemBarycenter)
                .build();

        assertThat(stateSolver).isInstanceOf(DirectStateSolver.class);

        DirectStateSolver directStateSolver = ((DirectStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(directStateSolver.negate).isFalse(),
                () -> assertThat(directStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(directStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                }
        );
    }

    @Test
    public void testTreeBodyPathWithOppositeDirection_2to1() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.SolarSystemBarycenter)
                .observer(JplBody.Earth)
                .build();

        assertThat(stateSolver).isInstanceOf(DirectStateSolver.class);

        DirectStateSolver directStateSolver = ((DirectStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(directStateSolver.negate).isTrue(),
                () -> assertThat(directStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(directStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                }
        );
    }

    @Test
    public void testTwoBodyPath_2to3() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.Pluto)
                .observer(JplBody.EarthMoonBarycenter)
                .build();

        assertThat(stateSolver).isInstanceOf(DirectStateSolver.class);

        DirectStateSolver directStateSolver = ((DirectStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(directStateSolver.negate).isFalse(),
                () -> assertThat(directStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(directStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(thirdChebyshevList);
                }
        );
    }

    @Test
    public void testTwoBodyPathWithOppositeDirection_3to2() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.EarthMoonBarycenter)
                .observer(JplBody.Pluto)
                .build();

        assertThat(stateSolver).isInstanceOf(DirectStateSolver.class);

        DirectStateSolver directStateSolver = ((DirectStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(directStateSolver.negate).isTrue(),
                () -> assertThat(directStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(directStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                },
                () -> {
                    assertThat(directStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) directStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(thirdChebyshevList);
                }

        );
    }

}
