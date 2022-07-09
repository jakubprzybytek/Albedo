import { openSync, closeSync } from 'node:fs';
import { Command } from 'commander';
import { JulianDay } from "../../math";
import { JplBody, jplBodyFromString, EphemerisSeconds } from "..";
import { PositionChebyshevRecord, PositionAndVelocityChebyshevRecord } from '../kernel';
import { readSpkFileInformation, readSpkPositionChebyshevPolynomials, readSpkPositionAndVelocityChebyshevPolynomials, DataType } from "../files";

function PrintRecordsFromSpkFile(fileName: string, body: JplBody, centerBody: JplBody, fromJde: number, toJde: number) {
    const fd = openSync(fileName, 'r');

    const { spkFileArrayInformationList } = readSpkFileInformation(fd);

    const arrayInformation = spkFileArrayInformationList
        .find(arrayInformation => arrayInformation.body === body && arrayInformation.centerBody === centerBody);

    if (arrayInformation === undefined) {
        throw Error(`Cannot find array information for body '${body.name}' w.r.t. '${centerBody.name}'`);
    }

    switch (arrayInformation.dataType) {
        case DataType.ChebyshevPosition:
            const positionChebyshevRecords = readSpkPositionChebyshevPolynomials(fd, arrayInformation, EphemerisSeconds.fromJde(fromJde), EphemerisSeconds.fromJde(toJde));
            console.log(JSON.stringify(positionChebyshevRecords, null, 2));
            break;
        case DataType.ChebyshevPosition:
            const positionAndVelocityChebyshevRecords = readSpkPositionAndVelocityChebyshevPolynomials(fd, arrayInformation, EphemerisSeconds.fromJde(fromJde), EphemerisSeconds.fromJde(toJde));
            console.log(JSON.stringify(positionAndVelocityChebyshevRecords, null, 2));
            break;
    }

    closeSync(fd);
}

const program = new Command();
program
    .usage('<fileName>')
    .argument('<fileName>', 'SPK file name')
    .requiredOption('--body <body>', 'Body name - must parse to JPL Body Id')
    .requiredOption('--centerBody <body>', 'Center body name - must parse to JPL Body Id')
    .requiredOption('--from <date>', 'Start date to cover, yyyy-mm-dd')
    .requiredOption('--to <date>', 'End date to cover')
    .action((fileName, options) => {
        const body = jplBodyFromString(options.body);
        if (body === undefined) {
            throw Error(`Cannot pare JPL body name: ${options.body}`);
        }

        const centerBody = jplBodyFromString(options.centerBody);
        if (centerBody === undefined) {
            throw Error(`Cannot pare JPL body name: ${options.centerBody}`);
        }

        const fromDate = new Date(options.from);
        const toDate = new Date(options.to);

        PrintRecordsFromSpkFile(fileName, body, centerBody, JulianDay.fromDateObject(fromDate), JulianDay.fromDateObject(toDate));
    })
    .parse(process.argv);
