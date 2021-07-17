package jp.albedo.webapp.events.all;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.events.all.parameters.ConjunctionsParameters;
import jp.albedo.webapp.events.all.parameters.EclipsesParameters;
import jp.albedo.webapp.events.all.parameters.RtsParameters;
import jp.albedo.webapp.rest.WrappedEvent;
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
                                                        ObserverLocation observerLocation,
                                                        @RequestParam("timeZone") String timeZone,
                                                        RtsParameters rtsParameters,
                                                        ConjunctionsParameters conjunctionsParameters,
                                                        EclipsesParameters eclipsesParameters,
                                                        String ephemerisMethodPreference) throws Exception {

        final ZoneId zoneId = ZoneId.of(timeZone);

        final AtomicInteger id = new AtomicInteger();

        return this.eventsOrchestrator.compute(JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation, rtsParameters, conjunctionsParameters, eclipsesParameters, ephemerisMethodPreference).stream()
                .map(event -> new WrappedEvent<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        event))
                .collect(Collectors.toList());
    }

}
