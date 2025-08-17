import { openSync, writeSync, closeSync } from 'node:fs';
import { SpkKernelCollection, TimeSpan } from '@jpl/kernels/spk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replacer(this: any, key: string, value: any): any {
  if (key === 'timeSpan') {
    const timeSpan = value as TimeSpan;
    return `new TimeSpan(${timeSpan.from}, ${timeSpan.to})`;
  }
  return value;
}

export function printSpkCollections(outputFileName: string, spkCollectionsList: SpkKernelCollection[], from: Date, to: Date) {
  const fd = openSync(outputFileName, 'w');
  writeSync(fd, "import { SpkKernelRepository, SpkKernelCollection, TimeSpan } from '../kernel';\n\n");
  writeSync(fd, `// from: ${from.toISOString()}\n`);
  writeSync(fd, `// to: ${to.toISOString()}\n\n`);

  let kernelRepositorySnippet = 'export const kernelRepository: SpkKernelRepository = new SpkKernelRepository();\n'
    + 'kernelRepository.registerSpkKernelCollections([\n';

  spkCollectionsList.forEach(spkCollection => {
    const constName = `a_${spkCollection.bodyId}_wrt_${spkCollection.centerBodyId}`;
    let spkCollectionString = JSON.stringify(spkCollection, replacer, 2);
    spkCollectionString = spkCollectionString.replaceAll(/"timeSpan": "(.+)",/g, (match, p1) => (`"timeSpan": ${p1},`));

    kernelRepositorySnippet += `\t${constName},\n`;

    writeSync(fd, `export const ${constName}: SpkKernelCollection = `);
    writeSync(fd, spkCollectionString);
    writeSync(fd, ';\n\n');
  });

  kernelRepositorySnippet += ']);\n';
  writeSync(fd, kernelRepositorySnippet);

  closeSync(fd);

  console.log(`Written to file: ${outputFileName}`);
}