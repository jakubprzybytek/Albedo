package jp.albedo.webapp.separation;

import jp.albedo.common.Radians;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
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

    public List<Separation> compute(String firstBody, String secondBody, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation) throws Exception {

        LOG.info(String.format("Computing separation between two bodies, params: [firstBody=%s, secondBody=%s, from=%s, to=%s, interval=%f]", firstBody, secondBody, fromDate, toDate, interval));

        final Instant start = Instant.now();

        ComputedEphemerides firstBodyEphemerides = this.ephemeridesOrchestrator.compute(firstBody, fromDate, toDate, interval, observerLocation);
        ComputedEphemerides secondBodyEphemerides = this.ephemeridesOrchestrator.compute(secondBody, fromDate, toDate, interval, observerLocation);

        List<Separation> separations = StreamUtils.zip(
                firstBodyEphemerides.getEphemerides().stream(),
                secondBodyEphemerides.getEphemerides().stream(),
                this::establishSeparation)
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d separations in %s", separations.size(), Duration.between(start, Instant.now())));

        return separations;
    }

    private Separation establishSeparation(Ephemeris first, Ephemeris second) {
        return new Separation(first.jde, Radians.separation(first.coordinates, second.coordinates));
    }

}
