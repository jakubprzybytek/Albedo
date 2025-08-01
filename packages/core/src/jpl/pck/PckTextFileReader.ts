import { loadFileTokens } from "./files/parser/TokenReader";
import { PckParser } from "./files/parser/PckParser";
import { AssignementType } from "./files/parser/PckParser";

export async function readPckFile(pckFileName: string) {
  const pckTokens = loadFileTokens(pckFileName);
  const pckParser = new PckParser(pckTokens);

  await pckParser.parse();

  for (const assignment of pckParser.assignments) {
    if (assignment.type === AssignementType.SingleValue) {
      console.log(assignment.variableName, assignment.value);
    } else {
      console.log(assignment.variableName, assignment.values);
    }
  }
}
