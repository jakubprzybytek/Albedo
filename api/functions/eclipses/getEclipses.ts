import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate } from '../LambdaParams';
import { JulianDay } from '../../math';
import { Eclipses, Eclipse } from '../../astro/eclipses';

type GetEclipsesParams = {
    fromTde: Date;
    toTde: Date;
}

const parseGetEcilipsesParams: (event: APIGatewayProxyEventV2) => GetEclipsesParams = (event: APIGatewayProxyEventV2) => ({
    fromTde: mandatoryDate(event, 'fromTde'),
    toTde: mandatoryDate(event, 'toTde'),
});

export type GetEclipsesReturnType = Eclipse[];

export const handler = lambdaHandler<GetEclipsesReturnType>(event => {
    const { fromTde, toTde } = parseGetEcilipsesParams(event);

    const fromJde = JulianDay.fromDateObject(fromTde);
    const toJde = JulianDay.fromDateObject(toTde);

    console.log(`Compute eclipses between ${fromTde}(${fromJde}) and ${toTde}(${toJde})`);

    const eclipses = Eclipses.all(fromJde, toJde);

    return Success(eclipses);
});
