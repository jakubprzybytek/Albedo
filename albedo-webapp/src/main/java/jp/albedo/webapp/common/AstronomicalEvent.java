package jp.albedo.webapp.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AstronomicalEvent implements JdeEvent {

    @JsonProperty
    private final double jde;

    @JsonProperty
    private final String type;

    @JsonProperty
    private final int score;

    public AstronomicalEvent(double jde, String type, int score) {
        this.jde = jde;
        this.type = type;
        this.score = score;
    }

    public double getJde() {
        return jde;
    }
}
