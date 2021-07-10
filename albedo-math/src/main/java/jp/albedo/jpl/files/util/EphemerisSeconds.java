package jp.albedo.jpl.files.util;

import jp.albedo.common.JulianDay;

public class EphemerisSeconds {

    private static final double J2000_EPOCH = 2451545.0;

    private static final double SECONDS_PER_JULIAN_DAY = 86400.0;

    public static double fromDate(int year, int month, double day) {
        return fromJde(JulianDay.fromDate(year, month, day));
    }

    public static double fromJde(double jde) {
        return (jde - J2000_EPOCH) * SECONDS_PER_JULIAN_DAY;
    }

    public static double toJde(double ephemerisSeconds) {
        return ephemerisSeconds / SECONDS_PER_JULIAN_DAY + J2000_EPOCH;
    }

}
