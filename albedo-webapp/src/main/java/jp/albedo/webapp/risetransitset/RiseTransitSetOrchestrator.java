package jp.albedo.webapp.risetransitset;

import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class RiseTransitSetOrchestrator {

    private static Log LOG = LogFactory.getLog(RiseTransitSetOrchestrator.class);

    public static final double INTERVAL = 1.0;

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    private RiseTransitSetCalculator riseTransitSetCalculator;

    public List<RiseTransitSetEvent> compute(List<String> bodyNames, Double fromDate, Double toDate, ObserverLocation observerLocation) throws Exception {

        LOG.info(String.format("Computing times of rising, transit and setting, params: [bodies:%s, from=%s, to=%s], observer location: %s", bodyNames, fromDate, toDate, observerLocation));

        final Instant start = Instant.now();

        final List<RiseTransitSetEvent> riseTransitSetList = new ArrayList<>();

        for (String bodyName : bodyNames) {
            ComputedEphemeris computedEphemeris = this.ephemeridesOrchestrator.compute(bodyName, fromDate - INTERVAL, toDate + INTERVAL, INTERVAL, observerLocation);
            riseTransitSetList.addAll(this.riseTransitSetCalculator.compute(bodyName, computedEphemeris, observerLocation.coords));
        }

        riseTransitSetList.sort(Comparator.comparingDouble(AstronomicalEvent::getJde));

        LOG.info(String.format("Calculated %d times of rising, transit and set in %s", riseTransitSetList.size(), Duration.between(start, Instant.now())));

        return riseTransitSetList;
    }

}
