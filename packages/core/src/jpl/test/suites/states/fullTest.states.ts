import { readFileSync } from "node:fs";
import path from "node:path";
import { jplBodyFromString } from "@jpl";
import { CorrectionType } from "@jpl/state/solvers";
import { StateTestCaseRunner } from ".";
import { readRectangularCoordsFromWebGeocalcCSVFile } from "../../lib/WebGeocalcCSV";
import { runState2TestCases } from "./State2TestCasesScript";
import { buildStateTestCaseRunner } from './StateTestCasesScript';
import { buildReportWriter, findFiles, ReportWriter } from "@jpl/test/lib/Files";
import { formatDistanceStrict } from "date-fns";

async function testSuite(testCaseFileNames: string[], writer: ReportWriter, stateTestCaseRunner: StateTestCaseRunner, description: string) {
  writer(`## ${description}\n`);

  writer('| Target body | Observer body | Test cases | Time span | Interval | Avg postion error [km] | Avg velocity error [km/s] | File name | Kernels |');
  writer('| ----------- | ------------- | ---------- | --------- | -------- | ---------------------- | ------------------------- | --------- | ------- |');

  for (const testFileName of testCaseFileNames) {
    const fileContent = readFileSync(testFileName).toString();
    const { targetBodyName, observerBodyName, kernels, data } = await readRectangularCoordsFromWebGeocalcCSVFile(fileContent);

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

    const stats = stateTestCaseRunner(targetBodyId, observerBodyId, data);

    const positionSummary = stats.positionDifferenceAverage?.toPrecision(4) || stats.positionComputationError;
    const velocitySummary = stats.velocityDifferenceAverage?.toPrecision(4) || stats.velocityComputationError;

    var fileName = /[^/]*$/.exec(testFileName)?.[0] || testFileName;

    writer(`| ${targetBodyName} | ${observerBodyName} | ${data.length} | ${timeSpan} | ${timeInterval}`
      + ` | ${positionSummary} | ${velocitySummary}`
      + ` | ${fileName} | ${kernels.join(', ')} |`);
  }
}

export async function runStatesTestSuite(timestamp: string) {
  const { append, flush } = buildReportWriter('states', timestamp);

  append('# State\n');

  await testSuite(
    findFiles(path.join(__dirname, 'data/states-reference-uncorrected'), 'WGC_StateVector'),
    append,
    buildStateTestCaseRunner({ corrections: [] }),
    'State without correction'
  );
  await testSuite(findFiles(path.join(__dirname, 'data/states-reference-lightTimeCorrected'), 'WGC_StateVector'),
    append,
    buildStateTestCaseRunner({ corrections: [CorrectionType.LightTime] }),
    'State with light time correction applied'
  );
  await testSuite(findFiles(path.join(__dirname, 'data/states-reference-starAberrationCorrected'), 'WGC_StateVector'),
    append,
    buildStateTestCaseRunner({ corrections: [CorrectionType.LightTime, CorrectionType.StarAbberation] }),
    'State with star aberration and light time correction applied'
  );

  await testSuite(findFiles(path.join(__dirname, 'data/states-reference-uncorrected'), 'WGC_StateVector'),
    append,
    runState2TestCases,
    'State without correction. New State Solver.'
  );
  await testSuite(findFiles(path.join(__dirname, 'data/states-reference-lightTimeCorrected'), 'WGC_StateVector'),
    append,
    runState2TestCases,
    'State with light time correction applied. New State Solver.'
  );
  await testSuite(findFiles(path.join(__dirname, 'data/states-reference-starAberrationCorrected'), 'WGC_StateVector'),
    append,
    runState2TestCases,
    'State with star aberration and light time correction applied. New State Solver.'
  );

  flush();
}

// (async () => {
//     await runStatesTestSuite();
// })();
