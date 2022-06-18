import { RectangularCoordinates } from "../../..";

export interface PositionAndVelocityCalculator {

    positionFor(ephemerisSeconds: number): RectangularCoordinates;

    velocityFor(ephemerisSeconds: number): RectangularCoordinates;

}
