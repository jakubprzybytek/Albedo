import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay } from '../../math';
import { JplBody } from '../../jpl';
import { States, StateWithPositionAndVelocity } from '../../jpl/state';

type GetStatesParams = {
    target: JplBody;
    observer: JplBody;
    fromTde: Date;
    toTde: Date;
    interval: number;
}

const parseGetStatesParams: (event: APIGatewayProxyEventV2) => GetStatesParams = (event: APIGatewayProxyEventV2) => ({
    target: mandatoryJplBody(event, 'target'),
    observer: mandatoryJplBody(event, 'observer'),
    fromTde: mandatoryDate(event, 'fromTde'),
    toTde: mandatoryDate(event, 'toTde'),
    interval: mandatoryFloat(event, 'interval')
});

export type GetStatesReturnType = StateWithPositionAndVelocity[];

export const handler = lambdaHandler<GetStatesReturnType>(event => {
    const { target, observer, fromTde, toTde, interval } = parseGetStatesParams(event);

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute states for '${target.name}' w.r.t. '${observer.name}' between ${fromTde}(${fromJde}) and ${toTde}(${toJde}) in interval of ${interval} day(s)`);

    const states = States.positionAndVelocity(target.id, observer.id, fromJde, toJde, interval)

    return Success(states);
});
