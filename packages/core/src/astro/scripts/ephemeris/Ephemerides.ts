import { AstronomicalCoordinates, ObserverLocation, Radians, RectangularCoordinates, AzAltCoordinates } from '@astro/coords';
import { States, timeProperties } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType } from '@jpl/state';
import { FullCoordinates, FullCoordinatesWithVelocity, FullEphemerisWithVelocity } from '.';
import { KernelsRepository } from '@jpl/kernels';
import { BodyGeometryProvider } from '@jpl/kernels/pck';
import { BodyFixedFrame, Frames } from '@jpl/frames';

export class Ephemerides {

  readonly states: States;

  readonly bodyGeometryProvider: BodyGeometryProvider;

  readonly earthBodyFixedFrame: BodyFixedFrame;

  readonly frames: Frames;

  constructor(kernels: KernelsRepository) {
    this.states = new States(kernels);
    this.bodyGeometryProvider = kernels.bodyGeometryProvider();
    this.earthBodyFixedFrame = kernels.frames().bodyFixedFrame(JplBodyId.Earth);
    this.frames = kernels.frames();
  }

  buildCoordinatesFunction(bodyId: JplBodyId, observerLocation?: ObserverLocation): (es: number) => AstronomicalCoordinates {
    const stateFunction = observerLocation
      ? this.states.buildParalaxCorrectedPositionFunction(bodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
      : this.states.buildPositionFunction(bodyId, JplBodyId.Earth, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);

    return (es: number): AstronomicalCoordinates => {
      const position = stateFunction(es);
      return AstronomicalCoordinates.fromRectangular(position);
    }
  }

  buildFullCoordinatesFunction(bodyId: JplBodyId, observerLocation: ObserverLocation): (es: number) => FullCoordinates {
    const positionFunction = this.states.buildParalaxCorrectedPositionFunction(bodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
    const topocentricFrame = this.frames.topocentricFrame(JplBodyId.Earth, observerLocation);

    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(bodyId);
    if (!bodyGeometry) {
      throw new Error(`Cannot find body geometry for: bodyId='${bodyId}'`);
    }
    const bodyDiameterKm = bodyGeometry[0] * 2;

    return (es: number): FullCoordinates => {
      const position = positionFunction(es);
      const topocentricPosition = topocentricFrame.transformVector3(es)(position.toVector());

      const rangeKm = position.length();
      const angularSize = Radians.angularSize(bodyDiameterKm, rangeKm);

      return {
        coords: AstronomicalCoordinates.fromRectangular(position),
        angularSize,
        range: rangeKm,
        azAltCoords: AzAltCoordinates.fromRectangular(RectangularCoordinates.fromVector(topocentricPosition)),
      }
    }
  }

  buildFullEphemerisWithVelocityFunction(bodyId: JplBodyId, observerLocation: ObserverLocation): (es: number) => FullCoordinatesWithVelocity {
    const stateFunction = this.states.buildParalaxCorrectedStateFunction(bodyId, JplBodyId.Earth, observerLocation, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
    const topocentricFrame = this.frames.topocentricFrame(JplBodyId.Earth, observerLocation);

    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(bodyId);
    if (!bodyGeometry) {
      throw new Error(`Cannot find body geometry for: bodyId='${bodyId}'`);
    }
    const bodyDiameterKm = bodyGeometry[0] * 2;

    return (es: number): FullCoordinatesWithVelocity => {
      const state = stateFunction(es);
      const coords = AstronomicalCoordinates.fromRectangular(state.position);

      const topocentricPosition = topocentricFrame.transformVector3(es)(state.position.toVector());

      const nextPosition = state.position.add(state.velocity);
      const nextCoords = AstronomicalCoordinates.fromRectangular(nextPosition);

      const rangeKm = state.position.length();
      const angularSize = Radians.angularSize(bodyDiameterKm, rangeKm);

      return {
        coords,
        velocity: new AstronomicalCoordinates(nextCoords.rightAscension - coords.rightAscension, nextCoords.declination - coords.declination),
        angularSize,
        range: rangeKm,
        azAltCoords: AzAltCoordinates.fromRectangular(RectangularCoordinates.fromVector(topocentricPosition)),
      }
    }
  }

  fullCoordinates(bodyId: JplBodyId, es: number, observerLocation: ObserverLocation): FullCoordinates {
    const coordsFunction = this.buildFullCoordinatesFunction(bodyId, observerLocation);
    return coordsFunction(es);
  }

  computeFullEphemeridesWithVelocity(bodyId: JplBodyId, fromJde: number, toJde: number, interval: number, observerLocation: ObserverLocation): FullEphemerisWithVelocity[] {
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    const coordsFunction = this.buildFullEphemerisWithVelocityFunction(bodyId, observerLocation);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map(es => ({
        ...timeProperties(es),
        ...coordsFunction(es)
      }));
  }

};
