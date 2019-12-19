package jp.albedo.webapp.separation.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesSerializer;

public class Separation {

    @JsonProperty
    private final double jde;

    @JsonSerialize(using = RadiansToPrecision6DegreesSerializer.class)
    private final double separation;

    public Separation(double jde, double separation) {
        this.jde = jde;
        this.separation = separation;
    }

    public double getJde() {
        return jde;
    }

}
