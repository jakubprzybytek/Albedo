import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success, Failure } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Ephemerides, Ephemeris } from '@astro/scripts';
import { JplBody, JplBodyId } from '@jpl';
import { kernelRepository } from "@jpl/data/de440.full";

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

export const handler = lambdaHandler<Ephemeris[]>(event => {
    const { target, fromTde, toTde, interval } = parseGetEphemerisParams(event);

    if (target.id === JplBodyId.Earth) {
        return Failure('Cannot ephemeris for Earth');
    }

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute ephemerides for '${target.name}' between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde}) in interval of ${interval} day(s)`);

    const ephemerisScripts = new Ephemerides(kernelRepository.StateSolver());
    const ephemerides = ephemerisScripts.simple(target.id, fromJde, toJde, interval);

    return Success(ephemerides);
});
