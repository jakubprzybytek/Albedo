import { AstronomicalCoordinates } from '@astro/coords';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { States } from '@jpl/state';
import { States as States2 } from '@astro/scripts';
import { StateSolver2 } from '@jpl/state/solver2';
import { Ephemeris } from '.';
import { JulianDay } from '@astro/JulianDay';

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

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  single(tagetBodyId: JplBodyId, es: number): Ephemeris {
    const position = new States2(this.stateSolver).position(tagetBodyId, JplBodyId.Earth, es);
    return {
      jde: EphemerisSeconds.toJde(es),
      ephemerisSeconds: es,
      tde: JulianDay.toDateTime(EphemerisSeconds.toJde(es)),
      coords: AstronomicalCoordinates.fromRectangular(position)
    };
  }
};
