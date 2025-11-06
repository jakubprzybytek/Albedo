import { AstronomicalCoordinates, Radians } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType, StateSolver } from '@jpl/state';
import { DetailedCoordinates, DetailedCoordinatesWithVelocity, DetailedEphemeris, EphemerisWithVelocity } from '.';
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

    const rangeKm = position.length();
    const objectDiameterKm = (Bodies[targetBodyId as keyof typeof Bodies].equatorialRadiusKm ?? 0) * 2;
    const angularSize = Radians.angularSize(objectDiameterKm, rangeKm);

    return {
      coords: AstronomicalCoordinates.fromRectangular(position),
      angularSize,
      range: rangeKm
    }
  }

  // ToDo: use JPL to fetch body radius
  detailedCoordinatesWithVelocityForBody(targetBodyId: JplBodyId, es: number): DetailedCoordinatesWithVelocity {
    const state = this.stateScripts.state(targetBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
    const coords = AstronomicalCoordinates.fromRectangular(state.position);
    const nextPosition = state.position.add(state.velocity);
    const nextCoords = AstronomicalCoordinates.fromRectangular(nextPosition);

    const rangeKm = state.position.length();
    const objectDiameterKm = (Bodies[targetBodyId as keyof typeof Bodies].equatorialRadiusKm ?? 0) * 2;
    const angularSize = Radians.angularSize(objectDiameterKm, rangeKm);

    return {
      coords,
      angularSize,
      range: rangeKm,
      velocity: new AstronomicalCoordinates(nextCoords.rightAscension - coords.rightAscension, nextCoords.declination - coords.declination)
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

  computeEphemeridesWithVelocity(tagetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): EphemerisWithVelocity[] {
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map(es => ({
        ...timeProperties(es),
        ...this.detailedCoordinatesWithVelocityForBody(tagetBodyId, es)
      }));
  }
};
