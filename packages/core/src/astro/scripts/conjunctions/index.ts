import { DetailedCoordinates } from "../ephemeris";
import { JplBody } from "@jpl";

export * from './Conjunctions';

export type Conjunction = {
  es: number;
  jde: number;
  tde: Date;
  firstBody: {
    info: JplBody;
    ephemeris: DetailedCoordinates;
  }
  secondBody: {
    info: JplBody;
    ephemeris: DetailedCoordinates;
  }
  separation: number;
};
