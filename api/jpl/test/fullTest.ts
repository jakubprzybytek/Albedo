import { readdirSync } from "node:fs";
import { average } from 'simple-statistics';
import { readStatesWebGeocalcCSVFile } from './WebGeocalcCSV';
import { kernelRepository } from '../data/de440.full';
import { jplBodyFromString, EphemerisSeconds } from '..';
import { RectangularCoordinates } from '../../math';

type TestReport = {
    fileName: string;
    targetBodyName: string;
    observerBodyName: string;
    testCases: number;
    positionErrorAverage: number;
    velocityErrorAverage: number;
};

async function testStateCSVFile(fileName: string): Promise<TestReport> {
    const { targetBodyName, observerBodyName, states } = await readStatesWebGeocalcCSVFile(fileName);

    const targetBodyId = jplBodyFromString(targetBodyName)?.id;
    if (targetBodyId === undefined) {
        throw Error(`Cannot parse body name to JplBodyId: ${targetBodyName}`);
    }

    const observerBodyId = jplBodyFromString(observerBodyName)?.id;
    if (observerBodyId === undefined) {
        throw Error(`Cannot parse body name to JplBodyId: ${observerBodyName}`);
    }

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
        fileName,
        targetBodyName,
        observerBodyName,
        testCases: states.length,
        positionErrorAverage,
        velocityErrorAverage
    };
};

(async () => {
    const testFileNames = readdirSync('./api/jpl/test/')
        .filter((testFileName) => testFileName.startsWith('WGC_StateVector'));

    console.log('# Results');
    console.log(`Test suites: ${testFileNames.length}`);
    console.log('| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name |');
    console.log('| ----------- | ------------- | ---------- | ----------------- | ------------------ | --------- |');
    
    for (const testFileName of testFileNames) {
        const testReport = await testStateCSVFile('./api/jpl/test/' + testFileName);
        console.log(`| ${testReport.targetBodyName} | ${testReport.observerBodyName} | ${testReport.testCases}`
            + `| ${testReport.positionErrorAverage.toPrecision(3)} | ${testReport.velocityErrorAverage.toPrecision(3)} | ${testReport.fileName} |`);
    }
})();
