import { JulianDay } from "../math";

export class EphemerisSeconds {

    private static J2000_EPOCH = 2451545.0;

    private static SECONDS_PER_JULIAN_DAY = 86400.0;

    static fromDate(year: number, month: number, day: number): number {
        return EphemerisSeconds.fromJde(JulianDay.fromDate(year, month, day));
    }

    static fromJde(jde: number): number {
        return (jde - EphemerisSeconds.J2000_EPOCH) * EphemerisSeconds.SECONDS_PER_JULIAN_DAY;
    }

    static toJde(ephemerisSeconds: number): number {
        return ephemerisSeconds / EphemerisSeconds.SECONDS_PER_JULIAN_DAY + EphemerisSeconds.J2000_EPOCH;
    }

}
