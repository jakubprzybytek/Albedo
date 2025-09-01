import { RectangularCoordinates, Radians } from "@astro/coords";
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

  observerPosition(longitudeDeg: number, latitudeDeg: number, altitude: number, es: number): RectangularCoordinates {
    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(JplBodyId.Earth);

    if (bodyGeometry === undefined) {
      throw Error("Earth geometry not found for Earth");
    }

    const bodyRadius = bodyGeometry[0];
    const bodyFlattening = (bodyGeometry[0] - bodyGeometry[2]) / bodyGeometry[0];

    const bodyFixedObserverPosition = geodeticToRectangular(Radians.fromDegrees(longitudeDeg), Radians.fromDegrees(latitudeDeg), altitude, bodyRadius, bodyFlattening);

    const bodyFixedRotationMatrix = this.bodyFixedFrame.getRotationMatrix(JplBodyId.Earth, es);
    const bodyFixedtoJ2000RotationMatrix = RotationMatrix.invert(bodyFixedRotationMatrix);

    const j2000ObserverPosition = RotationMatrix.multiplyVector(bodyFixedtoJ2000RotationMatrix, bodyFixedObserverPosition.toVector());

    return RectangularCoordinates.fromVector(j2000ObserverPosition);
  }
}
