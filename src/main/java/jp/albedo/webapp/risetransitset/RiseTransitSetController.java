package jp.albedo.webapp.risetransitset;

import jp.albedo.common.JulianDay;
import jp.albedo.topographic.GeographicCoordinates;
import jp.albedo.topographic.RiseTransitSet;
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
    public List<RiseTransitSet> ephemeris(@RequestParam(value = "bodies", defaultValue = "Sun") String[] bodyName,
                                          @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                          @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) throws Exception {

        GeographicCoordinates observerCoords = GeographicCoordinates.fromDegrees(71.0833, 42.3333);

        List<RiseTransitSet> riseTransitSetList = this.riseTransitSetOrchestrator.compute("Jupiter", JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), observerCoords);

        return riseTransitSetList;
    }

}
