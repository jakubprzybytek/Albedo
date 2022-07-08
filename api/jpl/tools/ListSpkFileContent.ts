import { openSync, readSync, closeSync } from 'node:fs';
import { SpkFileInformationReader } from "../files";

function ListSpkFileContent(fileName: string) {
    const fd = openSync(fileName, 'r');

    const spkFileInformationReader = new SpkFileInformationReader(fd);
    spkFileInformationReader.readArraysInformation();

    closeSync(fd);
}

ListSpkFileContent('d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp');