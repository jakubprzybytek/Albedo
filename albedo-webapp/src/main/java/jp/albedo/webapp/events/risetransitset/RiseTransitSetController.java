package jp.albedo.webapp.events.risetransitset;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.rest.EventWrapper;
import jp.albedo.webapp.rest.WrappedEvent;
import jp.albedo.webapp.events.risetransitset.rest.RiseTransitSetEvent;
import jp.albedo.webapp.events.risetransitset.rest.TransitsResponseWrapper;
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

    @RequestMapping(method = RequestMethod.GET, path = "/api/events/riseTransitSet")
    public List<WrappedEvent<RiseTransitSetEvent>> events(@RequestParam(value = "bodies", defaultValue = "Sun") String[] bodyNames,
                                                          @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                          @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                          ObserverLocation observerLocation,
                                                          @RequestParam("timeZone") String timeZone) throws Exception {

        final ZoneId zoneId = ZoneId.of(timeZone);

        final AtomicInteger id = new AtomicInteger();

        return this.riseTransitSetOrchestrator.computeEvents(Arrays.asList(bodyNames), JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation).stream()
                .map(EventWrapper.wrap(id, zoneId))
                .collect(Collectors.toList());
    }

    @RequestMapping(method = RequestMethod.GET, path = "/api/series/transit")
    public TransitsResponseWrapper series(@RequestParam(value = "bodies", defaultValue = "Sun") String[] bodyNames,
                                          @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                          @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                          ObserverLocation observerLocation,
                                          @RequestParam("timeZone") String timeZone) throws Exception {

        final ZoneId zoneId = ZoneId.of(timeZone);

        return TransitsResponseWrapper.wrap(
                this.riseTransitSetOrchestrator.computeRecords(Arrays.asList(bodyNames), JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation),
                zoneId
        );
    }

}
