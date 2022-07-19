import { JplBodyId } from "..";
import { generateTestData } from "./testDataGenerator";

//generateTestData('d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp', 'de440.full.ts', new Date('2022-01-01'), new Date('2022-12-31'), [
generateTestData('c:/_Me/Projects/Albedo-data/de440.bsp', 'de440.full.ts', new Date('2022-01-01'), new Date('2022-12-31'), [
    { body: JplBodyId.Sun, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.MercuryBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Mercury, centerBody: JplBodyId.MercuryBarycenter },
    { body: JplBodyId.EarthMoonBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Earth, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.Moon, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.VenusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Venus, centerBody: JplBodyId.VenusBarycenter },
]);
