import { RectangularCoordinates } from '../..';

export interface StateSolver {

    /**
     * Computes X, Y, Z position coordinates for given time provided as Ephemeris Seconds.
     * @param ephemerisSeconds Time in Ephemeris Seconds.
     * @return Rectangular coordinates for position.
     */
    positionFor(ephemerisSeconds: number): RectangularCoordinates;

    /**
     * Computes velocity as X, Y, Z coordinates for given time provided as Ephemeris Seconds.
     * @param ephemerisSeconds Time in Ephemeris Seconds.
     * @return Rectangular coordinates for velocity.
     */
    velocityFor(ephemerisSeconds: number): RectangularCoordinates;

}
