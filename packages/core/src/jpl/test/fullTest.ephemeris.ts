import { readdirSync, readFileSync } from "node:fs";
import { jplBodyFromString } from "..";
import { Radians } from "../../math";
import { runAstronomicalCoordsTestCases } from "./lib/AstronomicalCoordsTestCasesScript";
import { readAstronomicalCoordsFromWebGeocalcCSVFile } from "./lib/WebGeocalcCSV";

function findWebGeocalcCSVFiles(folder: string, fileNamePrefix: string): string[] {
    return readdirSync(folder)
        .filter((fileName) => fileName.startsWith(fileNamePrefix))
        .map((fileName) => `${folder}/${fileName}`);
}

async function testSuite(folder: string, fileNamePrefix: string, description: string) {
    console.log('# Test cases\n');

    console.log('## Overview\n');
    console.log(`${description}\n`);

    console.log('## Details\n');
    console.log(`Folder: \`${folder}\`, file name prefix: \`${fileNamePrefix}\`\n`);

    const testFileNames = findWebGeocalcCSVFiles(folder, fileNamePrefix);

    console.log('## Results\n');
    console.log(`Test suites: ${testFileNames.length}\n`);
    console.log('| Target body | Observer body | Test cases | Avg ephemeris difference [°]  | File name |');
    console.log('| ----------- | ------------- | ---------- | ------------------------------- | --------- |');

    for (const testFileName of testFileNames) {
        const fileContent = readFileSync(testFileName).toString();
        const { targetBodyName, observerBodyName, data } = await readAstronomicalCoordsFromWebGeocalcCSVFile(fileContent);

        const targetBodyId = jplBodyFromString(targetBodyName)?.id;
        if (targetBodyId === undefined) {
            throw Error(`Cannot parse body name to JplBodyId: ${targetBodyName}`);
        }

        const observerBodyId = jplBodyFromString(observerBodyName)?.id;
        if (observerBodyId === undefined) {
            throw Error(`Cannot parse body name to JplBodyId: ${observerBodyName}`);
        }

        const stats = runAstronomicalCoordsTestCases(targetBodyId, observerBodyId, data);

        const separationSummary = stats.separationAverage ? Radians.toDegrees(stats.separationAverage).toPrecision(4) : stats.error;

        var fileName = /[^/]*$/.exec(testFileName)?.[0] || testFileName;

        console.log(`| ${targetBodyName} | ${observerBodyName} | ${data.length}`
            + ` | ${separationSummary}`
            + ` | ${fileName} |`);
    }
}

export async function runEphemerisTestSuite() {
    await testSuite('./api/jpl/test/ephemeris-reference', 'WGC_StateVector', 'Computing ephemeris with standard configuration for corrections (light time and star aberration corrections)');
}

(async () => {
    await runEphemerisTestSuite();
})();
