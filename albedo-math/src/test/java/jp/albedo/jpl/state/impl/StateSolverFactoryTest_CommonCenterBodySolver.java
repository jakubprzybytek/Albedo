package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.StateSolver;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
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
        final SpkKernelRecord first = new SpkKernelRecord(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, firstChebyshevList);
        final SpkKernelRecord second = new SpkKernelRecord(JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, secondChebyshevList);
        final SpkKernelRecord third = new SpkKernelRecord(JplBody.JupiterBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, thirdChebyshevList);
        final SpkKernelRecord fourth = new SpkKernelRecord(JplBody.Jupiter, JplBody.JupiterBarycenter, ReferenceFrame.J2000, fourthChebyshevList);

        spkKernel = mock(SpkKernelRepository.class);
        when(spkKernel.getAllTransientSpkKernelRecords(JplBody.Earth)).thenReturn(Arrays.asList(first, second));
        when(spkKernel.getAllTransientSpkKernelRecords(JplBody.Jupiter)).thenReturn(Arrays.asList(third, fourth));
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
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.positionCalculators.get(0).positionChebyshevRecords).isSameAs(thirdChebyshevList),
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.positionCalculators.get(1).positionChebyshevRecords).isSameAs(fourthChebyshevList),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.positionCalculators.get(0).positionChebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.positionCalculators.get(1).positionChebyshevRecords).isSameAs(secondChebyshevList)
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
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.positionCalculators.get(0).positionChebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(commonCenterBodyStateSolver.targetStateSolver.positionCalculators.get(1).positionChebyshevRecords).isSameAs(secondChebyshevList),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.negate).isFalse(),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.positionCalculators.get(0).positionChebyshevRecords).isSameAs(thirdChebyshevList),
                () -> assertThat(commonCenterBodyStateSolver.observerStateSolver.positionCalculators.get(1).positionChebyshevRecords).isSameAs(fourthChebyshevList)
        );
    }

}
