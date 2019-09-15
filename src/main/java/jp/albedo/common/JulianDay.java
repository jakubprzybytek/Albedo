package jp.albedo.common;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

public class JulianDay {

    /**
     * From: Jean Meeus' Astronomical Algorithms
     *
     * @param year
     * @param month
     * @param day
     * @return
     */
    public static double fromDate(int year, int month, double day) {
        if (month < 3) {
            month += 12;
            year--;
        }

        final int A = year / 100;
        final int B = 2 - A + A / 4;

        return Math.floor(365.25 * (year + 4716.0)) + Math.floor(30.6001 * (month + 1.0)) + day + (double) B - 1524.5;
    }

    public static List<Double> forRange(double jdFrom, double jdTo, double interval) {
        return DoubleStream.iterate(jdFrom, day -> day <= jdTo, day -> day + interval).boxed().collect(Collectors.toList());
    }

    /**
     * From: Jean Meeus' Astronomical Algorithms
     *
     * @param julianDay
     * @return
     */
    public static LocalDateTime toDateTime(double julianDay) {
        julianDay += 0.5;

        int Z = (int) julianDay;
        double F = julianDay - Z;
        double A;

        if (Z < 2299161.0) {
            A = Z;
        } else {
            double alpha = Math.floor((Z - 1867216.25) / 36524.25);
            A = Z + 1.0 + alpha - Math.floor(alpha / 4.0);
        }

        double B = A + 1524.0;
        double C = Math.floor((B - 122.1) / 365.25);
        double D = Math.floor(365.25 * C);
        double E = Math.floor((B - D) / 30.6001);

        int month = (int) (E < 14.0 ? E - 1.0 : E - 13.0);
        double hours = F * 24.0;
        F = F * 24.0 - Math.floor(hours);
        double minutes = F * 60.0;
        F = F * 60.0 - Math.floor(minutes);

        return LocalDateTime.of(
                (int) (C - (month > 2 ? 4716.0 : 4715.0)),
                month,
                (int) (B - D - Math.floor(30.6001 * E)),
                (int) hours, (int) minutes, (int) Math.rint(F * 60.0));
    }

}
