package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.Radians;
import jp.albedo.common.BodyDetails;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.conjunctions.impl.LocalMinimumsFindingCollector;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Component
class ConjunctionsCalculator {

    private static Log LOG = LogFactory.getLog(ConjunctionsCalculator.class);

    /**
     * Finds conjunctions between pairs of ephemerides by looking for smallest separation.
     *
     * @param pairOfBodies
     * @return List of conjunctions.
     */
    List<Conjunction<BodyDetails, BodyDetails>> calculateForTwoBodies(List<Pair<ComputedEphemerides, ComputedEphemerides>> pairOfBodies) {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Calculating conjunctions for %d body pairs", pairOfBodies.size()));
        }

        final Instant start = Instant.now();

        // Compare all bodies between each other
        List<Conjunction<BodyDetails, BodyDetails>> conjunctions = pairOfBodies.parallelStream()
                .map(this::findConjunctionsBetweenTwoBodies)
                .flatMap(List<Conjunction<BodyDetails, BodyDetails>>::stream)
                .filter(bodiesPair -> bodiesPair.separation < Math.toRadians(1.00))
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
     * @return List of conjunctions.
     */
    List<Conjunction<BodyDetails, CatalogueEntry>> calculateForBodyAndCatalogueEntry(List<Pair<ComputedEphemerides, CatalogueEntry>> pairToCompare) {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Calculating conjunctions for %d pairs of objects", pairToCompare.size()));
        }

        final Instant start = Instant.now();

        // Compare all bodies between each other
        List<Conjunction<BodyDetails, CatalogueEntry>> conjunctions = pairToCompare.parallelStream()
                .map(this::findConjunctionsBetweenBodyAndCatalogueEntry)
                .flatMap(List<Conjunction<BodyDetails, CatalogueEntry>>::stream)
                .filter(bodiesPair -> bodiesPair.separation < Math.toRadians(1.00))
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
    List<Conjunction<BodyDetails, BodyDetails>> findConjunctionsBetweenTwoBodies(Pair<ComputedEphemerides, ComputedEphemerides> pairOfBodies) {

        return StreamUtils
                .zip(
                        pairOfBodies.getFirst().getEphemerides().stream(),
                        pairOfBodies.getSecond().getEphemerides().stream(),
                        Pair::new)
                .collect(LocalMinimumsFindingCollector.of(
                        (ephemerisPair) -> Radians.separation(ephemerisPair.getFirst().coordinates, ephemerisPair.getSecond().coordinates),
                        (ephemerisPair, separation) -> new Conjunction<>(
                                ephemerisPair.getFirst().jde,
                                separation,
                                pairOfBodies.getFirst().getBodyDetails(),
                                ephemerisPair.getFirst(),
                                pairOfBodies.getSecond().getBodyDetails(),
                                ephemerisPair.getSecond())
                ));
    }

    /**
     * Finds conjunctions by analysing separation between one body and catalogue entry using provided ephemerides.
     *
     * @param pairToCompare
     * @return List of conjunctions.
     */
    List<Conjunction<BodyDetails, CatalogueEntry>> findConjunctionsBetweenBodyAndCatalogueEntry(Pair<ComputedEphemerides, CatalogueEntry> pairToCompare) {

        return pairToCompare.getFirst().getEphemerides().stream()
                .collect(LocalMinimumsFindingCollector.of(
                        (ephemeris) -> Radians.separation(ephemeris.coordinates, pairToCompare.getSecond().coordinates),
                        (ephemeris, separation) -> new Conjunction<>(
                                ephemeris.jde,
                                separation,
                                pairToCompare.getFirst().getBodyDetails(),
                                ephemeris,
                                pairToCompare.getSecond(),
                                null)
                ));
    }

}
