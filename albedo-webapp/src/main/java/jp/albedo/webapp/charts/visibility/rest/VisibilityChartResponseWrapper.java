package jp.albedo.webapp.charts.visibility.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.altitude.AltitudeResponse;
import jp.albedo.webapp.altitude.rest.AltitudeSeries;
import jp.albedo.webapp.charts.visibility.VisibilityChartResponse;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.common.EventWrapper;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class VisibilityChartResponseWrapper {

    @JsonProperty
    final private List<EventWrapper<RiseTransitSetEvent>> sunRiseTransitSetEvents;

    private VisibilityChartResponseWrapper(List<EventWrapper<RiseTransitSetEvent>> sunRiseTransitSetEvents) {
        this.sunRiseTransitSetEvents = sunRiseTransitSetEvents;
    }

    public static VisibilityChartResponseWrapper wrap(VisibilityChartResponse visibilityChartResponse, ZoneId zoneId) {
        return new VisibilityChartResponseWrapper(
                visibilityChartResponse.getSunRiseTransitSetEvents().stream()
                        .sorted(Comparator.comparingDouble(AstronomicalEvent::getJde))
                        .map(event -> new EventWrapper<>(
                                0,
                                JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                                event
                        ))
                        .collect(Collectors.toList())
        );
    }
}
