import { JulianDay } from '../../math';
import { EphemerisSeconds, JplBodyId } from '../../jpl';
import { State } from './';
import { kernelRepository } from '../../jpl/data/de440.full';

export class States {
    static get(tagetBodyId: JplBodyId, observerBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): State[] {
        const stateSolver = kernelRepository.stateSolverBuilder()
            .forTarget(tagetBodyId)
            .forObserver(observerBodyId)
            .build();

        return JulianDay.forRange(fromJde, toJde, interval)
            .map(jde => ({
                jde: jde,
                ephemerisSeconds: EphemerisSeconds.fromJde(jde)
            }))
            .map(({ jde, ephemerisSeconds }) => ({
                jde,
                ephemerisSeconds,
                tde: JulianDay.toDateTime(jde),
                position: stateSolver.positionFor(ephemerisSeconds),
                velocity: stateSolver.velocityFor(ephemerisSeconds)
            }));
    }
};
