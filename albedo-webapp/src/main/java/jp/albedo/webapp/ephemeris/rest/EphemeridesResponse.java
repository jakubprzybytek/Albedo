package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.JulianDay;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.webapp.rest.WrappedEvent;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;

import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class EphemeridesResponse {

    @JsonProperty
    final private BodyInfo bodyInfo;

    @JsonProperty
    final private List<WrappedEvent<Ephemeris>> ephemerisList;

    public EphemeridesResponse(ComputedEphemeris computedEphemeris, ZoneId zoneId) {
        this.bodyInfo = new BodyInfo(computedEphemeris.getBodyDetails(), computedEphemeris.getOrbitElements(), computedEphemeris.getMagnitudeParameters());

        final AtomicInteger id = new AtomicInteger();

        this.ephemerisList = computedEphemeris.getEphemerisList().stream()
                .map(ephemeris -> new WrappedEvent<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(ephemeris.jde).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        ephemeris))
                .collect(Collectors.toList());
        ;
    }

}
