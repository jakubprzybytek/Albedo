package jp.albedo.webapp.events.eclipses.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.utils.RadiansToPrecision1DegreesConverter;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesConverter;

public class EclipseEvent extends AstronomicalEvent {

    private static final String EVENT_TYPE = "Eclipse";

    @JsonProperty
    private final Ephemeris sunEphemeris;

    @JsonProperty
    private final Ephemeris moonEphemeris;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision6DegreesConverter.class)
    private final double separation;

    @JsonProperty
    @JsonSerialize(converter = RadiansToPrecision1DegreesConverter.class)
    private final double positionAngle;

    public EclipseEvent(double jde, Ephemeris sunEphemeris, Ephemeris moonEphemeris, double separation, double positionAngle) {
        super(jde, EVENT_TYPE, -1);
        this.sunEphemeris = sunEphemeris;
        this.moonEphemeris = moonEphemeris;
        this.separation = separation;
        this.positionAngle = positionAngle;
    }
}
