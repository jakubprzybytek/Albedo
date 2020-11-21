package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.ChebyshevRecord;
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
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StateSolverFactoryDirectSolverTest {

    private final static List<ChebyshevRecord> firstChebyshevList = new ArrayList<>();

    private final static List<ChebyshevRecord> secondChebyshevList = new ArrayList<>();

    private final static List<ChebyshevRecord> thirdChebyshevList = new ArrayList<>();

    private static SpkKernelRepository spkKernel;

    @BeforeAll
    private static void setup() throws JplException {
        final SpkKernelRecord first = new SpkKernelRecord(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, firstChebyshevList);
        final SpkKernelRecord second = new SpkKernelRecord(JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, secondChebyshevList);
        final SpkKernelRecord third = new SpkKernelRecord(JplBody.Pluto, JplBody.Earth, ReferenceFrame.J2000, thirdChebyshevList);

        spkKernel = mock(SpkKernelRepository.class);
        when(spkKernel.getSpkKernelRecords(JplBody.Pluto)).thenReturn(Arrays.asList(first, second, third));
        when(spkKernel.getSpkKernelRecords(JplBody.Earth)).thenReturn(Arrays.asList(first, second));
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
                () -> assertThat(directStateSolver.positionCalculators.size()).isEqualTo(3),
                () -> assertThat(directStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(secondChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(2).chebyshevRecords).isSameAs(thirdChebyshevList)
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
                () -> assertThat(directStateSolver.positionCalculators.size()).isEqualTo(3),
                () -> assertThat(directStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(secondChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(2).chebyshevRecords).isSameAs(thirdChebyshevList)
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
                () -> assertThat(directStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(directStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(secondChebyshevList)
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
                () -> assertThat(directStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(directStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(firstChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(secondChebyshevList)
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
                () -> assertThat(directStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(directStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(secondChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(thirdChebyshevList)
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
                () -> assertThat(directStateSolver.positionCalculators.size()).isEqualTo(2),
                () -> assertThat(directStateSolver.positionCalculators.get(0).chebyshevRecords).isSameAs(secondChebyshevList),
                () -> assertThat(directStateSolver.positionCalculators.get(1).chebyshevRecords).isSameAs(thirdChebyshevList)
        );
    }

}
