import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay } from '@math';
import { JplBody } from '@jpl';
import { Separations, SeparationWithBodies } from '@astro/separations';
import { GetSeparationsResponseType } from ".";

type GetSeparationsParams = {
    target: JplBody;
    observer: JplBody;
    fromTde: Date;
    toTde: Date;
    interval: number;
}

const parseGetSeparationsParams: (event: APIGatewayProxyEventV2) => GetSeparationsParams = (event: APIGatewayProxyEventV2) => ({
    target: mandatoryJplBody(event, 'target'),
    observer: mandatoryJplBody(event, 'observer'),
    fromTde: mandatoryDate(event, 'fromTde'),
    toTde: mandatoryDate(event, 'toTde'),
    interval: mandatoryFloat(event, 'interval')
});

export const handler = lambdaHandler<GetSeparationsResponseType>(event => {
    const { target, observer, fromTde, toTde, interval } = parseGetSeparationsParams(event);

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute separations for '${target.name}' w.r.t. '${observer.name}' between ${fromTde}(${fromJde}) and ${toTde}(${toJde}) in interval of ${interval} day(s)`);

    const separations = Separations.all(target, observer, fromJde, toJde, interval)

    console.log(`Computed ${separations.length} separations`);

    return Success(separations);
});
