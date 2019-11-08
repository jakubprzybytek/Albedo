package jp.albedo.webapp.risetransitset;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.webapp.common.AstronomicalEvent;

import java.time.LocalDateTime;

public class RiseTransitSetEvent extends AstronomicalEvent {

    @JsonProperty
    private final BodyDetails bodyDetails;

    @JsonProperty
    private final RiseTransitSetEventType eventType;

    public RiseTransitSetEvent(double jde, LocalDateTime time, BodyDetails bodyDetails, RiseTransitSetEventType eventType) {
        super(jde, time);
        this.bodyDetails = bodyDetails;
        this.eventType = eventType;
    }

}
