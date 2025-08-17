import { JplBodyId } from "@jpl";
import { printSpkCollections } from "./lib/spk/printSpkCollections";
import { readMultipleSpkCollections } from "./lib/spk/readMultipleSpkCollections";

const from = new Date('2019-10-09');
const to = new Date('2019-10-11');

const de440spk = readMultipleSpkCollections('../../data/de440.bsp', from, to, [
    { body: JplBodyId.VenusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Venus, centerBody: JplBodyId.VenusBarycenter },
    { body: JplBodyId.EarthMoonBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Earth, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.Moon, centerBody: JplBodyId.EarthMoonBarycenter },
]);

printSpkCollections('de440.testData.ts', de440spk, from, to);
