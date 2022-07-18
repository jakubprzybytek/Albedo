import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay } from '../../math';
import { JplBody } from '../../jpl';
import { Separations, Separation } from '../../astro/separations';

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

export type GetSeparationsReturnType = Separation[];

export const handler = lambdaHandler<GetSeparationsReturnType>(event => {
    const { target, observer, fromTde, toTde, interval } = parseGetSeparationsParams(event);

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute separations for '${target.name}' w.r.t. '${observer.name}' between ${fromTde}(${fromJde}) and ${toTde}(${toJde}) in interval of ${interval} day(s)`);

    const separations = Separations.all(target.id, observer.id, fromJde, toJde, interval)

    return Success(separations);
});
