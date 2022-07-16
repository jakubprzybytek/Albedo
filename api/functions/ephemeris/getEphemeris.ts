import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success, Failure } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay, AstronomicalCoordinates } from '../../math';
import { States, JplBody, JplBodyId } from '../../jpl';
import { Ephemeris } from './';

type GetEphemeridesParams = {
    target: JplBody;
    fromTde: Date;
    toTde: Date;
    interval: number;
}

const parseGetEphemerisParams: (event: APIGatewayProxyEventV2) => GetEphemeridesParams = (event: APIGatewayProxyEventV2) => ({
    target: mandatoryJplBody(event, 'target'),
    fromTde: mandatoryDate(event, 'fromTde'),
    toTde: mandatoryDate(event, 'toTde'),
    interval: mandatoryFloat(event, 'interval')
});

export type GetEphemerisReturnType = Ephemeris[];

export const handler = lambdaHandler<GetEphemerisReturnType>(event => {
    const { target, fromTde, toTde, interval } = parseGetEphemerisParams(event);

    if (target.id === JplBodyId.Earth) {
        return Failure('Cannot ephemeris for Earth');
    }

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute ephemerides for '${target.name}' between ${fromTde}(${fromJde}) and ${toTde}(${toJde}) in interval of ${interval} day(s)`);

    const states = States.position(target.id, JplBodyId.Earth, fromJde, toJde, interval)
        .map(state => ({
            jde: state.jde,
            ephemerisSeconds: state.ephemerisSeconds,
            tde: state.tde,
            coords: AstronomicalCoordinates.fromRectangular(state.position).toDegrees()
        }))

    return Success(states);
});
