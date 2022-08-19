import { runStatesTestSuite } from "./fullTest.states";
import { runEphemerisTestSuite } from "./fullTest.ephemeris";

(async () => {
    await runStatesTestSuite();
    await runEphemerisTestSuite();
})();
