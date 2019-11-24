package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueType;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.MixListSupplier;
import jp.albedo.utils.MixTwoListsSupplier;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.services.CatalogueService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
class ConjunctionsOrchestrator {

    private static Log LOG = LogFactory.getLog(ConjunctionsOrchestrator.class);

    private static final double PRELIMINARY_INTERVAL = 1.0; // days

    private static final double DETAILED_SPAN = 2.0; // days

    private static final double DETAILED_INTERVAL = 1.0 / 24.0 / 6.0; // 10 mins

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    private ConjunctionsCalculator conjunctionsCalculator;

    @Autowired
    private CatalogueService catalogueService;

    /**
     * Finds conjunctions between requested bodies. Only bodies that moves across the sky (as seen from Earth) and
     * therefor can have computed ephemerides against over specific time period are used here. Those bodies includes: planets, asteroids, Sun.
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
    List<Conjunction<BodyDetails, BodyDetails>> computeForTwoMovingBodies(
            Set<String> primaryBodyNames,
            Set<BodyType> primaryBodyTypes,
            Set<BodyType> secondaryBodyTypes,
            Double fromDate, Double toDate,
            ObserverLocation observerLocation) {

        LOG.info(String.format("Computing conjunctions for two moving bodies, params: [primary bodies:%s, primary types:%s, secondary types:%s, from=%s, to=%s]",
                primaryBodyNames, primaryBodyTypes, secondaryBodyTypes, fromDate, toDate));

        final Instant start = Instant.now();

        final List<ComputedEphemerides> primaryObjectsEphemerides = new ArrayList<>();
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyType(primaryBodyTypes, fromDate, toDate, observerLocation));
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyNames(primaryBodyNames, fromDate, toDate, observerLocation));

        final List<ComputedEphemerides> secondaryObjectsEphemerides = getEphemeridesByBodyType(secondaryBodyTypes, fromDate, toDate, observerLocation);

        final List<Pair<ComputedEphemerides, ComputedEphemerides>> bodyPairs = generateBodiesPairs(primaryObjectsEphemerides, secondaryObjectsEphemerides);
        final List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions = this.conjunctionsCalculator.calculateForTwoBodies(bodyPairs);

        final List<Pair<ComputedEphemerides, ComputedEphemerides>> closeEncounters = getDetailedBodiesEphemerides(preliminaryConjunctions, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size() * 2, closeEncounters.size()));

        final List<Conjunction<BodyDetails, BodyDetails>> detailedConjunctions = this.conjunctionsCalculator.calculateForTwoBodies(closeEncounters);
        LOG.info(String.format("Found %d conjunctions in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    /**
     * Finds conjunctions between bodies and objects fom catalogues. Example of bodies: planets, asteroids, Sun.
     * <p>
     * Bodies could be provided either by their names or by type. Providing body type means that all bodies of that type should be used for computations.
     * Providing catalogue type means that all entries from that catalogue should be used for finding conjunctions.
     * <p>
     * All bodies are being compared with all catalogue entries.
     *
     * @param primaryBodyNames Set of primary by names.
     * @param primaryBodyTypes Set of primary body types.
     * @param catalogueTypes   Set of catalogues types.
     * @param fromDate         Start instant of the period over which conjunctions should be looked for.
     * @param toDate           End of that period.
     * @param observerLocation Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    List<Conjunction<BodyDetails, CatalogueEntry>> computeForBodyAndCatalogueEntry(
            Set<String> primaryBodyNames,
            Set<BodyType> primaryBodyTypes,
            Set<CatalogueType> catalogueTypes,
            Double fromDate, Double toDate,
            ObserverLocation observerLocation) {

        LOG.info(String.format("Computing conjunctions of one moving body and catalogue, params: [primary bodies:%s, primary types:%s, catalogues:%s, from=%s, to=%s], observer location: %s",
                primaryBodyNames, primaryBodyTypes, catalogueTypes, fromDate, toDate, observerLocation));

        final Instant start = Instant.now();

        // FixMe: those ephemerides are most likely computed twice per request
        final List<ComputedEphemerides> primaryObjectsEphemerides = new ArrayList<>();
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyType(primaryBodyTypes, fromDate, toDate, observerLocation));
        primaryObjectsEphemerides.addAll(getEphemeridesByBodyNames(primaryBodyNames, fromDate, toDate, observerLocation));

        final List<CatalogueEntry> catalogueEntries = getCatalogueEntries(catalogueTypes);

        final List<Pair<ComputedEphemerides, CatalogueEntry>> pairsToCompare = generatePairs(primaryObjectsEphemerides, catalogueEntries);
        final List<Conjunction<BodyDetails, CatalogueEntry>> preliminaryConjunctions = this.conjunctionsCalculator.calculateForBodyAndCatalogueEntry(pairsToCompare);

        final List<Pair<ComputedEphemerides, CatalogueEntry>> closeEncounters = getDetailedEphemerides(preliminaryConjunctions, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size(), closeEncounters.size()));

        final List<Conjunction<BodyDetails, CatalogueEntry>> detailedConjunctions = this.conjunctionsCalculator.calculateForBodyAndCatalogueEntry(closeEncounters);
        LOG.info(String.format("Found %d conjunctions in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    private List<ComputedEphemerides> getEphemeridesByBodyNames(Set<String> bodyNames, Double fromDate, Double toDate, ObserverLocation observerLocation) {
        return bodyNames.stream()
                .map(StreamUtils.wrap(bodyName -> this.ephemeridesOrchestrator.compute(bodyName, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation)))
                .collect(Collectors.toList());
    }

    private List<ComputedEphemerides> getEphemeridesByBodyType(Set<BodyType> bodyTypes, Double fromDate, Double toDate, ObserverLocation observerLocation) {
        return bodyTypes.stream()
                .map(StreamUtils.wrap(bodyType -> this.ephemeridesOrchestrator.computeAllByType(bodyType, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation)))
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    private List<CatalogueEntry> getCatalogueEntries(Set<CatalogueType> catalogueTypes) {
        return catalogueTypes.stream()
                .map(StreamUtils.wrap(catalogueType -> this.catalogueService.getCatalogue(catalogueType)))
                .flatMap(catalogue -> catalogue.getAllEntries().stream())
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemerides, ComputedEphemerides>> generateBodiesPairs(List<ComputedEphemerides> primaryObjectsEphemerides, List<ComputedEphemerides> secondaryObjectsEphemerides) {
        return Stream.concat(
                Stream.generate(new MixListSupplier<>(primaryObjectsEphemerides))
                        .limit(primaryObjectsEphemerides.size() * (primaryObjectsEphemerides.size() - 1) / 2),
                Stream.generate(new MixTwoListsSupplier<>(primaryObjectsEphemerides, secondaryObjectsEphemerides))
                        .limit(primaryObjectsEphemerides.size() * secondaryObjectsEphemerides.size()))
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemerides, CatalogueEntry>> generatePairs(List<ComputedEphemerides> primaryObjectsEphemerides, List<CatalogueEntry> catalogueEntries) {
        return Stream.generate(new MixTwoListsSupplier<>(primaryObjectsEphemerides, catalogueEntries))
                .limit(primaryObjectsEphemerides.size() * catalogueEntries.size())
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemerides, ComputedEphemerides>> getDetailedBodiesEphemerides(List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions, ObserverLocation observerLocation) {
        return preliminaryConjunctions.parallelStream()
                .map(StreamUtils.wrap(conjunction -> new Pair<>(
                        this.ephemeridesOrchestrator.compute(conjunction.firstObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation),
                        this.ephemeridesOrchestrator.compute(conjunction.secondObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation))))
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemerides, CatalogueEntry>> getDetailedEphemerides(List<Conjunction<BodyDetails, CatalogueEntry>> preliminaryConjunctions, ObserverLocation observerLocation) {
        return preliminaryConjunctions.parallelStream()
                .map(StreamUtils.wrap(conjunction -> new Pair<>(
                        this.ephemeridesOrchestrator.compute(conjunction.firstObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation),
                        conjunction.secondObject)))
                .collect(Collectors.toList());
    }
}
