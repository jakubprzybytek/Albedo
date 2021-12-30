package jp.albedo.common;

public class BodyDetails {

    final public String name;

    final public BodyType bodyType;

    static final public BodyDetails SUN = new BodyDetails("Sun", BodyType.Star);
    static final public BodyDetails EARTH = new BodyDetails("Earth", BodyType.Planet);
    static final public BodyDetails MOON = new BodyDetails("Moon", BodyType.NaturalSatellite);

    public BodyDetails(String name, BodyType bodyType) {
        this.name = name;
        this.bodyType = bodyType;
    }

    @Override
    public String toString() {
        return this.name;
    }

}
