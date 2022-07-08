import { describe, it, expect } from "vitest";
import { openSync, readSync, closeSync } from 'node:fs';
import { SpkFileInformationReader } from './';

describe("SpkFileInformationReader", () => {

    it("should read SPK file", async () => {
        const fd = openSync('d:/Workspace/Java/Albedo/misc/jpl-kernels/de440s.bsp', 'r');

        const spkFileInformationReader = new SpkFileInformationReader(fd);
        spkFileInformationReader.readArraysInformation();

        closeSync(fd);
    });
});
