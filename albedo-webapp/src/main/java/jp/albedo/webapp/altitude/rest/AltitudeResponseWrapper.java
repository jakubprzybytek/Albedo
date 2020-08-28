package jp.albedo.webapp.altitude.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.altitude.AltitudeResponse;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.common.EventWrapper;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class AltitudeResponseWrapper {

    @JsonProperty
    final private List<EventWrapper<RiseTransitSetEvent>> sunRiseTransitSetEvents;

    @JsonProperty
    final private List<ZonedDateTime> timeSeries;

    @JsonProperty
    final private List<AltitudeSeries> altitudeSeries;

    private AltitudeResponseWrapper(List<EventWrapper<RiseTransitSetEvent>> sunRiseTransitSetEvents, List<ZonedDateTime> timeSeries, List<AltitudeSeries> altitudeSeries) {
        this.sunRiseTransitSetEvents = sunRiseTransitSetEvents;
        this.timeSeries = timeSeries;
        this.altitudeSeries = altitudeSeries;
    }

    public static AltitudeResponseWrapper wrap(AltitudeResponse altitudeResponse, ZoneId zoneId) {
        return new AltitudeResponseWrapper(
                altitudeResponse.getSunRiseTransitSetEvents().stream()
                        .sorted(Comparator.comparingDouble(AstronomicalEvent::getJde))
                        .map(event -> new EventWrapper<>(
                                0,
                                JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                                event
                        ))
                        .collect(Collectors.toList()),
                altitudeResponse.getTimeSeries().stream()
                        .map(jde -> JulianDay.toDateTime(jde).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId))
                        .collect(Collectors.toList()),
                altitudeResponse.getAltitudeSeries()
        );
    }
}
