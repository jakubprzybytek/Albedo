package jp.albedo.webapp.common;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class AstronomicalEvent {

    @JsonProperty
    private final double jde;

    @JsonProperty
    private final LocalDateTime time;

    @JsonProperty
    private final String type;

    public AstronomicalEvent(double jde, LocalDateTime time, String type) {
        this.jde = jde;
        this.time = time;
        this.type = type;
    }

    public double getJde() {
        return jde;
    }
}
