package jp.albedo.webapp.risetransitset;

import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Component
public class RiseTransitSetOrchestrator {

    private static Log LOG = LogFactory.getLog(RiseTransitSetOrchestrator.class);

    public static final double INTERVAL = 1.0;

    @Autowired
    EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    RiseTransitSetCalculator riseTransitSetCalculator;

    List<RiseTransitSetEvent> compute(String[] bodyNames, Double fromDate, Double toDate, GeographicCoordinates observerCoords) throws Exception {

        LOG.info(String.format("Computing times of rising, transit and setting, params: [bodies:%s, from=%s, to=%s]", Arrays.toString(bodyNames), fromDate, toDate));

        final Instant start = Instant.now();

        List<RiseTransitSetEvent> riseTransitSetList = new ArrayList<>();

        for (String bodyName : bodyNames) {
            ComputedEphemerides computedEphemerides = this.ephemeridesOrchestrator.compute(bodyName, fromDate - INTERVAL, toDate + INTERVAL, INTERVAL);
            List<RiseTransitSetEvent> riseTransitSetListForBody = this.riseTransitSetCalculator.compute(computedEphemerides, observerCoords);
            riseTransitSetList.addAll(riseTransitSetListForBody);
        }

        Collections.sort(riseTransitSetList, Comparator.comparingDouble(AstronomicalEvent::getJde));

        LOG.info(String.format("Calculated %d times of rising, transit and set in %s", riseTransitSetList.size(), Duration.between(start, Instant.now())));

        return riseTransitSetList;
    }

}
