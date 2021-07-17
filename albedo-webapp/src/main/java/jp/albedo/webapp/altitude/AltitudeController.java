package jp.albedo.webapp.altitude;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.altitude.rest.AltitudeResponseWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;

@RestController
public class AltitudeController {

    @Autowired
    AltitudeOrchestrator altitudeOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/altitude")
    public AltitudeResponseWrapper events(@RequestParam(value = "bodies", defaultValue = "Mercury") String[] bodyNames,
                                          @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                          ObserverLocation observerLocation,
                                          @RequestParam("timeZone") String timeZone,
                                          String ephemerisMethodPreference) throws Exception {

        final ZoneId zoneId = ZoneId.of(timeZone);

        final AltitudeResponse altitudeResponse = this.altitudeOrchestrator.compute(Arrays.asList(bodyNames), JulianDay.fromDate(date), observerLocation, ephemerisMethodPreference);
        return AltitudeResponseWrapper.wrap(altitudeResponse, zoneId);
    }

}
