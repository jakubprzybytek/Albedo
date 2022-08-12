import { readdirSync } from "node:fs";
import { CorrectionType } from "../state/solvers";
import { SolverOptions, testStateCSVFile } from './TestCaseScript';

function findWebGeocalcCSVFiles(folder: string, fileNamePrefix: string): string[] {
    return readdirSync(folder)
        .filter((fileName) => fileName.startsWith(fileNamePrefix))
        .map((fileName) => `${folder}/${fileName}`);
}

async function testSuite(folder: string, fileNamePrefix: string, solverOptions: SolverOptions) {
    console.log('## Test suite');
    console.log(`Folder: \`${folder}\`, file name prefix: \`${fileNamePrefix}\``);
    console.log(`Corrections: ${solverOptions.corrections.length === 0 ? '*none*' : solverOptions.corrections}`);

    const testFileNames = findWebGeocalcCSVFiles(folder, fileNamePrefix);

    console.log('## Results');
    console.log(`Test suites: ${testFileNames.length}`);
    console.log('| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name |');
    console.log('| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- |');

    for (const testFileName of testFileNames) {
        const testReport = await testStateCSVFile(testFileName, solverOptions);
        console.log(`| ${testReport.targetBodyName} | ${testReport.observerBodyName} | ${testReport.testCases}`
            + ` | ${testReport.positionErrorAverage.toPrecision(4)}`
            + ` | ${testReport.velocityErrorAverage ? testReport.velocityErrorAverage.toPrecision(4) : '*n/a*'} | ${testReport.fileName} |`);
    }
}

(async () => {
    await testSuite('./api/jpl/test/uncorrected', 'WGC_StateVector', { corrections: [], computeVelocity: true });
    await testSuite('./api/jpl/test/lightTimeCorrected', 'WGC_StateVector', { corrections: [CorrectionType.LightTime], computeVelocity: false });
})();
