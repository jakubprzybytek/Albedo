import { JulianDay } from "@astro";

export class EphemerisSeconds {

    private static J2000_EPOCH = 2451545.0;

    private static SECONDS_PER_JULIAN_DAY = 86400.0;

    static fromDate(year: number, month: number, day: number): number {
        return EphemerisSeconds.fromJde(JulianDay.fromDate(year, month, day));
    }

    static fromDateTime(year: number, month: number, day: number, hours: number, minutes: number, seconds: number): number {
        const es = EphemerisSeconds.fromDate(year, month, day);
        return es + (hours * 3600 + minutes * 60 + seconds);
    }

    static fromDateTimeObject(tbd: Date): number {
        return EphemerisSeconds.fromDateTime(tbd.getUTCFullYear(), tbd.getUTCMonth() + 1, tbd.getUTCDate(), tbd.getUTCHours(), tbd.getUTCMinutes(), tbd.getUTCSeconds());
    }

    static fromJde(jde: number): number {
        return (jde - EphemerisSeconds.J2000_EPOCH) * EphemerisSeconds.SECONDS_PER_JULIAN_DAY;
    }

    static toJde(ephemerisSeconds: number): number {
        return ephemerisSeconds / EphemerisSeconds.SECONDS_PER_JULIAN_DAY + EphemerisSeconds.J2000_EPOCH;
    }

    static fromDays(days: number): number {
        return days * this.SECONDS_PER_JULIAN_DAY;
    }

    static toDays(es: number): number {
        return es / this.SECONDS_PER_JULIAN_DAY;
    }

    static forRange(fromEs: number, toEs: number, interval: number): number[] {
        const esArray: number[] = [];
        let currentEs = fromEs;
        while (currentEs <= toEs) {
            esArray.push(currentEs);
            currentEs += interval;
        }
        return esArray;
    }
}
