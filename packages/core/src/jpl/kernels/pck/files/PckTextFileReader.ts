import { loadFileTokens } from "./parser/TokenReader";
import { PckParser } from "./parser/PckParser";

export async function readPckFile(pckFileName: string) {
  const pckTokens = loadFileTokens(pckFileName);
  const pckParser = new PckParser(pckTokens);

  await pckParser.parse();

  return {
    variables: pckParser.assignments
  }
}
