import { readFileSync } from "node:fs";
import path from "node:path";
import { jplBodyFromString } from "@jpl";
import { Radians } from "@astro/coords";
import { runEphemerisTestCases } from "./EphemerisTestCasesScript";
import { readAstronomicalCoordsFromWebGeocalcCSVFile } from "../../lib/WebGeocalcCSV";
import { buildReportWriter, findFiles, ReportWriter } from "@jpl/test/lib/Files";
import { formatDistanceStrict } from "date-fns";

async function testSuite(testCaseFileNames: string[], writer: ReportWriter, description: string) {
  writer(`## ${description}\n`);

  writer('| Target body | Observer body | Test cases | Time span | Interval | Avg ephemeris difference [°]    | File name |');
  writer('| ----------- | ------------- | ---------- | --------- | -------- | ------------------------------- | --------- |');

  for (const testFileName of testCaseFileNames) {
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

    const timeSpan = formatDistanceStrict(data[data.length - 1].tbd, data[0].tbd);
    const timeInterval = formatDistanceStrict(data[1].tbd, data[0].tbd);

    const stats = runEphemerisTestCases(targetBodyId, observerBodyId, data);

    const separationSummary = stats.separationAverage ? Radians.toDegrees(stats.separationAverage).toPrecision(4) : stats.error;

    var fileName = /[^/]*$/.exec(testFileName)?.[0] || testFileName;

    writer(`| ${targetBodyName} | ${observerBodyName} | ${data.length} | ${timeSpan} | ${timeInterval}`
      + ` | ${separationSummary}`
      + ` | ${fileName} |`);
  }
}

export async function runEphemerisTestSuite(timestamp: string) {
  const { append, flush } = buildReportWriter('ephemeris', timestamp);

  append('# Ephemeris\n');

  await testSuite(
    findFiles(path.join(__dirname, 'data/ephemeris-reference'), 'WGC_StateVector'),
    append,
    'Computing ephemeris with standard configuration for corrections (light time and star aberration corrections)'
  );

  flush();
}

// (async () => {
//     await runEphemerisTestSuite();
// })();
