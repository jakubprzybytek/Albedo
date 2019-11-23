package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueType;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.common.EventWrapper;
import jp.albedo.webapp.conjunctions.rest.ConjunctionEvent;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
public class ConjunctionsController {

    @Autowired
    private ConjunctionsOrchestrator conjunctionsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/conjunctions")
    public List<EventWrapper> conjunctions(@RequestParam(value = "primary", required = false, defaultValue = "Planet") List<String> primaryTypeStrings,
                                           @RequestParam(value = "secondary", required = false, defaultValue = "Planet") List<String> secondaryTypeStrings,
                                           @RequestParam(value = "catalogues", required = false) List<String> catalogueTypeStrings,
                                           @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                           @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                           @RequestParam("longitude") double observerLongitude,
                                           @RequestParam("latitude") double observerLatitude,
                                           @RequestParam("height") double observerHeight,
                                           @RequestParam("timeZone") String timeZone) {

        final Set<BodyType> primaryBodyTypes = primaryTypeStrings.stream()
                .map(BodyType::valueOf)
                .collect(Collectors.toSet());

        final Set<BodyType> secondaryBodyTypes = secondaryTypeStrings.stream()
                .map(BodyType::valueOf)
                .collect(Collectors.toSet());

        final Set<CatalogueType> catalogueTypes = catalogueTypeStrings.stream()
                .filter(StringUtils::isNotBlank)
                .map(CatalogueType::valueOf)
                .collect(Collectors.toSet());

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        final List<ConjunctionEvent> conjunctionEvents = new ArrayList<>();

        final List<Conjunction<BodyDetails, BodyDetails>> conjunctionsBetweenBodies =
                this.conjunctionsOrchestrator.computeForTwoMovingBodies(primaryBodyTypes, secondaryBodyTypes, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation);

        conjunctionsBetweenBodies.stream()
                .map(ConjunctionEvent::fromTwoBodies)
                .forEachOrdered(conjunctionEvents::add);

        final List<Conjunction<BodyDetails, CatalogueEntry>> conjunctionsWithCatalogueEntries =
                this.conjunctionsOrchestrator.computeForBodyAndCatalogueEntry(primaryBodyTypes, catalogueTypes, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation);

        conjunctionsWithCatalogueEntries.stream()
                .map(ConjunctionEvent::fromBodyAndCatalogueEntry)
                .forEachOrdered(conjunctionEvents::add);

        Collections.sort(conjunctionEvents, Comparator.comparingDouble(AstronomicalEvent::getJde));

        final AtomicInteger id = new AtomicInteger();

        return conjunctionEvents.stream()
                .map(event -> new EventWrapper(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        event))
                .collect(Collectors.toList());
    }

}
