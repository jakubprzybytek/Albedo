import { ObserverLocation } from "@astro/coords";
import { JplBodyId } from "@jpl";
import { KernelsRepository } from "@jpl/kernels";
import { BodyFixedFrame } from "./BodyFixedFrame";
import { OrientationModelProvider } from "@jpl/kernels/pck";
import { TopocentricFrame } from "./TopocentricFrame";

export class Frames {

  readonly orientationModelProvider: OrientationModelProvider;

  constructor(kernels: KernelsRepository) {
    this.orientationModelProvider = kernels.orientationModelProvider();
  }

  bodyFixedFrame(bodyId: JplBodyId) {
    return new BodyFixedFrame(this.orientationModelProvider, bodyId);
  }

  topocentricFrame(bodyId: JplBodyId, observationLocation: ObserverLocation) {
    const bodyFixedFrame = this.bodyFixedFrame(bodyId);
    return new TopocentricFrame(bodyFixedFrame, observationLocation);
  }

}