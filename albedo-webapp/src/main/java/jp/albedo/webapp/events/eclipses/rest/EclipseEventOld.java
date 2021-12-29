package jp.albedo.webapp.events.eclipses.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.utils.RadiansToPrecision1DegreesConverter;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesConverter;

public class EclipseEventOld extends AstronomicalEvent {

    private static final String EVENT_TYPE = "Eclipse";

    @JsonProperty
    private final EclipseBodyInfoOld sun;

    @JsonProperty
    private final EclipseBodyInfoOld moon;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    private final double separation;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision1DegreesConverter.class)
    private final double positionAngle;

    public EclipseEventOld(double jde, EclipseBodyInfoOld sun, EclipseBodyInfoOld moon, double separation, double positionAngle) {
        super(jde, EVENT_TYPE, 10);
        this.sun = sun;
        this.moon = moon;
        this.separation = separation;
        this.positionAngle = positionAngle;
    }
}
