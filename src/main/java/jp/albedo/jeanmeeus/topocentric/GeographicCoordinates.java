package jp.albedo.jeanmeeus.topocentric;

/**
 * Class representing geographic coordinates. Applies for example for the observer on the surface of Earth.
 */
public class GeographicCoordinates {

    /**
     * Geographic latitude of the observer in radians, positive in the northern hemisphere.
     */
    public final double longitude;

    /**
     * Geographic longitude of the observer in radians, measured positively west of Greenwitch.
     */
    public final double latitude;

    public GeographicCoordinates(double longitude, double latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    static public GeographicCoordinates fromDegrees(double longitudeInDegrees, double latitudeInDegrees) {
        return new GeographicCoordinates(Math.toRadians(longitudeInDegrees), Math.toRadians(latitudeInDegrees));
    }

}
