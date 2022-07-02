import { RectangularCoordinates } from "../../../math";

export interface PositionAndVelocityCalculator {

    positionFor(ephemerisSeconds: number): RectangularCoordinates;

    velocityFor(ephemerisSeconds: number): RectangularCoordinates;

}
