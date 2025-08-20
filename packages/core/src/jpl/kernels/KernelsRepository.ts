import { StateSolver } from "@jpl/state";
import { SpkKernelRepository } from "./spk";
import { BodyGeometryProvider, PckRepository } from "./pck";
import { OrientationModelProvider } from "./pck";

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

}
