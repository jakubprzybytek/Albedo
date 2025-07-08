import { RectangularCoordinates } from "@astro/coords";

export { StateSolver } from "./solver2/StateSolver";

export type State = {
  position: RectangularCoordinates;
  velocity: RectangularCoordinates;
  lightTime?: number;
};

export enum CorrectionType {
  NONE = 'NONE',
  LIGHT_TIME = 'LT',
  CONVERGED_NEWTONIAN_LIGHT_TIME = 'CN',
  LIGHT_TIME_AND_STAR_ABBERATION = 'LT+S'
};

export function stringToCorrectionType(correctionString: string): CorrectionType | undefined {
  const correction = correctionString as CorrectionType;
  return Object.values(CorrectionType).some(correctionEnum => correctionEnum === correction) ? correction : undefined;
}
