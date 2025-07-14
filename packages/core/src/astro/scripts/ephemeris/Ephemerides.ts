import { AstronomicalCoordinates } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType, StateSolver } from '@jpl/state';
import { Ephemeris } from '.';

export class Ephemerides {

  readonly stateSolver: StateSolver;

  readonly stateScripts: States;

  constructor(stateSolver: StateSolver) {
    this.stateSolver = stateSolver;
    this.stateScripts = new States(this.stateSolver);
  }

  single(tagetBodyId: JplBodyId, es: number): AstronomicalCoordinates {
    return AstronomicalCoordinates.fromRectangular(this.stateScripts.position(tagetBodyId, JplBodyId.Earth, es, CorrectionType.NONE))
  }

  simple(tagetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Ephemeris[] {
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map(es => ({
        ...timeProperties(es),
        coords: AstronomicalCoordinates.fromRectangular(this.stateScripts.position(tagetBodyId, JplBodyId.Earth, es, CorrectionType.NONE))
      }));
  }
};
