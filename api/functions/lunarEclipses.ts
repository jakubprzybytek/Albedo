import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { SearchLunarEclipse, NextLunarEclipse, EclipseKind, LunarEclipseInfo } from 'astronomy-engine';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

    const eclipses: LunarEclipseInfo[] = [];

    let count = 0;
    let eclipse = SearchLunarEclipse(new Date());
    while (count < 10) {
        if (eclipse.kind !== EclipseKind.Penumbral) {
            eclipses.push(eclipse);
            count++;
        }
        eclipse = NextLunarEclipse(eclipse.peak);
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eclipses),
    };
};


