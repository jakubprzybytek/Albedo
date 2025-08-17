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
        objectRadii.set(jplBodyId, assignment.type === AssignementType.MultipleValues ? assignment.values : [assignment.value]);
        console.log(`Body ${bodyId}/${jplBodyId} radii: ${objectRadii.get(jplBodyId)?.join(', ')}`);
      }
    }
  }

  return objectRadii;
}
