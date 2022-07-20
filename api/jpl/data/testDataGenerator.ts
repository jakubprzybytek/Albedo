import { openSync, writeSync, closeSync } from 'node:fs';
import { JulianDay } from "../../math";
import { JplBodyId, EphemerisSeconds } from "..";
import { SpkKernelCollection, TimeSpan } from '../kernel';
import { SpkFileArrayInformation, readSpkFileInformation, readSpkPositionChebyshevPolynomials, DataType } from "../files";


type BodiesPair = {
    body: JplBodyId;
    centerBody: JplBodyId;
}


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

export function readMultipleSpkCollections(spkFileName: string, from: Date, to: Date, bodies: BodiesPair[]): SpkKernelCollection[] {
    const fromJde = JulianDay.fromDateObject(from);
    const toJde = JulianDay.fromDateObject(to);

    const spkFd = openSync(spkFileName, 'r');
    const { spkFileArrayInformationList } = readSpkFileInformation(spkFd);

    const spkCollectionsList = bodies.map(pair => readRecords(spkFd, spkFileArrayInformationList, pair.body, pair.centerBody, fromJde, toJde))

    closeSync(spkFd);

    return spkCollectionsList;
}

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
    
    var kernelRepositorySnippet = 'export const kernelRepository: SpkKernelRepository = new SpkKernelRepository();\n'
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
}