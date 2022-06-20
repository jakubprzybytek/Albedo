import { describe, it } from "vitest";
import { JulianDay } from "..";
import { EphemerisSeconds, JplBody } from '../jpl';
import { DirectStateSolver } from './state';
import { kernelRepository } from './testData';

describe("DE440 data", () => {

    it("should compute correct states", () => {
        const spkKernelForMercury = kernelRepository.getAllTransientSpkKernelCollections(JplBody.Mercury);
        const mercuryStateSolver = new DirectStateSolver(spkKernelForMercury);
        console.log(mercuryStateSolver.positionFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));
    });

});
