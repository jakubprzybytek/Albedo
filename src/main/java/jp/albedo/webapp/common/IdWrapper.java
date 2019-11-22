package jp.albedo.webapp.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

public class IdWrapper {

    @JsonProperty
    private final int id;

    @JsonUnwrapped
    private final AstronomicalEvent astronomicalEvent;

    public IdWrapper(int id, AstronomicalEvent astronomicalEvent) {
        this.id = id;
        this.astronomicalEvent = astronomicalEvent;
    }
}
