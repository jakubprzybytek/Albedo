package jp.albedo.jpl.testdata.de438.state;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.de438.TestData_de438;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;

@Disabled
public class StateSolver_ExecutionTimesTest {

    private static final SpkKernelRepository kernel = TestData_de438.SPK_KERNEL;

    @Test
    public void test() throws JplException {

        final double startDate = JulianDay.fromDate(2019, 10, 9);
        final double endDate = JulianDay.fromDate(2019, 10, 11);

        final int numberOfIterations = 5;
        final int numberOfComputations = 100000;

        StateSolver uncorrectingStateSolver = kernel.stateSolver()
                .target(JplBody.Moon)
                .observer(JplBody.Earth)
                .build();

        for (int iteration = 0; iteration < numberOfIterations; iteration++) {
            System.out.printf("%d. Uncorrected state solver, computations: %d%n", iteration, numberOfComputations);
            Duration uncorrectedDuration = runStateSolverManyTimes(uncorrectingStateSolver, startDate, endDate, numberOfComputations);
            System.out.printf("Duration: %s%n%n", uncorrectedDuration);
        }

        StateSolver correctingStateSolver = kernel.stateSolver()
                .target(JplBody.Venus)
                .observer(JplBody.Earth)
                .corrections(Correction.LightTime, Correction.StarAberration)
                .build();


        for (int iteration = 0; iteration < numberOfIterations; iteration++) {
            System.out.printf("%d. Corrected state solver, computations: %d%n", iteration, numberOfComputations);
            Duration uncorrectedDuration = runStateSolverManyTimes(correctingStateSolver, startDate, endDate, numberOfComputations);
            System.out.printf("Duration: %s%n%n", uncorrectedDuration);
        }
    }

    private Duration runStateSolverManyTimes(StateSolver stateSolver, double startDate, double endDate, int maxIterations) {
        final Instant start = Instant.now();

        for (int i = 0; i < maxIterations; i++) {
            final double jde = startDate + (endDate - startDate) * i / maxIterations;
            RectangularCoordinates coords = stateSolver.positionForDate(jde);
        }

        return Duration.between(start, Instant.now());
    }
}
