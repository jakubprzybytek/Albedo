import { describe, it, expect } from "vitest";
import { JulianDay } from "../JulianDay";
import { EphemerisSeconds, JplBody } from '../jpl';
import { DirectStateSolver } from '@jpl/state';
import { kernelRepository, stateSolver } from './testData';

describe("DE440 data", () => {

    it("should compute correct states", () => {
        const spkKernelForMercury = kernelRepository.getAllTransientSpkKernelCollections(JplBody.Mercury);
        const mercuryStateSolver = new DirectStateSolver(spkKernelForMercury);
        console.log(mercuryStateSolver.positionFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));
        console.log(stateSolver.positionFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));
    });

});
