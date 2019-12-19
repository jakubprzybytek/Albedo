package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueType;
import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.common.ResponseWrapper;
import jp.albedo.webapp.conjunctions.rest.ConjunctionEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
public class ConjunctionsController {

    @Autowired
    private ConjunctionsOrchestrator conjunctionsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/conjunctions")
    public List<ResponseWrapper<ConjunctionEvent>> conjunctions(@RequestParam(value = "primaryBodies", defaultValue = "") Set<String> primaryBodyNames,
                                                                @RequestParam(value = "primary", defaultValue = "") Set<String> primaryTypeStrings,
                                                                @RequestParam(value = "secondary", defaultValue = "") Set<String> secondaryTypeStrings,
                                                                @RequestParam(value = "catalogues", defaultValue = "") Set<String> catalogueTypeStrings,
                                                                @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                                @RequestParam("longitude") double observerLongitude,
                                                                @RequestParam("latitude") double observerLatitude,
                                                                @RequestParam("height") double observerHeight,
                                                                @RequestParam("timeZone") String timeZone) {

        final Set<BodyType> primaryBodyTypes = BodyType.parse(primaryTypeStrings);
        final Set<BodyType> secondaryBodyTypes = BodyType.parse(secondaryTypeStrings);
        final Set<CatalogueType> catalogueTypes = CatalogueType.parse(catalogueTypeStrings);

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        final AtomicInteger id = new AtomicInteger();

        return Stream.concat(
                this.conjunctionsOrchestrator.computeForTwoMovingBodies(primaryBodyNames, primaryBodyTypes, secondaryBodyTypes, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation).stream()
                        .map(ConjunctionEvent::fromTwoBodies),
                this.conjunctionsOrchestrator.computeForBodyAndCatalogueEntry(primaryBodyNames, primaryBodyTypes, catalogueTypes, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation).stream()
                        .map(ConjunctionEvent::fromBodyAndCatalogueEntry))
                .sorted(Comparator.comparingDouble(AstronomicalEvent::getJde))
                .map(event -> new ResponseWrapper<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        event))
                .collect(Collectors.toList());
    }

}
