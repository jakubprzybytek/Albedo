package jp.albedo.webapp.ephemeris;

import jp.albedo.webapp.ephemeris.rest.EphemeridesResponse;
import jp.albedo.webapp.ephemeris.rest.RestEphemeris;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class EphemeridesController {

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemerides")
    public EphemeridesResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
                                         @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                         @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                         @RequestParam(value = "interval") double interval) throws Exception {

        ComputedEphemerides computedEphemerides = this.ephemeridesOrchestrator.ephemeris(bodyName, fromDate, toDate, interval);

        List<RestEphemeris> ephemerides = computedEphemerides.getEphemerides()
                .stream()
                .map(RestEphemeris::fromEphemeris)
                .collect(Collectors.toList());

        return new EphemeridesResponse(computedEphemerides.getBodyDetails(), computedEphemerides.getOrbitElements(), computedEphemerides.getMagnitudeParameters(), ephemerides);
    }

}
