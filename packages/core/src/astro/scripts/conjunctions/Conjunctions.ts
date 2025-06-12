import { JulianDay } from '@astro';
import { Radians } from '@astro/coords';
import { localMinimums } from '@astro/math/LocalMinimums';
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { Ephemerides, Ephemeris } from "@astro/scripts";
import { Separation, Separations } from '@astro/scripts/separations';
import { JplBody, JplBodyId, jplBodyFromId, EphemerisSeconds } from "@jpl";
import { kernelRepository } from '@jpl/data/de440.full';
import { StateSolver } from '@jpl/state/solvers';
import { Conjunction } from '.';

const PRELIMINARY_INTERVAL = 1;

const SEPARATION_THRESHOLD = Radians.fromDegrees(2);

type BodyWithEphemerides = {
  body: JplBody;
  ephemerides: Ephemeris[];
};

type EphemerisPair = {
  first: BodyWithEphemerides;
  second: BodyWithEphemerides;
}

function separationFunction(bodies: JplBodyId[]) {
  const stateSolvers = bodies
    .reduce((map, bodyId) => {
      const stateSolver = kernelRepository.stateSolverBuilder().forTarget(bodyId).forObserver(JplBodyId.Earth).build();
      map.set(bodyId, stateSolver);
      return map;
    }, new Map<JplBodyId, StateSolver>());

  function buildSeparationFunctionfor(firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    const firstBodySolver = stateSolvers.get(firstBodyId);
    const secondBodySolver = stateSolvers.get(secondBodyId);

    if (firstBodySolver === undefined || secondBodySolver === undefined) {
      throw new Error(`Missing solver for either ${firstBodyId} or ${secondBodyId}`);
    }

    return (es: number) => {
      const firstBodyPosition = firstBodySolver.positionFor(es);
      const secondBOdyPosition = secondBodySolver.positionFor(es);

      return Radians.between(firstBodyPosition, secondBOdyPosition);
    }
  }

  return buildSeparationFunctionfor;
}

/**
 * @deprecated The method should not be used
 */
export class Conjunctions {

  static for(bodies: JplBodyId[], fromJde: number, toJde: number, separationLimit: number): Conjunction[] {
    const bodiesWithEphemeris = bodies
      .map(jplBodyFromId)
      .filter((jplBody): jplBody is JplBody => !!jplBody)
      .map((jplBody) => ({
        body: jplBody,
        ephemerides: Ephemerides.simple(jplBody.id, fromJde, toJde, PRELIMINARY_INTERVAL)
      }));

    const bodyPairs: EphemerisPair[] = new Array();
    for (let i = 0; i < bodiesWithEphemeris.length - 1; i++) {
      for (let j = i + 1; j < bodiesWithEphemeris.length; j++) {
        bodyPairs.push({ first: bodiesWithEphemeris[i], second: bodiesWithEphemeris[j] });
      }
    }

    const separationFunctionBuilder = separationFunction(bodies);

    return bodyPairs
      .map((pair) => ({
        firstBody: pair.first.body,
        secondBody: pair.second.body,
        separations: localMinimums(
          Separations.fromEphemerides(pair.first.ephemerides, pair.second.ephemerides),
          element => element.separation
        )
          .filter(separation => separation.separation < separationLimit)
          .map<Separation>(separation => {
            const separationFunction = separationFunctionBuilder(pair.first.body.id, pair.second.body.id);

            const a = EphemerisSeconds.fromJde(separation.jde - PRELIMINARY_INTERVAL);
            const b = EphemerisSeconds.fromJde(separation.jde);
            const c = EphemerisSeconds.fromJde(separation.jde + PRELIMINARY_INTERVAL);
            const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(separationFunction, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });

            const eventJde = EphemerisSeconds.toJde(eventEs);

            return {
              jde: eventJde,
              firstBodyEphemeris: Ephemerides.simple(pair.first.body.id, eventJde, eventJde, 1)[0],
              secondBodyEphemeris: Ephemerides.simple(pair.second.body.id, eventJde, eventJde, 1)[0],
              separation: minSeparation
            };
          })
      }))
      .flatMap((pair) => {
        return pair.separations
          .map<Conjunction>((separation) => ({
            jde: separation.jde,
            tde: JulianDay.toDateTime(separation.jde),
            firstBody: {
              info: pair.firstBody,
              ephemeris: separation.firstBodyEphemeris,
            },
            secondBody: {
              info: pair.secondBody,
              ephemeris: separation.secondBodyEphemeris
            },
            separation: separation.separation
          }));
      })
      .sort((c1, c2) => c1.jde - c2.jde);
  }

  static all(fromJde: number, toJde: number): Conjunction[] {
    const bodies = [JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    return this.for(bodies, fromJde, toJde, SEPARATION_THRESHOLD);
  }

};
