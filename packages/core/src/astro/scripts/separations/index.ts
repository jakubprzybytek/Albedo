import { RectangularCoordinates } from "@math";

export * from './Separations';

export type Separation2 = {
  es: number;
  separation: number;
};

export type SeparationWithPositions = Separation2 | {
  firstBodyPosition: RectangularCoordinates;
  secondBodyPosition: RectangularCoordinates;
};
