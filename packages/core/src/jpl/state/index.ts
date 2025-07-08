import { RectangularCoordinates } from "@astro/coords";

export { StateSolver2 } from "./solver2/StateSolver";

export type State = {
  position: RectangularCoordinates;
  velocity: RectangularCoordinates;
  lightTime?: number;
};

export enum CorrectionType2 {
  NONE = 'NONE',
  LIGHT_TIME = 'LT',
  CONVERGED_NEWTONIAN_LIGHT_TIME = 'CN',
  LIGHT_TIME_AND_STAR_ABBERATION = 'LT+S'
};

export function stringToCorrectionType(correctionString: string): CorrectionType2 | undefined {
  const correction = correctionString as CorrectionType2;
  return Object.values(CorrectionType2).some(correctionEnum => correctionEnum === correction) ? correction : undefined;
}
