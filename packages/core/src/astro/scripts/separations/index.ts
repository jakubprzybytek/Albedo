import { RectangularCoordinates } from "@math";

export * from './Separations';

export type Separation = {
  es: number;
  separation: number;
};

export type SeparationWithPositions = Separation | {
  firstBodyPosition: RectangularCoordinates;
  secondBodyPosition: RectangularCoordinates;
};
