import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Conjunctions } from '@astro/scripts';
import { kernelRepository } from "@jpl/data/de440.full";
import { Conjunction } from ".";

type GetConjunctionsParams = {
  fromTde: Date;
  toTde: Date;
}

const parseGetConjunctionsParams: (event: APIGatewayProxyEventV2) => GetConjunctionsParams = (event: APIGatewayProxyEventV2) => ({
  fromTde: mandatoryDate(event, 'fromTde'),
  toTde: mandatoryDate(event, 'toTde'),
});

export const handler = lambdaHandler<Conjunction[]>(event => {
  const { fromTde, toTde } = parseGetConjunctionsParams(event);

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  console.log(`Compute conjunctions for between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde})`);

  const conjunctionScripts = new Conjunctions(kernelRepository.StateSolver());
  const conjunctions = conjunctionScripts.all(fromJde, toJde);

  console.log(`Found ${conjunctions.length} conjunctions.`);

  return Success(conjunctions);
});
