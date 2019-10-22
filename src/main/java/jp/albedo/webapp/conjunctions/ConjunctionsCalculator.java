package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.Angles;
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
public class ConjunctionsCalculator {

    private static Log LOG = LogFactory.getLog(ConjunctionsCalculator.class);

    /**
     * Finds conjunctions between pairs of ephemerides by looking for smallest separation.
     *
     * @param bodyPairs
     * @return List of conjunctions.
     */
    public List<Conjunction<ComputedEphemerides, ComputedEphemerides>> calculateForTwoBodies(List<Pair<ComputedEphemerides, ComputedEphemerides>> bodyPairs) {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Calculating conjunctions for %d body pairs", bodyPairs.size()));
        }

        final Instant start = Instant.now();

        // Compare all bodies between each other
        List<Conjunction<ComputedEphemerides, ComputedEphemerides>> conjunctions = bodyPairs.parallelStream()
                .map(this::findConjunctions)
                .flatMap(List<Conjunction<ComputedEphemerides, ComputedEphemerides>>::stream)
                .filter(bodiesPair -> bodiesPair.separation < Math.toRadians(1.00))
                .peek(conjunction -> {
                    if (LOG.isDebugEnabled()) {
                        LOG.debug(String.format("Separation between %s and %s on %.1fTD: %.4f°",
                                conjunction.first.getBodyDetails().name, conjunction.second.getBodyDetails().name, conjunction.jde, Math.toDegrees(conjunction.separation)));
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Compared %d pairs of ephemeris, found %d conjunctions in %s", bodyPairs.size(), conjunctions.size(), Duration.between(start, Instant.now())));

        return conjunctions;
    }

    /**
     * Finds conjunctions between body and catalogue entries by looking for smallest separation.
     *
     * @param pairToCompare
     * @return List of conjunctions.
     */
    public List<Conjunction<ComputedEphemerides, CatalogueEntry>> calculateForBodyAndCatalogueEntry(List<Pair<ComputedEphemerides, CatalogueEntry>> pairToCompare) {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Calculating conjunctions for %d pairs of objects", pairToCompare.size()));
        }

        final Instant start = Instant.now();

        // Compare all bodies between each other
        List<Conjunction<ComputedEphemerides, CatalogueEntry>> conjunctions = pairToCompare.parallelStream()
                .map(this::findConjunctionsWithCatalogue)
                .flatMap(List<Conjunction<ComputedEphemerides, CatalogueEntry>>::stream)
                .filter(bodiesPair -> bodiesPair.separation < Math.toRadians(1.00))
                .peek(conjunction -> {
                    if (LOG.isDebugEnabled()) {
                        LOG.debug(String.format("Separation between %s and %s on %.1fTD: %.4f°",
                                conjunction.first.getBodyDetails().name, conjunction.second.name, conjunction.jde, Math.toDegrees(conjunction.separation)));
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Compared %d pairs of ephemeris, found %d conjunctions in %s", pairToCompare.size(), conjunctions.size(), Duration.between(start, Instant.now())));

        return conjunctions;
    }

    /**
     * Finds conjunctions by analysing separation between two bodies using provided ephemerides.
     *
     * @param bodiesPair
     * @return List of conjunctions.
     */
    protected List<Conjunction<ComputedEphemerides, ComputedEphemerides>> findConjunctions(Pair<ComputedEphemerides, ComputedEphemerides> bodiesPair) {

        return StreamUtils
                .zip(
                        bodiesPair.getFirst().getEphemerides().stream(),
                        bodiesPair.getSecond().getEphemerides().stream(),
                        Pair::new)
                .collect(LocalMinimumsFindingCollector.of(
                        (ephemerisPair) -> Angles.separation(ephemerisPair.getFirst().coordinates, ephemerisPair.getSecond().coordinates),
                        (findContext) -> new Conjunction<>(
                                findContext.lastJde,
                                findContext.lastMinSeparation,
                                bodiesPair.getFirst(),
                                bodiesPair.getSecond()),
                        (ephemerisPair) -> ephemerisPair.getFirst().jde
                ));
    }

    /**
     * Finds conjunctions by analysing separation between one body and catalogue entry using provided ephemerides.
     *
     * @param pairToCompare
     * @return List of conjunctions.
     */
    protected List<Conjunction<ComputedEphemerides, CatalogueEntry>> findConjunctionsWithCatalogue(Pair<ComputedEphemerides, CatalogueEntry> pairToCompare) {

        return pairToCompare.getFirst().getEphemerides().stream()
                .collect(LocalMinimumsFindingCollector.of(
                        (ephemeris) -> Angles.separation(ephemeris.coordinates, pairToCompare.getSecond().coordinates),
                        (findContext) -> new Conjunction<>(
                                findContext.lastJde,
                                findContext.lastMinSeparation,
                                pairToCompare.getFirst(),
                                pairToCompare.getSecond()),
                        (ephemeris) -> ephemeris.jde
                ));
    }

}
