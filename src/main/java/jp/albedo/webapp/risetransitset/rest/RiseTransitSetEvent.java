package jp.albedo.webapp.risetransitset.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.common.AstronomicalEvent;

public class RiseTransitSetEvent extends AstronomicalEvent {

    @JsonProperty
    private final BodyDetails bodyDetails;

    @JsonProperty
    private final RiseTransitSetEventType eventType;

    public RiseTransitSetEvent(double jde, BodyDetails bodyDetails, RiseTransitSetEventType eventType) {
        super(jde, JulianDay.toDateTime(jde));
        this.bodyDetails = bodyDetails;
        this.eventType = eventType;
    }

}
