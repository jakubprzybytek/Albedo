package jp.albedo.common;

public class AstronomicalCoordinates {

    /**
     * In radians.
     */
    public double rightAscension;

    /**
     * In radians.
     */
    public double declination;

    public AstronomicalCoordinates(double rightAscension, double declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }

    static public AstronomicalCoordinates fromDegrees(double rightAscensionInDegrees, double declinationInDegrees) {
        return new AstronomicalCoordinates(Math.toRadians(rightAscensionInDegrees), Math.toRadians(declinationInDegrees));
    }

    @Override
    public String toString() {
        return format("[α=%dh%02dm%05.2fs (%f°), δ=%d°%02d'%04.1f\" (%f°)]");
    }

    public String toStringHighPrecision() {
        return format("[α=%dh%02dm%09.6fs (%.10f°), δ=%d°%02d'%08.5f\" (%.10f°)]");
    }

    private String format(String pattern) {
        final double rightAscensionInHours = Math.toDegrees(this.rightAscension) / 15.0;
        final double rightAscensionFractionInMinutes = (rightAscensionInHours - Math.floor(rightAscensionInHours)) * 60.0;
        final double declinationInDegrees = Math.toDegrees(this.declination);
        final double declinationAbs = Math.abs(declinationInDegrees);
        final double declinationFractionInMinutes = (declinationAbs - Math.floor(declinationAbs)) * 60.0;
        return String.format(pattern,
                (int) rightAscensionInHours,
                (int) (rightAscensionFractionInMinutes),
                (rightAscensionFractionInMinutes - Math.floor(rightAscensionFractionInMinutes)) * 60,
                Math.toDegrees(this.rightAscension),
                (int) declinationInDegrees,
                (int) (declinationFractionInMinutes),
                (declinationFractionInMinutes - Math.floor(declinationFractionInMinutes)) * 60,
                declinationInDegrees);
    }
}
