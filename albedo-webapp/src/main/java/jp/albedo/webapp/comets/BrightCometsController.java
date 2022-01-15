package jp.albedo.webapp.comets;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
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
import java.util.List;

@RestController
public class BrightCometsController {

    final private static Log LOG = LogFactory.getLog(BrightCometsController.class);

    @Autowired
    private CometsOrchestrator cometsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/comets/bright")
    public List<ComputedEphemeris<Ephemeris>> getBrightComets(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                   @RequestParam(name = "magnitudeLimit", defaultValue = "10.0") double magnitudeLimit,
                                                   @RequestParam("longitude") double observerLongitude,
                                                   @RequestParam("latitude") double observerLatitude,
                                                   @RequestParam("height") double observerHeight,
                                                   @RequestParam("timeZone") String timeZone) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        LOG.info(String.format("Returning bright comets, params: [date=%s]", date));

        final List<ComputedEphemeris<Ephemeris>> computedEphemerides = this.cometsOrchestrator.getBrightComets(JulianDay.fromDate(date), magnitudeLimit, observerLocation);

        return computedEphemerides;
    }

}
