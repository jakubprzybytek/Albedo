package jp.astro.common;

public class AstronomicalCoordinates {

    public double rightAscension;

    public double declination;

    public AstronomicalCoordinates(double rightAscension, double declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }

    static public AstronomicalCoordinates fromDegreeses(double rightAscensionInDegrees, double declinationInDegrees) {
        return new AstronomicalCoordinates(rightAscensionInDegrees / 15.0, declinationInDegrees);
    }

    static public AstronomicalCoordinates fromRadians(double rightAscensionInRadians, double declinationInRadians) {
        return fromDegreeses(Math.toDegrees(rightAscensionInRadians), Math.toDegrees(declinationInRadians));
    }

    @Override
    public String toString() {
        double rightAscensionFractionInMinutes = (this.rightAscension - Math.floor(this.rightAscension)) * 60.0;
        double declinationAbs = Math.abs(this.declination);
        double declinationFractionInMinutes = (declinationAbs - Math.floor(declinationAbs)) * 60.0;
        return String.format("[α=%dh%02dm%05.2fs (%fh), δ=%d°%02d'%05.2f\" (%f°)]",
                (int) this.rightAscension,
                (int) (rightAscensionFractionInMinutes),
                (rightAscensionFractionInMinutes - Math.floor(rightAscensionFractionInMinutes)) * 60,
                this.rightAscension,
                (int) this.declination,
                (int) (declinationFractionInMinutes),
                (declinationFractionInMinutes - Math.floor(declinationFractionInMinutes)) * 60,
                this.declination);
    }
}
