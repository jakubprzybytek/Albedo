package jp.albedo.webapp.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import java.time.ZonedDateTime;

public class EventWrapper {

    @JsonProperty
    private final int id;

    @JsonProperty
    private final ZonedDateTime localTime;

    @JsonUnwrapped
    private final AstronomicalEvent astronomicalEvent;

    public EventWrapper(int id, ZonedDateTime localTime, AstronomicalEvent astronomicalEvent) {
        this.id = id;
        this.localTime = localTime;
        this.astronomicalEvent = astronomicalEvent;
    }
}
