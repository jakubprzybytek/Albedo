package jp.albedo.common;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

public class JulianDate {

    static public double fromDate(int year, int month, double day) {
        if (month < 3) {
            month += 12;
            year--;
        }

        final int A = year / 100;
        final int B = 2 - A + A / 4;

        return Math.floor(365.25 * (year + 4716.0)) + Math.floor(30.6001 * (month + 1.0)) + day + (double) B - 1524.5;
    }

    static public List<Double> forRange(double jdFrom, double jdTo, double interval) {
        return DoubleStream.iterate(jdFrom, day -> day <= jdTo, day -> day + interval).boxed().collect(Collectors.toList());
    }

}
