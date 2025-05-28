import { JulianDay } from '@astro';
import { JplBody, JplBodyId, jplBodyFromId, EphemerisSeconds } from "@jpl";
import { StateSolver2 } from '@jpl/state/solver2';
import { Radians, RectangularCoordinates } from '@astro/coords';
import { localExtremums } from "@astro/math";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { createPairs } from '@astro/utils/Pairs';
import { States, Separations2, Ephemerides2 } from '@astro/scripts';
import { Conjunction } from '.';

const PRELIMINARY_INTERVAL = 1;

const SEPARATION_THRESHOLD = Radians.fromDegrees(2);

type TimedSeparation = {
  es: number;
  separation: number;
}

export class Conjunctions2 {

  readonly stateSolver: StateSolver2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  for(bodyIdies: JplBodyId[], fromJde: number, toJde: number, separationLimit: number): Conjunction[] {
    const bodies = bodyIdies
      .map(jplBodyFromId)
      .filter((jplBody): jplBody is JplBody => !!jplBody);

    const esArray = JulianDay.forRange(fromJde - PRELIMINARY_INTERVAL, toJde + PRELIMINARY_INTERVAL, PRELIMINARY_INTERVAL)
      .map(EphemerisSeconds.fromJde);

    const ephemerides = new Ephemerides2(this.stateSolver);

    const positionsByBody = bodyIdies
      .reduce((acc, bodyId) => acc.set(bodyId, esArray.map(States.buildPositionFunction(this.stateSolver, bodyId))), new Map<JplBodyId, RectangularCoordinates[]>());

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
          const a = separation.es - EphemerisSeconds.fromDays(PRELIMINARY_INTERVAL);
          const b = separation.es;
          const c = separation.es + EphemerisSeconds.fromDays(PRELIMINARY_INTERVAL);
          const separationFunction = Separations2.buildSeparationFunction(this.stateSolver, firstBody.id, secondBody.id);
          const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(separationFunction, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
          // console.log(`jde: ${EphemerisSeconds.toJde(eventEs)}, date=${JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)).toISOString()}, angle=${Radians.toDegrees(minSeparation)}°, result range width=${resultRangeWidth}, iterations=${iterations}`);
          return {
            es: eventEs,
            separation: minSeparation
          }
        })
        .map<Conjunction>(separation => ({
          jde: EphemerisSeconds.toJde(separation.es),
          tde: JulianDay.toDateTime(EphemerisSeconds.toJde(separation.es)),
          firstBody: {
            info: firstBody,
            ephemeris: ephemerides.single(firstBody.id, separation.es)
          },
          secondBody: {
            info: secondBody,
            ephemeris: ephemerides.single(secondBody.id, separation.es)
          },
          separation: separation.separation,
          positionAngle: NaN
        }))
        .forEach(conjuction => conjuctions.push(conjuction));
    }

    return conjuctions;
  }

  all(fromJde: number, toJde: number): Conjunction[] {
    const bodies = [JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    return this.for(bodies, fromJde, toJde, SEPARATION_THRESHOLD);
  }

};
