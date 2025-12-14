import { ObserverLocation, Radians, RectangularCoordinates } from '@astro/coords';
import { localExtremums } from "@astro/math";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { createPairs } from '@astro/utils/Pairs';
import { JplBody, JplBodyId, jplBodyFromId, EphemerisSeconds } from "@jpl";
import { KernelsRepository } from '@jpl/kernels';
import { States, Separations, Ephemerides, timeProperties, esOrder } from '@astro/scripts';
import { Conjunction } from '.';
import { JulianDay } from '@astro';

const PRELIMINARY_INTERVAL = EphemerisSeconds.fromDays(1);

const SEPARATION_THRESHOLD = Radians.fromDegrees(0.5);

type TimedSeparation = {
  es: number;
  separation: number;
}

export class Conjunctions {

  readonly states: States;

  readonly seprations: Separations;

  readonly ephemerides: Ephemerides;

  constructor(kernels: KernelsRepository) {
    this.states = new States(kernels);
    this.seprations = new Separations(kernels);
    this.ephemerides = new Ephemerides(kernels);
  }

  for(bodyIdies: JplBodyId[], fromJde: number, toJde: number, separationLimit: number, observerLocation?: ObserverLocation): Conjunction[] {
    const bodies = bodyIdies
      .map(jplBodyFromId)
      .filter((jplBody): jplBody is JplBody => !!jplBody);

    const correctedFromEs = EphemerisSeconds.fromJde(fromJde) - PRELIMINARY_INTERVAL;
    const correctedToEs = EphemerisSeconds.fromJde(toJde) + PRELIMINARY_INTERVAL;
    const esArray = EphemerisSeconds.forRange(correctedFromEs, correctedToEs, PRELIMINARY_INTERVAL);

    const positionsByBody = bodyIdies
      .reduce(
        (acc, bodyId) => acc.set(bodyId, esArray.map(this.states.buildPositionFunction(bodyId))),
        new Map<JplBodyId, RectangularCoordinates[]>()
      );

    const conjuctions: Conjunction[] = [];

    for (const [firstBody, secondBody] of createPairs(bodies)) {
      const firstBodyPositions = positionsByBody.get(firstBody.id);
      const secondBodyPositions = positionsByBody.get(secondBody.id);

      if (firstBodyPositions === undefined || secondBodyPositions === undefined) {
        throw new Error(`Positions missing for either '${firstBody.id}' or '${secondBody.id}'`);
      }

      const separations = esArray.map<TimedSeparation>((es, index) => ({
        es,
        separation: Radians.between(firstBodyPositions[index], secondBodyPositions[index])
      }));

      const { minimums } = localExtremums(separations, minSepration => minSepration.separation);

      minimums
        .filter(separation => separation.separation < separationLimit)
        .map<TimedSeparation>(separation => {
          // console.log(`jde: ${separation.jde}, date=${JulianDay.toDateTime(separation.jde).toISOString()}, angle=${Radians.toDegrees(separation.separation)}°`);
          const a = separation.es - PRELIMINARY_INTERVAL;
          const b = separation.es;
          const c = separation.es + PRELIMINARY_INTERVAL;
          const separationFunction = observerLocation
            ? this.seprations.buildParalaxCorrectedSeparationFunction(firstBody.id, secondBody.id, observerLocation)
            : this.seprations.buildSeparationFunction(firstBody.id, secondBody.id);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(separationFunction, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
          console.log(`jde: ${EphemerisSeconds.toJde(eventEs)}, date=${JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)).toISOString()}, angle=${Radians.toDegrees(minSeparation)}°, result range width=${resultRangeWidth}, iterations=${iterations}`);
          return {
            es: eventEs,
            separation: minSeparation
          }
        })
        .map<Conjunction>(separation => ({
          ...timeProperties(separation.es),
          firstBody: {
            info: firstBody,
            ephemeris: this.ephemerides.detailedCoordinatesForBody(firstBody.id, separation.es, observerLocation)
          },
          secondBody: {
            info: secondBody,
            ephemeris: this.ephemerides.detailedCoordinatesForBody(secondBody.id, separation.es, observerLocation)
          },
          separation: separation.separation,
        }))
        .forEach(conjuction => conjuctions.push(conjuction));
    }

    return conjuctions.sort(esOrder);
  }

  all(fromJde: number, toJde: number, observerLocation?: ObserverLocation): Conjunction[] {
    const bodies = [JplBodyId.Moon, JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    return this.for(bodies, fromJde, toJde, SEPARATION_THRESHOLD, observerLocation);
  }

};
