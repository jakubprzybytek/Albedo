package jp.astro.common;

public class AstronomicalCoordinates {

    /**
     * In degrees.
     */
    public double rightAscension;

    /**
     * In degrees.
     */
    public double declination;

    public AstronomicalCoordinates(double rightAscension, double declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }

    static public AstronomicalCoordinates fromDegrees(double rightAscensionInDegrees, double declinationInDegrees) {
        return new AstronomicalCoordinates(rightAscensionInDegrees, declinationInDegrees);
    }

    static public AstronomicalCoordinates fromRadians(double rightAscensionInRadians, double declinationInRadians) {
        return fromDegrees(Math.toDegrees(rightAscensionInRadians), Math.toDegrees(declinationInRadians));
    }

    @Override
    public String toString() {
        return format("[α=%dh%02dm%05.2fs (%f°), δ=%d°%02d'%04.1f\" (%f°)]");
    }

    public String toStringHighPrecision() {
        return format("[α=%dh%02dm%09.6fs (%.10f°), δ=%d°%02d'%08.5f\" (%.10f°)]");
    }

    private String format(String pattern) {
        double rightAscensionInHours = this.rightAscension / 15.0;
        double rightAscensionFractionInMinutes = (rightAscensionInHours - Math.floor(rightAscensionInHours)) * 60.0;
        double declinationAbs = Math.abs(this.declination);
        double declinationFractionInMinutes = (declinationAbs - Math.floor(declinationAbs)) * 60.0;
        return String.format(pattern,
                (int) rightAscensionInHours,
                (int) (rightAscensionFractionInMinutes),
                (rightAscensionFractionInMinutes - Math.floor(rightAscensionFractionInMinutes)) * 60,
                this.rightAscension,
                (int) this.declination,
                (int) (declinationFractionInMinutes),
                (declinationFractionInMinutes - Math.floor(declinationFractionInMinutes)) * 60,
                this.declination);
    }
}
