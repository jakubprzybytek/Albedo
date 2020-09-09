package jp.albedo.webapp.charts.visibility;

import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.charts.visibility.rest.VisibilityChartResponseWrapper;
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
public class VisibilityChartController {

    @Autowired
    VisibilityChartOrchestrator visibilityChartOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/charts/visibility")
    public VisibilityChartResponseWrapper events(@RequestParam(value = "bodies", defaultValue = "Mercury") String[] bodyNames,
                                                 @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                 @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                 @RequestParam("interval") double interval,
                                                 @RequestParam("longitude") double observerLongitude,
                                                 @RequestParam("latitude") double observerLatitude,
                                                 @RequestParam("height") double observerHeight,
                                                 @RequestParam("timeZone") String timeZone) throws Exception {

        final ObserverLocation observerLocation = new ObserverLocation(GeographicCoordinates.fromDegrees(observerLongitude, observerLatitude), observerHeight);
        final ZoneId zoneId = ZoneId.of(timeZone);

        final VisibilityChartResponse visibilityChartResponse = this.visibilityChartOrchestrator.compute(
                Arrays.asList(bodyNames),
                JulianDay.fromDate(fromDate),
                JulianDay.fromDate(toDate),
                interval,
                observerLocation);

        return VisibilityChartResponseWrapper.wrap(visibilityChartResponse, zoneId);
    }

}
