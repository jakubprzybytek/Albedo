import { JplBodyId } from "../../jpl";
import { localMinimums } from '../utils/LocalMinimums';
import { Separations } from '../../astro/separations';
import { Conjunction } from './';

const PRELIMINARY_INTERVAL = 1;

export class Conjunctions {
    static all(fromJde: number, toJde: number): Conjunction[] {
        const sepearations = Separations.all(JplBodyId.Mercury, JplBodyId.Venus, fromJde, toJde, PRELIMINARY_INTERVAL);
        return localMinimums(sepearations, element => element.separation)
    }
};
