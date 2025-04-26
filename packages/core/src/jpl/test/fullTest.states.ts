import { readdirSync, readFileSync } from "node:fs";
import { jplBodyFromString } from "..";
import { CorrectionType } from "../state/solvers";
import { runRectangularCoordsTestCases, SolverOptions } from './lib/RectangularCoordsTestCasesScript';
import { readRectangularCoordsFromWebGeocalcCSVFile } from "./lib/WebGeocalcCSV";

function findWebGeocalcCSVFiles(folder: string, fileNamePrefix: string): string[] {
    return readdirSync(folder)
        .filter((fileName) => fileName.startsWith(fileNamePrefix))
        .map((fileName) => `${folder}/${fileName}`);
}

async function testSuite(folder: string, fileNamePrefix: string, solverOptions: SolverOptions, description: string) {
    console.log('# Test cases\n');

    console.log('## Overview\n');
    console.log(`${description}\n`);

    console.log('## Details\n');
    console.log(`Folder: \`${folder}\`, file name prefix: \`${fileNamePrefix}\`\n`);
    console.log(`Corrections: ${solverOptions.corrections.length === 0 ? '*none*' : solverOptions.corrections}\n`);

    const testFileNames = findWebGeocalcCSVFiles(folder, fileNamePrefix);

    console.log('## Results\n');
    console.log(`Test suites: ${testFileNames.length}\n`);
    console.log('| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name |');
    console.log('| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- |');

    for (const testFileName of testFileNames) {
        const fileContent = readFileSync(testFileName).toString();
        const { targetBodyName, observerBodyName, data } = await readRectangularCoordsFromWebGeocalcCSVFile(fileContent);

        const targetBodyId = jplBodyFromString(targetBodyName)?.id;
        if (targetBodyId === undefined) {
            throw Error(`Cannot parse body name to JplBodyId: ${targetBodyName}`);
        }

        const observerBodyId = jplBodyFromString(observerBodyName)?.id;
        if (observerBodyId === undefined) {
            throw Error(`Cannot parse body name to JplBodyId: ${observerBodyName}`);
        }

        const stats = runRectangularCoordsTestCases(targetBodyId, observerBodyId, data, solverOptions);

        const positionSummary = stats.positionDifferenceAverage?.toPrecision(4) || stats.positionComputationError;
        const velocitySummary = stats.velocityDifferenceAverage?.toPrecision(4) || stats.velocityComputationError;

        var fileName = /[^/]*$/.exec(testFileName)?.[0] || testFileName;

        console.log(`| ${targetBodyName} | ${observerBodyName} | ${data.length}`
            + ` | ${positionSummary} | ${velocitySummary}`
            + ` | ${fileName} |`);
    }
}

export async function runStatesTestSuite() {
    await testSuite('./api/jpl/test/states-reference-uncorrected', 'WGC_StateVector', { corrections: [] },
        'Computing body states without any corrections');
    await testSuite('./api/jpl/test/states-reference-lightTimeCorrected', 'WGC_StateVector', { corrections: [CorrectionType.LightTime] },
        'Computing body states with light time correction applied');
    await testSuite('./api/jpl/test/states-reference-starAberrationCorrected', 'WGC_StateVector', { corrections: [CorrectionType.LightTime, CorrectionType.StarAbberation] },
        'Computing body states with star aberration and light time correction applied');
}

(async () => {
    await runStatesTestSuite();
})();
