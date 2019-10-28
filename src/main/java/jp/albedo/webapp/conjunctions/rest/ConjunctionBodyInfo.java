package jp.albedo.webapp.conjunctions.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;

public class ConjunctionBodyInfo {

    @JsonProperty
    final private BodyDetails bodyDetails;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final private Ephemeris ephemeris;

    public ConjunctionBodyInfo(BodyDetails bodyDetails, Ephemeris ephemeris) {
        this.bodyDetails = bodyDetails;
        this.ephemeris = ephemeris;
    }

}
