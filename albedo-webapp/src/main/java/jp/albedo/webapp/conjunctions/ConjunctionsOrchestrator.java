package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueName;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.utils.MixListSupplier;
import jp.albedo.utils.MixTwoListsSupplier;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.catalogue.DsoCatalogueRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class ConjunctionsOrchestrator {

    private static final Log LOG = LogFactory.getLog(ConjunctionsOrchestrator.class);

    private static final double PRELIMINARY_INTERVAL = 1.0; // days

    private static final double DETAILED_SPAN = 2.0; // days

    private static final double DETAILED_INTERVAL = 1.0 / 24.0 / 6.0; // 10 mins

    private static final double MAX_SEPARATION = Math.toRadians(1.0);

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    private DsoCatalogueRepository dsoCatalogueRepository;

    /**
     * Finds conjunctions between requested bodies. Only bodies that moves across the sky (as seen from Earth) and
     * therefore can have computed ephemerides against over specific time period are used here. Those bodies includes: planets, asteroids, Sun.
     * <p>
     * Bodies could be provided either by their names or by type. Providing body type means that all bodies of that type should be used for computations.
     * <p>
     * Primary bodies are being compared on each-to-each basis.
     * Secondary bodies or only compared with primary bodes and not with each other.
     *
     * @param primaryBodyNames   Set of primary by names.
     * @param primaryBodyTypes   Set of primary body types.
     * @param secondaryBodyTypes Set of secondary body types.
     * @param fromDate           Start instant of the period over which conjunctions should be looked for.
     * @param toDate             End of that period.
     * @param observerLocation   Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    public List<Conjunction<BodyDetails, BodyDetails>> computeForTwoMovingBodies(
            Collection<String> primaryBodyNames,
            Collection<BodyType> primaryBodyTypes,
            Collection<BodyType> secondaryBodyTypes,
            Double fromDate, Double toDate,
            ObserverLocation observerLocation) {

        LOG.info(String.format("Computing conjunctions for two moving bodies, params: [primary bodies:%s, primary types:%s, secondary types:%s, from=%s, to=%s]",
                primaryBodyNames, primaryBodyTypes, secondaryBodyTypes, fromDate, toDate));

        final Instant start = Instant.now();

        final List<ComputedEphemeris> primaryObjectsEphemerides = new ArrayList<>();
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyType(primaryBodyTypes, fromDate, toDate, observerLocation));
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyNames(primaryBodyNames, fromDate, toDate, observerLocation));

        final List<ComputedEphemeris> secondaryObjectsEphemerides = getEphemeridesByBodyType(secondaryBodyTypes, fromDate, toDate, observerLocation);

        final List<Pair<ComputedEphemeris, ComputedEphemeris>> bodyPairs = generateBodiesPairs(primaryObjectsEphemerides, secondaryObjectsEphemerides);
        final List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions = ConjunctionFinder.forTwoBodies(bodyPairs, MAX_SEPARATION);

        final List<Pair<ComputedEphemeris, ComputedEphemeris>> closeEncounters = getDetailedBodiesEphemerides(preliminaryConjunctions, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size() * 2, closeEncounters.size()));

        final List<Conjunction<BodyDetails, BodyDetails>> detailedConjunctions = ConjunctionFinder.forTwoBodies(closeEncounters, MAX_SEPARATION);
        LOG.info(String.format("Found %d conjunctions in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    /**
     * Finds conjunctions between specific bodies and objects fom catalogues. Example of bodies: planets, asteroids, Sun.
     * <p>
     * Bodies could be provided either by their names or by type. Providing body type means that all bodies of that type should be used for computations.
     * Providing catalogue type means that all entries from that catalogue should be used for finding conjunctions.
     * <p>
     * All bodies are being compared with all catalogue entries.
     *
     * @param bodyNames        Set of primary by names.
     * @param bodyTypes        Set of primary body types.
     * @param catalogueNames   Set of catalogues types.
     * @param fromDate         Start instant of the period over which conjunctions should be looked for.
     * @param toDate           End of that period.
     * @param observerLocation Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    public List<Conjunction<BodyDetails, CatalogueEntry>> computeForBodyAndCatalogueEntry(
            Collection<String> bodyNames,
            Collection<BodyType> bodyTypes,
            Collection<CatalogueName> catalogueNames,
            Double fromDate, Double toDate,
            ObserverLocation observerLocation) {

        LOG.info(String.format("Computing conjunctions of one moving body and catalogue, params: [primary bodies:%s, primary types:%s, catalogues:%s, from=%s, to=%s], observer location: %s",
                bodyNames, bodyTypes, catalogueNames, fromDate, toDate, observerLocation));

        final Instant start = Instant.now();

        // FixMe: those ephemerides are most likely computed twice per request
        final List<ComputedEphemeris> primaryObjectsEphemerides = new ArrayList<>();
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyNames(bodyNames, fromDate, toDate, observerLocation));
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyType(bodyTypes, fromDate, toDate, observerLocation));

        final List<CatalogueEntry> catalogueEntries = getCatalogueEntries(catalogueNames);

        final List<Pair<ComputedEphemeris, CatalogueEntry>> pairsToCompare = generatePairs(primaryObjectsEphemerides, catalogueEntries);
        final List<Conjunction<BodyDetails, CatalogueEntry>> preliminaryConjunctions = ConjunctionFinder.forBodyAndCatalogueEntry(pairsToCompare, MAX_SEPARATION);

        final List<Pair<ComputedEphemeris, CatalogueEntry>> closeEncounters = getDetailedEphemerides(preliminaryConjunctions, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size(), closeEncounters.size()));

        final List<Conjunction<BodyDetails, CatalogueEntry>> detailedConjunctions = ConjunctionFinder.forBodyAndCatalogueEntry(closeEncounters, MAX_SEPARATION);
        LOG.info(String.format("Found %d conjunctions in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    private List<ComputedEphemeris> getEphemeridesByBodyNames(Collection<String> bodyNames, Double fromDate, Double toDate, ObserverLocation observerLocation) {
        return bodyNames.stream()
                .map(FunctionUtils.wrap(bodyName -> this.ephemeridesOrchestrator.compute(bodyName, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation)))
                .collect(Collectors.toList());
    }

    private List<ComputedEphemeris> getEphemeridesByBodyType(Collection<BodyType> bodyTypes, Double fromDate, Double toDate, ObserverLocation observerLocation) {
        return bodyTypes.stream()
                .map(FunctionUtils.wrap(bodyType -> this.ephemeridesOrchestrator.computeAllByType(bodyType, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation)))
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    private List<CatalogueEntry> getCatalogueEntries(Collection<CatalogueName> catalogueNames) {
        return catalogueNames.stream()
                .map(FunctionUtils.wrap(catalogueType -> this.dsoCatalogueRepository.getCatalogue(catalogueType)))
                .flatMap(catalogue -> catalogue.getAllEntries().stream())
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemeris, ComputedEphemeris>> generateBodiesPairs(List<ComputedEphemeris> primaryObjectsEphemerides, List<ComputedEphemeris> secondaryObjectsEphemerides) {
        return Stream.concat(
                Stream.generate(new MixListSupplier<>(primaryObjectsEphemerides))
                        .limit((long) primaryObjectsEphemerides.size() * (primaryObjectsEphemerides.size() - 1) / 2),
                Stream.generate(new MixTwoListsSupplier<>(primaryObjectsEphemerides, secondaryObjectsEphemerides))
                        .limit((long) primaryObjectsEphemerides.size() * secondaryObjectsEphemerides.size()))
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemeris, CatalogueEntry>> generatePairs(List<ComputedEphemeris> primaryObjectsEphemerides, List<CatalogueEntry> catalogueEntries) {
        return Stream.generate(new MixTwoListsSupplier<>(primaryObjectsEphemerides, catalogueEntries))
                .limit((long) primaryObjectsEphemerides.size() * catalogueEntries.size())
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemeris, ComputedEphemeris>> getDetailedBodiesEphemerides(List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions, ObserverLocation observerLocation) {
        return preliminaryConjunctions.parallelStream()
                .map(FunctionUtils.wrap(conjunction -> new Pair<>(
                        this.ephemeridesOrchestrator.compute(conjunction.firstObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation),
                        this.ephemeridesOrchestrator.compute(conjunction.secondObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation))))
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemeris, CatalogueEntry>> getDetailedEphemerides(List<Conjunction<BodyDetails, CatalogueEntry>> preliminaryConjunctions, ObserverLocation observerLocation) {
        return preliminaryConjunctions.parallelStream()
                .map(FunctionUtils.wrap(conjunction -> new Pair<>(
                        this.ephemeridesOrchestrator.compute(conjunction.firstObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation),
                        conjunction.secondObject)))
                .collect(Collectors.toList());
    }
}
