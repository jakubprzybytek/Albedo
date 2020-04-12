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

    @Override
    public String toString() {
        return String.format("[%s, H=%.2f]", this.coords, this.height);
    }

}
