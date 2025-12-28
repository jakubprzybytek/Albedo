import { ObserverLocation, Radians } from "@astro/coords";
import { Axis, BodyFixedFrame, RotationMatrix } from ".";
import { Vector3 } from "@astro/math";

export class TopocentricFrame {

  constructor(readonly bodyFixedFrame: BodyFixedFrame, readonly observerLocation: ObserverLocation) {
  }

  transformVector3(es: number) {
    const bodyFixedTransform = this.bodyFixedFrame.transformVector3(es);

    return (vector: Vector3): Vector3 => {
      const bodyFixedVector3 = bodyFixedTransform(vector);

      const observerColatitude = 90 - this.observerLocation.latitude;
      const topocentricRotationMatrix = RotationMatrix.eulerToMatrix(
        Radians.fromDegrees(-this.observerLocation.latitude),
        Radians.fromDegrees(-observerColatitude),
        Radians.fromDegrees(180),
        Axis.Z, Axis.Y, Axis.Z)

      return RotationMatrix.multiplyVector(topocentricRotationMatrix, bodyFixedVector3);
    }
  }

}
