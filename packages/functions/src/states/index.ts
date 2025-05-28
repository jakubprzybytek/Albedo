import { RectangularCoordinates } from '@astro/coords';

export type StateWithPosition = {
  jde: number;
  ephemerisSeconds: number;
  tde: Date;
  position: RectangularCoordinates;
}

export type StateWithPositionAndVelocity = StateWithPosition & {
  velocity: RectangularCoordinates;
}
