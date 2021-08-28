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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StateSolverFactoryTest_CommonCenterBodySolver {

    private final static List<PositionChebyshevRecord> firstChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> secondChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> thirdChebyshevList = new ArrayList<>();

    private final static List<PositionChebyshevRecord> fourthChebyshevList = new ArrayList<>();

    private static SpkKernelRepository spkKernel;

    @BeforeAll
    private static void setup() throws JplException {
        final SpkKernelCollection first = new SpkKernelCollection("Test", JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, firstChebyshevList, Collections.emptyList());
        final SpkKernelCollection second = new SpkKernelCollection("Test", JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, secondChebyshevList, Collections.emptyList());
        final SpkKernelCollection third = new SpkKernelCollection("Test", JplBody.JupiterBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, thirdChebyshevList, Collections.emptyList());
        final SpkKernelCollection fourth = new SpkKernelCollection("Test", JplBody.Jupiter, JplBody.JupiterBarycenter, ReferenceFrame.J2000, fourthChebyshevList, Collections.emptyList());

        spkKernel = mock(SpkKernelRepository.class);
        when(spkKernel.getAllTransientSpkKernelCollections(JplBody.Earth)).thenReturn(Arrays.asList(first, second));
        when(spkKernel.getAllTransientSpkKernelCollections(JplBody.Jupiter)).thenReturn(Arrays.asList(third, fourth));
    }

    @Test
    public void testNoCommonCenterBody() {
        StateSolverFactory stateSolverFactory = new StateSolverFactory(spkKernel)
                .target(JplBody.Mars)
                .observer(JplBody.Earth);

        assertThatThrownBy(stateSolverFactory::build).isInstanceOf(JplException.class).hasMessageContaining("Cannot find SPK records for");
    }

    @Test
    public void testEarthToJupiter() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.Jupiter)
                .observer(JplBody.Earth)
                .build();

        assertThat(stateSolver).isInstanceOf(CommonCenterBodyStateSolver.class);

        CommonCenterBodyStateSolver commonCenterBodyStateSolver = ((CommonCenterBodyStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.negate).isFalse(),
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(commonCenterBodyStateSolver.targetStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.targetStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(thirdChebyshevList);
                },
                () -> {
                    assertThat(commonCenterBodyStateSolver.targetStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.targetStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(fourthChebyshevList);
                },
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(commonCenterBodyStateSolver.observerStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.observerStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(commonCenterBodyStateSolver.observerStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.observerStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                }
        );
    }

    @Test
    public void testJupiterToEarth() throws JplException {
        StateSolver stateSolver = new StateSolverFactory(spkKernel)
                .target(JplBody.Earth)
                .observer(JplBody.Jupiter)
                .build();

        assertThat(stateSolver).isInstanceOf(CommonCenterBodyStateSolver.class);

        CommonCenterBodyStateSolver commonCenterBodyStateSolver = ((CommonCenterBodyStateSolver) stateSolver);
        Assertions.assertAll(
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.negate).isFalse(),
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(commonCenterBodyStateSolver.targetStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.targetStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(firstChebyshevList);
                },
                () -> {
                    assertThat(commonCenterBodyStateSolver.targetStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.targetStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(secondChebyshevList);
                },
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.calculators.size()).isEqualTo(2),
                () -> {
                    assertThat(commonCenterBodyStateSolver.observerStateSolver.calculators.get(0)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.observerStateSolver.calculators.get(0);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(thirdChebyshevList);
                },
                () -> {
                    assertThat(commonCenterBodyStateSolver.observerStateSolver.calculators.get(1)).isInstanceOf(PositionAndVelocitySolvingCalculator.class);
                    PositionAndVelocitySolvingCalculator calculator = (PositionAndVelocitySolvingCalculator) commonCenterBodyStateSolver.observerStateSolver.calculators.get(1);
                    assertThat(calculator.positionChebyshevRecords).isSameAs(fourthChebyshevList);
                }
        );
    }

}
