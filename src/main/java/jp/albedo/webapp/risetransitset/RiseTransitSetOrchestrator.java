package jp.albedo.webapp.risetransitset;

import jp.albedo.topographic.GeographicCoordinates;
import jp.albedo.topographic.RiseTransitSet;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Component
public class RiseTransitSetOrchestrator {

    public static final double INTERVAL = 1.0;
    private static Log LOG = LogFactory.getLog(RiseTransitSetOrchestrator.class);

    @Autowired
    EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    RiseTransitSetCalculator riseTransitSetCalculator;

    List<RiseTransitSet> compute(String bodyName, Double fromDate, Double toDate, GeographicCoordinates observerCoords) throws Exception {

        final Instant start = Instant.now();

        ComputedEphemerides computedEphemerides = this.ephemeridesOrchestrator.compute(bodyName, fromDate - INTERVAL, toDate + INTERVAL, INTERVAL);
        List<RiseTransitSet> riseTransitSetList = this.riseTransitSetCalculator.compute(computedEphemerides.getEphemerides(), observerCoords);

        LOG.info(String.format("Calculated %d times of rising, transit and set in %s", 1, Duration.between(start, Instant.now())));

        return riseTransitSetList;
    }

}
