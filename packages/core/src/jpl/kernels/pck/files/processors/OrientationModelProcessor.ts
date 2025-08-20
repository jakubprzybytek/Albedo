import { AssignementType, Assignment } from "../parser/PckParser";
import { JplBodyId, jplBodyIdFromId } from "@jpl";

export type BodyOrientationModelParameters = {
  poleRACoefficients: number[],
  poleDecCoefficients: number[],
  poleWCoefficients: number[],
  nutationPrecessionAnglesRACoefficients: number[],
  nutationPrecessionAnglesDecCoefficients: number[],
  nutationPrecessionAnglesWCoefficients: number[],
}

export type BarycenterOrientationModelParameters = {
  nutationPrecessionAnglesPolynomialsDegree: number, // 1 by default
  nutationPrecessionAnglesCoefficients: number[]
}

const EMPTY_BODY_ORIENTATION_MODEL: BodyOrientationModelParameters = {
  poleRACoefficients: [],
  poleDecCoefficients: [],
  poleWCoefficients: [],
  nutationPrecessionAnglesRACoefficients: [],
  nutationPrecessionAnglesDecCoefficients: [],
  nutationPrecessionAnglesWCoefficients: []
}

const EMPTY_BARYCENTER_ORIENTATION_MODEL: BarycenterOrientationModelParameters = {
  nutationPrecessionAnglesPolynomialsDegree: 1,
  nutationPrecessionAnglesCoefficients: []
}

export type OrientationModel = {
  bodies: Map<JplBodyId, BodyOrientationModelParameters>,
  barycenters: Map<JplBodyId, BarycenterOrientationModelParameters>
}

const bodyVariableNameRegex = /^BODY(\d+)_(POLE_RA|POLE_DEC|PM|NUT_PREC_RA|NUT_PREC_DEC|NUT_PREC_PM)$/;
const barycenterVariableNameRegex = /^BODY(\d+)_(MAX_PHASE_DEGREE|NUT_PREC_ANGLES)$/;

function validateSingleValue(assignment: Assignment) {
  if (assignment.type == AssignementType.MultipleValues) {
    throw new Error(`Expecting ${assignment.variableName} to have single value, got: ${assignment.values.toString()}`);
  }
  return assignment.value;
}

function validateArray(assignment: Assignment, minLength: number) {
  if (assignment.type == AssignementType.SingleValue || assignment.values.length < minLength) {
    throw new Error(`Expecting ${assignment.variableName} to have value of type array and length at least ${minLength}, got value: ${assignment.type === AssignementType.MultipleValues ? assignment.values.toString() : assignment.value.toString()}`);
  }
  return assignment.values;
}

export function extractOrientationModelInformation(assignments: Assignment[]): OrientationModel {
  const bodiesOrientationModels: Map<JplBodyId, BodyOrientationModelParameters> = new Map();
  const barycentersOrientationModels: Map<JplBodyId, BarycenterOrientationModelParameters> = new Map();

  for (const assignment of assignments) {
    const bodyModelVariableNameMatch = assignment.variableName.match(bodyVariableNameRegex);
    if (bodyModelVariableNameMatch) {
      const bodyId = parseInt(bodyModelVariableNameMatch[1]);
      const jplBodyId = jplBodyIdFromId(bodyId);

      const fieldName = bodyModelVariableNameMatch[2];

      if (jplBodyId) {
        if (!bodiesOrientationModels.has(jplBodyId)) {
          bodiesOrientationModels.set(jplBodyId, { ...EMPTY_BODY_ORIENTATION_MODEL });
        }
        const orientationModel = bodiesOrientationModels.get(jplBodyId) as BodyOrientationModelParameters;

        switch (fieldName) {
          case 'POLE_RA':
            orientationModel.poleRACoefficients = validateArray(assignment, 3);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} poleRA: [${orientationModel.poleRACoefficients.toString()}]`);
            break;
          case 'POLE_DEC':
            orientationModel.poleDecCoefficients = validateArray(assignment, 3);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} poleDec: [${orientationModel.poleDecCoefficients.toString()}]`);
            break;
          case 'PM':
            orientationModel.poleWCoefficients = validateArray(assignment, 3);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} polePM: [${orientationModel.poleWCoefficients.toString()}]`);
            break;
          case 'NUT_PREC_RA':
            orientationModel.nutationPrecessionAnglesRACoefficients = validateArray(assignment, 3);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} nutationPrecessionAnglesRA: [${orientationModel.nutationPrecessionAnglesRACoefficients.toString()}]`);
            break;
          case 'NUT_PREC_DEC':
            orientationModel.nutationPrecessionAnglesDecCoefficients = validateArray(assignment, 3);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} nutationPrecessionAnglesDec: [${orientationModel.nutationPrecessionAnglesDecCoefficients.toString()}]`);
            break;
          case 'NUT_PREC_PM':
            orientationModel.nutationPrecessionAnglesWCoefficients = validateArray(assignment, 3);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} nutationPrecessionAnglesPM: [${orientationModel.nutationPrecessionAnglesWCoefficients.toString()}]`);
            break;
        }

        continue;
      }
    }

    const barycenterModelVariableNameMatch = assignment.variableName.match(barycenterVariableNameRegex);
    if (barycenterModelVariableNameMatch) {
      const bodyId = parseInt(barycenterModelVariableNameMatch[1]);
      const jplBodyId = jplBodyIdFromId(bodyId);
      console.log(`Barycenter ${bodyId}`);
      const fieldName = barycenterModelVariableNameMatch[2];

      if (jplBodyId) {
        if (!barycentersOrientationModels.has(jplBodyId)) {
          barycentersOrientationModels.set(jplBodyId, { ...EMPTY_BARYCENTER_ORIENTATION_MODEL });
        }
        const orientationModel = barycentersOrientationModels.get(jplBodyId) as BarycenterOrientationModelParameters;

        switch (fieldName) {
          case 'MAX_PHASE_DEGREE':
            orientationModel.nutationPrecessionAnglesPolynomialsDegree = validateSingleValue(assignment);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} nutPrecAnglesPolynomialsDegree: ${orientationModel.nutationPrecessionAnglesPolynomialsDegree}`);
            break;
          case 'NUT_PREC_ANGLES':
            orientationModel.nutationPrecessionAnglesCoefficients = validateArray(assignment, 3);
            // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} nutPrecAngles: [${orientationModel.nutationPrecessionAnglesCoefficients.toString()}]`);
            break;
        }

        continue;
      }
    }
  }
  console.log(barycentersOrientationModels);
  return {
    bodies: bodiesOrientationModels,
    barycenters: barycentersOrientationModels
  }
}
