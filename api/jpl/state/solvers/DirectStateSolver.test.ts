import { describe, it, expect } from "vitest";
import { RectangularCoordinates } from "../../../math";
import { EphemerisSeconds } from '../..';
import { DirectStateSolver } from './';
import { a_3_wrt_0, a_399_wrt_3 } from '../../data/de440.testData';

const spkKernelCollections = [
    a_3_wrt_0,
    a_399_wrt_3
];

describe("DirectStateSolver", () => {

    it("should correctly compute state for multiple spk collections", () => {
        const directStateSolcer = new DirectStateSolver(spkKernelCollections);
        const position = directStateSolcer.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));
        const velocity = directStateSolcer.velocityFor(EphemerisSeconds.fromDate(2019, 10, 9));

        const positionDelta = position.subtract(new RectangularCoordinates(143811325.04688266, 36856589.50987644, 15977853.64250682));
        const velocityDelta = velocity.subtract(new RectangularCoordinates(-8.28800013, 26.26862274, 11.38875394));

        console.log(`Position error: ${positionDelta.length()}`);
        console.log(`Velocity error: ${velocityDelta.length()}`);

        expect(positionDelta.length()).toBeLessThan(3e-8);
        expect(velocityDelta.length()).toBeLessThan(1e-8);
    });

    it("should correctly compute state for multiple spk collections and opposite direction", () => {
        const directStateSolcer = new DirectStateSolver(spkKernelCollections, true);
        const position = directStateSolcer.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));
        const velocity = directStateSolcer.velocityFor(EphemerisSeconds.fromDate(2019, 10, 9));

        const positionDelta = position.subtract(new RectangularCoordinates(-143811325.04688266, -36856589.50987644, -15977853.64250682));
        const velocityDelta = velocity.subtract(new RectangularCoordinates(8.28800013, -26.26862274, -11.38875394));

        console.log(`Position error: ${positionDelta.length()}`);
        console.log(`Velocity error: ${velocityDelta.length()}`);

        expect(positionDelta.length()).toBeLessThan(3e-8);
        expect(velocityDelta.length()).toBeLessThan(1e-8);
    });

});
