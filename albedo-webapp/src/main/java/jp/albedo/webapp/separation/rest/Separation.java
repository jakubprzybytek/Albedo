package jp.albedo.webapp.separation.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesConverter;

public class Separation {

    @JsonProperty
    private final double jde;

    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    private final double separation;

    public Separation(double jde, double separation) {
        this.jde = jde;
        this.separation = separation;
    }

    public double getJde() {
        return jde;
    }

}
