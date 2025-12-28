import { RectangularCoordinates, Radians, ObserverLocation } from "@astro/coords";
import { JplBodyId } from "@jpl";
import { geodeticToRectangular } from "@jpl/coordinates";
import { Frames, RotationMatrix } from "@jpl/frames";
import { KernelsRepository } from "@jpl/kernels";
import { BodyGeometryProvider } from "@jpl/kernels/pck";

export class ParalaxCorrection {

  readonly bodyGeometryProvider: BodyGeometryProvider;

  readonly frames: Frames;

  constructor(kernels: KernelsRepository) {
    this.bodyGeometryProvider = kernels.bodyGeometryProvider();
    this.frames = kernels.frames();
  }

  observerPosition(bodyId: JplBodyId, observerLocation: ObserverLocation, es: number): RectangularCoordinates {
    const bodyFixedFrame = this.frames.bodyFixedFrame(bodyId);
    const bodyFixedObserverPosition = this.bodyFixedObserverPosition(bodyId, observerLocation);

    const bodyFixedRotationMatrix = bodyFixedFrame.getRotationMatrix(es);
    const bodyFixedtoJ2000RotationMatrix = RotationMatrix.invert(bodyFixedRotationMatrix);

    const j2000ObserverPosition = RotationMatrix.multiplyVector(bodyFixedtoJ2000RotationMatrix, bodyFixedObserverPosition.toVector());

    return RectangularCoordinates.fromVector(j2000ObserverPosition);
  }

  /**
   * Computes observer velocity in J2000 frame using numerical differentiation.
   * The observer is stationary in body-fixed frame but moving in J2000 due to body rotation.
   */
  observerVelocity(bodyId: JplBodyId, observerLocation: ObserverLocation, es: number, dt: number = 1): RectangularCoordinates {
    const positionBefore = this.observerPosition(bodyId, observerLocation, es - dt);
    const positionAfter = this.observerPosition(bodyId, observerLocation, es + dt);

    return new RectangularCoordinates(
      (positionAfter.x - positionBefore.x) / (2 * dt),
      (positionAfter.y - positionBefore.y) / (2 * dt),
      (positionAfter.z - positionBefore.z) / (2 * dt)
    );
  }

  private bodyFixedObserverPosition(bodyId: JplBodyId, observerLocation: ObserverLocation): RectangularCoordinates {
    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(bodyId);

    if (bodyGeometry === undefined) {
      throw Error(`Body geometry not found for bodyId=${bodyId}`);
    }

    const bodyRadius = bodyGeometry[0];
    const bodyFlattening = (bodyGeometry[0] - bodyGeometry[2]) / bodyGeometry[0];

    return geodeticToRectangular(
      Radians.fromDegrees(observerLocation.longitude),
      Radians.fromDegrees(observerLocation.latitude),
      observerLocation.altitude / 1000,
      bodyRadius, bodyFlattening);
  }

}
