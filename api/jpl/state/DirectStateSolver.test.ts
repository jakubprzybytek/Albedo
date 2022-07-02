import { describe, it, expect } from "vitest";
import { RectangularCoordinates } from "../../math";
import { EphemerisSeconds } from '..';
import { DirectStateSolver } from './';
import { EARTH_MOON_BARYCENTER_FOR_2019_10_09, EARTH_FOR_2019_10_09 } from '../tests/de440.testData';

const spkKernelCollections = [
    EARTH_MOON_BARYCENTER_FOR_2019_10_09,
    EARTH_FOR_2019_10_09
];

describe("DirectStateSolver", () => {

    it("should correctly compute state for multiple spk collections", () => {
        const directStateSolcer = new DirectStateSolver(spkKernelCollections);
        const state = directStateSolcer.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));
        expect(state).toEqual(new RectangularCoordinates(143810364.72360718, 36854660.62309639, 15977150.040510522));
    });

    it("should correctly compute state for multiple spk collections and opposite direction", () => {
        const directStateSolcer = new DirectStateSolver(spkKernelCollections, true);
        const state = directStateSolcer.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));
        expect(state).toEqual(new RectangularCoordinates(-143810364.72360718, -36854660.62309639, -15977150.040510522));
    });

});
