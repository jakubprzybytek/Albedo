import { RectangularCoordinates } from '@astro/coords';

export type StateWithPosition = {
  es: number;
  jde: number;
  tde: Date;
  position: RectangularCoordinates;
}

export type StateWithPositionAndVelocity = StateWithPosition & {
  velocity: RectangularCoordinates;
}
