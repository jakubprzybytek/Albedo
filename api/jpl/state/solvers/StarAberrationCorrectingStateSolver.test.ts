import { describe, it, expect } from "vitest";
import { RectangularCoordinates } from "../../../math";
import { EphemerisSeconds } from '../..';
import { LightTimeCorrectingStateSolver, StarAberrationCorrectingStateSolver } from '.';
import { a_2_wrt_0, a_299_wrt_2, a_3_wrt_0, a_399_wrt_3 } from '../../data/de440.testData';

const spkKernelCollectionsForVenus = [
    a_2_wrt_0,
    a_299_wrt_2
];

const spkKernelCollectionsForEarth = [
    a_3_wrt_0,
    a_399_wrt_3
];

describe("StarAberrationCorrectingStateSolver", () => {

    it("should correctly position", () => {
        const stateSolverForVenus = new LightTimeCorrectingStateSolver(spkKernelCollectionsForVenus, spkKernelCollectionsForEarth);
        const stateSolver = new StarAberrationCorrectingStateSolver(stateSolverForVenus, spkKernelCollectionsForEarth);
        const position = stateSolver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        const positionDelta = position.subtract(new RectangularCoordinates(-212508057.97494290, -114061538.40538892, -46416268.63226115));

        console.log(`StarAberrationCorrectingStateSolver position error: ${positionDelta.length()}`);

        expect(positionDelta.length()).toBeLessThan(3e-7);
    });

});
