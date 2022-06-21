import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { JulianDay } from '@math';
import { JplBody, EphemerisSeconds } from '@jpl';
import { DirectStateSolver } from '../math/jpl/state';
import { kernelRepository } from '../math/jpl/tests/de440.testData';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

  const spkForMercury = kernelRepository.getAllTransientSpkKernelCollections(JplBody.Mercury);
  const mercuryStateSolver = new DirectStateSolver(spkForMercury);

  const states = JulianDay.forRange(JulianDay.fromDate(2019, 10, 9), JulianDay.fromDate(2019, 10, 10), 0.1)
    .map(EphemerisSeconds.fromJde)
    .map(ephemerisSeconds => mercuryStateSolver.positionFor(ephemerisSeconds));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(states),
  };
};
