package jp.albedo.webapp.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AstronomicalEvent {

    @JsonProperty
    private final double jde;

    @JsonProperty
    private final String type;

    public AstronomicalEvent(double jde, String type) {
        this.jde = jde;
        this.type = type;
    }

    public double getJde() {
        return jde;
    }
}
