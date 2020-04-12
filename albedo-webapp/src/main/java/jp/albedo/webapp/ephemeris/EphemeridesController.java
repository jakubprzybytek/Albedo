package jp.albedo.webapp.ephemeris;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.ephemeris.rest.EphemeridesResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

    private static Log LOG = LogFactory.getLog(EphemeridesController.class);

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemerides")
    public EphemeridesResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
                                         @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                         @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                         @RequestParam("interval") double interval,
                                         @RequestParam("longitude") double observerLongitude,
                                         @RequestParam("latitude") double observerLatitude,
                                         @RequestParam("height") double observerHeight,
                                         @RequestParam("timeZone") String timeZone) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        LOG.info(String.format("Computing ephemerides for single body, params: [bodyName=%s, from=%s, to=%s, interval=%f], observer location: %s", bodyName, fromDate, toDate, interval, observerLocation));

        final ComputedEphemerides computedEphemerides = this.ephemeridesOrchestrator.compute(bodyName, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), interval, observerLocation);

        return new EphemeridesResponse(computedEphemerides, zoneId);
    }

}
