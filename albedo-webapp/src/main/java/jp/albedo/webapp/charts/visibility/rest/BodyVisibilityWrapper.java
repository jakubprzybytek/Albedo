package jp.albedo.webapp.charts.visibility.rest;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.charts.visibility.BodyVisibility;
import jp.albedo.webapp.charts.visibility.VisibilityChartResponse;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BodyVisibilityWrapper {

    final BodyDetails bodyDetails;

    final List<ZonedDateTime> rises;

    final List<ZonedDateTime> transits;

    final List<ZonedDateTime> sets;

    public BodyVisibilityWrapper(BodyDetails bodyDetails, List<ZonedDateTime> rises, List<ZonedDateTime> transits, List<ZonedDateTime> sets) {
        this.bodyDetails = bodyDetails;
        this.rises = rises;
        this.transits = transits;
        this.sets = sets;
    }

    public static BodyVisibilityWrapper wrap(BodyVisibility bodyVisibility, ZoneId zoneId) {
        return new BodyVisibilityWrapper(
                bodyVisibility.getBodyDetails(),
                localTime(bodyVisibility.getRises(), zoneId),
                localTime(bodyVisibility.getTransits(), zoneId),
                localTime(bodyVisibility.getSets(), zoneId));
    }

    // FIXME: code duplication
    private static List<ZonedDateTime> localTime(List<Double> jdes, ZoneId zoneId) {
        return jdes.stream()
                .map(jde -> JulianDay.toDateTime(jde).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId))
                .collect(Collectors.toList());
    }
}
