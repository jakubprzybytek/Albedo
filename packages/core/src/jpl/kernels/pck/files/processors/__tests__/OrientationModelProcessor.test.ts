import { describe, it, expect } from "vitest";
import { extractOrientationModelInformation } from '../OrientationModelProcessor';
import { AssignementType, Assignment } from "../../parser/PckParser";
import { JplBodyId } from "@jpl";

function createMultipleValuesAssignment(variableName: string, values: number[]): Assignment {
  return {
    type: AssignementType.MultipleValues,
    variableName,
    values
  };
}

function createSingleValueAssignment(variableName: string, value: number): Assignment {
  return {
    type: AssignementType.SingleValue,
    variableName,
    value
  };
}

describe('extractOrientationModelInformation', () => {
  it('should extract basic body orientation model for POLE_RA assignment', () => {
    const assignments: Assignment[] = [
      createMultipleValuesAssignment('BODY399_POLE_RA', [1, 2, 3]),
      createMultipleValuesAssignment('BODY399_POLE_DEC', [4, 5, 6]),
      createMultipleValuesAssignment('BODY399_PM', [7, 8, 9]),
      createMultipleValuesAssignment('BODY399_NUT_PREC_RA', [10, 11, 12]),
      createMultipleValuesAssignment('BODY399_NUT_PREC_DEC', [13, 14, 15]),
      createMultipleValuesAssignment('BODY399_NUT_PREC_PM', [16, 17, 18]),
      createMultipleValuesAssignment('BODY301_POLE_RA', [100, 200, 300]),
      createMultipleValuesAssignment('BODY301_POLE_DEC', [400, 500, 600]),
      createMultipleValuesAssignment('BODY301_PM', [700, 800, 900]),
    ];

    const result = extractOrientationModelInformation(assignments);

    expect(result.bodies.size).toBe(2);
    expect(result.bodies.has(JplBodyId.Earth)).toBe(true);
    expect(result.bodies.has(JplBodyId.Moon)).toBe(true);

    const earthModel = result.bodies.get(JplBodyId.Earth);
    expect(earthModel).toEqual({
      poleRACoefficients: [1, 2, 3],
      poleDecCoefficients: [4, 5, 6],
      poleWCoefficients: [7, 8, 9],
      nutationPrecessionAnglesRACoefficients: [10, 11, 12],
      nutationPrecessionAnglesDecCoefficients: [13, 14, 15],
      nutationPrecessionAnglesWCoefficients: [16, 17, 18]
    });

    const moonModel = result.bodies.get(JplBodyId.Moon);
    expect(moonModel).toEqual({
      poleRACoefficients: [100, 200, 300],
      poleDecCoefficients: [400, 500, 600],
      poleWCoefficients: [700, 800, 900],
      nutationPrecessionAnglesRACoefficients: [],
      nutationPrecessionAnglesDecCoefficients: [],
      nutationPrecessionAnglesWCoefficients: []
    });
  });

  it('should extract barycenter orientation model', () => {
    const assignments: Assignment[] = [
      createSingleValueAssignment('BODY3_MAX_PHASE_DEGREE', 2),
      createMultipleValuesAssignment('BODY3_NUT_PREC_ANGLES', [1.5, 2.5, 3.5, 4.5, 5.5]),
      createMultipleValuesAssignment('BODY5_NUT_PREC_ANGLES', [10.1, 20.2, 30.3]),
    ];

    const result = extractOrientationModelInformation(assignments);

    expect(result.barycenters.size).toBe(2);
    expect(result.barycenters.has(JplBodyId.EarthMoonBarycenter)).toBe(true);
    expect(result.barycenters.has(JplBodyId.JupiterBarycenter)).toBe(true);

    const earthMoonBarycenterModel = result.barycenters.get(JplBodyId.EarthMoonBarycenter);
    expect(earthMoonBarycenterModel).toEqual({
      nutationPrecessionAnglesPolynomialsDegree: 2,
      nutationPrecessionAnglesCoefficients: [1.5, 2.5, 3.5, 4.5, 5.5]
    });

    const jupiterBarycenterModel = result.barycenters.get(JplBodyId.JupiterBarycenter);
    expect(jupiterBarycenterModel).toEqual({
      nutationPrecessionAnglesPolynomialsDegree: 1,
      nutationPrecessionAnglesCoefficients: [10.1, 20.2, 30.3]
    });
  });
});
