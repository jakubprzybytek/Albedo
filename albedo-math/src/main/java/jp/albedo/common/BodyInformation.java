package jp.albedo.common;

public enum BodyInformation {

    Sun(695700.0, 695700.0, 4.83),
    Mercury(2439.7, 2439.7),
    Venus(6051.8, 6051.8),
    Earth(6378.1, 6356.8),
    Moon(1738.1, 1736.0),
    Mars(3396.2, 3376.2),
    Jupiter(71492.0, 66854.0),
    Saturn(60268.0, 54364.0),
    Neptune(24764.0, 24341.0),
    Uranus(25559, 24973.0);

    public final double equatorialRadius;

    public final double polarRadius;

    public final Double absoluteMagnitude;

    BodyInformation(double equatorialRadius, double polarRadius, Double absoluteMagnitude) {
        this.equatorialRadius = equatorialRadius;
        this.polarRadius = polarRadius;
        this.absoluteMagnitude = absoluteMagnitude;
    }

    BodyInformation(double equatorialRadius, double polarRadius) {
        this(equatorialRadius, polarRadius, null);
    }

}
