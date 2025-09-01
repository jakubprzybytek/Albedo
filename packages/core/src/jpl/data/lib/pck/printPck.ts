import { openSync, writeSync, closeSync } from 'node:fs';
import { JplBodyId } from "@jpl/JplBody";
import { BodyOrientationModel, BarycenterOrientationModel } from "@jpl/kernels/pck";

export function printRadiiMap(fd: number, radii: Map<JplBodyId, number[]>) {
  writeSync(fd, 'const objectRadii: Map<JplBodyId, Vector3> = new Map();\n\n');

  radii.forEach((value: number[], key: JplBodyId) =>
    writeSync(fd, `objectRadii.set(JplBodyId.${JplBodyId[key]}, [${value.join(', ')}]);\n`)
  );
}

export function printOrientationModels(fd: number, bodies: Map<JplBodyId, BodyOrientationModel>, barycenters: Map<JplBodyId, BarycenterOrientationModel>) {
  writeSync(fd, '\nconst bodiesOrientationModels: Map<JplBodyId, BodyOrientationModel> = new Map();\n\n');

  bodies.forEach((value: BodyOrientationModel, key: JplBodyId) =>
    writeSync(fd, `bodiesOrientationModels.set(JplBodyId.${JplBodyId[key]}, ${JSON.stringify(value)});\n`)
  );

  writeSync(fd, '\nconst barycentersOrientationModels: Map<JplBodyId, BarycenterOrientationModel> = new Map();\n\n');

  barycenters.forEach((value: BarycenterOrientationModel, key: JplBodyId) =>
    writeSync(fd, `barycentersOrientationModels.set(JplBodyId.${JplBodyId[key]}, ${JSON.stringify(value)});\n`)
  );
}

export function printPckFile(outputFileName: string, radii: Map<JplBodyId, number[]>, bodies: Map<JplBodyId, BodyOrientationModel>, barycenters: Map<JplBodyId, BarycenterOrientationModel>) {
  const fd = openSync(outputFileName, 'w');

  writeSync(fd, 'import { Vector3 } from "@astro/math";\n');
  writeSync(fd, 'import { JplBodyId } from "@jpl/JplBody";\n');
  writeSync(fd, 'import { PckRepository, BodyOrientationModel, BarycenterOrientationModel } from "@jpl/kernels/pck";\n\n');

  printRadiiMap(fd, radii);

  printOrientationModels(fd, bodies, barycenters);

  writeSync(fd, '\nexport const pckRepository: PckRepository = new PckRepository();\n');
  writeSync(fd, 'pckRepository.registerPckVariables(objectRadii);\n');
  writeSync(fd, 'pckRepository.registerBodyOrientationModels(bodiesOrientationModels);\n');
  writeSync(fd, 'pckRepository.registerBarycenterOrientationModels(barycentersOrientationModels);\n');

  closeSync(fd);

  console.log(`Written to file: ${outputFileName}`);
}