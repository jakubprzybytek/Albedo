import { Command } from 'commander';
import { readPckFile } from "../pck/files/PckTextFileReader";

async function ListPckFileContent(fileName: string) {
  await readPckFile(fileName);
}

const program = new Command();
program
  .usage('<fileName>')
  .arguments('<fileName>')
  .action(async (fileName: string) => {
    await ListPckFileContent(fileName);
  })
  .parse(process.argv);
