import { Radians } from "@astro/coords";
import { Matrix3x3, Vector3 } from "@astro/math";
import { Axis, RotationMatrix } from "./RotationMatrix";
import { JplBodyId } from "@jpl";
import { OrientationModelProvider } from "@jpl/kernels/pck";

export class BodyFixedFrame {

  constructor(readonly orientationModelProvider: OrientationModelProvider, readonly bodyId: JplBodyId) {
  }

  getRotationAngles(es: number): Vector3 {
    const orientationModel = this.orientationModelProvider.getOrientationModel(this.bodyId, es);

    const RA = 90 + orientationModel.RA;
    const Dec = 90 - orientationModel.Dec;
    const W = orientationModel.W % 360;

    return [
      W > 180 ? W - 360 : W,
      Dec > 180 ? Dec - 360 : Dec,
      RA > 180 ? RA - 360 : RA
    ]
  }

  getRotationMatrix(es: number): Matrix3x3 {
    const orientationModel = this.orientationModelProvider.getOrientationModel(this.bodyId, es);

    const RA = 90 + orientationModel.RA;
    const Dec = 90 - orientationModel.Dec;
    const W = orientationModel.W % 360;

    return RotationMatrix.eulerToMatrix(Radians.fromDegrees(W), Radians.fromDegrees(Dec), Radians.fromDegrees(RA), Axis.Z, Axis.X, Axis.Z);
  }

  transformVector3(es: number) {
    const bodyFixedRotationMatrix = this.getRotationMatrix(es);
    return function (vector: Vector3): Vector3 {
      return RotationMatrix.multiplyVector(bodyFixedRotationMatrix, vector);
    }
  }
}
