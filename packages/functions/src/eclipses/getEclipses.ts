import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Eclipses, Eclipse } from '@astro/scripts';
import { kernelRepository } from "@jpl/data/de440.full";

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

  console.log(`Find eclipses between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde})`);

  const eclipseScripts = new Eclipses(kernelRepository.StateSolver());
  const eclipses = eclipseScripts.forSunAndMoon(fromJde, toJde);

  console.log(`Found ${eclipses.length} eclipses.`);

  return Success(eclipses);
});
