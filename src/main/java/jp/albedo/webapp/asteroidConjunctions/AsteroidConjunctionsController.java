package jp.albedo.webapp.asteroidConjunctions;

import jp.albedo.common.JulianDay;
import jp.albedo.webapp.asteroidConjunctions.AsteroidConjunctionsCalculator.Conjunction;
import jp.albedo.vsop87.VSOPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AsteroidConjunctionsController {

    @Autowired
    private AsteroidConjunctionsOrchestrator asteroidConjunctionsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/asteroidConjunctions")
    public List<RestConjunction> ephemeris(
            @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate)
            throws IOException, VSOPException, URISyntaxException {

        List<Conjunction> conjunctions = this.asteroidConjunctionsOrchestrator.orchestrate(fromDate, toDate);

        return conjunctions.stream()
                .map(c -> new RestConjunction(c.first.bodyDetails, c.second.bodyDetails, JulianDay.toDateTime(c.jde), Math.toDegrees(c.separation)))
                .collect(Collectors.toList());
    }

}
