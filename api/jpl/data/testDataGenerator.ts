import { openSync, writeSync, closeSync } from 'node:fs';
import { JulianDay } from "../../math";
import { JplBodyId, EphemerisSeconds } from "..";
import { PositionAndVelocityChebyshevRecord, PositionChebyshevRecord, SpkKernelCollection, TimeSpan } from '../kernel';
import { SpkFileArrayInformation, readSpkFileInformation, readSpkPositionChebyshevPolynomials, readSpkPositionAndVelocityChebyshevPolynomials, DataType } from "../files";

type BodiesPair = {
    body: JplBodyId;
    centerBody: JplBodyId;
}

function readRecords(fd: number, spkFileArrayInformationList: SpkFileArrayInformation[], bodyId: JplBodyId, centerBodyId: JplBodyId, fromJde: number, toJde: number): SpkKernelCollection {
    const positionRecords: PositionChebyshevRecord[] = new Array();
    const positionAndVelocityRecords: PositionAndVelocityChebyshevRecord[] = new Array();

    spkFileArrayInformationList
        .filter(arrayInformation => arrayInformation.body.id === bodyId && arrayInformation.centerBody.id === centerBodyId)
        .forEach(arrayInformation => {
            switch (arrayInformation.dataType) {
                case DataType.ChebyshevPosition:
                    const newPRecords = readSpkPositionChebyshevPolynomials(fd, arrayInformation, EphemerisSeconds.fromJde(fromJde), EphemerisSeconds.fromJde(toJde));
                    positionRecords.push(...newPRecords);
                    break;
                case DataType.ChebyshevPositionAndVelocity:
                    const newPVRecords = readSpkPositionAndVelocityChebyshevPolynomials(fd, arrayInformation, EphemerisSeconds.fromJde(fromJde), EphemerisSeconds.fromJde(toJde));
                    positionAndVelocityRecords.push(...newPVRecords);
                    break;
            };
        })

    if (positionRecords.length === 0 && positionAndVelocityRecords.length === 0) {
        throw Error(`Cannot find records for body '${bodyId}' w.r.t. '${centerBodyId}'`);
    }

    return {
        kernelFileName: 'test',
        bodyId: bodyId,
        centerBodyId: centerBodyId,
        data: positionRecords.length > 0 ? positionRecords : positionAndVelocityRecords,
        dataType: positionRecords.length > 0 ? DataType.ChebyshevPosition : DataType.ChebyshevPositionAndVelocity
    }
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