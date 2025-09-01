import { readPckFile } from "@jpl/kernels/pck/files/PckTextFileReader";
import { extractRadiiInformation } from "@jpl/kernels/pck/files/processors/RadiiProcessor";
import { extractOrientationModelInformation } from "@jpl/kernels/pck/files/processors/OrientationModelProcessor";
import { printPckFile } from "@jpl/data/lib/pck/printPck";

export async function generatePck(rootFolder: string) {
    const { variables } = await readPckFile(`${rootFolder}/pck00011.tpc`);

    const radii = extractRadiiInformation(variables);
    const { bodies, barycenters } = extractOrientationModelInformation(variables);

    printPckFile(`${__dirname}/pck00011.ts`, radii, bodies, barycenters);
}
