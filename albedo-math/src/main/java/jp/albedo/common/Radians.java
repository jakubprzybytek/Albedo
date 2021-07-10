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
     * @param arcMinutes
     * @param arcSeconds
     * @return
     */
    public static double fromDegrees(int degrees, int arcMinutes, double arcSeconds) {
        return degrees >= 0.0 ? Math.toRadians(degrees + arcMinutes / 60.0 + arcSeconds / 3600.0)
                : Math.toRadians(degrees - arcMinutes / 60.0 - arcSeconds / 3600.0);
    }

    /**
     * Angular separation over great circle.
     *
     * @param first  First coords.
     * @param second Second coords.
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

    /**
     * Computes angle between two vectors defined as RectangularCoordinates.
     *
     * @param first  First vector.
     * @param second Second vector.
     * @return Angle between two vectors in radians.
     */
    public static double between(RectangularCoordinates first, RectangularCoordinates second) {
        return Math.acos((first.x * second.x + first.y * second.y + first.z * second.z) / (first.length() * second.length()));
    }

    /**
     * Returns Position Angle of a body (RA1, Dec1) with respect to another body (RA2, Dec2)
     * <p>
     * Based on Jean Meeus: Astronomical Algorithms, chapter 'Angular Separation'
     *
     * @param first  Astronomical coordinates of first body.
     * @param second Astronomical coordinates of second body.
     * @return Position Angle in radians.
     */
    public static double positionAngle(AstronomicalCoordinates first, AstronomicalCoordinates second) {
//        final double tan = Math.sin(first.rightAscension - second.rightAscension) /
//              (Math.cos(second.declination) * Math.tan(first.declination) - Math.sin(second.declination) * Math.cos(first.rightAscension - second.rightAscension));
//        return Math.atan(tan);

        return Math.atan2(
                Math.sin(first.rightAscension - second.rightAscension),
                Math.cos(second.declination) * Math.tan(first.declination) - Math.sin(second.declination) * Math.cos(first.rightAscension - second.rightAscension));
    }

}
