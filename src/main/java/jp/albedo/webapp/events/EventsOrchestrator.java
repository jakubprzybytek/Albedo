package jp.albedo.webapp.events;

import jp.albedo.catalogue.CatalogueType;
import jp.albedo.common.BodyType;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.conjunctions.ConjunctionsOrchestrator;
import jp.albedo.webapp.conjunctions.rest.ConjunctionEvent;
import jp.albedo.webapp.events.parameters.RtsParameters;
import jp.albedo.webapp.risetransitset.RiseTransitSetOrchestrator;
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
import java.util.stream.Collectors;

@Component
public class EventsOrchestrator {

    private static Log LOG = LogFactory.getLog(EventsOrchestrator.class);

    @Autowired
    private RiseTransitSetOrchestrator riseTransitSetOrchestrator;

    @Autowired
    private ConjunctionsOrchestrator conjunctionsOrchestrator;

    List<AstronomicalEvent> compute(String[] bodyNames, Double fromDate, Double toDate, ObserverLocation observerLocation, RtsParameters rtsParameters) throws Exception {

        LOG.info(String.format("Computing events, params: [bodies:%s, from=%s, to=%s], observer location: %s", Arrays.toString(bodyNames), fromDate, toDate, observerLocation));
        final Instant start = Instant.now();

        final List<AstronomicalEvent> astronomicalEvents = new ArrayList<>();

        if (rtsParameters.isSunEnabled() || rtsParameters.isMoonEnabled()) {
            ArrayList bodies = new ArrayList();
            if (rtsParameters.isSunEnabled()) {
                bodies.add("Sun");
            }
            if (rtsParameters.isMoonEnabled()) {
                bodies.add("Moon");
            }
            astronomicalEvents.addAll(this.riseTransitSetOrchestrator.compute(bodies, fromDate, toDate, observerLocation));
        }

        astronomicalEvents.addAll(this.conjunctionsOrchestrator.computeForTwoMovingBodies(
                Arrays.asList("Sun", "Moon"),
                Arrays.asList(BodyType.Planet),
                Arrays.asList(BodyType.Asteroid),
                fromDate,
                toDate + 1.0,
                observerLocation)
                .stream()
                .filter(conjunction -> conjunction.jde > fromDate) // FixMe
                .map(ConjunctionEvent::fromTwoBodies)
                .collect(Collectors.toList()));
        astronomicalEvents.addAll(this.conjunctionsOrchestrator.computeForBodyAndCatalogueEntry(
                Arrays.asList("Sun", "Moon"),
                Arrays.asList(BodyType.Planet),
                Arrays.asList(CatalogueType.NGC, CatalogueType.IC),
                fromDate,
                toDate + 1.0,
                observerLocation)
                .stream()
                .filter(conjunction -> conjunction.jde > fromDate) // FixMe
                .map(ConjunctionEvent::fromBodyAndCatalogueEntry)
                .collect(Collectors.toList()));

        astronomicalEvents.sort(Comparator.comparingDouble(AstronomicalEvent::getJde));

        LOG.info(String.format("Calculated %d times of rising, transit and set in %s", astronomicalEvents.size(), Duration.between(start, Instant.now())));

        return astronomicalEvents;
    }

}
