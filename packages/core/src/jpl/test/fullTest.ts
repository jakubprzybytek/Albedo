import { runStatesTestSuite } from "./suites/states/fullTest.states";
import { runEphemerisTestSuite } from "./suites/ephemeris/fullTest.ephemeris";

(async () => {
    await runStatesTestSuite();
    await runEphemerisTestSuite();
})();
