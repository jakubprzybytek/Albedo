import { DetailedCoordinates } from "@astro/scripts";

export enum EclipseType {
  SunEclipse = 'SunEclipse',
  MoonEclipse = 'MoonEclipse'
}

export type CommonEclipseProperties = {
  readonly es: number;
  readonly jde: number;
  readonly tde: Date;
  readonly separation: number;
}

export type SunEclipse = {
  readonly type: EclipseType.SunEclipse;
  readonly sunEphemeris: DetailedCoordinates;
  readonly moonEphemeris: DetailedCoordinates;
}

export type MoonEclipse = {
  readonly type: EclipseType.MoonEclipse;
  readonly sunEphemeris: DetailedCoordinates;
  readonly moonShadowEphemeris: DetailedCoordinates;
}

export type Eclipse = (SunEclipse | MoonEclipse) & CommonEclipseProperties;
