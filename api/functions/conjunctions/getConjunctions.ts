import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success, Failure } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay } from '../../math';
import { JplBody, JplBodyId } from '../../jpl';
import { Conjunctions, Conjunction } from './';

type GetConjunctionsParams = {
    fromTde: Date;
    toTde: Date;
}

const parseGetConjunctionsParams: (event: APIGatewayProxyEventV2) => GetConjunctionsParams = (event: APIGatewayProxyEventV2) => ({
    fromTde: mandatoryDate(event, 'fromTde'),
    toTde: mandatoryDate(event, 'toTde'),
});

export type GetConjunctionsReturnType = Conjunction[];

export const handler = lambdaHandler<GetConjunctionsReturnType>(event => {
    const { fromTde, toTde } = parseGetConjunctionsParams(event);

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute conjunctions for between ${fromTde}(${fromJde}) and ${toTde}(${toJde})`);

    const conjunctions = Conjunctions.all(fromJde, toJde);

    return Success(conjunctions);
});
