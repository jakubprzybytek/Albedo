import { EphemerisSeconds, getBarycenterIdForBodyId, JplBodyId } from "@jpl";
import { PckRepository } from "./PckRepository";
import { BarycenterOrientationModel, BodyOrientationModel } from ".";

export type OrientationModel = {
  RA: number;
  Dec: number;
  W: number;
};

class OrientationModelCalculator {
  constructor(private bodyOrientationModel: BodyOrientationModel, private barycenterOrientationModel: BarycenterOrientationModel) { }

  private calculatePolynomials(coefficients: number[], x: number): number {
    let result = coefficients[0];
    let currentX = x;
    for (let i = 1; i < coefficients.length; i++) {
      result += coefficients[i] * currentX;
      currentX *= x;
    }
    return result;
  }

  calculate(es: number): OrientationModel {
    const esDays = es / EphemerisSeconds.SECONDS_PER_JULIAN_DAY;
    const esCenturies = es / EphemerisSeconds.SECONDS_PER_JULIAN_CENTURY;

    console.log('es', es);
    console.log('esDays', esDays);
    console.log('esCenturies', esCenturies);
    console.log('bodyOrientationModel', this.bodyOrientationModel);
    console.log('barycenterOrientationModel', this.barycenterOrientationModel);
    return {
      RA: this.calculatePolynomials(this.bodyOrientationModel.poleRACoefficients, esCenturies),
      Dec: this.calculatePolynomials(this.bodyOrientationModel.poleDecCoefficients, esCenturies),
      W: this.calculatePolynomials(this.bodyOrientationModel.poleWCoefficients, esDays)
    };
  }
}

export class OrientationModelProvider {

  readonly orientationModelCalculators: Map<JplBodyId, OrientationModelCalculator> = new Map();

  constructor(private pckRepository: PckRepository) { }

  private getOrientationModelCalulator(jplBodyId: JplBodyId): OrientationModelCalculator {
    if (this.orientationModelCalculators.has(jplBodyId)) {
      return this.orientationModelCalculators.get(jplBodyId)!;
    }

    const orientationModel = this.pckRepository.getBodyOrientationModel(jplBodyId);

    if (orientationModel === undefined) {
      throw new Error(`Orientation model not found for body ID: ${jplBodyId}`);
    }

    const barycenterJplBodyId = getBarycenterIdForBodyId(jplBodyId);

    if (barycenterJplBodyId === undefined) {
      throw new Error(`Barycenter not found for body ID: ${jplBodyId}`);
    }

    const barycenterOrientationModel = this.pckRepository.getBarycenterOrientationModel(barycenterJplBodyId);

    if (barycenterOrientationModel === undefined) {
      throw new Error(`Barycenter orientation model not found for body ID: ${barycenterJplBodyId}`);
    }

    const orientationModelCalculator = new OrientationModelCalculator(orientationModel, barycenterOrientationModel);
    this.orientationModelCalculators.set(jplBodyId, orientationModelCalculator);

    return orientationModelCalculator;
  }

  getOrientationModel(jplBodyId: JplBodyId, es: number): OrientationModel {
    return this.getOrientationModelCalulator(jplBodyId).calculate(es);
  }
}
