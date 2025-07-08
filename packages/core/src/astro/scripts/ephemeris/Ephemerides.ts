import { AstronomicalCoordinates } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType2, StateSolver2 } from '@jpl/state';
import { Ephemeris2 } from '.';

export class Ephemerides2 {

  readonly stateSolver: StateSolver2;

  readonly stateScripts: States;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
    this.stateScripts = new States(this.stateSolver);
  }

  single(tagetBodyId: JplBodyId, es: number): AstronomicalCoordinates {
    return AstronomicalCoordinates.fromRectangular(this.stateScripts.position(tagetBodyId, JplBodyId.Earth, es, CorrectionType2.NONE))
  }

  simple(tagetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Ephemeris2[] {
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map(es => ({
        ...timeProperties(es),
        coords: AstronomicalCoordinates.fromRectangular(this.stateScripts.position(tagetBodyId, JplBodyId.Earth, es, CorrectionType2.NONE))
      }));
  }
};
