import { readdirSync } from "node:fs";
import { test } from "vitest";
import { CorrectionType } from "../state/solvers";
import { SolverOptions, testStateCSVFile } from './TestCaseScript';

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
        const testReport = await testStateCSVFile(testFileName, solverOptions);

        const positionSummary = testReport.stats.positionDifferenceAverage?.toPrecision(4) || testReport.stats.positionComputationError;
        const velocitySummary = testReport.stats.velocityDifferenceAverage?.toPrecision(4) || testReport.stats.velocityComputationError;

        console.log(`| ${testReport.targetBodyName} | ${testReport.observerBodyName} | ${testReport.testCases}`
            + ` | ${positionSummary} | ${velocitySummary}`
            + ` | ${testReport.fileName} |`);
    }
}

(async () => {
    await testSuite('./api/jpl/test/uncorrected', 'WGC_StateVector', { corrections: [] },
        'Computing body states without any corrections');
    await testSuite('./api/jpl/test/lightTimeCorrected', 'WGC_StateVector', { corrections: [CorrectionType.LightTime] },
        'Computing body states with only light time correction applied');
})();
