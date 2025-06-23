import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody, mandatoryString } from '../LambdaParams';
import { EphemerisSeconds, JplBody } from '@jpl';
import { stringToCorrectionType } from "@jpl/state/solver2";
import { kernelRepository } from "@jpl/data/de440.full";
import { JulianDay } from '@astro';
import { RectangularCoordinates } from "@astro/coords";
import { States } from "@astro/scripts";
import { StateResult } from ".";

type GetStatesParams = {
  target: JplBody;
  observer: JplBody;
  fromTde: Date;
  toTde: Date;
  interval: number;
  correctionString: string;
}

const parseGetStatesParams: (event: APIGatewayProxyEventV2) => GetStatesParams = (event: APIGatewayProxyEventV2) => ({
  target: mandatoryJplBody(event, 'target'),
  observer: mandatoryJplBody(event, 'observer'),
  fromTde: mandatoryDate(event, 'fromTde'),
  toTde: mandatoryDate(event, 'toTde'),
  interval: mandatoryFloat(event, 'interval'),
  correctionString: mandatoryString(event, 'correction')
});

export const handler = lambdaHandler<StateResult[]>((event: APIGatewayProxyEventV2) => {
  const { target, observer, fromTde, toTde, interval, correctionString } = parseGetStatesParams(event);

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  const correction = stringToCorrectionType(correctionString);

  if (correction === undefined) {
    throw Error(`'correction' parameter has wrong value: ${correction}`);
  }

  console.log(`Compute states for '${target.name}' w.r.t. '${observer.name}' between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde}) in interval of ${interval} day(s) and correction: '${correction}'`);

  const stateScripts = new States(kernelRepository.stateSolver2());

  const fromEs = EphemerisSeconds.fromJde(fromJde);
  const toEs = EphemerisSeconds.fromJde(toJde);
  const intervalEs = EphemerisSeconds.fromDays(interval);

  const states = stateScripts.states(target.id, observer.id, fromEs, toEs, intervalEs, correction)
    .map<StateResult>(state => {
      const jde = EphemerisSeconds.toJde(state.es);
      return {
        es: state.es,
        jde: jde,
        tde: JulianDay.toDateTime(jde),
        position: state.position,
        distance: state.position.length(),
        velocity: new RectangularCoordinates(0, 0, 0),
        lightTime: state.lightTime
      }
    });

  console.log(`Returning ${states.length} states`);

  return Success(states);
});
