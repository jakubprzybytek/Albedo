import { describe, it } from "vitest";
import { JulianDay } from "../..";
import { EphemerisSeconds, JplBody } from '..';
import { DirectStateSolver } from '../state';
import { kernelRepository } from './de440.testData';

describe("DE440 data", () => {

    it("should compute correct states", () => {
        const spkForMercury = kernelRepository.getAllTransientSpkKernelCollections(JplBody.Mercury);
        const mercuryStateSolver = new DirectStateSolver(spkForMercury);
        console.log(mercuryStateSolver.positionFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));
        console.log(mercuryStateSolver.velocityFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));
    });

});
