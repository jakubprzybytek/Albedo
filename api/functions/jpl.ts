import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { JulianDay } from '@math';
import { EphemerisSeconds } from '@jpl';
import { stateSolver } from '../math/jpl/test';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

  const states = JulianDay.forRange(JulianDay.fromDate(2019, 10, 9), JulianDay.fromDate(2019, 10, 10), 0.1)
    .map(EphemerisSeconds.fromJde)
    .map(ephemerisSeconds => stateSolver.positionFor(ephemerisSeconds));

  // const es = EphemerisSeconds.fromJde(JulianDay.fromDateTime(2019, 10, 9, 10, 0, 0));
  // const coords = stateSolver.positionFor(es);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(states),
  };
};
