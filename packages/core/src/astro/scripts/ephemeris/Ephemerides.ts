import { AstronomicalCoordinates, ObserverLocation, Radians, RectangularCoordinates, AzAltCoordinates } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType } from '@jpl/state';
import { DetailedCoordinates, DetailedCoordinatesWithVelocity, EphemerisWithVelocity, FullCoordinates } from '.';
import { Bodies } from 'src/catalogues/Bodies';
import { KernelsRepository } from '@jpl/kernels';
import { BodyGeometryProvider } from '@jpl/kernels/pck';
import { Axis, BodyFixedFrame, RotationMatrix } from '@jpl/frames';

export class Ephemerides {

  readonly states: States;

  readonly bodyGeometryProvider: BodyGeometryProvider;

  readonly bodyFixedFrame: BodyFixedFrame;

  constructor(kernels: KernelsRepository) {
    this.states = new States(kernels);
    this.bodyGeometryProvider = kernels.bodyGeometryProvider();
    this.bodyFixedFrame = kernels.bodyFixedFrame();
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

  buildFullEphemerisFunction(bodyId: JplBodyId, observerLocation: ObserverLocation) {
    const positionFunction = this.states.buildParalaxCorrectedPositionFunction(bodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)

    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(bodyId);
    if (!bodyGeometry) {
      throw new Error(`Cannot find body geometry for: bodyId='${bodyId}'`);
    }
    const bodyDiameterKm = bodyGeometry[0] * 2;

    return (es: number): FullCoordinates => {
      const position = positionFunction(es);
      const bodyFixedRotationMatrix = this.bodyFixedFrame.getRotationMatrix(JplBodyId.Earth, es);
      const fixedBodyPosition = RotationMatrix.multiplyVector(bodyFixedRotationMatrix, position.toVector());

      const observerColatitude = 90 - observerLocation.latitude;
      const topocentricRotationMatrix = RotationMatrix.eulerToMatrix(
        Radians.fromDegrees(-observerLocation.latitude),
        Radians.fromDegrees(-observerColatitude),
        Radians.fromDegrees(180),
        Axis.Z, Axis.Y, Axis.Z)
      const topocentricPosition = RotationMatrix.multiplyVector(topocentricRotationMatrix, fixedBodyPosition);

      const rangeKm = position.length();
      const angularSize = Radians.angularSize(bodyDiameterKm, rangeKm);

      return {
        coords: AstronomicalCoordinates.fromRectangular(position).toDegrees(),
        angularSize,
        range: rangeKm,
        // fixedBodyCoords: AstronomicalCoordinates.fromRectangular(RectangularCoordinates.fromVector(fixedBodyPosition)).toDegrees(),
        azAltCoords: AzAltCoordinates.fromRectangular(RectangularCoordinates.fromVector(topocentricPosition)).toDegrees()
      }
    }
  }

  detailedCoordinatesForBody(targetBodyId: JplBodyId, es: number, observerLocation?: ObserverLocation): DetailedCoordinates {
    const detailedCoordinatesFunction = this.buildDetailedCoordinatesFunction(targetBodyId, observerLocation)
    return detailedCoordinatesFunction(es);
  }

  fullEphemerisForBody(bodyId: JplBodyId, jde: number, observerLocation: ObserverLocation): FullCoordinates {
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
