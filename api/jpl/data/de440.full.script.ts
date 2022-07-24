import { JplBodyId } from "..";
import { readMultipleSpkCollections, printSpkCollections } from "./testDataGenerator";

const from = new Date('2022-01-01');
const to = new Date('2023-12-31');
//const to = new Date('2022-01-02');

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

const mar097spk = readMultipleSpkCollections('c:/_Me/Projects/Albedo-data/mar097.bsp', from, to, [
    { body: JplBodyId.MarsBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Mars, centerBody: JplBodyId.MarsBarycenter },
]);

const jup365spk = readMultipleSpkCollections('c:/_Me/Projects/Albedo-data/jup365.bsp', from, to, [
    { body: JplBodyId.JupiterBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Jupiter, centerBody: JplBodyId.JupiterBarycenter },
]);

const ura116spk = readMultipleSpkCollections('c:/_Me/Projects/Albedo-data/ura116.bsp', from, to, [
    { body: JplBodyId.UranusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Uranus, centerBody: JplBodyId.UranusBarycenter },
]);

const nep101spk = readMultipleSpkCollections('c:/_Me/Projects/Albedo-data/nep101.bsp', from, to, [
    { body: JplBodyId.NeptuneBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Neptune, centerBody: JplBodyId.NeptuneBarycenter },
]);

printSpkCollections('de440.full.ts', [...de440spk, ...mar097spk, ...jup365spk, ...ura116spk, ...nep101spk], from, to);
