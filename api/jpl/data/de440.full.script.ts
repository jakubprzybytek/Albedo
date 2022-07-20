import { JplBodyId } from "..";
import { readMultipleSpkCollections, printSpkCollections } from "./testDataGenerator";

const from = new Date('2022-01-01');
const to = new Date('2023-12-31');

const de440spk = readMultipleSpkCollections('c:/_Me/Projects/Albedo-data/de440.bsp', from, to, [
    { body: JplBodyId.Sun, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.MercuryBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Mercury, centerBody: JplBodyId.MercuryBarycenter },
    { body: JplBodyId.EarthMoonBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Earth, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.Moon, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.VenusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Venus, centerBody: JplBodyId.VenusBarycenter },
]);

printSpkCollections('de440.full.ts', de440spk, from, to);
