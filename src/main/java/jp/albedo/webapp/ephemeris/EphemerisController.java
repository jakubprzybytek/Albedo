package jp.albedo.webapp.ephemeris;

import jp.albedo.webapp.external.BodyRecord;
import jp.albedo.webapp.external.SolarSystemService;
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
    private SolarSystemService solarSystemService;

    @Autowired
    private EphemerisCalculator ephemerisCalculator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemeris")
    public EphemerisResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
                                       @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                       @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                       @RequestParam(value = "interval") double interval) throws Exception {

        final Optional<BodyRecord> bodyRecordOptional = this.solarSystemService.getByName(bodyName);

        if (!bodyRecordOptional.isPresent()) {
            throw new Exception("Body not found: " + bodyName);
        }

        final BodyRecord bodyRecord = bodyRecordOptional.get();

        List<RestEphemeris> ephemerisList = this.ephemerisCalculator.compute(bodyRecord, fromDate, toDate, interval)
                .stream()
                .map(RestEphemeris::fromEphemeris)
                .collect(Collectors.toList());

        return new EphemerisResponse(bodyRecord, ephemerisList);
    }

}
