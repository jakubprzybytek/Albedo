import { openSync, closeSync } from 'node:fs';
import { JulianDay } from "../../math";
import { jplBodyFromString, EphemerisSeconds } from "..";
import { readSpkFileInformation, readSpkPositionChebyshevPolynomials, readSpkPositionAndVelocityChebyshevPolynomials } from "../files";

function PrintRecordsFromSpkFile(fileName: string, bodyName: string, centerBodyName: string) {
    const body = jplBodyFromString(bodyName);
    if (body === undefined) {
        throw Error(`Cannot pare JPL body name: ${bodyName}`);
    }

    const centerBody = jplBodyFromString(centerBodyName);
    if (centerBody === undefined) {
        throw Error(`Cannot pare JPL body name: ${centerBodyName}`);
    }

    const fd = openSync(fileName, 'r');

    const { spkFileArrayInformationList } = readSpkFileInformation(fd);

    const arrayInformation = spkFileArrayInformationList
        .find(arrayInformation => arrayInformation.body === body && arrayInformation.centerBody === centerBody);

    if (arrayInformation === undefined) {
        throw Error(`Cannot find array information for body '${body.name}' w.r.t. '${centerBody.name}'`);
    }

    const positionChebyshevRecords = readSpkPositionChebyshevPolynomials(fd, arrayInformation, -1000, 1000);
    //const positionAndVelocityChebyshevRecords = readSpkPositionAndVelocityChebyshevPolynomials(fd, arrayInformation, -1000, 1000);

    //positionAndVelocityChebyshevRecords.forEach(record => {
    positionChebyshevRecords.forEach(record => {
        console.log(`[${record.timeSpan.from}, ${record.timeSpan.to}]`);
        console.log(JSON.stringify(record, null, 2));
    });

    closeSync(fd);
}

PrintRecordsFromSpkFile('d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp', 'Earth Moon Barycenter', 'Solar System Barycenter');
//PrintRecordsFromSpkFile('d:/Workspace/Java/Albedo/misc/jpl-kernels/mar097.bsp', 'Mars', 'Mars Barycenter');
