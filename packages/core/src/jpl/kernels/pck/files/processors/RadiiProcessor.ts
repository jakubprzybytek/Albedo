import { AssignementType, Assignment } from "../parser/PckParser";
import { JplBodyId, jplBodyIdFromId } from "@jpl";

const radiiVariableRegex = /^BODY(\d+)_RADII$/;

export function extractRadiiInformation(assignments: Assignment[]): Map<JplBodyId, number[]> {
  const objectRadii: Map<JplBodyId, number[]> = new Map();

  for (const assignment of assignments) {
    const radiiVariableMatch = assignment.variableName.match(radiiVariableRegex);
    if (radiiVariableMatch) {
      const bodyId = parseInt(radiiVariableMatch[1]);
      const jplBodyId = jplBodyIdFromId(bodyId);
      if (jplBodyId) {
        if (assignment.type === AssignementType.MultipleValues && assignment.values.length === 3) {
          objectRadii.set(jplBodyId, assignment.values);
        } else {
          throw new Error(`Expecting ${assignment.variableName} to have value of type array and length 3, got value: ${assignment.type === AssignementType.MultipleValues ? assignment.values.toString() : assignment.value.toString()}`);
        }
        // console.log(`Body ${bodyId}/${JplBodyId[jplBodyId]} radii: ${objectRadii.get(jplBodyId)?.toString()}`);
      }
    }
  }

  return objectRadii;
}
