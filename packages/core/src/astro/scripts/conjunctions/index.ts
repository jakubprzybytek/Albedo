import { AstronomicalCoordinates } from "@astro/coords";
import { JplBody } from "@jpl";

export * from './Conjunctions';

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
