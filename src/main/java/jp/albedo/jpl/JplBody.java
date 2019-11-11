package jp.albedo.jpl;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;

public enum JplBody {

    Sun(BodyType.Sun),
    Mercury(BodyType.Planet),
    Venus(BodyType.Planet),
    Earth(BodyType.Planet),
    Mars(BodyType.Planet),
    Jupiter(BodyType.Planet),
    Saturn(BodyType.Planet),
    Uranus(BodyType.Planet),
    Neptune(BodyType.Planet),
    Pluto(BodyType.Asteroid),
    Moon(BodyType.Moon),

    EarthMoonBarycenter(BodyType.Barycenter),
    MarsBarycenter(BodyType.Barycenter);

    private BodyType bodyType;

    JplBody(BodyType bodyType) {
        this.bodyType = bodyType;
    }

    public BodyDetails toBodyDetails() {
        return new BodyDetails(this.name(), bodyType);
    }

}
