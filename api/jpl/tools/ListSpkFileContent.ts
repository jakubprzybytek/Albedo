import { openSync, closeSync } from 'node:fs';
import { Command } from 'commander';
import { JulianDay } from "../../math";
import { EphemerisSeconds } from "../";
import { DataType, readSpkFileInformation } from "../files";

function ListSpkFileContent(fileName: string) {
    const fd = openSync(fileName, 'r');

    const { spkFileDescriptor, spkFileArrayInformationList } = readSpkFileInformation(fd);

    closeSync(fd);

    console.log(`File name: '${spkFileDescriptor.fileName}', architecture: '${spkFileDescriptor.architecture}', `
        + `doubles number: ${spkFileDescriptor.fileRecordDoublesNumber}, integers number: ${spkFileDescriptor.fileRecordIntegersNumber} `
        + `first index: ${spkFileDescriptor.firstArrayInformationBlockIndex}, last index: ${spkFileDescriptor.lastArrayInformationBlockIndex} `
        + `free index: ${spkFileDescriptor.freeDoubleIndex}.`);

    spkFileArrayInformationList.forEach(spkFileArrayInformation => {
        const bodyName = spkFileArrayInformation.body.name;
        const centerBodyName = spkFileArrayInformation.centerBody.name;
        const startDate = JulianDay.toDateTime(EphemerisSeconds.toJde(spkFileArrayInformation.startDate));
        const endDate = JulianDay.toDateTime(EphemerisSeconds.toJde(spkFileArrayInformation.endDate));
        const dataType = spkFileArrayInformation.dataType === DataType.ChebyshevPosition ? 'position' :
            spkFileArrayInformation.dataType === DataType.ChebyshevPositionAndVelocity ? 'position and velocity' : 'unknown';
        console.log(`${bodyName} w.r.t. ${centerBodyName} `
            + `from ${startDate.toLocaleDateString('pl-pl')} to ${endDate.toLocaleDateString('pl-pl')}, `
            + `start index: ${spkFileArrayInformation.startIndex}, end index: ${spkFileArrayInformation.endIndex}, `
            + `data type: ${dataType}(${spkFileArrayInformation.dataType})`);
    });
}

const program = new Command();
program
    .usage('<fileName>')
    .argument('<fileName>', 'SPK file name')
    .action(fileName => {
        ListSpkFileContent(fileName);
    })
    .parse(process.argv);
