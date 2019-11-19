package jp.albedo.webapp.events;

import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.risetransitset.RiseTransitSetOrchestrator;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Component
public class EventsOrchestrator {

    private static Log LOG = LogFactory.getLog(EventsOrchestrator.class);

    @Autowired
    private RiseTransitSetOrchestrator riseTransitSetOrchestrator;

    List<AstronomicalEvent> compute(String[] bodyNames, Double fromDate, Double toDate, ObserverLocation observerLocation) throws Exception {

        LOG.info(String.format("Computing events, params: [bodies:%s, from=%s, to=%s], observer location: %s", Arrays.toString(bodyNames), fromDate, toDate, observerLocation));

        final Instant start = Instant.now();

        final List<AstronomicalEvent> astronomicalEvents = new ArrayList<>();

        final List<RiseTransitSetEvent> sunEvents = this.riseTransitSetOrchestrator.compute(new String[]{"Sun", "Moon"}, fromDate, toDate, observerLocation);
        astronomicalEvents.addAll(sunEvents);

        astronomicalEvents.sort(Comparator.comparingDouble(AstronomicalEvent::getJde));

        LOG.info(String.format("Calculated %d times of rising, transit and set in %s", astronomicalEvents.size(), Duration.between(start, Instant.now())));

        return astronomicalEvents;
    }

}
