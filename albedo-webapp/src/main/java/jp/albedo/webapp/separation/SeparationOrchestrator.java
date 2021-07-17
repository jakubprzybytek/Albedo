package jp.albedo.webapp.separation;

import jp.albedo.common.Radians;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.separation.rest.Separation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SeparationOrchestrator {

    private static Log LOG = LogFactory.getLog(SeparationOrchestrator.class);

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    public List<Separation> compute(String firstBody, String secondBody, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        LOG.info(String.format("Computing separation between two bodies, params: [firstBody=%s, secondBody=%s, from=%s, to=%s, interval=%f]", firstBody, secondBody, fromDate, toDate, interval));

        final Instant start = Instant.now();

        ComputedEphemeris firstBodyEphemerides = this.ephemeridesOrchestrator.compute(firstBody, fromDate, toDate, interval, observerLocation, ephemerisMethodPreference);
        ComputedEphemeris secondBodyEphemerides = this.ephemeridesOrchestrator.compute(secondBody, fromDate, toDate, interval, observerLocation, ephemerisMethodPreference);

        List<Separation> separations = StreamUtils.zip(
                firstBodyEphemerides.getEphemerisList().stream(),
                secondBodyEphemerides.getEphemerisList().stream(),
                this::establishSeparation)
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d separations in %s", separations.size(), Duration.between(start, Instant.now())));

        return separations;
    }

    private Separation establishSeparation(Ephemeris first, Ephemeris second) {
        return new Separation(first.jde, Radians.separation(first.coordinates, second.coordinates));
    }

}
