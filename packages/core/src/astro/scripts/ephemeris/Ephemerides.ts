import { AstronomicalCoordinates, Radians } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType, StateSolver } from '@jpl/state';
import { DetailedCoordinates, Ephemeris } from '.';

export class Ephemerides {

  readonly stateSolver: StateSolver;

  readonly stateScripts: States;

  constructor(stateSolver: StateSolver) {
    this.stateSolver = stateSolver;
    this.stateScripts = new States(this.stateSolver);
  }

  coordinatesForBody(tagetBodyId: JplBodyId, es: number): AstronomicalCoordinates {
    const position = this.stateScripts.position(tagetBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
    return AstronomicalCoordinates.fromRectangular(position);
  }

  detailedCoordinatesForBody(tagetBodyId: JplBodyId, es: number): DetailedCoordinates {
    const position = this.stateScripts.position(tagetBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
    let objectDiameter = 0;
    switch (tagetBodyId) {
      case JplBodyId.Sun:
        objectDiameter = 1392684; // in km
        break;
      case JplBodyId.Moon:
        objectDiameter = 3474.8; // in km
        break;
    }

    const angularSize = objectDiameter / position.length(); // in radians

    return {
      coords: AstronomicalCoordinates.fromRectangular(position),
      angularSize: Radians.toDegrees(angularSize)
    }
  }

  simple(tagetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Ephemeris[] {
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map(es => ({
        ...timeProperties(es),
        coords: AstronomicalCoordinates.fromRectangular(this.stateScripts.position(tagetBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION))
      }));
  }
};
