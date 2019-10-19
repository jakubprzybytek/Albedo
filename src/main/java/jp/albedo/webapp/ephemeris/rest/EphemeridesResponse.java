package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.common.MagnitudeParameters;
import jp.albedo.ephemeris.common.OrbitElements;

import java.util.List;

public class EphemeridesResponse {

    @JsonProperty
    final private BodyInfo bodyInfo;

    @JsonProperty
    final private List<RestEphemeris> ephemerisList;

    public EphemeridesResponse(BodyDetails bodyDetails, OrbitElements orbitElements, MagnitudeParameters magnitudeParameters, List<RestEphemeris> ephemerisList) {
        this.bodyInfo = new BodyInfo(bodyDetails, orbitElements, magnitudeParameters);
        this.ephemerisList = ephemerisList;
    }

    private class BodyInfo {

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

}
