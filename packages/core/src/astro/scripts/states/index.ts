import { State } from '@jpl/state/solver2';
import { RectangularCoordinates } from '@math';

export * from './States';

export type PositionInTime = {
  es: number,
  coords: RectangularCoordinates
}

export type StateInTime = State & {
  es: number,
}
