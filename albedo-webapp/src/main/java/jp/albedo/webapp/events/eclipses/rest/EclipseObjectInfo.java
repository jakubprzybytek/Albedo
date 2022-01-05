package jp.albedo.webapp.events.eclipses.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;

public class EclipseObjectInfo {

    @JsonProperty
    final private BodyDetails bodyDetails;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final private Ephemeris ephemeris;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final private EarthShadowInfo earthShadow;

    public EclipseObjectInfo(BodyDetails bodyDetails, Ephemeris ephemeris) {
        this.bodyDetails = bodyDetails;
        this.ephemeris = ephemeris;
        this.earthShadow = null;
    }

    public EclipseObjectInfo(BodyDetails bodyDetails, EarthShadowInfo earthShadow) {
        this.bodyDetails = bodyDetails;
        this.ephemeris = null;
        this.earthShadow = earthShadow;
    }

}
