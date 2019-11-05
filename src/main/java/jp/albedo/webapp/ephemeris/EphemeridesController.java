package jp.albedo.webapp.ephemeris;

import jp.albedo.common.JulianDay;
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

@RestController
public class EphemeridesController {

    private static Log LOG = LogFactory.getLog(EphemeridesController.class);

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemerides")
    public EphemeridesResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
                                         @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                         @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                         @RequestParam(value = "interval") double interval) throws Exception {

        LOG.info(String.format("Computing ephemerides for single body, params: [bodyName=%s, from=%s, to=%s, interval=%f]", bodyName, fromDate, toDate, interval));

        ComputedEphemerides computedEphemerides = this.ephemeridesOrchestrator.compute(bodyName, JulianDay.fromDate(fromDate), JulianDay.fromDate(toDate), interval);

        return new EphemeridesResponse(computedEphemerides.getBodyDetails(),
                computedEphemerides.getOrbitElements(),
                computedEphemerides.getMagnitudeParameters(),
                computedEphemerides.getEphemerides());
    }

}
