import { AstronomicalCoordinates } from "@astro/coords";
import { DetailedCoordinates } from "@astro/scripts";

export enum EclipseType {
  SunEclipse = 'SunEclipse',
  MoonEclipse = 'MoonEclipse'
}

export type EarthShadowCoordinates = {
  coords: AstronomicalCoordinates;
  umbraAngularSize: number;
  penumbraAngularSize: number;
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
} & CommonEclipseProperties;

export type MoonEclipse = {
  readonly type: EclipseType.MoonEclipse;
  readonly moonEphemeris: DetailedCoordinates;
  readonly earthShadowEphemeris: EarthShadowCoordinates;
} & CommonEclipseProperties;

export type Eclipse = SunEclipse | MoonEclipse;
