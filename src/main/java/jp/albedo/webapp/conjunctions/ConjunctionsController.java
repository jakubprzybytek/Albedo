package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.conjunctions.rest.RestConjunction;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class ConjunctionsController {

    @Autowired
    private ConjunctionsOrchestrator conjunctionsOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/conjunctions")
    public List<RestConjunction> ephemeris(
            @RequestParam(value = "primary", required = false, defaultValue = "Planet") List<String> primaryTypeStrings,
            @RequestParam(value = "secondary", required = false, defaultValue = "Planet") List<String> secondaryTypeStrings,
            @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        Set<BodyType> primaryBodyTypes = primaryTypeStrings.stream()
                .map(BodyType::valueOf)
                .collect(Collectors.toSet());

        Set<BodyType> secondaryBodyTypes = secondaryTypeStrings.stream()
                .map(BodyType::valueOf)
                .collect(Collectors.toSet());

        List<RestConjunction> restConjunctions = new ArrayList<>();

        List<Conjunction<ComputedEphemerides, ComputedEphemerides>> conjunctionsBetweenBodies = this.conjunctionsOrchestrator.computeForTwoMovingBodies(primaryBodyTypes, secondaryBodyTypes, JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate));
        conjunctionsBetweenBodies.stream()
                .map(c -> new RestConjunction(c.first.getBodyDetails(), c.second.getBodyDetails(), JulianDay.toDateTime(c.jde), Math.toDegrees(c.separation)))
                .forEachOrdered(restConjunctions::add);

        List<Conjunction<ComputedEphemerides, CatalogueEntry>> conjunctionsWithCatalogueEntries = this.conjunctionsOrchestrator.computeForBodyAndCatalogueEntry(primaryBodyTypes, JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate));
        conjunctionsWithCatalogueEntries.stream()
                .map(c -> new RestConjunction(c.first.getBodyDetails(), new BodyDetails(c.second.name), JulianDay.toDateTime(c.jde), Math.toDegrees(c.separation)))
                .forEachOrdered(restConjunctions::add);

        return restConjunctions;
    }

}
