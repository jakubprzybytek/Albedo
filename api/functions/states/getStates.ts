import { lambdaHandler, Success, Failure } from '../HandlerProxy';
import { JulianDay } from '../../math';
import { jplBodyFromString } from '../../jpl';
import { StateWithPositionAndVelocity } from './';
import { States } from './States';

type GetStatesParams = {
    target: string;
    observer: string;
    fromTde: string;
    toTde: string;
    interval: string;
}

export type GetStatesReturnType = StateWithPositionAndVelocity[];

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

    console.log(`Compute states for '${targetJplBody.name}' w.r.t. '${observerJplBody.name}' between ${fromTde}(${fromJde}) and ${toTde}(${toJde}) in interval of ${intervalInDays} day(s)`);

    const states = States.positionAndVelocity(targetJplBody.id, observerJplBody.id, fromJde, toJde, intervalInDays)

    return Success(states);
});
