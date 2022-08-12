import { average } from 'simple-statistics';
import { readStatesWebGeocalcCSVFile, State } from './WebGeocalcCSVFile';
import { kernelRepository } from '../data/de440.full';
import { jplBodyFromString, EphemerisSeconds, JplBodyId } from '..';
import { RectangularCoordinates } from '../../math';

type Stats = {
    positionErrorAverage: number;
    velocityErrorAverage: number;
};

function testStates(targetBodyId: JplBodyId, observerBodyId: JplBodyId, states: State[]): Stats {
    const stateSolver = kernelRepository.stateSolverBuilder()
        .forTarget(targetBodyId)
        .forObserver(observerBodyId)
        .build();

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
};

export type TestReport = {
    fileName: string;
    targetBodyName: string;
    observerBodyName: string;
    testCases: number;
    positionErrorAverage: number;
    velocityErrorAverage: number;
};

export async function testStateCSVFile(fileName: string): Promise<TestReport> {
    const { targetBodyName, observerBodyName, states } = await readStatesWebGeocalcCSVFile(fileName);

    const targetBodyId = jplBodyFromString(targetBodyName)?.id;
    if (targetBodyId === undefined) {
        throw Error(`Cannot parse body name to JplBodyId: ${targetBodyName}`);
    }

    const observerBodyId = jplBodyFromString(observerBodyName)?.id;
    if (observerBodyId === undefined) {
        throw Error(`Cannot parse body name to JplBodyId: ${observerBodyName}`);
    }

    const { positionErrorAverage, velocityErrorAverage } = testStates(observerBodyId, targetBodyId, states);

    return {
        fileName,
        targetBodyName,
        observerBodyName,
        testCases: states.length,
        positionErrorAverage,
        velocityErrorAverage
    };
};
