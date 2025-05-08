import { Eclipse } from ".";
import { JplBodyId } from "@jpl";
import { Radians } from "@astro/coords";
import { Conjunction, Conjunctions } from "@astro/scripts/conjunctions";
import { States } from "@jpl/state";
import { Separations } from "../separations";
import { localExtremums } from "@astro/utils";

const COARSE_PRELIMINARY_INTERVAL = 1;

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

    return [];
  }

};
