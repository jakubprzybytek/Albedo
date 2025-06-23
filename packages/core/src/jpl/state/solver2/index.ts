import { RectangularCoordinates } from '@astro/coords';

export * from './StateSolver';

export enum CorrectionType2 {
  NONE = 'NONE',
  LIGHT_TIME = 'LT',
  LIGHT_TIME_AND_STAR_ABBERATION = 'LT+S'
};

export function stringToCorrectionType(correctionString: string): CorrectionType2 | undefined {
  const correction = correctionString as CorrectionType2;
  return Object.values(CorrectionType2).some(correctionEnum => correctionEnum === correction) ? correction : undefined;
}

export type State = {
  position: RectangularCoordinates;
  lightTime?: number;
};
