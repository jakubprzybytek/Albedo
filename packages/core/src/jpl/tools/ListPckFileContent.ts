import { Command } from 'commander';
import { readPckFile } from "@jpl/kernels/pck/files/PckTextFileReader";
import { extractRadiiInformation } from '@jpl/kernels/pck/files/processors/RadiiProcessor';
import { extractOrientationModelInformation } from '@jpl/kernels/pck/files/processors/OrientationModelProcessor';

async function ListPckFileContent(fileName: string) {
  const { variables } = await readPckFile(fileName);

  const radii = extractRadiiInformation(variables);
  const { bodies, barycenters } = extractOrientationModelInformation(variables);

  console.log(radii);
  console.log(bodies);
  console.log(barycenters);
}

const program = new Command();
program
  .usage('<fileName>')
  .arguments('<fileName>')
  .action(async (fileName: string) => {
    await ListPckFileContent(fileName);
  })
  .parse(process.argv);
