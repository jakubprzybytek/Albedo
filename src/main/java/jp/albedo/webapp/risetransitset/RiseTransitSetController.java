package jp.albedo.webapp.risetransitset;

import jp.albedo.common.JulianDay;
import jp.albedo.common.Radians;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
public class RiseTransitSetController {

    @Autowired
    RiseTransitSetOrchestrator riseTransitSetOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/riseTransitSet")
    public List<RiseTransitSetEvent> ephemeris(@RequestParam(value = "bodies", defaultValue = "Sun") String[] bodyNames,
                                               @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                               @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                               @RequestParam("longitude") double observerLongitude,
                                               @RequestParam("latitude") double observerLatitude,
                                               @RequestParam("height") double observerHeight) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);

        final List<RiseTransitSetEvent> riseTransitSetList = this.riseTransitSetOrchestrator.compute(bodyNames, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerLocation);
        return riseTransitSetList;
    }

}
