import { OpenNgcObject } from "@openNgc";
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

export type ConjunctionDso = {
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
