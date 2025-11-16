import { ObserverLocation, Radians, RectangularCoordinates } from "@astro/coords";
import { ConjunctionDso, Ephemerides } from "@astro/scripts";
import { JplBodyId, jplBodyFromId, EphemerisSeconds, JplBody } from "@jpl";
import { KernelsRepository } from "@jpl/kernels";
import { OpenNgcObject } from "@openNgc";
import { Table } from "@utils/Table";
import { prepareCatalogueClusters } from "./dso/catalogue";

const PRELIMINARY_INTERVAL = EphemerisSeconds.fromDays(1);

const SEPARATION_THRESHOLD = Radians.fromDegrees(0.5);

export class ConjunctionsWithDso {

  readonly ephemerides: Ephemerides;

  readonly catalogueClusters: Table<OpenNgcObject[]>;

  constructor(kernels: KernelsRepository, dsoObjects: OpenNgcObject[]) {
    this.ephemerides = new Ephemerides(kernels);
    this.catalogueClusters = prepareCatalogueClusters(dsoObjects);
  }

  for(bodyIdies: JplBodyId[], fromJde: number, toJde: number, separationLimit: number, observerLocation?: ObserverLocation): ConjunctionDso[] {
    // const bodies = bodyIdies
    //   .map(jplBodyFromId)
    //   .filter((jplBody): jplBody is JplBody => !!jplBody);

    // const correctedFromEs = EphemerisSeconds.fromJde(fromJde) - PRELIMINARY_INTERVAL;
    // const correctedToEs = EphemerisSeconds.fromJde(toJde) + PRELIMINARY_INTERVAL;
    // const esArray = EphemerisSeconds.forRange(correctedFromEs, correctedToEs, PRELIMINARY_INTERVAL);

    // const positionsByBody = bodyIdies
    //   .reduce(
    //     (acc, bodyId) => acc.set(bodyId, esArray.map(this.states.buildPositionFunction(bodyId))),
    //     new Map<JplBodyId, RectangularCoordinates[]>()
    //   );

    // for (const body of bodies) {
    //   const bodyPositions = positionsByBody.get(body.id);
    // }
    return [];
  }

  findConjunctionsWithDso(fromJde: number, toJde: number, observerLocation?: ObserverLocation): ConjunctionDso[] {
    const bodies = [JplBodyId.Moon, JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    return this.for(bodies, fromJde, toJde, SEPARATION_THRESHOLD, observerLocation);
  }
}
