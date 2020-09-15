package jp.albedo.webapp.charts.visibility.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.charts.visibility.BodyVisibility;
import jp.albedo.webapp.charts.visibility.VisibilityChartResponse;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class VisibilityChartResponseWrapper {

    @JsonProperty
    final List<ZonedDateTime> sunSets;

    @JsonProperty
    final List<ZonedDateTime> sunCivilDusks;

    @JsonProperty
    final List<ZonedDateTime> sunNauticalDusks;

    @JsonProperty
    final List<ZonedDateTime> sunAstronomicalDusks;

    @JsonProperty
    final List<ZonedDateTime> sunAstronomicalDawns;

    @JsonProperty
    final List<ZonedDateTime> sunNauticalDawns;

    @JsonProperty
    final List<ZonedDateTime> sunCivilDawns;

    @JsonProperty
    final List<ZonedDateTime> sunRises;

    @JsonProperty("bodies")
    final List<BodyVisibilityWrapper> bodyVisibilityList;

    private VisibilityChartResponseWrapper(List<ZonedDateTime> sunSets, List<ZonedDateTime> sunCivilDusks, List<ZonedDateTime> sunNauticalDusks, List<ZonedDateTime> sunAstronomicalDusks, List<ZonedDateTime> sunAstronomicalDawns, List<ZonedDateTime> sunNauticalDawns, List<ZonedDateTime> sunCivilDawns, List<ZonedDateTime> sunRises, List<BodyVisibilityWrapper> bodyVisibilityList) {
        this.sunSets = sunSets;
        this.sunCivilDusks = sunCivilDusks;
        this.sunNauticalDusks = sunNauticalDusks;
        this.sunAstronomicalDusks = sunAstronomicalDusks;
        this.sunAstronomicalDawns = sunAstronomicalDawns;
        this.sunNauticalDawns = sunNauticalDawns;
        this.sunCivilDawns = sunCivilDawns;
        this.sunRises = sunRises;
        this.bodyVisibilityList = bodyVisibilityList;
    }

    public static VisibilityChartResponseWrapper wrap(VisibilityChartResponse visibilityChartResponse, ZoneId zoneId) {
        return new VisibilityChartResponseWrapper(
                localTime(visibilityChartResponse.getSunSets(), zoneId),
                localTime(visibilityChartResponse.getSunCivilDusks(), zoneId),
                localTime(visibilityChartResponse.getSunNauticalDusks(), zoneId),
                localTime(visibilityChartResponse.getSunAstronomicalDusks(), zoneId),
                localTime(visibilityChartResponse.getSunAstronomicalDawns(), zoneId),
                localTime(visibilityChartResponse.getSunNauticalDawns(), zoneId),
                localTime(visibilityChartResponse.getSunCivilDawns(), zoneId),
                localTime(visibilityChartResponse.getSunRises(), zoneId),
                visibilityChartResponse.getBodiesVisibilityList().stream()
                        .map(bodyVisibility -> BodyVisibilityWrapper.wrap(bodyVisibility, zoneId))
                        .collect(Collectors.toList()));
    }

    private static List<ZonedDateTime> localTime(List<Double> jdes, ZoneId zoneId) {
        return jdes.stream()
                .map(jde -> JulianDay.toDateTime(jde).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId))
                .collect(Collectors.toList());
    }
}
