import { describe, it, expect } from "vitest";
import { RectangularCoordinates } from "../..";
import { EphemerisSeconds } from '..';
import { DirectStateSolver } from './';
import { MERCURY_BARYCENTER_FOR_2019_10_09, MERCURY_FOR_2019_10_09 } from '../tests/de440.testData';

const spkKernelCollections = [
    MERCURY_BARYCENTER_FOR_2019_10_09,
    MERCURY_FOR_2019_10_09
];

describe("DirectStateSolver", () => {

    it("should correctly compute state for multiple spk collections", () => {
        const directStateSolcer = new DirectStateSolver(spkKernelCollections);
        const state = directStateSolcer.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));
        expect(state).toEqual(new RectangularCoordinates(3376994.242698209, -59677665.17325123, -32381250.609176435));
    });

    it("should correctly compute state for multiple spk collections and opposite direction", () => {
        const directStateSolcer = new DirectStateSolver(spkKernelCollections, true);
        const state = directStateSolcer.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));
        expect(state).toEqual(new RectangularCoordinates(-3376994.242698209, 59677665.17325123, 32381250.609176435));
    });

});
