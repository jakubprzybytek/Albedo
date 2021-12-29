package jp.albedo.webapp.events.all;

import jp.albedo.catalogue.CatalogueName;
import jp.albedo.common.BodyType;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.conjunctions.ConjunctionsOrchestrator;
import jp.albedo.webapp.conjunctions.rest.ConjunctionEvent;
import jp.albedo.webapp.events.all.parameters.ConjunctionsParameters;
import jp.albedo.webapp.events.all.parameters.EclipsesParameters;
import jp.albedo.webapp.events.all.parameters.RtsParameters;
import jp.albedo.webapp.events.eclipses.EclipsesOrchestrator;
import jp.albedo.webapp.events.eclipses.rest.EclipseEventOld;
import jp.albedo.webapp.events.risetransitset.RiseTransitSetOrchestrator;
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

    final private static Log LOG = LogFactory.getLog(EventsOrchestrator.class);

    @Autowired
    private RiseTransitSetOrchestrator riseTransitSetOrchestrator;

    @Autowired
    private ConjunctionsOrchestrator conjunctionsOrchestrator;

    @Autowired
    private EclipsesOrchestrator eclipsesOrchestrator;

    List<AstronomicalEvent> compute(Double fromDate, Double toDate, ObserverLocation observerLocation,
                                    RtsParameters rtsParameters, ConjunctionsParameters conjunctionsParameters, EclipsesParameters eclipsesParameters,
                                    String ephemerisMethodPreference) throws Exception {

        LOG.info(String.format("Computing events, params: [from=%s, to=%s, rtsParams=%s, conjunctionsParams=%s], observer location: %s", fromDate, toDate, rtsParameters, conjunctionsParameters, observerLocation));
        final Instant start = Instant.now();

        final List<AstronomicalEvent> astronomicalEvents = new ArrayList<>();

        if (rtsParameters.isSunEnabled() || rtsParameters.isMoonEnabled()) {
            List<String> rtsBodies = StreamUtils.collectPresent(
                    Optional.ofNullable(rtsParameters.isSunEnabled() ? "Sun" : null),
                    Optional.ofNullable(rtsParameters.isMoonEnabled() ? "Moon" : null));
            astronomicalEvents.addAll(this.riseTransitSetOrchestrator.computeEvents(rtsBodies, fromDate, toDate, observerLocation, ephemerisMethodPreference));
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
                Optional.ofNullable(conjunctionsParameters.isCataloguesDSEnabled() ? CatalogueName.Messier : null),
                Optional.ofNullable(conjunctionsParameters.isCataloguesDSEnabled() ? CatalogueName.NGC : null),
                Optional.ofNullable(conjunctionsParameters.isCataloguesDSEnabled() ? CatalogueName.IC : null));

        ConjunctionTwoBodyEventsFilter conjunctionTwoBodyEventsFilter = new ConjunctionTwoBodyEventsFilter(conjunctionsParameters.isFilterBlindedBySun());
        ConjunctionBodyAndCatalogueEventsFilter conjunctionBodyAndCatalogueEventsFilter = new ConjunctionBodyAndCatalogueEventsFilter(conjunctionsParameters.isFilterBlindedBySun());

        if (!conjunctionBodyNames.isEmpty() || !conjunctionPrimaryBodyTypes.isEmpty()) {
            astronomicalEvents.addAll(this.conjunctionsOrchestrator.computeForTwoMovingBodies(
                    conjunctionBodyNames,
                    conjunctionPrimaryBodyTypes,
                    conjunctionSecondaryBodyTypes,
                    fromDate,
                    toDate + 1.0,
                    observerLocation,
                    ephemerisMethodPreference)
                    .stream()
                    .filter(conjunction -> conjunction.jde > fromDate) // FixMe
                    .filter(conjunctionTwoBodyEventsFilter)
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
                    observerLocation,
                    ephemerisMethodPreference)
                    .stream()
                    .filter(conjunction -> conjunction.jde > fromDate) // FixMe
                    .filter(conjunctionBodyAndCatalogueEventsFilter)
                    .map(ConjunctionEvent::fromBodyAndCatalogueEntry)
                    .collect(Collectors.toList()));
        }

        if (eclipsesParameters.isEnabled()) {
            astronomicalEvents.addAll(getEclipses(fromDate, toDate, observerLocation, ephemerisMethodPreference));
        }

        astronomicalEvents.sort(Comparator.comparingDouble(AstronomicalEvent::getJde));

        LOG.info(String.format("Calculated %d events in %s", astronomicalEvents.size(), Duration.between(start, Instant.now())));

        return astronomicalEvents;
    }

    private List<EclipseEventOld> getEclipses(double from, double to, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {
        return this.eclipsesOrchestrator.computeOld(from, to, observerLocation, ephemerisMethodPreference);
    }

}
