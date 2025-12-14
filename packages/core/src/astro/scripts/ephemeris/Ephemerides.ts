import { AstronomicalCoordinates, ObserverLocation, Radians, RectangularCoordinates } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType, StateSolver } from '@jpl/state';
import { DetailedCoordinates, DetailedCoordinatesWithVelocity, DetailedEphemeris, EphemerisWithVelocity, FullCoordinates, FullEphemeris } from '.';
import { Bodies } from 'src/catalogues/Bodies';
import { KernelsRepository } from '@jpl/kernels';
import { BodyGeometryProvider } from '@jpl/kernels/pck';
import { BodyFixedFrame, RotationMatrix } from '@jpl/frames';

export class Ephemerides {

  readonly states: States;

  readonly bodyGeometryProvider: BodyGeometryProvider;

  readonly bodyFixedFrame: BodyFixedFrame;

  // readonly stateSolver: StateSolver;

  constructor(kernels: KernelsRepository) {
    this.states = new States(kernels);
    this.bodyGeometryProvider = kernels.bodyGeometryProvider();
    this.bodyFixedFrame = kernels.bodyFixedFrame();
    // this.stateSolver = kernels.stateSolver();
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
  buildDetailedCoordinatesFunction(bodyId: JplBodyId, observerLocation?: ObserverLocation) {
    const stateFunction = observerLocation
      ? this.states.buildParalaxCorrectedPositionFunction(bodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
      : this.states.buildPositionFunction(bodyId, JplBodyId.Earth, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
    const objectDiameterKm = (Bodies[bodyId as keyof typeof Bodies].equatorialRadiusKm ?? 0) * 2;

    return (es: number): DetailedCoordinates => {
      const position = stateFunction(es);

      const rangeKm = position.length();
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

  buildFullEphemerisFunction(bodyId: JplBodyId, observerLocation?: ObserverLocation) {
    const stateFunction = observerLocation
      ? this.states.buildParalaxCorrectedPositionFunction(bodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
      : this.states.buildPositionFunction(bodyId, JplBodyId.Earth, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);

    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(bodyId);
    if (!bodyGeometry) {
      throw new Error(`Cannot find body geometry for: bodyId='${bodyId}'`);
    }
    const bodyDiameterKm = bodyGeometry[0] * 2;

    return (es: number): FullCoordinates => {
      const position = stateFunction(es);
      const bodyFixedRotationMatrix = this.bodyFixedFrame.getRotationMatrix(bodyId, es);
      const fixedBodyPosition = RotationMatrix.multiplyVector(bodyFixedRotationMatrix, position.toVector());

      const rangeKm = position.length();
      const angularSize = Radians.angularSize(bodyDiameterKm, rangeKm);

      return {
        coords: AstronomicalCoordinates.fromRectangular(position).toDegrees(),
        angularSize,
        range: rangeKm,
        fixedBodyCoords: AstronomicalCoordinates.fromRectangular(RectangularCoordinates.fromVector(fixedBodyPosition)).toDegrees()
      }
    }
  }

  detailedCoordinatesForBody(targetBodyId: JplBodyId, es: number, observerLocation?: ObserverLocation): DetailedCoordinates {
    const detailedCoordinatesFunction = this.buildDetailedCoordinatesFunction(targetBodyId, observerLocation)
    return detailedCoordinatesFunction(es);
  }

  fullEphemerisForBody(bodyId: JplBodyId, jde: number, observerLocation?: ObserverLocation): FullCoordinates {
    const fullEphemerisFunction = this.buildFullEphemerisFunction(bodyId, observerLocation);
    return fullEphemerisFunction(EphemerisSeconds.fromJde(jde));
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
