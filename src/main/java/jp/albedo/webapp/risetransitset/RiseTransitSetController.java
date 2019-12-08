package jp.albedo.webapp.risetransitset;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.common.EventWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
public class RiseTransitSetController {

    @Autowired
    RiseTransitSetOrchestrator riseTransitSetOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/riseTransitSet")
    public List<EventWrapper> events(@RequestParam(value = "bodies", defaultValue = "Sun") String[] bodyNames,
                                     @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                     @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                     @RequestParam("longitude") double observerLongitude,
                                     @RequestParam("latitude") double observerLatitude,
                                     @RequestParam("height") double observerHeight,
                                     @RequestParam("timeZone") String timeZone) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        final AtomicInteger id = new AtomicInteger();

        return this.riseTransitSetOrchestrator.compute(Arrays.asList(bodyNames), JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation).stream()
                .map(event -> new EventWrapper(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        event))
                .collect(Collectors.toList());
    }

}
