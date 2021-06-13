package jp.albedo.webapp.events.eclipses;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.conjunctions.rest.ConjunctionEvent;
import jp.albedo.webapp.events.risetransitset.RiseTransitSetOrchestrator;
import jp.albedo.webapp.events.risetransitset.rest.RiseTransitSetEvent;
import jp.albedo.webapp.events.risetransitset.rest.TransitsResponseWrapper;
import jp.albedo.webapp.rest.EventWrapper;
import jp.albedo.webapp.rest.WrappedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
public class EclipsesController {

    @Autowired
    EclipsesOrchestrator eclipsesOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/events/eclipses")
    public List<WrappedEvent<ConjunctionEvent>> events(@RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                       @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                       ObserverLocation observerLocation,
                                                       @RequestParam("timeZone") String timeZone) throws Exception {

        final ZoneId zoneId = ZoneId.of(timeZone);

        final AtomicInteger id = new AtomicInteger();

        return this.eclipsesOrchestrator.compute(JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation).stream()
                .map(ConjunctionEvent::fromTwoBodies)
                .sorted(Comparator.comparingDouble(AstronomicalEvent::getJde))
                .map(event -> new WrappedEvent<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        event))
                .collect(Collectors.toList());
    }

}
