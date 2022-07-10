import { RectangularCoordinates } from '../../math';

export type State = {
    jde: number;
    ephemerisSeconds: number;
    tde: Date;
    position: RectangularCoordinates;
    velocity: RectangularCoordinates;
}
