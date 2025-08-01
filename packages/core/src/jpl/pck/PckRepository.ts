import { Assignment, AssignementType } from "./files/parser/PckParser";
import { JplBodyId, jplBodyIdFromId } from "../JplBody";

const radiiVariableRegex = /^BODY(\d+)_RADII$/;

const objectRadii: Map<JplBodyId, number[]> = new Map();

export class PckRepository {

  registerPckVariables(assignments: Assignment[]) {
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
  }

  getBodyRadii(jplBodyId: JplBodyId): number[] | undefined {
    return objectRadii.get(jplBodyId);
  }

}
