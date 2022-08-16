import { average } from 'simple-statistics';
import { readStatesWebGeocalcCSVFile, State } from './WebGeocalcCSVFile';
import { kernelRepository } from '../data/de440.full';
import { jplBodyFromString, EphemerisSeconds, JplBodyId } from '..';
import { RectangularCoordinates } from '../../math';
import { CorrectionType } from '../state/solvers';

export type SolverOptions = {
    corrections: CorrectionType[];
}

type Stats = {
    positionDifferenceAverage?: number;
    positionComputationError?: any;
    velocityDifferenceAverage?: number;
    velocityComputationError?: any;
};

function testStates(targetBodyId: JplBodyId, observerBodyId: JplBodyId, states: State[], solverOptions: SolverOptions): Stats {
    const { corrections } = solverOptions;

    const stats: Stats = {};

    try {
        const stateSolver = kernelRepository.stateSolverBuilder()
            .forTarget(targetBodyId)
            .forObserver(observerBodyId)
            .withCorrections(...corrections)
            .build();

        try {
            const positionDifferences = states.map(state => {
                const computedPosition = stateSolver.positionFor(EphemerisSeconds.fromDateObject(state.tbd));
                const expectedPosition = new RectangularCoordinates(state.x, state.y, state.z);

                return expectedPosition.subtract(computedPosition).length();
            });

            stats.positionDifferenceAverage = average(positionDifferences);
        } catch (e: any) {
            stats.positionComputationError = e;
        }

        try {
            const velocityDifferences = states.map(state => {
                const computedVelocity = stateSolver.velocityFor(EphemerisSeconds.fromDateObject(state.tbd));
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

export type TestReport = {
    fileName: string;
    targetBodyName: string;
    observerBodyName: string;
    testCases: number;
    stats: Stats;
};

export async function testStateCSVFile(fileName: string, solverOptions: SolverOptions): Promise<TestReport> {
    const { targetBodyName, observerBodyName, states } = await readStatesWebGeocalcCSVFile(fileName);

    const targetBodyId = jplBodyFromString(targetBodyName)?.id;
    if (targetBodyId === undefined) {
        throw Error(`Cannot parse body name to JplBodyId: ${targetBodyName}`);
    }

    const observerBodyId = jplBodyFromString(observerBodyName)?.id;
    if (observerBodyId === undefined) {
        throw Error(`Cannot parse body name to JplBodyId: ${observerBodyName}`);
    }

    const stats = testStates(targetBodyId, observerBodyId, states, solverOptions);

    return {
        fileName,
        targetBodyName,
        observerBodyName,
        testCases: states.length,
        stats
    };
};
