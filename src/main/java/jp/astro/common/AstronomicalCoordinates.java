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

    @Override
    public String toString() {
        double rightAscensionFractionInMinutes = (this.rightAscension - Math.floor(this.rightAscension)) * 60.0;
        double declinationFractionInMinutes = (this.declination - Math.floor(this.declination)) * 60.0;
        return String.format("[α=%dh%02dm%.2fs (%fh), δ=%d°%02d'%.2f\" (%f°)]",
                (int)this.rightAscension,
                (int)(rightAscensionFractionInMinutes),
                (rightAscensionFractionInMinutes - Math.floor(rightAscensionFractionInMinutes)) * 60,
                this.rightAscension,
                (int)this.declination,
                (int)(declinationFractionInMinutes),
                (declinationFractionInMinutes - Math.floor(declinationFractionInMinutes)) * 60,
                this.declination);
    }
}
