import { describe, it } from "vitest";
import { JulianDay } from "../..";
import { EphemerisSeconds, JplBodyId } from '..';
import { DirectStateSolver } from '../state';
import { kernelRepository } from './de440.testData';

describe("DE440 data", () => {

    it("should compute correct states", () => {
        const spkForMercury = kernelRepository.getAllTransientSpkKernelCollections(JplBodyId.Mercury);
        const mercuryStateSolver = new DirectStateSolver(spkForMercury);
        console.log(mercuryStateSolver.positionFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));
        console.log(mercuryStateSolver.velocityFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));
    });

});
