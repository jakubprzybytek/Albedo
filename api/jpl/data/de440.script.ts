import { openSync, writeSync, closeSync } from 'node:fs';
import { JulianDay } from "../../math";
import { JplBody, BodyType, jplBodyFromString, EphemerisSeconds } from "..";
import { PositionChebyshevRecord, PositionAndVelocityChebyshevRecord, SpkKernelCollection, TimeSpan } from '../kernel';
import { readSpkFileInformation, readSpkPositionChebyshevPolynomials, readSpkPositionAndVelocityChebyshevPolynomials, DataType } from "../files";

function readRecords(fd: number, body: JplBody, centerBody: JplBody, fromJde: number, toJde: number): SpkKernelCollection {
    const arrayInformation = spkFileArrayInformationList
        .find(arrayInformation => arrayInformation.body === body && arrayInformation.centerBody === centerBody);

    if (arrayInformation === undefined) {
        throw Error(`Cannot find array information for body '${body?.name}' w.r.t. '${centerBody?.name}'`);
    }

    switch (arrayInformation.dataType) {
        case DataType.ChebyshevPosition:
            return {
                kernelFileName: 'test',
                bodyId: body.id,
                centerBodyId: centerBody.id,
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

function generateSpkCollection(spkFd: number, outputFd: number, constName: string, body: JplBody | undefined, centerBody: JplBody | undefined, fromJde: number, toJde: number) {
    if (body === undefined || centerBody === undefined) {
        throw Error('Unknown body or center body');
    }
    
    const spkCollection = readRecords(spkFd, body, centerBody, fromJde, toJde);
    let spkCollectionString = JSON.stringify(spkCollection, replacer, 2);
    spkCollectionString = spkCollectionString.replaceAll(/"timeSpan": "(.+)",/g, (match, p1) => (`"timeSpan": ${p1},`));

    writeSync(outputFd, `const ${constName}: SpkKernelCollection = `);
    writeSync(outputFd, spkCollectionString);
    writeSync(outputFd, ';\n\n');
}

const from = new Date('2022-01-01');
const to = new Date('2022-12-31');
const fromJde = JulianDay.fromDateObject(from);
const toJde = JulianDay.fromDateObject(to);

const spkFd = openSync('d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp', 'r');
const { spkFileArrayInformationList } = readSpkFileInformation(spkFd);

const outputFd = openSync('./de440.ts', 'w');
writeSync(outputFd, "import { SpkKernelRepository, SpkKernelCollection, TimeSpan } from '../kernel';\n\n");
writeSync(outputFd, `// from: ${from.toISOString()}\n`);
writeSync(outputFd, `// to: ${to.toISOString()}\n\n`);

generateSpkCollection(spkFd, outputFd, 'SUN_ERT_SOLAR_SYSTEM_BARYCENTER', jplBodyFromString('Sun'), jplBodyFromString('Solar System Barycenter'), fromJde, toJde);
generateSpkCollection(spkFd, outputFd, 'EARTH_MOON_BARYCENTER_ERT_SOLAR_SYSTEM_BARYCENTER', jplBodyFromString('Earth Moon Barycenter'), jplBodyFromString('Solar System Barycenter'), fromJde, toJde);
generateSpkCollection(spkFd, outputFd, 'EARTH_WRT_EARTH_MOON_BARYCENTER', jplBodyFromString('Earth'), jplBodyFromString('Earth Moon Barycenter'), fromJde, toJde);
generateSpkCollection(spkFd, outputFd, 'MERCURY_BARYCENTER_ERT_SOLAR_SYSTEM_BARYCENTER', jplBodyFromString('Mercury Barycenter'), jplBodyFromString('Solar System Barycenter'), fromJde, toJde);
generateSpkCollection(spkFd, outputFd, 'MERCURY_ERT_MERCURY_BARYCENTER', jplBodyFromString('Mercury'), jplBodyFromString('Mercury Barycenter'), fromJde, toJde);
generateSpkCollection(spkFd, outputFd, 'VENUS_BARYCENTER_ERT_SOLAR_SYSTEM_BARYCENTER', jplBodyFromString('Venus Barycenter'), jplBodyFromString('Solar System Barycenter'), fromJde, toJde);
generateSpkCollection(spkFd, outputFd, 'VENUS_ERT_VENUS_BARYCENTER', jplBodyFromString('Venus'), jplBodyFromString('Venus Barycenter'), fromJde, toJde);

closeSync(spkFd);

writeSync(outputFd, 'export const kernelRepository: SpkKernelRepository = new SpkKernelRepository();\n');
writeSync(outputFd, 'kernelRepository.registerSpkKernelCollections([\n');
writeSync(outputFd, '\tSUN_ERT_SOLAR_SYSTEM_BARYCENTER,\n');
writeSync(outputFd, '\tEARTH_MOON_BARYCENTER_ERT_SOLAR_SYSTEM_BARYCENTER,\n');
writeSync(outputFd, '\tEARTH_WRT_EARTH_MOON_BARYCENTER,\n');
writeSync(outputFd, '\tMERCURY_BARYCENTER_ERT_SOLAR_SYSTEM_BARYCENTER,\n');
writeSync(outputFd, '\tMERCURY_ERT_MERCURY_BARYCENTER,\n');
writeSync(outputFd, '\tVENUS_BARYCENTER_ERT_SOLAR_SYSTEM_BARYCENTER,\n');
writeSync(outputFd, '\tVENUS_ERT_VENUS_BARYCENTER,\n');
writeSync(outputFd, ']);\n');

closeSync(outputFd);