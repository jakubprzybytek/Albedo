package jp.albedo.utils;

import java.util.function.Function;

public class Formatter {

    public static Function<Double, String> HOUR_ANGLE = (angle) -> {
        final double angleInHours = Math.toDegrees(angle) / 15.0;
        final double angleFractionInMinutes = (angleInHours - Math.floor(angleInHours)) * 60.0;
        return String.format("%dh%02dm%05.2fs",
                (int) angleInHours,
                (int) (angleFractionInMinutes),
                (angleFractionInMinutes - Math.floor(angleFractionInMinutes)) * 60);
    };

    public static Function<Double, String> DEGREES = (angle) -> {
        final double degrees = Math.toDegrees(angle);
        final double angleFractionInMinutes = (degrees - Math.floor(degrees)) * 60.0;
        return String.format("%d°%02d'%04.1f",
                (int) degrees,
                (int) (angleFractionInMinutes),
                (angleFractionInMinutes - Math.floor(angleFractionInMinutes)) * 60);
    };

}
