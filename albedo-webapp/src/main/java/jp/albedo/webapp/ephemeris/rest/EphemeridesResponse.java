package jp.albedo.webapp.ephemeris.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.JulianDay;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.webapp.common.ResponseWrapper;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;

import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class EphemeridesResponse {

    @JsonProperty
    final private BodyInfo bodyInfo;

    @JsonProperty
    final private List<ResponseWrapper<Ephemeris>> ephemerisList;

    public EphemeridesResponse(ComputedEphemerides computedEphemerides, ZoneId zoneId) {
        this.bodyInfo = new BodyInfo(computedEphemerides.getBodyDetails(), computedEphemerides.getOrbitElements(), computedEphemerides.getMagnitudeParameters());

        final AtomicInteger id = new AtomicInteger();

        this.ephemerisList = computedEphemerides.getEphemerides().stream()
                .map(ephemeris -> new ResponseWrapper<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(ephemeris.jde).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        ephemeris))
                .collect(Collectors.toList());
        ;
    }

}
