import { Radians } from "@astro/coords";
import { EphemerisSeconds } from "@jpl";
import { BarycenterOrientationModel, BodyOrientationModel } from "../..";
import { OrientationModel } from "..";
import { calculatePolynomials } from ".";

export class NutationPrecessionOrientationModelCalculator {
  constructor(private bodyOrientationModelParameters: BodyOrientationModel, private barycenterOrientationModelParameters: BarycenterOrientationModel) { }

  private computeNutationPrecessionAngles(x: number, nutationPrecessionAnglesParameters: number[], polynomialDegree: number) {
    const nutationPrecessionAnglesSin = [];
    const nutationPrecessionAnglesCos = [];

    for (let i = 0; i < nutationPrecessionAnglesParameters.length; i += polynomialDegree + 1) {
      let angle = nutationPrecessionAnglesParameters[i];
      let currentX = 1;
      for (let j = 1; j <= polynomialDegree; j++) {
        currentX *= x;
        angle += nutationPrecessionAnglesParameters[i + j] * currentX;
      }
      const angleRad = Radians.fromDegrees(angle % 360);
      nutationPrecessionAnglesSin.push(Math.sin(angleRad));
      nutationPrecessionAnglesCos.push(Math.cos(angleRad));
    }

    return { nutationPrecessionAnglesSin, nutationPrecessionAnglesCos };
  }

  private computeSimplePolynomial(coefficients: number[], values: number[]) {
    let result = 0;
    for (let i = 0; i < coefficients.length; i++) {
      result += coefficients[i] * values[i];
    }
    return result;
  }

  calculate(es: number): OrientationModel {
    const esDays = es / EphemerisSeconds.SECONDS_PER_JULIAN_DAY;
    const esCenturies = es / EphemerisSeconds.SECONDS_PER_JULIAN_CENTURY;

    const { nutationPrecessionAnglesSin, nutationPrecessionAnglesCos } = this.computeNutationPrecessionAngles(
      esCenturies,
      this.barycenterOrientationModelParameters.nutationPrecessionAnglesCoefficients,
      this.barycenterOrientationModelParameters.nutationPrecessionAnglesPolynomialsDegree
    );

    return {
      RA:
        calculatePolynomials(this.bodyOrientationModelParameters.poleRACoefficients, esCenturies)
        + this.computeSimplePolynomial(this.bodyOrientationModelParameters.nutationPrecessionAnglesRACoefficients, nutationPrecessionAnglesSin),
      Dec:
        calculatePolynomials(this.bodyOrientationModelParameters.poleDecCoefficients, esCenturies)
        + this.computeSimplePolynomial(this.bodyOrientationModelParameters.nutationPrecessionAnglesDecCoefficients, nutationPrecessionAnglesCos),
      W:
        calculatePolynomials(this.bodyOrientationModelParameters.poleWCoefficients, esDays)
        + this.computeSimplePolynomial(this.bodyOrientationModelParameters.nutationPrecessionAnglesWCoefficients, nutationPrecessionAnglesSin)
    };
  }
}
