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
        const directStateSolcer = new LightTimeCorrectingStateSolver(spkKernelCollectionsForVenus, spkKernelCollectionsForEarth);
        const position = directStateSolcer.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));
        //const velocity = directStateSolcer.velocityFor(EphemerisSeconds.fromDate(2019, 10, 9));

        const positionDelta = position.subtract(new RectangularCoordinates(-212496177.30534464, -114080326.47248125, -46424486.90050933));
        //const velocityDelta = velocity.subtract(new RectangularCoordinates(-8.28800013, 26.26862274, 11.38875394));

        console.log(`Position error: ${positionDelta.length()}`);
        //console.log(`Velocity error: ${velocityDelta.length()}`);

        expect(positionDelta.length()).toBeLessThan(6e-8);
        //expect(velocityDelta.length()).toBeLessThan(1e-8);
    });

});
