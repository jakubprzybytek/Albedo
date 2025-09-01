import { JplBodyId } from "@jpl";
import { printSpkCollections } from "@jpl/data/lib/spk/printSpkCollections";
import { readMultipleSpkCollections } from "@jpl/data/lib/spk/readMultipleSpkCollections";

export function generateSpk(kernelsFolder: string) {
  const from = new Date('2019-10-09');
  const to = new Date('2019-10-11');

  const spkCollections = readMultipleSpkCollections(`${kernelsFolder}/de440.bsp`, from, to, [
    { body: JplBodyId.Sun, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.VenusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Venus, centerBody: JplBodyId.VenusBarycenter },
    { body: JplBodyId.EarthMoonBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Earth, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.Moon, centerBody: JplBodyId.EarthMoonBarycenter },
  ]);

  printSpkCollections(`${__dirname}/spk.testData.ts`, spkCollections, from, to);
}
