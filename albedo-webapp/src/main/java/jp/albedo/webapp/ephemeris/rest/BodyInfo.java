package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.magnitude.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;

class BodyInfo {

    @JsonProperty
    final private BodyDetails bodyDetails;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final private OrbitElements orbitElements;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final private MagnitudeParameters magnitudeParameters;

    public BodyInfo(BodyDetails bodyDetails, OrbitElements orbitElements, MagnitudeParameters magnitudeParameters) {
        this.bodyDetails = bodyDetails;
        this.orbitElements = orbitElements;
        this.magnitudeParameters = magnitudeParameters;
    }
}
