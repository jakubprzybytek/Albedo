import { openSync, writeSync, closeSync } from 'node:fs';
import { JplBodyId } from "@jpl/JplBody";

export function printRadiiMap(outputFileName: string, radii: Map<JplBodyId, number[]>) {
  const fd = openSync(outputFileName, 'w');

  writeSync(fd, 'import { JplBodyId } from "@jpl/JplBody";\n');
  writeSync(fd, 'import { PckRepository } from "@jpl/kernels/pck";\n\n');

  writeSync(fd, 'const objectRadii: Map<JplBodyId, number[]> = new Map();\n\n');

  radii.forEach((value: number[], key: JplBodyId) =>
    writeSync(fd, `objectRadii.set(JplBodyId.${JplBodyId[key]}, [${value.join(', ')}]);\n`)
  );

  writeSync(fd, '\nexport const pckRepository: PckRepository = new PckRepository();\n');
  writeSync(fd, 'pckRepository.registerPckVariables(objectRadii)\n');

  closeSync(fd);

  console.log(`Written to file: ${outputFileName}`);
}