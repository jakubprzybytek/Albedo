import { AstronomicalCoordinates } from '@astro/coords';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { States } from '@jpl/state';
import { States as States2, timeProperties } from '@astro/scripts';
import { CorrectionType2, StateSolver2 } from '@jpl/state/solver2';
import { Ephemeris, Ephemeris2 } from '.';

/**
 * @deprecated The method should not be used
 */
export class Ephemerides {
  static simple(tagetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Ephemeris[] {
    return States.position(tagetBodyId, JplBodyId.Earth, fromJde, toJde, interval)
      .map((state) => ({
        jde: state.jde,
        ephemerisSeconds: state.ephemerisSeconds,
        tde: state.tde,
        coords: AstronomicalCoordinates.fromRectangular(state.position)
      }));
  }
};

export class Ephemerides2 {

  readonly stateSolver: StateSolver2;

  readonly stateScripts: States2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
    this.stateScripts = new States2(this.stateSolver);
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
