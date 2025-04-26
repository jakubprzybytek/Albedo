import { describe, it, expect } from "vitest";
import { RectangularCoordinates } from "../../../math";
import { EphemerisSeconds } from '../..';
import { LightTimeCorrectingStateSolver } from '.';
import { a_2_wrt_0, a_299_wrt_2, a_3_wrt_0, a_399_wrt_3 } from '../../data/de440.testData';

const spkKernelCollectionsForVenus = [
    a_2_wrt_0,
    a_299_wrt_2
];

const spkKernelCollectionsForEarth = [
    a_3_wrt_0,
    a_399_wrt_3
];

describe("LightTimeCorrectingStateSolver", () => {

    it("should correctly compute state for multiple spk collections", () => {
        const stateSolver = new LightTimeCorrectingStateSolver(spkKernelCollectionsForVenus, spkKernelCollectionsForEarth);
        const position = stateSolver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        const positionDelta = position.subtract(new RectangularCoordinates(-212496177.30534464, -114080326.47248125, -46424486.90050933));

        console.log(`LightTimeCorrectingStateSolver position error: ${positionDelta.length()}`);

        expect(positionDelta.length()).toBeLessThan(6e-8);
    });

});
