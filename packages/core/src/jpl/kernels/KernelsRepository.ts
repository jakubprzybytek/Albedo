import { StateSolver } from "@jpl/state";
import { SpkKernelRepository } from "./spk";
import { BodyGeometryProvider, PckRepository } from "./pck";
import { OrientationModelProvider } from "./pck";
import { BodyFixedFrame } from "@jpl/frames/BodyFixedFrame";

export class KernelsRepository {

  constructor(readonly spkRepository: SpkKernelRepository, readonly pckRepository: PckRepository) { }

  stateSolver() {
    return new StateSolver([...this.spkRepository.spkKernels.values()]);
  }

  bodyGeometryProvider() {
    return new BodyGeometryProvider(this.pckRepository);
  }

  orientationModelProvider() {
    return new OrientationModelProvider(this.pckRepository);
  }

  bodyFixedFrame() {
    return new BodyFixedFrame(this);
  }

}
