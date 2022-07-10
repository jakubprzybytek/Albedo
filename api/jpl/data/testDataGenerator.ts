import { openSync, writeSync, closeSync } from 'node:fs';
import { JulianDay } from "../../math";
import { JplBodyId, EphemerisSeconds } from "..";
import { SpkKernelCollection, TimeSpan } from '../kernel';
import { SpkFileArrayInformation, readSpkFileInformation, readSpkPositionChebyshevPolynomials, DataType } from "../files";

function readRecords(fd: number, spkFileArrayInformationList: SpkFileArrayInformation[], bodyId: JplBodyId, centerBodyId: JplBodyId, fromJde: number, toJde: number): SpkKernelCollection {
    const arrayInformation = spkFileArrayInformationList
        .find(arrayInformation => arrayInformation.body.id === bodyId && arrayInformation.centerBody.id === centerBodyId);

    if (arrayInformation === undefined) {
        throw Error(`Cannot find array information for body '${bodyId}' w.r.t. '${centerBodyId}'`);
    }

    switch (arrayInformation.dataType) {
        case DataType.ChebyshevPosition:
            return {
                kernelFileName: 'test',
                bodyId: bodyId,
                centerBodyId: centerBodyId,
                positionData: readSpkPositionChebyshevPolynomials(fd, arrayInformation, EphemerisSeconds.fromJde(fromJde), EphemerisSeconds.fromJde(toJde))
            }
    }

    throw Error(`Unsupported data typ ${arrayInformation.dataType}`);
}

function replacer(this: any, key: string, value: any): any {
    if (key === 'timeSpan') {
        const timeSpan = value as TimeSpan;
        return `new TimeSpan(${timeSpan.from}, ${timeSpan.to})`;
    }
    return value;
}

function generateSpkCollection(spkFd: number, outputFd: number, spkFileArrayInformationList: SpkFileArrayInformation[], constName: string, bodyId: JplBodyId, centerBodyId: JplBodyId, fromJde: number, toJde: number) {
    const spkCollection = readRecords(spkFd, spkFileArrayInformationList, bodyId, centerBodyId, fromJde, toJde);
    let spkCollectionString = JSON.stringify(spkCollection, replacer, 2);
    spkCollectionString = spkCollectionString.replaceAll(/"timeSpan": "(.+)",/g, (match, p1) => (`"timeSpan": ${p1},`));

    writeSync(outputFd, `export const ${constName}: SpkKernelCollection = `);
    writeSync(outputFd, spkCollectionString);
    writeSync(outputFd, ';\n\n');
}

type BodiesPair = {
    body: JplBodyId;
    centerBody: JplBodyId;
}

export function generateTestData(spkFileName: string, outputFileName: string, from: Date, to: Date, bodiesPairs: BodiesPair[]): void {
    const fromJde = JulianDay.fromDateObject(from);
    const toJde = JulianDay.fromDateObject(to);

    const spkFd = openSync(spkFileName, 'r');
    const { spkFileArrayInformationList } = readSpkFileInformation(spkFd);

    const outputFd = openSync(outputFileName, 'w');
    writeSync(outputFd, "import { SpkKernelRepository, SpkKernelCollection, TimeSpan } from '../kernel';\n\n");
    writeSync(outputFd, `// from: ${from.toISOString()}\n`);
    writeSync(outputFd, `// to: ${to.toISOString()}\n\n`);

    var kernelRepositorySnippet = 'export const kernelRepository: SpkKernelRepository = new SpkKernelRepository();\n'
        + 'kernelRepository.registerSpkKernelCollections([\n';

    bodiesPairs.forEach(pair => {
        const fieldName = `a_${pair.body}_wrt_${pair.centerBody}`;
        generateSpkCollection(spkFd, outputFd, spkFileArrayInformationList, fieldName, pair.body, pair.centerBody, fromJde, toJde);
        kernelRepositorySnippet += `\t${fieldName},\n`;
    });
    kernelRepositorySnippet += ']);\n';
    writeSync(outputFd, kernelRepositorySnippet);

    closeSync(outputFd);
    closeSync(spkFd);
}
