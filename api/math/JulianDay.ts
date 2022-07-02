/**
 * Based on Jean Meeus' "Astronomical Algorithms", chapter 7 "Julian Day"
 */
export class JulianDay {

    /**
     * Return date in Julian Days that represents the same time instant as Gregorian date provided as parameters.
     *
     * @param year    Gregorian year.
     * @param month   Gregorian month. January is 1.
     * @param day     Gregorian day of the month.
     * @param hours   Hours.
     * @param minutes Minutes.
     * @param seconds Seconds.
     * @return Date in Julian Days.
     */
    static fromDateTime(year: number, month: number, day: number, hours: number, minutes: number, seconds: number): number {
        if (month < 3) {
            month += 12;
            year--;
        }

        const A = Math.floor(year / 100);
        const B = Math.floor(2 - A + A / 4);

        const dayPart = (hours + (minutes + seconds / 60.0) / 60.0) / 24.0;

        return Math.floor(365.25 * (year + 4716.0)) + Math.floor(30.6001 * (month + 1.0)) + day + B - 1524.5 + dayPart;
    }

    /**
     * Return date in Julian Days that represents the same time instant as Gregorian date provided as parameters.
     *
     * @param year  Gregorian year.
     * @param month Gregorian month. January is 1.
     * @param day   Gregorian day of the month.
     * @return Date in Julian Days.
     */
    static fromDate(year: number, month: number, day: number): number {
        return JulianDay.fromDateTime(year, month, day, 0, 0, 0.0);
    }

    static fromDateObject(date: Date): number {
        return this.fromDate(date.getFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    }

    static forRange(jdFrom: number, jdTo: number, interval: number): number[] {
        const julianDays: number[] = [];
        let currentJd = jdFrom;
        while (currentJd < jdTo) {
            julianDays.push(currentJd);
            currentJd += interval;
        }
        return julianDays;
    }

    // /**
    //  * From: Jean Meeus' Astronomical Algorithms
    //  *
    //  * @param julianDay Date in Julian Days.
    //  * @return Gregorian date.
    //  */
    // public static LocalDateTime toDateTime(double julianDay) {
    //     julianDay += 0.5;

    //     final int Z = (int) julianDay;
    //     double F = julianDay - Z;
    //     double A;

    //     if (Z < 2299161.0) {
    //         A = Z;
    //     } else {
    //         double alpha = Math.floor((Z - 1867216.25) / 36524.25);
    //         A = Z + 1.0 + alpha - Math.floor(alpha / 4.0);
    //     }

    //     final double B = A + 1524.0;
    //     final double C = Math.floor((B - 122.1) / 365.25);
    //     final double D = Math.floor(365.25 * C);
    //     final double E = Math.floor((B - D) / 30.6001);

    //     int month = (int) (E < 14.0 ? E - 1.0 : E - 13.0);
    //     int year = (int) (C - (month > 2 ? 4716.0 : 4715.0));
    //     int dayOfMonth = (int) (B - D - Math.floor(30.6001 * E));

    //     int hours = (int) Math.floor(F * 24.0);
    //     F = F * 24.0 - hours;
    //     int minutes = (int) Math.floor(F * 60.0);
    //     F = F * 60.0 - minutes;
    //     int seconds = (int) Math.rint(F * 60.0);

    //     // FixMe: Correct up to years
    //     if (seconds == 60) {
    //         seconds = 0;
    //         minutes++;
    //     }
    //     if (minutes == 60) {
    //         minutes = 0;
    //         hours++;
    //     }
    //     if (hours == 24) {
    //         hours = 0;
    //         dayOfMonth++;
    //     }

    //     return LocalDateTime.of(
    //             year, month, dayOfMonth,
    //             hours, minutes, seconds);
    // }

}
