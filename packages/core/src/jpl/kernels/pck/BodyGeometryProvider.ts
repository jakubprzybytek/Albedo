import { JplBodyId } from "@jpl";
import { PckRepository } from "./PckRepository";

export class BodyGeometryProvider {

  constructor(private pckRepository: PckRepository) { }

  getBodyRadii(jplBodyId: JplBodyId): number[] | undefined {
    return this.pckRepository.getBodyRadii(jplBodyId);
  }
}
