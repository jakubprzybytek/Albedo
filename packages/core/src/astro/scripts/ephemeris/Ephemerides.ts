import { AstronomicalCoordinates, ObserverLocation, Radians } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType, StateSolver } from '@jpl/state';
import { DetailedCoordinates, DetailedCoordinatesWithVelocity, DetailedEphemeris, EphemerisWithVelocity } from '.';
import { Bodies } from 'src/catalogues/Bodies';
import { KernelsRepository } from '@jpl/kernels';

export class Ephemerides {

  readonly states: States;

  readonly stateSolver: StateSolver;

  constructor(kernels: KernelsRepository) {
    this.states = new States(kernels);
    this.stateSolver = kernels.stateSolver();
  }

  buildCoordinatesFunction(targetBodyId: JplBodyId, observerLocation?: ObserverLocation) {
    const stateFunction = observerLocation
      ? this.states.buildParalaxCorrectedPositionFunction(targetBodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
      : this.states.buildPositionFunction(targetBodyId, JplBodyId.Earth, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);

    return (es: number): AstronomicalCoordinates => {
      const position = stateFunction(es);
      return AstronomicalCoordinates.fromRectangular(position);
    }
  }

  // ToDo: use JPL to fetch body radius
  buildDetailedCoordinatesFunction(targetBodyId: JplBodyId, observerLocation?: ObserverLocation) {
    const stateFunction = observerLocation
      ? this.states.buildParalaxCorrectedPositionFunction(targetBodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
      : this.states.buildPositionFunction(targetBodyId, JplBodyId.Earth, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);

    return (es: number): DetailedCoordinates => {
      const position = stateFunction(es);

      const rangeKm = position.length();
      const objectDiameterKm = (Bodies[targetBodyId as keyof typeof Bodies].equatorialRadiusKm ?? 0) * 2;
      const angularSize = Radians.angularSize(objectDiameterKm, rangeKm);

      return {
        coords: AstronomicalCoordinates.fromRectangular(position),
        angularSize,
        range: rangeKm
      }
    }
  }

  // ToDo: use JPL to fetch body radius
  buildDetailedCoordinatesWithVelocityFunction(targetBodyId: JplBodyId, correctionType: CorrectionType = CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION) {
    return (es: number): DetailedCoordinatesWithVelocity => {
      const state = this.states.computeState(targetBodyId, JplBodyId.Earth, es, correctionType);
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
  }

  detailedCoordinatesForBody2(targetBodyId: JplBodyId, es: number, observerLocation?: ObserverLocation): DetailedCoordinates {
    const detailedCoordinatesFunction = this.buildDetailedCoordinatesFunction(targetBodyId, observerLocation)
    return detailedCoordinatesFunction(es);
  }

  computeEphemeridesWithVelocity(targetBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): EphemerisWithVelocity[] {
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    const detailedCoordinatesWithVelocityFunction = this.buildDetailedCoordinatesWithVelocityFunction(targetBodyId);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map(es => ({
        ...timeProperties(es),
        ...detailedCoordinatesWithVelocityFunction(es)
      }));
  }
};
