import { JulianDay } from "@astro/JulianDay";
import { EphemerisSeconds } from "@jpl";

export type TimeProperties = {
  es: number;
  jde: number;
  tde: Date;
}

export function timeProperties(es: number): TimeProperties {
  const jde = EphemerisSeconds.toJde(es);
  return {
    es,
    jde,
    tde: JulianDay.toDateTime(jde),
  };
}