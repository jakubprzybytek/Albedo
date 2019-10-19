package jp.albedo.jpl;

import jp.albedo.common.BodyDetails;

public enum Body {

    Sun,
    Mercury,
    Venus,
    Earth,
    Mars,
    Jupiter,
    Saturn,
    Uranus,
    Neptune,
    Pluto,
    Moon,

    EarthMoonBarycenter,
    MarsBarycenter;

    public BodyDetails toBodyDetails() {
        return new BodyDetails(this.name());
    }

}
