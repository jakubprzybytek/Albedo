package jp.albedo.webapp.events;

import jp.albedo.catalogue.CatalogueName;
import jp.albedo.common.BodyType;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.conjunctions.ConjunctionsOrchestrator;
import jp.albedo.webapp.conjunctions.rest.ConjunctionEvent;
import jp.albedo.webapp.events.parameters.ConjunctionsParameters;
import jp.albedo.webapp.events.parameters.RtsParameters;
import jp.albedo.webapp.risetransitset.RiseTransitSetOrchestrator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EventsOrchestrator {

    private static Log LOG = LogFactory.getLog(EventsOrchestrator.class);

    @Autowired
    private RiseTransitSetOrchestrator riseTransitSetOrchestrator;

    @Autowired
    private ConjunctionsOrchestrator conjunctionsOrchestrator;

    List<AstronomicalEvent> compute(Double fromDate, Double toDate, ObserverLocation observerLocation, RtsParameters rtsParameters, ConjunctionsParameters conjunctionsParameters) throws Exception {

        LOG.info(String.format("Computing events, params: [from=%s, to=%s, rtsParams=%s, conjunctionsParams=%s], observer location: %s", fromDate, toDate, rtsParameters, conjunctionsParameters, observerLocation));
        final Instant start = Instant.now();

        final List<AstronomicalEvent> astronomicalEvents = new ArrayList<>();

        if (rtsParameters.isSunEnabled() || rtsParameters.isMoonEnabled()) {
            List<String> rtsBodies = StreamUtils.collectPresent(
                    Optional.ofNullable(rtsParameters.isSunEnabled() ? "Sun" : null),
                    Optional.ofNullable(rtsParameters.isMoonEnabled() ? "Moon" : null));
            astronomicalEvents.addAll(this.riseTransitSetOrchestrator.compute(rtsBodies, fromDate, toDate, observerLocation));
        }

        List<String> conjunctionBodyNames = StreamUtils.collectPresent(
                Optional.ofNullable(conjunctionsParameters.isSunEnabled() ? "Sun" : null),
                Optional.ofNullable(conjunctionsParameters.isMoonEnabled() ? "Moon" : null));
        List<BodyType> conjunctionPrimaryBodyTypes = StreamUtils.collectPresent(
                Optional.ofNullable(conjunctionsParameters.arePlanetsEnabled() ? BodyType.Planet : null));
        List<BodyType> conjunctionSecondaryBodyTypes = StreamUtils.collectPresent(
                Optional.ofNullable(conjunctionsParameters.areAsteroidsEnabled() ? BodyType.Asteroid : null),
                Optional.ofNullable(conjunctionsParameters.areCometsEnabled() ? BodyType.Comet : null));
        List<CatalogueName> conjunctionCatalogues = StreamUtils.collectPresent(
                Optional.ofNullable(conjunctionsParameters.isCataloguesDSEnabled() ? CatalogueName.NGC : null),
                Optional.ofNullable(conjunctionsParameters.isCataloguesDSEnabled() ? CatalogueName.IC : null));

        if (!conjunctionBodyNames.isEmpty() || !conjunctionPrimaryBodyTypes.isEmpty()) {
            astronomicalEvents.addAll(this.conjunctionsOrchestrator.computeForTwoMovingBodies(
                    conjunctionBodyNames,
                    conjunctionPrimaryBodyTypes,
                    conjunctionSecondaryBodyTypes,
                    fromDate,
                    toDate + 1.0,
                    observerLocation)
                    .stream()
                    .filter(conjunction -> conjunction.jde > fromDate) // FixMe
                    .map(ConjunctionEvent::fromTwoBodies)
                    .collect(Collectors.toList()));
        }
        if ((!conjunctionBodyNames.isEmpty() || !conjunctionPrimaryBodyTypes.isEmpty()) && !conjunctionCatalogues.isEmpty()) {
            astronomicalEvents.addAll(this.conjunctionsOrchestrator.computeForBodyAndCatalogueEntry(
                    conjunctionBodyNames,
                    conjunctionPrimaryBodyTypes,
                    conjunctionCatalogues,
                    fromDate,
                    toDate + 1.0,
                    observerLocation)
                    .stream()
                    .filter(conjunction -> conjunction.jde > fromDate) // FixMe
                    .map(ConjunctionEvent::fromBodyAndCatalogueEntry)
                    .collect(Collectors.toList()));
        }

        astronomicalEvents.sort(Comparator.comparingDouble(AstronomicalEvent::getJde));

        LOG.info(String.format("Calculated %d events in %s", astronomicalEvents.size(), Duration.between(start, Instant.now())));

        return astronomicalEvents;
    }

}
