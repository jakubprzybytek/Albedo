import { average } from 'simple-statistics';
import { readStatesWebGeocalcCSVFile, State } from './WebGeocalcCSVFile';
import { kernelRepository } from '../data/de440.full';
import { jplBodyFromString, EphemerisSeconds, JplBodyId } from '..';
import { RectangularCoordinates } from '../../math';
import { CorrectionType } from '../state/solvers';

export type SolverOptions = {
    corrections: CorrectionType[];
    computeVelocity: boolean;
}

type Stats = {
    positionErrorAverage: number;
    velocityErrorAverage?: number;
};

function testStates(targetBodyId: JplBodyId, observerBodyId: JplBodyId, states: State[], solverOptions: SolverOptions): Stats {
    const { corrections, computeVelocity } = solverOptions;
    const stateSolver = kernelRepository.stateSolverBuilder()
        .forTarget(targetBodyId)
        .forObserver(observerBodyId)
        .withCorrections(...corrections)
        .build();

    if (computeVelocity) {
        const errors = states.map(state => {
            const computedPosition = stateSolver.positionFor(EphemerisSeconds.fromDateObject(state.tbd));
            const expectedPosition = new RectangularCoordinates(state.x, state.y, state.z);

            const computedVelocity = stateSolver.velocityFor(EphemerisSeconds.fromDateObject(state.tbd));
            const expectedVelocity = new RectangularCoordinates(state.speed_x, state.speed_y, state.speed_z);

            return {
                positionError: expectedPosition.subtract(computedPosition).length(),
                velocityError: expectedVelocity.subtract(computedVelocity).length()
            }
        });

        const positionErrorAverage = average(errors.map((error) => error.positionError));
        const velocityErrorAverage = average(errors.map((error) => error.velocityError));

        return {
            positionErrorAverage,
            velocityErrorAverage
        };
    }
    else {
        const errors = states.map(state => {
            const computedPosition = stateSolver.positionFor(EphemerisSeconds.fromDateObject(state.tbd));
            const expectedPosition = new RectangularCoordinates(state.x, state.y, state.z);

            return {
                positionError: expectedPosition.subtract(computedPosition).length(),
            }
        });

        const positionErrorAverage = average(errors.map((error) => error.positionError));

        return {
            positionErrorAverage,
        };
    }
};

export type TestReport = {
    fileName: string;
    targetBodyName: string;
    observerBodyName: string;
    testCases: number;
    positionErrorAverage: number;
    velocityErrorAverage?: number;
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

    const { positionErrorAverage, velocityErrorAverage } = testStates(targetBodyId, observerBodyId, states, solverOptions);

    return {
        fileName,
        targetBodyName,
        observerBodyName,
        testCases: states.length,
        positionErrorAverage,
        velocityErrorAverage
    };
};
