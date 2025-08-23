import { JplBodyId, Vector3 } from "@jpl";
import { KernelsRepository } from "@jpl/kernels/KernelsRepository";

export class BodyFixedFrame {

  readonly orientationModelProvider;

  constructor(readonly kernels: KernelsRepository) {
    this.orientationModelProvider = kernels.orientationModelProvider();
  }

  getRotation(jplBodyId: JplBodyId, es: number): Vector3 {
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
}
