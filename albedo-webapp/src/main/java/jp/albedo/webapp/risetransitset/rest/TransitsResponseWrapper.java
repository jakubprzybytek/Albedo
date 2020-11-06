package jp.albedo.webapp.risetransitset.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.risetransitset.TransitsResponse;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TransitsResponseWrapper {

    @JsonProperty
    final private List<ZonedDateTime> timeSeries;

    @JsonProperty
    final private List<TransitSeries> transitsSeries;

    private TransitsResponseWrapper(List<ZonedDateTime> timeSeries, List<TransitSeries> transitsSeries) {
        this.timeSeries = timeSeries;
        this.transitsSeries = transitsSeries;
    }

    public static TransitsResponseWrapper wrap(TransitsResponse transitResponse, ZoneId zoneId) {
        return new TransitsResponseWrapper(
                transitResponse.getTimeSeries().stream()
                        .map(jde -> JulianDay.toDateTime(jde).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId))
                        .collect(Collectors.toList()),
                transitResponse.getAltitudeSeries()
        );
    }
}
