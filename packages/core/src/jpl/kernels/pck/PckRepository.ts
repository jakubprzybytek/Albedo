import { JplBodyId } from "@jpl";

export class PckRepository {

  private objectRadii: Map<JplBodyId, number[]> = new Map();

  registerPckVariables(radii: Map<JplBodyId, number[]>) {
    radii.forEach((value: number[], key: JplBodyId) => this.objectRadii.set(key, value));
  }

  getBodyRadii(jplBodyId: JplBodyId): number[] | undefined {
    return this.objectRadii.get(jplBodyId);
  }

}
