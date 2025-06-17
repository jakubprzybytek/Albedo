import { readdirSync, writeFileSync } from "fs";
import path from "path";

export function findFiles(folder: string, fileNamePrefix: string): string[] {
  return readdirSync(folder)
    .filter((fileName) => fileName.startsWith(fileNamePrefix))
    .map((fileName) => `${folder}/${fileName}`);
}

export type ReportWriter = (content: string) => void;

export function buildReportWriter(testName: string, timestamp: string) {
  const fileName = path.join(__dirname, `../results/fullTest.${testName}.results-${timestamp}.md`);
  
  const buffer: string[] = [];

  const append: ReportWriter = (content: string) => {
    buffer.push(content);
  };

  const flush = () => {
    console.log(`Writing to ${fileName}`);
    writeFileSync(fileName, buffer.join('\n'));
  };

  return { append, flush };
}
