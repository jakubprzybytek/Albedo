import { EphemerisSeconds } from "@jpl";
import { BodyOrientationModel } from "../..";
import { OrientationModel } from "..";
import { calculatePolynomials } from ".";

export class SimpleOrientationModelCalculator {
  constructor(private bodyOrientationModel: BodyOrientationModel) { }

  calculate(es: number): OrientationModel {
    const esDays = es / EphemerisSeconds.SECONDS_PER_JULIAN_DAY;
    const esCenturies = es / EphemerisSeconds.SECONDS_PER_JULIAN_CENTURY;

    return {
      RA: calculatePolynomials(this.bodyOrientationModel.poleRACoefficients, esCenturies),
      Dec: calculatePolynomials(this.bodyOrientationModel.poleDecCoefficients, esCenturies),
      W: calculatePolynomials(this.bodyOrientationModel.poleWCoefficients, esDays)
    };
  }
}
