package jp.albedo.webapp.altitude.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.BodyDetails;
import jp.albedo.webapp.utils.RadiansArrayToPrecision1DegreesConverter;

public class AltitudeSeries {

    @JsonProperty
    private final BodyDetails bodyDetails;

    @JsonProperty
    @JsonSerialize(converter = RadiansArrayToPrecision1DegreesConverter.class)
    private final Double[] altitudes;

    public AltitudeSeries(BodyDetails bodyDetails, Double[] altitudes) {
        this.bodyDetails = bodyDetails;
        this.altitudes = altitudes;
    }
}
