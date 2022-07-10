import { JplBodyId } from "..";
import { generateTestData } from "./testDataGenerator";

generateTestData('d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp', 'de440.testData.ts', new Date('2019-10-09'), new Date('2019-10-11'), [
    { body: JplBodyId.EarthMoonBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Earth, centerBody: JplBodyId.EarthMoonBarycenter },
]);
