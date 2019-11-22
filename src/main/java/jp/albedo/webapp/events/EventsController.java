package jp.albedo.webapp.events;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.IdWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
public class EventsController {

    @Autowired
    EventsOrchestrator eventsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/events")
    public List<IdWrapper> events(@RequestParam(value = "bodies", defaultValue = "Sun") String[] bodyNames,
                                  @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                  @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                  @RequestParam("longitude") double observerLongitude,
                                  @RequestParam("latitude") double observerLatitude,
                                  @RequestParam("height") double observerHeight) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);

        final AtomicInteger id = new AtomicInteger();

        return this.eventsOrchestrator.compute(bodyNames, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation).stream()
                .map(event -> new IdWrapper(id.getAndIncrement(), event))
                .collect(Collectors.toList());
    }

}
