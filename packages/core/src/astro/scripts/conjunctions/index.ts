import { AstronomicalCoordinates } from "@math";
import { JplBody } from "@jpl";

export * from './Conjunctions2';

export type Conjunction2 = {
  es: number;
  jde: number;
  tde: Date;
  firstBody: {
    info: JplBody;
    coords: AstronomicalCoordinates;
  }
  secondBody: {
    info: JplBody;
    coords: AstronomicalCoordinates;
  }
  separation: number;
};
