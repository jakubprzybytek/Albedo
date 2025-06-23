import { RectangularCoordinates } from '@astro/coords';
import { StateInTime } from '@astro/scripts';

export type StateResult = StateInTime & {
  jde: number;
  tde: Date;
  distance: number;
  distanceAU: number;
  velocity: RectangularCoordinates;
}

/**
 * @deprecated The method should not be used
 */
export type StateWithPosition = {
  es: number;
  jde: number;
  tde: Date;
  position: RectangularCoordinates;
}

/**
 * @deprecated The method should not be used
 */
export type StateWithPositionAndVelocity = StateWithPosition & {
  velocity: RectangularCoordinates;
}
