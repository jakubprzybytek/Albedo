package jp.albedo.common;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

/**
 * Based on Jean Meeus' "Astronomical Algorithms", chapter 7 "Julian Day"
 */
public class JulianDay {

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
    public static double fromDateTime(int year, int month, double day, int hours, int minutes, double seconds) {
        if (month < 3) {
            month += 12;
            year--;
        }

        final int A = year / 100;
        final int B = 2 - A + A / 4;

        final double dayPart = (hours + (minutes + seconds / 60.0) / 60.0) / 24.0;

        return Math.floor(365.25 * (year + 4716.0)) + Math.floor(30.6001 * (month + 1.0)) + day + (double) B - 1524.5 + dayPart;
    }

    /**
     * Return date in Julian Days that represents the same time instant as Gregorian date provided as parameters.
     *
     * @param year  Gregorian year.
     * @param month Gregorian month. January is 1.
     * @param day   Gregorian day of the month.
     * @return Date in Julian Days.
     */
    public static double fromDate(int year, int month, double day) {
        return fromDateTime(year, month, day, 0, 0, 0.0);
    }

    /**
     * Return date in Julian Days that represents the same time instant as Gregorian date provided as parameters.
     *
     * @param date Gregorian date.
     * @return Date in Julian Days.
     */
    public static double fromDate(LocalDate date) {
        return fromDate(date.getYear(), date.getMonthValue(), date.getDayOfMonth());
    }

    /**
     * Return date in Julian Days that represents the same time instant as Gregorian date provided as parameters.
     *
     * @param dateTime Gregorian date time.
     * @return Date in Julian Days.
     */
    public static double fromDate(LocalDateTime dateTime) {
        return fromDateTime(dateTime.getYear(), dateTime.getMonthValue(), dateTime.getDayOfMonth(),
                dateTime.getHour(), dateTime.getMinute(), dateTime.getSecond());
    }

    public static List<Double> forRange(double jdFrom, double jdTo, double interval) {
        return DoubleStream.iterate(jdFrom, day -> day + interval)
                .limit((int) ((jdTo - jdFrom) / interval) + 1)
                .boxed()
                .collect(Collectors.toList());
    }

    /**
     * From: Jean Meeus' Astronomical Algorithms
     *
     * @param julianDay Date in Julian Days.
     * @return Gregorian date.
     */
    public static LocalDateTime toDateTime(double julianDay) {
        julianDay += 0.5;

        final int Z = (int) julianDay;
        double F = julianDay - Z;
        double A;

        if (Z < 2299161.0) {
            A = Z;
        } else {
            double alpha = Math.floor((Z - 1867216.25) / 36524.25);
            A = Z + 1.0 + alpha - Math.floor(alpha / 4.0);
        }

        final double B = A + 1524.0;
        final double C = Math.floor((B - 122.1) / 365.25);
        final double D = Math.floor(365.25 * C);
        final double E = Math.floor((B - D) / 30.6001);

        int month = (int) (E < 14.0 ? E - 1.0 : E - 13.0);
        int year = (int) (C - (month > 2 ? 4716.0 : 4715.0));
        int dayOfMonth = (int) (B - D - Math.floor(30.6001 * E));

        int hours = (int) Math.floor(F * 24.0);
        F = F * 24.0 - hours;
        int minutes = (int) Math.floor(F * 60.0);
        F = F * 60.0 - minutes;
        int seconds = (int) Math.rint(F * 60.0);

        // FixMe: Correct up to years
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes == 60) {
            minutes = 0;
            hours++;
        }
        if (hours == 24) {
            hours = 0;
            dayOfMonth++;
        }

        return LocalDateTime.of(
                year, month, dayOfMonth,
                hours, minutes, seconds);
    }

}
