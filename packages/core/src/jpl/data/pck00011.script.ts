import { readPckFile } from "@jpl/kernels/pck/files/PckTextFileReader";
import { extractRadiiInformation } from "@jpl/kernels/pck/files/processors/RadiiProcessor";
import { printRadiiMap } from "./lib/pck/printPck";

async function read() {
    const { variables } = await readPckFile('../../data/pck00011.tpc');

    const radii = extractRadiiInformation(variables);
    printRadiiMap('pck00011.ts', radii);
}

(async () => { await read(); })();