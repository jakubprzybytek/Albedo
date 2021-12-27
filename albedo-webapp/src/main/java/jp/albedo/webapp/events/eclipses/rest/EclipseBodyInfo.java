package jp.albedo.webapp.events.eclipses.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;

public class EclipseBodyInfo {

    @JsonProperty
    final private BodyDetails bodyDetails;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final private Ephemeris ephemeris;

    public EclipseBodyInfo(BodyDetails bodyDetails, Ephemeris ephemeris) {
        this.bodyDetails = bodyDetails;
        this.ephemeris = ephemeris;
    }

}
