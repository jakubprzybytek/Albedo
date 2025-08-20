import { JplBodyId } from "@jpl";
import { BarycenterOrientationModel, BodyOrientationModel } from ".";

export class PckRepository {

  private objectRadii: Map<JplBodyId, number[]> = new Map();

  private bodiesOrientationModels: Map<JplBodyId, BodyOrientationModel> = new Map();

  private barycentersOrientationModels: Map<JplBodyId, BarycenterOrientationModel> = new Map();

  registerPckVariables(radii: Map<JplBodyId, number[]>) {
    radii.forEach((value: number[], key: JplBodyId) => this.objectRadii.set(key, value));
  }

  getBodyRadii(jplBodyId: JplBodyId): number[] | undefined {
    return this.objectRadii.get(jplBodyId);
  }

  registerBodyOrientationModels(bodyOrientationModels: Map<JplBodyId, BodyOrientationModel>) {
    bodyOrientationModels.forEach((value: BodyOrientationModel, key: JplBodyId) => this.bodiesOrientationModels.set(key, value));
  }

  registerBarycenterOrientationModels(barycenterOrientationModels: Map<JplBodyId, BarycenterOrientationModel>) {
    barycenterOrientationModels.forEach((value: BarycenterOrientationModel, key: JplBodyId) => this.barycentersOrientationModels.set(key, value));
  }

  getBodyOrientationModel(jplBodyId: JplBodyId): BodyOrientationModel | undefined {
    return this.bodiesOrientationModels.get(jplBodyId);
  }

  getBarycenterOrientationModel(jplBodyId: JplBodyId): BarycenterOrientationModel | undefined {
    return this.barycentersOrientationModels.get(jplBodyId);
  }

}
