import { loadFileTokens } from "./parser/TokenReader";
import { PckParser } from "./parser/PckParser";
import { PckRepository } from "../PckRepository";

export async function readPckFile(pckFileName: string) {
  const pckTokens = loadFileTokens(pckFileName);
  const pckParser = new PckParser(pckTokens);

  await pckParser.parse();

  const pckRepository = new PckRepository();
  pckRepository.registerPckVariables(pckParser.assignments);
}
