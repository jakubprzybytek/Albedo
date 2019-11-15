package jp.albedo.jeanmeeus.topocentric;

public class ObserverLocation {

    public GeographicCoordinates coords;

    /**
     * Height above sea level in meters.
     */
    public double height;

    public ObserverLocation(GeographicCoordinates coords, double height) {
        this.coords = coords;
        this.height = height;
    }
}
