package jp.albedo.jpl.files.util;

public class EphemerisSeconds {

    private static final double J2000_EPOCH = 2451545.0;

    private static final double SECONDS_PER_JULIAN_DAY = 86400.0;

    public static double fromJde(double jde) {
        return (jde - J2000_EPOCH) * SECONDS_PER_JULIAN_DAY;
    }

}
