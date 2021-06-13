package jp.albedo.webapp.events.all;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.rest.WrappedEvent;
import jp.albedo.webapp.events.all.parameters.ConjunctionsParameters;
import jp.albedo.webapp.events.all.parameters.RtsParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
public class EventsController {

    @Autowired
    EventsOrchestrator eventsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/events")
    public List<WrappedEvent<AstronomicalEvent>> events(@RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                        @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                        @RequestParam("longitude") double observerLongitude,
                                                        @RequestParam("latitude") double observerLatitude,
                                                        @RequestParam("height") double observerHeight,
                                                        @RequestParam("timeZone") String timeZone,
                                                        @RequestParam(value = "rtsSunEnabled", required = false) boolean rtsSunEnabled,
                                                        @RequestParam(value = "rtsMoonEnabled", required = false) boolean rtsMoonEnabled,
                                                        @RequestParam(value = "conjunctionsSunEnabled", required = false) boolean conjunctionsSunEnabled,
                                                        @RequestParam(value = "conjunctionsMoonEnabled", required = false) boolean conjunctionsMoonEnabled,
                                                        @RequestParam(value = "conjunctionsPlanetsEnabled", required = false) boolean conjunctionsPlanetsEnabled,
                                                        @RequestParam(value = "conjunctionsCometsEnabled", required = false) boolean conjunctionsCometsEnabled,
                                                        @RequestParam(value = "conjunctionsAsteroidsEnabled", required = false) boolean conjunctionsAsteroidsEnabled,
                                                        @RequestParam(value = "conjunctionsCataloguesDSEnabled", required = false) boolean conjunctionsCataloguesDSEnabled,
                                                        @RequestParam(value = "cFilterBlindedBySun", required = false) boolean conjunctionsFilterBlindedBySun) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        final RtsParameters rtsParameters = new RtsParameters(rtsSunEnabled, rtsMoonEnabled);
        final ConjunctionsParameters conjunctionsParameters = new ConjunctionsParameters(
                conjunctionsSunEnabled,
                conjunctionsMoonEnabled,
                conjunctionsPlanetsEnabled,
                conjunctionsCometsEnabled,
                conjunctionsAsteroidsEnabled,
                conjunctionsCataloguesDSEnabled,
                conjunctionsFilterBlindedBySun);

        final AtomicInteger id = new AtomicInteger();

        return this.eventsOrchestrator.compute(JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation, rtsParameters, conjunctionsParameters).stream()
                .map(event -> new WrappedEvent<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        event))
                .collect(Collectors.toList());
    }

}
