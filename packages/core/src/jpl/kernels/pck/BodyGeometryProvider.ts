import { JplBodyId, Vector3 } from "@jpl";
import { PckRepository } from "./PckRepository";

export class BodyGeometryProvider {

  constructor(private pckRepository: PckRepository) { }

  getBodyRadii(jplBodyId: JplBodyId): Vector3 | undefined {
    return this.pckRepository.getBodyRadii(jplBodyId);
  }
}
