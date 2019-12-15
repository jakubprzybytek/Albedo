package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;

import java.time.ZonedDateTime;

public class EphemerisWrapper {

    @JsonProperty
    private final int id;

    @JsonProperty
    private final ZonedDateTime localTime;

    @JsonUnwrapped
    private final Ephemeris ephemeris;

    public EphemerisWrapper(int id, ZonedDateTime localTime, Ephemeris ephemeris) {
        this.id = id;
        this.localTime = localTime;
        this.ephemeris = ephemeris;
    }
}
