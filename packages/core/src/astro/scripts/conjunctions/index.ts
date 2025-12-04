import { OpenNgcObject } from "@openNgc";
import { DetailedCoordinates } from "../ephemeris";
import { JplBody } from "@jpl";

export * from './Conjunctions';
export * from './ConjunctionsWithDso';

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

export type DsoConjunction = {
  es: number;
  jde: number;
  tde: Date;
  body: {
    info: JplBody;
    ephemeris: DetailedCoordinates;
  }
  dso: OpenNgcObject;
  separation: number;
};
