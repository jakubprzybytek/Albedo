package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.BodyType;
import jp.albedo.utils.MixListSupplier;
import jp.albedo.utils.MixTwoListsSupplier;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.services.CatalogueService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class ConjunctionsOrchestrator {

    private static Log LOG = LogFactory.getLog(ConjunctionsOrchestrator.class);

    public static final double PRELIMINARY_INTERVAL = 1.0; // days

    public static final double DETAILED_SPAN = 2.0; // days

    public static final double DETAILED_INTERVAL = 1.0 / 24.0 / 6.0; // 10 mins

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    private ConjunctionsCalculator conjunctionsCalculator;

    @Autowired
    private CatalogueService catalogueService;

    public List<Conjunction<ComputedEphemerides, ComputedEphemerides>> computeForTwoMovingBodies(Set<BodyType> primaryBodyTypes, Set<BodyType> secondaryBodyTypes, Double fromDate, Double toDate) {
        LOG.info(String.format("Computing conjunctions for two moving bodies, params: [primary types:%s, secondary types:%s, from=%s, to=%s]", primaryBodyTypes, secondaryBodyTypes, fromDate, toDate));

        final Instant start = Instant.now();

        // compute ephemerides for all required body types
        Map<BodyType, List<ComputedEphemerides>> ephemeridesByType = Stream.concat(primaryBodyTypes.stream(), secondaryBodyTypes.stream())
                .distinct()
                .collect(Collectors.toMap(
                        bodyType -> bodyType,
                        bodyType -> {
                            try {
                                return this.ephemeridesOrchestrator.computeAll(bodyType, fromDate, toDate, PRELIMINARY_INTERVAL);
                            } catch (IOException e) {
                                throw new RuntimeException(e); // FixMe
                            }
                        }
                ));

        // generate pairs of ephemerides for further computations
        final List<Pair<ComputedEphemerides, ComputedEphemerides>> bodyPairs = Stream.generate(new MixTwoListsSupplier<>(primaryBodyTypes, secondaryBodyTypes))
                .limit(primaryBodyTypes.size() * secondaryBodyTypes.size())
                .map(bodyTypesPair -> {
                    if (bodyTypesPair.getFirst() == bodyTypesPair.getSecond()) {
                        final List<ComputedEphemerides> ephemeridesList = ephemeridesByType.get(bodyTypesPair.getFirst());
                        return Stream.generate(new MixListSupplier<>(ephemeridesList))
                                .limit(ephemeridesList.size() * (ephemeridesList.size() - 1) / 2);
                    } else {
                        final List<ComputedEphemerides> firstEphemeridesList = ephemeridesByType.get(bodyTypesPair.getFirst());
                        final List<ComputedEphemerides> secondEphemeridesList = ephemeridesByType.get(bodyTypesPair.getSecond());
                        return Stream.generate(new MixTwoListsSupplier<>(firstEphemeridesList, secondEphemeridesList))
                                .limit(firstEphemeridesList.size() * secondEphemeridesList.size());
                    }
                })
                .flatMap(Function.identity())
                .collect(Collectors.toList());

        final List<Conjunction<ComputedEphemerides, ComputedEphemerides>> preliminaryConjunctions = this.conjunctionsCalculator.calculateForTwoBodies(bodyPairs);

        final List<Pair<ComputedEphemerides, ComputedEphemerides>> closeEncounters = preliminaryConjunctions.parallelStream()
                .map(conjunction -> {
                    try {
                        return new Pair<>(
                                this.ephemeridesOrchestrator.compute(conjunction.first.getBodyDetails().name, conjunction.jde - DETAILED_SPAN / 2.0,
                                        conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL),
                                this.ephemeridesOrchestrator.compute(conjunction.second.getBodyDetails().name, conjunction.jde - DETAILED_SPAN / 2.0,
                                        conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL));
                    } catch (Exception e) {
                        throw new RuntimeException(e); // FixMe
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size() * 2, closeEncounters.size()));

        final List<Conjunction<ComputedEphemerides, ComputedEphemerides>> detailedConjunctions = this.conjunctionsCalculator.calculateForTwoBodies(closeEncounters).stream()
                .sorted((c1, c2) -> Double.compare(c1.jde, c2.jde))
                .collect(Collectors.toList());

        LOG.info(String.format("Found %d conjunctions in %s", closeEncounters.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    public List<Conjunction<ComputedEphemerides, CatalogueEntry>> computeForBodyAndCatalogueEntry(Set<BodyType> primaryBodyTypes, Double fromDate, Double toDate) {

        LOG.info(String.format("Computing conjunctions of one moving body and catalogue, params: [primary types:%s, from=%s, to=%s]", primaryBodyTypes, fromDate, toDate));

        final Instant start = Instant.now();

        // compute ephemerides for all required body types
        Map<BodyType, List<ComputedEphemerides>> ephemeridesByType = primaryBodyTypes.stream()
                .collect(Collectors.toMap(
                        bodyType -> bodyType,
                        bodyType -> {
                            try {
                                return this.ephemeridesOrchestrator.computeAll(bodyType, fromDate, toDate, PRELIMINARY_INTERVAL);
                            } catch (IOException e) {
                                throw new RuntimeException(e); // FixMe
                            }
                        }
                ));

        // generate pairs of ephemerides for further computations
        final List<Pair<ComputedEphemerides, CatalogueEntry>> pairsToCompare = primaryBodyTypes.stream()
                .map(bodyType -> {
                    try {
                        final List<ComputedEphemerides> firstEphemeridesList = ephemeridesByType.get(bodyType);
                        final List<CatalogueEntry> catalogueEntries = this.catalogueService.getOpenNgcCatalogue().getAllEntries();
                        return Stream.generate(new MixTwoListsSupplier<>(firstEphemeridesList, catalogueEntries))
                                .limit(firstEphemeridesList.size() * catalogueEntries.size());
                    } catch (IOException e) {
                        throw new RuntimeException(e); // FixMe
                    }
                })
                .flatMap(Function.identity())
                .collect(Collectors.toList());

        final List<Conjunction<ComputedEphemerides, CatalogueEntry>> preliminaryConjunctions = this.conjunctionsCalculator.calculateForBodyAndCatalogueEntry(pairsToCompare);

        final List<Pair<ComputedEphemerides, CatalogueEntry>> closeEncounters = preliminaryConjunctions.parallelStream()
                .map(conjunction -> {
                    try {
                        return new Pair<>(
                                this.ephemeridesOrchestrator.compute(conjunction.first.getBodyDetails().name, conjunction.jde - DETAILED_SPAN / 2.0,
                                        conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL),
                                conjunction.second);
                    } catch (Exception e) {
                        throw new RuntimeException(e); // FixMe
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size() * 2, closeEncounters.size()));

        final List<Conjunction<ComputedEphemerides, CatalogueEntry>> detailedConjunctions = this.conjunctionsCalculator.calculateForBodyAndCatalogueEntry(closeEncounters).stream()
                .sorted((c1, c2) -> Double.compare(c1.jde, c2.jde))
                .collect(Collectors.toList());

        LOG.info(String.format("Found %d conjunctions in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

}
