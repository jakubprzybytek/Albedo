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

    List<Conjunction<BodyDetails, BodyDetails>> computeForTwoMovingBodies(
            Set<BodyType> primaryBodyTypes, Set<BodyType> secondaryBodyTypes,
            Double fromDate, Double toDate,
            ObserverLocation observerLocation) {

        LOG.info(String.format("Computing conjunctions for two moving bodies, params: [primary types:%s, secondary types:%s, from=%s, to=%s]", primaryBodyTypes, secondaryBodyTypes, fromDate, toDate));

        final Instant start = Instant.now();

        // compute ephemerides for all required body types
        final Map<BodyType, List<ComputedEphemerides>> ephemeridesByType = Stream.concat(primaryBodyTypes.stream(), secondaryBodyTypes.stream())
                .distinct()
                .collect(Collectors.toMap(
                        bodyType -> bodyType,
                        StreamUtils.wrap(bodyType -> this.ephemeridesOrchestrator.computeAll(bodyType, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation))
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

        final List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions = this.conjunctionsCalculator.calculateForTwoBodies(bodyPairs);

        final List<Pair<ComputedEphemerides, ComputedEphemerides>> closeEncounters = preliminaryConjunctions.parallelStream()
                .map(StreamUtils.wrap(conjunction -> new Pair<>(
                        this.ephemeridesOrchestrator.compute(conjunction.firstObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation),
                        this.ephemeridesOrchestrator.compute(conjunction.secondObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation))))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size() * 2, closeEncounters.size()));

        final List<Conjunction<BodyDetails, BodyDetails>> detailedConjunctions = this.conjunctionsCalculator.calculateForTwoBodies(closeEncounters);

        LOG.info(String.format("Found %d conjunctions in %s", closeEncounters.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    List<Conjunction<BodyDetails, CatalogueEntry>> computeForBodyAndCatalogueEntry(
            Set<BodyType> primaryBodyTypes, Set<CatalogueType> catalogueTypes,
            Double fromDate, Double toDate,
            ObserverLocation observerLocation) {

        LOG.info(String.format("Computing conjunctions of one moving body and catalogue, params: [primary types:%s, catalogues:%s, from=%s, to=%s], observer location: %s", primaryBodyTypes, catalogueTypes, fromDate, toDate, observerLocation));

        final Instant start = Instant.now();

        // compute ephemerides for all required body types
        final Map<BodyType, List<ComputedEphemerides>> ephemeridesByType = primaryBodyTypes.stream()
                .collect(Collectors.toMap(
                        bodyType -> bodyType,
                        StreamUtils.wrap(bodyType -> this.ephemeridesOrchestrator.computeAll(bodyType, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation))
                ));

        // generate pairs of ephemerides and catalogue entries for further computations
        final List<Pair<ComputedEphemerides, CatalogueEntry>> pairsToCompare = Stream.generate(new MixTwoListsSupplier<>(primaryBodyTypes, catalogueTypes))
                .limit(primaryBodyTypes.size() * catalogueTypes.size())
                .map(bodyAndCatalogueEntryPair -> {
                    try {
                        final List<ComputedEphemerides> ephemeridesList = ephemeridesByType.get(bodyAndCatalogueEntryPair.getFirst());
                        final List<CatalogueEntry> catalogueEntries = this.catalogueService.getCatalogue(bodyAndCatalogueEntryPair.getSecond()).getAllEntries();
                        return Stream.generate(new MixTwoListsSupplier<>(ephemeridesList, catalogueEntries))
                                .limit(ephemeridesList.size() * catalogueEntries.size());
                    } catch (IOException e) {
                        throw new RuntimeException(e); // FixMe
                    }
                })
                .flatMap(Function.identity())
                .collect(Collectors.toList());

        final List<Conjunction<BodyDetails, CatalogueEntry>> preliminaryConjunctions = this.conjunctionsCalculator.calculateForBodyAndCatalogueEntry(pairsToCompare);

        final List<Pair<ComputedEphemerides, CatalogueEntry>> closeEncounters = preliminaryConjunctions.parallelStream()
                .map(StreamUtils.wrap(conjunction -> new Pair<>(
                        this.ephemeridesOrchestrator.compute(conjunction.firstObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation),
                        conjunction.secondObject)))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size(), closeEncounters.size()));

        final List<Conjunction<BodyDetails, CatalogueEntry>> detailedConjunctions = this.conjunctionsCalculator.calculateForBodyAndCatalogueEntry(closeEncounters);

        LOG.info(String.format("Found %d conjunctions in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

}
