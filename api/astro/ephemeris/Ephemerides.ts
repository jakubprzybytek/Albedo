import { AstronomicalCoordinates } from '../../math';
import { JplBodyId } from '../../jpl';
import { States } from '../../jpl/state';
import { Ephemeris } from '.';

export class Ephemerides {
    static simple(tagetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Ephemeris[] {
        return States.position(tagetBodyId, JplBodyId.Earth, fromJde, toJde, interval)
            .map((state) => ({
                jde: state.jde,
                ephemerisSeconds: state.ephemerisSeconds,
                tde: state.tde,
                coords: AstronomicalCoordinates.fromRectangular(state.position)
            }));
    }
};
