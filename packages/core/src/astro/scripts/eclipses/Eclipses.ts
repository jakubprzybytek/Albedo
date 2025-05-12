import { Eclipse } from ".";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernelRepository } from '@jpl/data/de440.full';
import { States } from "@jpl/state";
import { JulianDay } from "@astro";
import { Radians } from "@astro/coords";
import { localExtremums } from "@astro/math";
import { Conjunction, Conjunctions } from "@astro/scripts/conjunctions";
import { Separations } from "../separations";

const COARSE_PRELIMINARY_INTERVAL = 1;

const sunStateSolver = kernelRepository.stateSolverBuilder()
            .forTarget(JplBodyId.Sun)
            .forObserver(JplBodyId.Earth)
            .build();

 const moonStateSolver = kernelRepository.stateSolverBuilder()
            .forTarget(JplBodyId.Moon)
            .forObserver(JplBodyId.Earth)
            .build();

function earthsShadowAndMoonAngle(es: number) {
  const sunState = sunStateSolver.positionFor(es);
  const earthsShadowState = sunState.negate();

  const moonState = moonStateSolver.positionFor(es);

  return Radians.between(moonState, earthsShadowState);
}

export class Eclipses {


  static all(fromJde: number, toJde: number): Eclipse[] {
    return Conjunctions.for([JplBodyId.Sun, JplBodyId.Moon], fromJde, toJde, Radians.fromDegrees(2))
      .map((conjunction) => ({
        jde: conjunction.jde,
        tde: conjunction.tde,
        separation: conjunction.separation,
        positionAngle: 1
      }))
  }

  static forSunAndMoon(fromJde: number, toJde: number): Conjunction[] {
    const sunPositions = States.position(JplBodyId.Sun, JplBodyId.Earth, fromJde, toJde, COARSE_PRELIMINARY_INTERVAL);
    const moonPositions = States.position(JplBodyId.Moon, JplBodyId.Earth, fromJde, toJde, COARSE_PRELIMINARY_INTERVAL);

    const sunMoonSeparations = Separations.fromPositions(sunPositions, moonPositions);
    const { minimums, maximums } = localExtremums(sunMoonSeparations, (separation) => separation.separation);
    console.log(sunMoonSeparations);
    console.log('Minimums', minimums);
    console.log('Maximums', maximums);

    maximums
      .filter(separation => Radians.toDegrees(separation.separation) > 160)
      .forEach(separation => {
      const angle = earthsShadowAndMoonAngle(EphemerisSeconds.fromJde(separation.jde));
      console.log(`jde: ${separation.jde}, date=${JulianDay.toDateTime(separation.jde)}, angle=${Radians.toDegrees(angle)}°`);
    })

    return [];
  }

};
