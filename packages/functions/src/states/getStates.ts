import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { EphemerisSeconds, JplBody } from '@jpl';
import { kernelRepository } from "@jpl/data/de440.full";
import { JulianDay } from '@astro';
import { States } from "@astro/scripts";
import { RectangularCoordinates } from "@astro/coords";
import { StateWithPositionAndVelocity } from ".";

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

export const handler = lambdaHandler<StateWithPositionAndVelocity[]>((event: APIGatewayProxyEventV2) => {
  const { target, observer, fromTde, toTde, interval } = parseGetStatesParams(event);

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  console.log(`Compute states for '${target.name}' w.r.t. '${observer.name}' between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde}) in interval of ${interval} day(s)`);
  
  const stateScripts = new States(kernelRepository.stateSolver2());
  
  const fromEs = EphemerisSeconds.fromJde(fromJde);
  const toEs = EphemerisSeconds.fromJde(toJde);
  const intervalEs = EphemerisSeconds.fromDays(interval);
  
  const states = stateScripts.positions(target.id, observer.id, fromEs, toEs, intervalEs)
  .map<StateWithPositionAndVelocity>(positionInTime => {
      const jde = EphemerisSeconds.toJde(positionInTime.es);
      return {
        es: positionInTime.es,
        jde: jde,
        tde: JulianDay.toDateTime(jde),
        position: positionInTime.coords,
        velocity: new RectangularCoordinates(0, 0, 0)
      }
    });
    
    console.log(`Returning ${states.length} states`);

  return Success(states);
});
