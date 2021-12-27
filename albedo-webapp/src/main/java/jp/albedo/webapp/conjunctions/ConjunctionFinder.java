package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.Radians;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.conjunctions.impl.LocalMinimumsFindingCollector;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ConjunctionFinder {

    private static final Log LOG = LogFactory.getLog(ConjunctionFinder.class);

    /**
     * Finds conjunctions between pairs of ephemerides by looking for smallest separation.
     *
     * @param pairOfBodies
     * @param maxSeparation Maximal separation that would constitute for a conjunctions. Encounters separated more than that will be ignored.
     * @return List of conjunctions.
     */
    public static List<Conjunction<BodyDetails, BodyDetails>> forTwoBodies(Pair<ComputedEphemeris, ComputedEphemeris> pairOfBodies, double maxSeparation) {
        return forTwoBodies(Collections.singletonList(pairOfBodies), maxSeparation);
    }

    /**
     * Finds conjunctions between pairs of ephemerides by looking for smallest separation.
     *
     * @param pairOfBodies
     * @param maxSeparation Maximal separation that would constitute for a conjunctions. Encounters separated more than that will be ignored.
     * @return List of conjunctions.
     */
    public static List<Conjunction<BodyDetails, BodyDetails>> forTwoBodies(List<Pair<ComputedEphemeris, ComputedEphemeris>> pairOfBodies, double maxSeparation) {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Calculating conjunctions for %d body pairs", pairOfBodies.size()));
        }

        final Instant start = Instant.now();

        // Compare all bodies between each other
        List<Conjunction<BodyDetails, BodyDetails>> conjunctions = pairOfBodies.parallelStream()
                .map(ConjunctionFinder::findConjunctionsBetweenTwoBodies)
                .flatMap(List<Conjunction<BodyDetails, BodyDetails>>::stream)
                .filter(bodiesPair -> bodiesPair.separation < maxSeparation)
                .peek(conjunction -> {
                    if (LOG.isDebugEnabled()) {
                        LOG.debug(String.format("Separation between %s and %s on %.1fTD: %.4f°",
                                conjunction.firstObject.name, conjunction.secondObject.name, conjunction.jde, Math.toDegrees(conjunction.separation)));
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Compared %d pairs of ephemeris, found %d conjunctions in %s", pairOfBodies.size(), conjunctions.size(), Duration.between(start, Instant.now())));

        return conjunctions;
    }

    /**
     * Finds conjunctions between body and catalogue entries by looking for smallest separation.
     *
     * @param pairToCompare
     * @param maxSeparation Maximal separation that would constitute for a conjunctions. Encounters separated more than that will be ignored.
     * @return List of conjunctions.
     */
    public static List<Conjunction<BodyDetails, CatalogueEntry>> forBodyAndCatalogueEntry(List<Pair<ComputedEphemeris, CatalogueEntry>> pairToCompare, double maxSeparation) {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Calculating conjunctions for %d pairs of objects", pairToCompare.size()));
        }

        final Instant start = Instant.now();

        // Compare all bodies between each other
        List<Conjunction<BodyDetails, CatalogueEntry>> conjunctions = pairToCompare.parallelStream()
                .map(ConjunctionFinder::findConjunctionsBetweenBodyAndCatalogueEntry)
                .flatMap(List<Conjunction<BodyDetails, CatalogueEntry>>::stream)
                .filter(bodiesPair -> bodiesPair.separation < maxSeparation)
                .peek(conjunction -> {
                    if (LOG.isDebugEnabled()) {
                        LOG.debug(String.format("Separation between %s and %s on %.1fTD: %.4f°",
                                conjunction.firstObject.name, conjunction.secondObject.name, conjunction.jde, Math.toDegrees(conjunction.separation)));
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Compared %d pairs of ephemeris, found %d conjunctions in %s", pairToCompare.size(), conjunctions.size(), Duration.between(start, Instant.now())));

        return conjunctions;
    }

    /**
     * Finds conjunctions by analysing separation between two bodies using provided ephemerides.
     *
     * @param pairOfBodies
     * @return List of conjunctions.
     */
    static List<Conjunction<BodyDetails, BodyDetails>> findConjunctionsBetweenTwoBodies(Pair<ComputedEphemeris, ComputedEphemeris> pairOfBodies) {

        return StreamUtils
                .zip(
                        pairOfBodies.getFirst().getEphemerisList().stream(),
                        pairOfBodies.getSecond().getEphemerisList().stream(),
                        Pair::new)
                .collect(LocalMinimumsFindingCollector.of(
                        (ephemerisPair) -> Radians.separation(ephemerisPair.getFirst().coordinates, ephemerisPair.getSecond().coordinates),
                        (ephemerisPair, separation) -> new Conjunction<>(
                                ephemerisPair.getFirst().jde,
                                separation,
                                separation / computeAverageSize(ephemerisPair.getFirst(), ephemerisPair.getSecond()),
                                pairOfBodies.getFirst().getBodyDetails(),
                                ephemerisPair.getFirst(),
                                pairOfBodies.getSecond().getBodyDetails(),
                                ephemerisPair.getSecond())
                ));
    }

    static double computeAverageSize(Ephemeris firstEphemeris, Ephemeris secondEphemeris) {
        return ((firstEphemeris.angularSize != null ? firstEphemeris.angularSize : Radians.fromDegrees(0, 0, 1))
                + (secondEphemeris.angularSize != null ? secondEphemeris.angularSize : Radians.fromDegrees(0, 0, 1))) / 2.0;
    }

    /**
     * Finds conjunctions by analysing separation between one body and catalogue entry using provided ephemerides.
     *
     * @param pairToCompare
     * @return List of conjunctions.
     */
    static List<Conjunction<BodyDetails, CatalogueEntry>> findConjunctionsBetweenBodyAndCatalogueEntry(Pair<ComputedEphemeris, CatalogueEntry> pairToCompare) {

        return pairToCompare.getFirst().getEphemerisList().stream()
                .collect(LocalMinimumsFindingCollector.of(
                        (ephemeris) -> Radians.separation(ephemeris.coordinates, pairToCompare.getSecond().coordinates),
                        (ephemeris, separation) -> new Conjunction<>(
                                ephemeris.jde,
                                separation,
                                separation / computeAverageSize(ephemeris, pairToCompare.getSecond()),
                                pairToCompare.getFirst().getBodyDetails(),
                                ephemeris,
                                pairToCompare.getSecond(),
                                null)
                ));
    }

    static double computeAverageSize(Ephemeris firstEphemeris, CatalogueEntry catalogueEntry) {
        final double catalogueEntrySize = (catalogueEntry.minorAxisSize != null ? (catalogueEntry.majorAxisSize + catalogueEntry.minorAxisSize) / 2.0
                : (catalogueEntry.majorAxisSize != null ? catalogueEntry.majorAxisSize : Radians.fromDegrees(0, 0, 1)));
        return ((firstEphemeris.angularSize != null ? firstEphemeris.angularSize : Radians.fromDegrees(0, 0, 1))
                + Math.toRadians(catalogueEntrySize / 60.0)) / 2.0;
    }
}
