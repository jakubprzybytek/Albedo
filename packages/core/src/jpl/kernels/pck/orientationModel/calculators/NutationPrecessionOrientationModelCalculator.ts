import { EphemerisSeconds } from "@jpl";
import { BarycenterOrientationModel, BodyOrientationModel } from "../..";
import { OrientationModel } from "..";
import { calculatePolynomials } from ".";

export class NutationPrecessionOrientationModelCalculator {
  constructor(private bodyOrientationModelParameters: BodyOrientationModel, private barycenterOrientationModelParameters: BarycenterOrientationModel) { }

  private computeNutationPrecessionAngles(x: number, nutationPrecessionAnglesParameters: number[], polynomialDegree: number) {
    const nutationPrecessionAngles = [];

    for (let i = 0; i < nutationPrecessionAnglesParameters.length / (polynomialDegree + 1); i += polynomialDegree + 1) {
      let angle = nutationPrecessionAnglesParameters[i];
      let currentX = 1;
      for (let j = 1; j <= polynomialDegree; j++) {
        currentX *= x;
        angle += nutationPrecessionAnglesParameters[i + j] * currentX;
      }
      nutationPrecessionAngles.push(angle);
    }

    return nutationPrecessionAngles;
  }

  calculate(es: number): OrientationModel {
    const esDays = es / EphemerisSeconds.SECONDS_PER_JULIAN_DAY;
    const esCenturies = es / EphemerisSeconds.SECONDS_PER_JULIAN_CENTURY;
    console.log(this.bodyOrientationModelParameters);
    console.log(this.barycenterOrientationModelParameters);

    const nutationPrecessionAngles = this.computeNutationPrecessionAngles(
      es,
      this.barycenterOrientationModelParameters.nutationPrecessionAnglesCoefficients,
      this.barycenterOrientationModelParameters.nutationPrecessionAnglesPolynomialsDegree
    );

    return {
      RA: calculatePolynomials(this.bodyOrientationModelParameters.poleRACoefficients, esCenturies),
      Dec: calculatePolynomials(this.bodyOrientationModelParameters.poleDecCoefficients, esCenturies),
      W: calculatePolynomials(this.bodyOrientationModelParameters.poleWCoefficients, esDays)
    };
  }
}
