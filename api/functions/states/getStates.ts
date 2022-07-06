import { lambdaHandler, Success, Failure } from '../HandlerProxy';
import { JulianDay, RectangularCoordinates } from '../../math';
import { EphemerisSeconds, jplBodyFromString } from '../../jpl';
import { kernelRepository } from '../../jpl/tests/de440.testData';

type GetStatesParams = {
    target: string;
    observer: string;
    fromTde: string;
    toTde: string;
    interval: string;
}

type State = {
    jde: number;
    ephemerisSeconds: number;
    position: RectangularCoordinates;
    velocity: RectangularCoordinates;
}

export type GetStatesReturnType = State[];

export const handler = lambdaHandler<GetStatesReturnType>(event => {
    const { target, observer, fromTde, toTde, interval } = event.queryStringParameters as GetStatesParams;
    if (!target || !observer || !fromTde || !toTde || !interval) {
        return Failure("Following parameters are required: 'target', 'observer', 'fromTde', 'toTde', 'interval");
    }

    const targetJplBody = jplBodyFromString(target);

    if (targetJplBody == undefined) {
        return Failure(`Cannot parse JPL body from '${target}'`);
    }

    const observerJplBody = jplBodyFromString(observer);

    if (observerJplBody === undefined) {
        return Failure(`Cannot parse JPL body from '${observer}'`);
    }

    const fromTdeDate = new Date(fromTde);
    const toTdeDate = new Date(toTde);
    const intervalInDays = Number.parseFloat(interval);

    const fromJde = JulianDay.fromDateObject(fromTdeDate);
    const toJde = JulianDay.fromDateObject(toTdeDate);

    console.log(`Compute states for '${targetJplBody.name}' w.r.t. ${observerJplBody.name} between ${fromTde}(${fromJde}) and ${toTde}(${toJde}) in interval of ${intervalInDays} days`);

    const stateSolver = kernelRepository.stateSolverBuilder()
        .forTarget(targetJplBody.id)
        .forObserver(observerJplBody.id)
        .build();

    const states: GetStatesReturnType = JulianDay.forRange(fromJde, toJde, intervalInDays)
        .map(jde => ({
            jde: jde,
            ephemerisSeconds: EphemerisSeconds.fromJde(jde)
        }))
        .map(({ jde, ephemerisSeconds }) => ({
            jde,
            ephemerisSeconds,
            position: stateSolver.positionFor(ephemerisSeconds),
            velocity: stateSolver.velocityFor(ephemerisSeconds)
        }));

    return Success(states);
});
