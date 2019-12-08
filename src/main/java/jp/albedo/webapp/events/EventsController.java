package jp.albedo.webapp.events;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.EventWrapper;
import jp.albedo.webapp.events.parameters.RtsParameters;
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
    public List<EventWrapper> events(@RequestParam(value = "bodies", defaultValue = "Sun") String[] bodyNames,
                                     @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                     @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                     @RequestParam("longitude") double observerLongitude,
                                     @RequestParam("latitude") double observerLatitude,
                                     @RequestParam("height") double observerHeight,
                                     @RequestParam("timeZone") String timeZone,
                                     @RequestParam(value = "rtsSunEnabled", defaultValue = "true") boolean rtsSunEnabled,
                                     @RequestParam(value = "rtsMoonEnabled", defaultValue = "true") boolean rtsMoonEnabled) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        final RtsParameters rtsParameters = new RtsParameters(rtsSunEnabled, rtsMoonEnabled);

        final AtomicInteger id = new AtomicInteger();

        return this.eventsOrchestrator.compute(bodyNames, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation, rtsParameters).stream()
                .map(event -> new EventWrapper(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        event))
                .collect(Collectors.toList());
    }

}
