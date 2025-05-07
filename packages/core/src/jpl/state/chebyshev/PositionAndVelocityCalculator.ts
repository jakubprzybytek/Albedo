import { RectangularCoordinates } from "../../../astro/coords";

export interface PositionAndVelocityCalculator {

    positionFor(ephemerisSeconds: number): RectangularCoordinates;

    velocityFor(ephemerisSeconds: number): RectangularCoordinates;

}
