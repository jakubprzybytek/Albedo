package jp.albedo.webapp.events.risetransitset.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.BodyDetails;
import jp.albedo.webapp.utils.RadiansArrayToPrecision1DegreesConverter;

public class TransitSeries {

    @JsonProperty
    private final BodyDetails bodyDetails;

    @JsonProperty
    @JsonSerialize(converter = RadiansArrayToPrecision1DegreesConverter.class)
    private final Double[] transits;

    public TransitSeries(BodyDetails bodyDetails, Double[] transits) {
        this.bodyDetails = bodyDetails;
        this.transits = transits;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public Double[] getTransits() {
        return transits;
    }
}
