import { AstronomicalCoordinates, Radians } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType, StateSolver } from '@jpl/state';
import { DetailedCoordinates, DetailedEphemeris } from '.';
import { Bodies } from 'src/catalogues/Bodies';
import { KernelsRepository } from '@jpl/kernels';

export class Ephemerides {

  readonly stateScripts: States;

  readonly stateSolver: StateSolver;

  constructor(kernels: KernelsRepository) {
    this.stateScripts = new States(kernels);
    this.stateSolver = kernels.stateSolver();
  }

  coordinatesForBody(targetBodyId: JplBodyId, es: number): AstronomicalCoordinates {
    const position = this.stateScripts.position(targetBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
    return AstronomicalCoordinates.fromRectangular(position);
  }

  detailedCoordinatesForBody(targetBodyId: JplBodyId, es: number): DetailedCoordinates {
    const position = this.stateScripts.position(targetBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);

    const objectDiameterKm = (Bodies[targetBodyId as keyof typeof Bodies].equatorialRadiusKm ?? 0) * 2;
    const angularSize = Radians.angularSize(objectDiameterKm, position.length());

    return {
      coords: AstronomicalCoordinates.fromRectangular(position),
      angularSize
    }
  }

  computeEphemerides(tagetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): DetailedEphemeris[] {
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map(es => ({
        ...timeProperties(es),
        ...this.detailedCoordinatesForBody(tagetBodyId, es)
      }));
  }
};
