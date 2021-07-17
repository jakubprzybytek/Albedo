package jp.albedo.webapp.separation;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.rest.WrappedEvent;
import jp.albedo.webapp.separation.rest.Separation;
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
public class SeparationController {

    @Autowired
    private SeparationOrchestrator separationOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/separation")
    public List<WrappedEvent<Separation>> separation(@RequestParam(value = "firstBody", defaultValue = "Sun") String firstBody,
                                                     @RequestParam(value = "secondBody", defaultValue = "Moon") String secondBody,
                                                     @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                     @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                     @RequestParam("interval") double interval,
                                                     @RequestParam("longitude") double observerLongitude,
                                                     @RequestParam("latitude") double observerLatitude,
                                                     @RequestParam("height") double observerHeight,
                                                     @RequestParam("timeZone") String timeZone,
                                                     String ephemerisMethodPreference) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        final AtomicInteger id = new AtomicInteger();

        return this.separationOrchestrator.compute(firstBody, secondBody, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), interval, observerLocation, ephemerisMethodPreference).stream()
                .map(separation -> new WrappedEvent<>(
                        id.getAndIncrement(),
                        JulianDay.toDateTime(separation.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                        separation))
                .collect(Collectors.toList());
    }

}
