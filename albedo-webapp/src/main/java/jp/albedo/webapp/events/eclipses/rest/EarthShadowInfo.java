package jp.albedo.webapp.events.eclipses.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.webapp.utils.Precision2Converter;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesConverter;

public class EarthShadowInfo {

    @JsonProperty
    @JsonSerialize(converter = Precision2Converter.class)
    final public double umbraRadius;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    final public double umbraAngularSize;

    @JsonProperty
    @JsonSerialize(converter = Precision2Converter.class)
    final public double penumbraRadius;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    final public double penumbraAngularSize;

    public EarthShadowInfo(double umbraRadius, double umbraAngularSize, double penumbraRadius, double penumbraAngularSize) {
        this.umbraRadius = umbraRadius;
        this.umbraAngularSize = umbraAngularSize;
        this.penumbraRadius = penumbraRadius;
        this.penumbraAngularSize = penumbraAngularSize;
    }

}
