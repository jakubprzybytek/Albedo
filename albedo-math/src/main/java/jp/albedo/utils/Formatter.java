package jp.albedo.utils;

import java.util.function.Function;

public class Formatter {

    public static Function<Double, String> HOUR_ANGLE = (angle) -> formatAngle("%dh%02dm%05.2fs", angle / 15.0);

    public static Function<Double, String> HOUR_ANGLE_HIGH_RESOLUTION = (angle) -> formatAngle("%dh%02dm%09.6fs", angle / 15.0);

    public static Function<Double, String> SECONDS = (angle) -> String.format("%.2fs", Math.toDegrees(angle / 15.0) * 3600.0);

    public static Function<Double, String> DEGREES = (angle) -> formatAngle("%d°%02d'%04.1f\"", angle);

    public static Function<Double, String> DEGREES_HIGH_RESOLUTION = (angle) -> formatAngle("%d°%02d'%08.5f\"", angle);

    public static Function<Double, String> ARCSECONDS = (angle) -> String.format("%.1f\"", Math.toDegrees(angle) * 3600.0);

    private static String formatAngle(String format, double angle) {
        final double degrees = Math.toDegrees(angle);
        final double degreesAbs = Math.abs(degrees);
        final double angleFractionInMinutes = (degreesAbs - Math.floor(degreesAbs)) * 60.0;
        return String.format(format,
                (int) degrees,
                (int) (angleFractionInMinutes),
                (angleFractionInMinutes - Math.floor(angleFractionInMinutes)) * 60);
    }
}
