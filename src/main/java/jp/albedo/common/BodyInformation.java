package jp.albedo.common;

public class BodyInformation {

    public static BodyInformation MERCURY = new BodyInformation(2439.7, 2439.7);

    public static BodyInformation VENUS = new BodyInformation(6051.8, 6051.8);

    public static BodyInformation EARTH = new BodyInformation(6378.1, 6356.8);

    public static BodyInformation MARS = new BodyInformation(3396.2, 3376.2);

    public static BodyInformation JUPITER = new BodyInformation(71492.0, 66854.0);

    public static BodyInformation SATURN = new BodyInformation(60268.0, 54364.0);

    public static BodyInformation NEPTUNE = new BodyInformation(24764.0, 24341.0);

    public static BodyInformation URANUS = new BodyInformation(25559, 24973.0);

    public final double equatorialRadius;

    public final double polarRadius;

    private BodyInformation(double equatorialRadius, double polarRadius) {
        this.equatorialRadius = equatorialRadius;
        this.polarRadius = polarRadius;
    }

    public static BodyInformation getByName(String bodyName) {
        switch (bodyName) {
            case "Mercury":
                return MERCURY;
            case "Venus":
                return VENUS;
            case "Earth":
                return EARTH;
            case "Mars":
                return MARS;
            case "Jupiter":
                return JUPITER;
            case "Saturn":
                return SATURN;
            case "Neptune":
                return NEPTUNE;
            case "Uranus":
                return URANUS;
        }

        throw new RuntimeException("Unknown body name: " + bodyName);
    }

}
