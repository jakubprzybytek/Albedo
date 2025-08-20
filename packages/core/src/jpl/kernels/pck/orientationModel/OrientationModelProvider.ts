import { getBarycenterIdForBodyId, JplBodyId } from "@jpl";
import { PckRepository } from "../PckRepository";
import { SimpleOrientationModelCalculator, NutationPrecessionOrientationModelCalculator } from "./calculators";
import { OrientationModel } from ".";

export class OrientationModelProvider {

  readonly orientationModelCalculators: Map<JplBodyId, SimpleOrientationModelCalculator | NutationPrecessionOrientationModelCalculator> = new Map();

  constructor(private pckRepository: PckRepository) { }

  private getOrientationModelCalulator(jplBodyId: JplBodyId): SimpleOrientationModelCalculator | NutationPrecessionOrientationModelCalculator {
    if (this.orientationModelCalculators.has(jplBodyId)) {
      return this.orientationModelCalculators.get(jplBodyId)!;
    }

    const bodyOrientationModel = this.pckRepository.getBodyOrientationModel(jplBodyId);

    if (bodyOrientationModel === undefined) {
      throw new Error(`Orientation model not found for body ID: ${jplBodyId}`);
    }

    if (bodyOrientationModel.nutationPrecessionAnglesRACoefficients.length == 0) {
      const orientationModelCalculator = new SimpleOrientationModelCalculator(bodyOrientationModel);
      this.orientationModelCalculators.set(jplBodyId, orientationModelCalculator);
      return orientationModelCalculator;
    }

    const barycenterJplBodyId = getBarycenterIdForBodyId(jplBodyId);

    if (barycenterJplBodyId === undefined) {
      throw new Error(`Barycenter not found for body ID: ${jplBodyId}`);
    }

    const barycenterOrientationModel = this.pckRepository.getBarycenterOrientationModel(barycenterJplBodyId);

    if (barycenterOrientationModel === undefined) {
      throw new Error(`Barycenter orientation model not found for body ID: ${barycenterJplBodyId}`);
    }

    const orientationModelCalculator = new NutationPrecessionOrientationModelCalculator(bodyOrientationModel, barycenterOrientationModel);
    this.orientationModelCalculators.set(jplBodyId, orientationModelCalculator);

    return orientationModelCalculator;
  }

  getOrientationModel(jplBodyId: JplBodyId, es: number): OrientationModel {
    return this.getOrientationModelCalulator(jplBodyId).calculate(es);
  }
}
