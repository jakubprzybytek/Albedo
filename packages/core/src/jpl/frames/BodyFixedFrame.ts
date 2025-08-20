import { JplBodyId, Vector3 } from "@jpl";
import { KernelsRepository } from "@jpl/kernels/KernelsRepository";
import { PckRepository } from "@jpl/kernels/pck";

export class BodyFixedFrame {

  readonly orientationModelProvider;

  constructor(readonly kernels: KernelsRepository) {
    this.orientationModelProvider = kernels.orientationModelProvider();
  }

  getRotation(jplBodyId: JplBodyId, es: number): Vector3 {
    const orientationModel = this.orientationModelProvider.getOrientationModel(jplBodyId, es);

    const W = orientationModel.W % 360;

    return [
      W > 180 ? W - 360 : W,
      90 - orientationModel.Dec,
      90 + orientationModel.RA
    ]
  }
}
