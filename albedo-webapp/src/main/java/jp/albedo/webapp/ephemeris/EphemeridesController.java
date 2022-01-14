package jp.albedo.webapp.ephemeris;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.ephemeris.rest.EphemeridesResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;

@RestController
public class EphemeridesController {

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemerides")
    public EphemeridesResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
                                         @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                         @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                         @RequestParam("interval") double interval,
                                         ObserverLocation observerLocation,
                                         @RequestParam("timeZone") String timeZone,
                                         String ephemerisMethodPreference) throws Exception {

        final ZoneId zoneId = ZoneId.of(timeZone);

        final ComputedEphemeris<Ephemeris> computedEphemeris = this.ephemeridesOrchestrator.compute(bodyName, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), interval, observerLocation, ephemerisMethodPreference);
        return new EphemeridesResponse(computedEphemeris, zoneId);
    }

}
