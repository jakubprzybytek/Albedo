import { readPckFile } from "@jpl/kernels/pck/files/PckTextFileReader";
import { extractRadiiInformation } from "@jpl/kernels/pck/files/processors/RadiiProcessor";
import { extractOrientationModelInformation } from "@jpl/kernels/pck/files/processors/OrientationModelProcessor";
import { printPckFile } from "./lib/pck/printPck";

async function read() {
    const { variables } = await readPckFile('../../data/pck00011.tpc');

    const radii = extractRadiiInformation(variables);
    const { bodies, barycenters } = extractOrientationModelInformation(variables);

    printPckFile('pck00011.ts', radii, bodies, barycenters);

}

(async () => { await read(); })();