import { Eclipse } from ".";
import { JplBodyId } from "../../jpl";
import { Radians } from "../../math";
import { Conjunctions } from "../conjunctions";

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
};
