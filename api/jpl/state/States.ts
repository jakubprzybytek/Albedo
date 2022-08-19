import { JulianDay } from '../../math';
import { EphemerisSeconds, JplBodyId } from '..';
import { StateWithPosition, StateWithPositionAndVelocity } from '.';
import { kernelRepository } from '../data/de440.full';
import { CorrectionType } from './solvers';

export class States {
    static position(tagetBodyId: JplBodyId, observerBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): StateWithPosition[] {
        const stateSolver = kernelRepository.stateSolverBuilder()
            .forTarget(tagetBodyId)
            .forObserver(observerBodyId)
            .withCorrections(CorrectionType.LightTime, CorrectionType.StarAbberation)
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
                position: stateSolver.positionFor(ephemerisSeconds)
            }));
    }

    static positionAndVelocity(tagetBodyId: JplBodyId, observerBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): StateWithPositionAndVelocity[] {
        const stateSolver = kernelRepository.stateSolverBuilder()
            .forTarget(tagetBodyId)
            .forObserver(observerBodyId)
            .withCorrections(CorrectionType.LightTime, CorrectionType.StarAbberation)
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
