package jp.albedo.webapp.ephemeris;

import jp.albedo.jpl.Body;
import jp.albedo.webapp.ephemeris.jpl.JplEphemerisCalculator;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisCalculator;
import jp.albedo.webapp.services.OrbitingBodyRecord;
import jp.albedo.webapp.services.OrbitsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class EphemerisController {

    @Autowired
    private OrbitsService orbitsService;

    @Autowired
    private OrbitBasedEphemerisCalculator orbitBasedEphemerisCalculator;

    @Autowired
    private JplEphemerisCalculator jplEphemerisCalculator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemeris")
    public EphemerisResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
                                       @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                       @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                       @RequestParam(value = "interval") double interval) throws Exception {

        final Optional<Body> jplSupportedBody = this.jplEphemerisCalculator.parseBody(bodyName);
        if (jplSupportedBody.isPresent()) {
            List<RestEphemeris> ephemerides = this.jplEphemerisCalculator.compute(jplSupportedBody.get(), fromDate, toDate, interval)
                    .stream()
                    .map(RestEphemeris::fromEphemeris)
                    .collect(Collectors.toList());

            return new EphemerisResponse(null, ephemerides);
        }

        final Optional<OrbitingBodyRecord> bodyRecordOptional = this.orbitsService.getByName(bodyName);

        if (!bodyRecordOptional.isPresent()) {
            throw new Exception("Body not found: " + bodyName);
        }

        final OrbitingBodyRecord orbitingBodyRecord = bodyRecordOptional.get();

        List<RestEphemeris> ephemerides = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval)
                .stream()
                .map(RestEphemeris::fromEphemeris)
                .collect(Collectors.toList());

        return new EphemerisResponse(orbitingBodyRecord, ephemerides);
    }

}
