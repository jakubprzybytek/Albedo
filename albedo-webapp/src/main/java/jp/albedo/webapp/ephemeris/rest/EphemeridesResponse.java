package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.webapp.rest.WrappedEvent;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;

import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class EphemeridesResponse {

    @JsonProperty
    private final BodyInfo bodyInfo;

    @JsonProperty
    private final List<WrappedEvent<Ephemeris>> ephemerisList;

    @JsonProperty
    private final String engine;

    public EphemeridesResponse(ComputedEphemeris<Ephemeris> computedEphemeris, ZoneId zoneId) {
        this.bodyInfo = new BodyInfo(computedEphemeris.getBodyDetails(), computedEphemeris.getOrbitElements(), computedEphemeris.getMagnitudeParameters());
        this.engine = computedEphemeris.getEngine();

        final AtomicInteger id = new AtomicInteger();

        this.ephemerisList = computedEphemeris.getEphemerisList().stream()
                .map(ephemeris -> new WrappedEvent<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(ephemeris.jde).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        ephemeris))
                .collect(Collectors.toList());
    }

}
