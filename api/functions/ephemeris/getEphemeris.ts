import { lambdaHandler, Success, Failure } from '../HandlerProxy';
import { JulianDay, AstronomicalCoordinates } from '../../math';
import { JplBodyId, jplBodyFromString } from '../../jpl';
import { States } from '../states/States';
import { Ephemeris } from './';

type GetEphemeridesParams = {
    target: string;
    fromTde: string;
    toTde: string;
    interval: string;
}

export type GetEphemerisReturnType = Ephemeris[];

export const handler = lambdaHandler<GetEphemerisReturnType>(event => {
    const { target, fromTde, toTde, interval } = event.queryStringParameters as GetEphemeridesParams;
    if (!target || !fromTde || !toTde || !interval) {
        return Failure("Following parameters are required: 'target', 'fromTde', 'toTde', 'interval");
    }

    const targetJplBody = jplBodyFromString(target);

    if (targetJplBody == undefined) {
        return Failure(`Cannot parse JPL body from '${target}'`);
    }

    if (targetJplBody.id === JplBodyId.Earth) {
        return Failure('Cannot ephemeris for Earth');
    }

    const fromTdeDate = new Date(fromTde);
    const toTdeDate = new Date(toTde);
    const intervalInDays = Number.parseFloat(interval);

    const fromJde = JulianDay.fromDateObject(fromTdeDate);
    const toJde = JulianDay.fromDateObject(toTdeDate);

    console.log(`Compute ephemerides for '${targetJplBody.name}' between ${fromTde}(${fromJde}) and ${toTde}(${toJde}) in interval of ${intervalInDays} day(s)`);

    const states = States.get(targetJplBody.id, JplBodyId.Earth, fromJde, toJde, intervalInDays)
        .map(state => ({
            jde: state.jde,
            ephemerisSeconds: state.ephemerisSeconds,
            tde: state.tde,
            coords: AstronomicalCoordinates.fromRectangular(state.position).toDegrees()
        }))

    return Success(states);
});
