package jp.albedo.webapp.conjunctions;

import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.conjunctions.rest.RestConjunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class ConjunctionsController {

    @Autowired
    private ConjunctionsOrchestrator conjunctionsOrchestrator;

    @Autowired
    private AsteroidConjunctionsOrchestrator asteroidConjunctionsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/asteroidConjunctions")
    public List<RestConjunction> ephemeris(
            @RequestParam(value = "primary", required = false, defaultValue = "Planet") List<String> primaryTypeStrings,
            @RequestParam(value = "secondary", required = false, defaultValue = "Planet") List<String> secondaryTypeStrings,
            @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        Set<BodyType> primaryBodyTypes = primaryTypeStrings.stream()
                .map(bodyTypeString -> BodyType.valueOf(bodyTypeString))
                .collect(Collectors.toSet());

        Set<BodyType> secondaryBodyTypes = secondaryTypeStrings.stream()
                .map(bodyTypeString -> BodyType.valueOf(bodyTypeString))
                .collect(Collectors.toSet());

        List<Conjunction> conjunctions = this.conjunctionsOrchestrator.compute(primaryBodyTypes, secondaryBodyTypes, JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate));

        return conjunctions.stream()
                .map(c -> new RestConjunction(c.first.getBodyDetails(), c.second.getBodyDetails(), JulianDay.toDateTime(c.jde), Math.toDegrees(c.separation)))
                .collect(Collectors.toList());
    }

}
