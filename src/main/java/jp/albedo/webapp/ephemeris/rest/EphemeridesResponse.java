package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.common.MagnitudeParameters;
import jp.albedo.ephemeris.common.OrbitElements;

import java.util.List;

public class EphemeridesResponse {

    @JsonProperty
    final private BodyInfo bodyInfo;

    @JsonProperty
    final private List<Ephemeris> ephemerisList;

    public EphemeridesResponse(BodyDetails bodyDetails, OrbitElements orbitElements, MagnitudeParameters magnitudeParameters, List<Ephemeris> ephemerisList) {
        this.bodyInfo = new BodyInfo(bodyDetails, orbitElements, magnitudeParameters);
        this.ephemerisList = ephemerisList;
    }

}
