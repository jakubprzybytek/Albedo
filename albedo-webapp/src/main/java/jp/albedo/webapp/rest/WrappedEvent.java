package jp.albedo.webapp.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import java.time.ZonedDateTime;

public class WrappedEvent<T> {

    @JsonProperty
    private final int id;

    @JsonProperty
    private final ZonedDateTime localTime;

    @JsonUnwrapped
    private final T innerObject;

    public WrappedEvent(int id, ZonedDateTime localTime, T innerObject) {
        this.id = id;
        this.localTime = localTime;
        this.innerObject = innerObject;
    }

}
