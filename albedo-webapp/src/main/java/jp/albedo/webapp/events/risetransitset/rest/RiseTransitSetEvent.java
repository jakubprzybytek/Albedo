package jp.albedo.webapp.events.risetransitset.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.BodyDetails;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesConverter;

public class RiseTransitSetEvent extends AstronomicalEvent {

    private static final String EVENT_TYPE = "RiseTransitSet";

    @JsonProperty
    private final BodyDetails bodyDetails;

    @JsonProperty
    private final RiseTransitSetEventType eventType;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Double azimuth;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Double altitude;

    private RiseTransitSetEvent(double jde, BodyDetails bodyDetails, RiseTransitSetEventType eventType, Double azimuth, Double altitude) {
        super(jde, EVENT_TYPE, 0);
        this.bodyDetails = bodyDetails;
        this.eventType = eventType;
        this.azimuth = azimuth;
        this.altitude = altitude;
    }

    public static RiseTransitSetEvent forTransit(double jde, BodyDetails bodyDetails, double altitude) {
        return new RiseTransitSetEvent(jde, bodyDetails, RiseTransitSetEventType.Transit, null, altitude);
    }

    public static RiseTransitSetEvent forRiseAndSet(double jde, BodyDetails bodyDetails, RiseTransitSetEventType eventType) {
        return new RiseTransitSetEvent(jde, bodyDetails, eventType, null, null);
    }

    public static RiseTransitSetEvent forRiseAndSet(double jde, BodyDetails bodyDetails, RiseTransitSetEventType eventType, double azimuth) {
        return new RiseTransitSetEvent(jde, bodyDetails, eventType, azimuth, null);
    }

    public RiseTransitSetEventType getEventType() {
        return eventType;
    }
}
