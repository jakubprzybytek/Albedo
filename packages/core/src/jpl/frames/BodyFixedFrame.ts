import { Radians } from "@astro/coords";
import { Matrix3x3, Vector3 } from "@astro/math";
import { JplBodyId} from "@jpl";
import { KernelsRepository } from "@jpl/kernels/KernelsRepository";
import { Axis, RotationMatrix } from "./RotationMatrix";

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

    const RA = 90 + orientationModel.RA;
    const Dec = 90 - orientationModel.Dec;
    const W = orientationModel.W % 360;

    return RotationMatrix.eulerToMatrix(Radians.fromDegrees(W), Radians.fromDegrees(Dec), Radians.fromDegrees(RA), Axis.Z, Axis.X, Axis.Z);
  }
}
