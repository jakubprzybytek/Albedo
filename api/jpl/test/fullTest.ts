import { readdirSync } from "node:fs";
import { testStateCSVFile } from './TestCaseScript';

function findWebGeocalcCSVFiles(folder: string, fileNamePrefix: string): string[] {
    return readdirSync(folder)
        .filter((fileName) => fileName.startsWith(fileNamePrefix))
        .map((fileName) => `${folder}/${fileName}`);
}

(async () => {
    const testFileNames = findWebGeocalcCSVFiles('./api/jpl/test/uncorrected', 'WGC_StateVector');

    console.log('# Results');
    console.log(`Test suites: ${testFileNames.length}`);
    console.log('| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name |');
    console.log('| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- |');

    for (const testFileName of testFileNames) {
        const testReport = await testStateCSVFile(testFileName);
        console.log(`| ${testReport.targetBodyName} | ${testReport.observerBodyName} | ${testReport.testCases}`
            + `| ${testReport.positionErrorAverage.toPrecision(4)} | ${testReport.velocityErrorAverage.toPrecision(4)} | ${testReport.fileName} |`);
    }
})();
