import { RectangularCoordinates, Radians, ObserverLocation } from "@astro/coords";
import { JplBodyId } from "@jpl";
import { geodeticToRectangular } from "@jpl/coordinates";
import { BodyFixedFrame, RotationMatrix } from "@jpl/frames";
import { KernelsRepository } from "@jpl/kernels";
import { BodyGeometryProvider } from "@jpl/kernels/pck";

export class ParalaxCorrection {

  readonly bodyGeometryProvider: BodyGeometryProvider;

  readonly bodyFixedFrame: BodyFixedFrame;

  constructor(kernels: KernelsRepository) {
    this.bodyGeometryProvider = kernels.bodyGeometryProvider();
    this.bodyFixedFrame = kernels.bodyFixedFrame();
  }

  observerPosition(bodyId: JplBodyId, observerLocation: ObserverLocation, es: number): RectangularCoordinates {
    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(bodyId);

    if (bodyGeometry === undefined) {
      throw Error("Earth geometry not found for Earth");
    }

    const bodyRadius = bodyGeometry[0];
    const bodyFlattening = (bodyGeometry[0] - bodyGeometry[2]) / bodyGeometry[0];

    const bodyFixedObserverPosition = geodeticToRectangular(
      Radians.fromDegrees(observerLocation.longitude),
      Radians.fromDegrees(observerLocation.latitude),
      observerLocation.altitude / 1000,
      bodyRadius, bodyFlattening);

    const bodyFixedRotationMatrix = this.bodyFixedFrame.getRotationMatrix(bodyId, es);
    const bodyFixedtoJ2000RotationMatrix = RotationMatrix.invert(bodyFixedRotationMatrix);

    const j2000ObserverPosition = RotationMatrix.multiplyVector(bodyFixedtoJ2000RotationMatrix, bodyFixedObserverPosition.toVector());

    return RectangularCoordinates.fromVector(j2000ObserverPosition);
  }

}
