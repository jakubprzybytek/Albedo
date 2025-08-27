import { JplBodyId, Matrix3x3, Vector3 } from "@jpl";
import { KernelsRepository } from "@jpl/kernels/KernelsRepository";
import { RotationMatrix } from "./RotationMatrix";
import { Radians } from "@math";

export class BodyFixedFrame {

  readonly orientationModelProvider;

  constructor(readonly kernels: KernelsRepository) {
    this.orientationModelProvider = kernels.orientationModelProvider();
  }

  getRotationAngles(jplBodyId: JplBodyId, es: number): Vector3 {
    const orientationModel = this.orientationModelProvider.getOrientationModel(jplBodyId, es);

    const RA = 90 + orientationModel.RA;
    const Dec = 90 - orientationModel.Dec;
    const W = orientationModel.W % 360;

    return [
      W > 180 ? W - 360 : W,
      Dec > 180 ? Dec - 360 : Dec,
      RA > 180 ? RA - 360 : RA
    ]
  }

  getRotationMatrix(jplBodyId: JplBodyId, es: number): Matrix3x3 {
    const orientationModel = this.orientationModelProvider.getOrientationModel(jplBodyId, es);

    return RotationMatrix.bodyFixedRotation(
      Radians.fromDegrees(orientationModel.RA),
      Radians.fromDegrees(orientationModel.Dec),
      Radians.fromDegrees(orientationModel.W)
    );
  }
}
