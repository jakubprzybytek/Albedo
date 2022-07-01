import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { JulianDay } from '../../math';
import { JplBody, EphemerisSeconds } from '../../math/jpl';
import { kernelRepository } from '../../math/jpl/tests/de440.testData';

type GetStatesParams = {
    target: string,
    observer: string,
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    const { target, observer } = event.queryStringParameters as GetStatesParams;
    if (!target || !observer) {
        throw Error("Following parameters are required: 'target', 'observer'");
    }

    const stateSolver = kernelRepository.stateSolverBuilder()
        .forTarget(JplBody.Earth)
        .forObserver(JplBody.SolarSystemBarycenter)
        .build();

    const states = JulianDay.forRange(JulianDay.fromDate(2019, 10, 9), JulianDay.fromDate(2019, 10, 10), 0.1)
        .map(EphemerisSeconds.fromJde)
        .map(ephemerisSeconds => stateSolver.positionFor(ephemerisSeconds));

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(states),
    };
};
