import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Separation, Separations } from '@astro/scripts';
import { JplBody } from '@jpl';
import { kernels } from "@jpl/data/kernels.full";

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

export const handler = lambdaHandler<Separation[]>(event => {
    const { target, observer, fromTde, toTde, interval } = parseGetSeparationsParams(event);

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute separations for '${target.name}' w.r.t. '${observer.name}' between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde}) in interval of ${interval} day(s)`);

    const seprationScripts = new Separations(kernels.stateSolver());
    const separations = seprationScripts.for(target.id, observer.id, fromJde, toJde, interval);

    console.log(`Computed ${separations.length} separations`);

    return Success(separations);
});
