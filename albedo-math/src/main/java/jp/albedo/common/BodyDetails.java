package jp.albedo.common;

import java.util.Objects;

public class BodyDetails {

    final public String name;

    final public BodyType bodyType;

    static final public BodyDetails SUN = new BodyDetails("Sun", BodyType.Star);
    static final public BodyDetails EARTH = new BodyDetails("Earth", BodyType.Planet);
    static final public BodyDetails EARTH_SHADOW = new BodyDetails("EarthShadow", BodyType.Shadow);
    static final public BodyDetails MOON = new BodyDetails("Moon", BodyType.NaturalSatellite);

    public BodyDetails(String name, BodyType bodyType) {
        this.name = name;
        this.bodyType = bodyType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BodyDetails that = (BodyDetails) o;
        return Objects.equals(name, that.name) && bodyType == that.bodyType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, bodyType);
    }

    @Override
    public String toString() {
        return this.name;
    }

}
