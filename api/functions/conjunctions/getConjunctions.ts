import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate } from '../LambdaParams';
import { JulianDay } from '../../math';
import { Conjunctions, Conjunction } from '../../astro/conjunctions';

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
