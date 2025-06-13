import { average } from 'simple-statistics';
import { RectangularCoordsData } from './WebGeocalcCSV';
import { RectangularCoordinates } from '@astro/coords';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType } from '@jpl/state/solvers';
import { kernelRepository } from '@jpl/data/de440.full';

export type SolverOptions = {
    corrections: CorrectionType[];
}

type Stats = {
    positionDifferenceAverage?: number;
    positionComputationError?: any;
    velocityDifferenceAverage?: number;
    velocityComputationError?: any;
};

export function runRectangularCoordsTestCases(targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: RectangularCoordsData[], solverOptions: SolverOptions): Stats {
    const { corrections } = solverOptions;

    const stats: Stats = {};

    try {
        const stateSolver = kernelRepository.stateSolverBuilder()
            .forTarget(targetBodyId)
            .forObserver(observerBodyId)
            .withCorrections(...corrections)
            .build();

        try {
            const positionDifferences = data.map(state => {
                const computedPosition = stateSolver.positionFor(EphemerisSeconds.fromDateTimeObject(state.tbd));
                const expectedPosition = new RectangularCoordinates(state.x, state.y, state.z);

                return expectedPosition.subtract(computedPosition).length();
            });

            stats.positionDifferenceAverage = average(positionDifferences);
        } catch (e: any) {
            stats.positionComputationError = e;
        }

        try {
            const velocityDifferences = data.map(state => {
                const computedVelocity = stateSolver.velocityFor(EphemerisSeconds.fromDateTimeObject(state.tbd));
                const expectedVelocity = new RectangularCoordinates(state.speed_x, state.speed_y, state.speed_z);

                return expectedVelocity.subtract(computedVelocity).length();
            });

            stats.velocityDifferenceAverage = average(velocityDifferences);
        } catch (e: any) {
            stats.velocityComputationError = e;
        }
    } catch (e: any) {
        stats.positionComputationError = e;
        stats.velocityComputationError = e;
    }

    return stats;
};
