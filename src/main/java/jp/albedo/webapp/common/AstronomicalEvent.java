package jp.albedo.webapp.common;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class AstronomicalEvent {

    @JsonProperty
    final double jde;

    @JsonProperty
    final LocalDateTime time;

    public AstronomicalEvent(double jde, LocalDateTime time) {
        this.jde = jde;
        this.time = time;
    }

    public double getJde() {
        return jde;
    }

}
