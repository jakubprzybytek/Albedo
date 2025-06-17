import { runStatesTestSuite } from "./suites/states/fullTest.states";
import { runEphemerisTestSuite } from "./suites/ephemeris/fullTest.ephemeris";

(async () => {
  const timestamp = new Date().toISOString().replace(/\..+/, '').replace(/[:.-]/g, '');
  await runStatesTestSuite(timestamp);
  await runEphemerisTestSuite(timestamp);
})();
