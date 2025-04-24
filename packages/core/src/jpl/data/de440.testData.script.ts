import { JplBodyId } from "..";
import { readMultipleSpkCollections, printSpkCollections } from "./testDataGenerator";

const from = new Date('2019-10-09');
const to = new Date('2019-10-11');

const de440spk = readMultipleSpkCollections('c:/_Me/Projects/Albedo-data/de440.bsp', from, to, [
    { body: JplBodyId.VenusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Venus, centerBody: JplBodyId.VenusBarycenter },
    { body: JplBodyId.EarthMoonBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Earth, centerBody: JplBodyId.EarthMoonBarycenter },
]);

printSpkCollections('de440.testData.ts', de440spk, from, to);
