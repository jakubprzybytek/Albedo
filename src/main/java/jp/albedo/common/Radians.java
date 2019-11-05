package jp.albedo.common;

public class Radians {

    /**
     * Returns radians from hour angle.
     *
     * @param hours
     * @param minutes
     * @param seconds
     * @return
     */
    public static double fromHours(int hours, int minutes, double seconds) {
        return Math.toRadians((hours + minutes / 60.0 + (seconds / 3600.0)) * 15.0);
    }

    /**
     * Returns radians from degrees, arc minutes and arc seconds.
     *
     * @param degrees
     * @param minutes
     * @param seconds
     * @return
     */
    public static double fromDegrees(int degrees, int minutes, double seconds) {
        return degrees >= 0.0 ? Math.toRadians(degrees + minutes / 60.0 + seconds / 3600.0)
                : Math.toRadians(degrees - minutes / 60.0 - seconds / 3600.0);
    }

    /**
     * Angular separation over great circle.
     *
     * @param first
     * @param second
     * @return Separation in radians.
     */
    public static double separation(AstronomicalCoordinates first, AstronomicalCoordinates second) {
        final double x = Math.cos(first.declination) * Math.sin(second.declination)
                - Math.sin(first.declination) * Math.cos(second.declination) * Math.cos(second.rightAscension - first.rightAscension);
        final double y = Math.cos(second.declination) * Math.sin(second.rightAscension - first.rightAscension);
        final double z = Math.sin(first.declination) * Math.sin(second.declination)
                + Math.cos(first.declination) * Math.cos(second.declination) * Math.cos(second.rightAscension - first.rightAscension);
        return Math.atan2(Math.sqrt(x * x + y * y), z);
    }

}
