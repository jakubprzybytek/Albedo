package jp.albedo.webapp.asteroidConjunctions;

import jp.albedo.common.Angles;
import jp.albedo.utils.MixListsSupplier;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class ConjunctionsCalculator {

    private static Log LOG = LogFactory.getLog(ConjunctionsCalculator.class);

    public List<Pair<ComputedEphemerides, ComputedEphemerides>> mix(List<ComputedEphemerides> bodies) {

        // Mix body data and generate all possible pairs
        return Stream.generate(new MixListsSupplier<>(bodies))
                .limit(bodies.size() * (bodies.size() - 1) / 2)
                .collect(Collectors.toList());
    }

    public List<Conjunction> calculate(List<Pair<ComputedEphemerides, ComputedEphemerides>> bodyPairs) {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Calculating conjunctions for %d body pairs", bodyPairs.size()));
        }

        final Instant start = Instant.now();

        // Compare all bodies between each other
        List<Conjunction> conjunctions = bodyPairs.parallelStream()
                .map(this::findConjunctions)
                .flatMap(List<Conjunction>::stream)
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
     * Finds conjunctions by analysing separation between two bodies using provided ephemerides.
     *
     * @param bodiesPair
     * @return
     */
    protected List<Conjunction> findConjunctions(Pair<ComputedEphemerides, ComputedEphemerides> bodiesPair) {

        return StreamUtils
                .zip(
                        bodiesPair.getFirst().getEphemerides().stream(),
                        bodiesPair.getSecond().getEphemerides().stream(),
                        (leftEphemeris, rightEphemeris) -> new Pair<>(leftEphemeris, rightEphemeris))
                .collect(Collector.of(
                        () -> new ConjunctionFind(),
                        (findContext, ephemerisPair) -> {
                            final double separation = Angles.separation(ephemerisPair.getFirst().coordinates, ephemerisPair.getSecond().coordinates);
                            if (separation > findContext.lastMinSeparation) {
                                if (!findContext.addedLocalMin) {
                                    findContext.result.add(new Conjunction(
                                            findContext.lastJde,
                                            findContext.lastMinSeparation,
                                            bodiesPair.getFirst(),
                                            bodiesPair.getSecond()));

                                    findContext.addedLocalMin = true;
                                }
                            } else {
                                findContext.addedLocalMin = false;
                            }
                            findContext.lastMinSeparation = separation;
                            findContext.lastJde = ephemerisPair.getFirst().jde;
                        },
                        (findContext1, findContext2) -> {
                            throw new RuntimeException("Cannot collect concurrent results");
                        },
                        (findContext) -> findContext.result));
    }

    private static class ConjunctionFind {

        public double lastMinSeparation = Double.MAX_VALUE;

        public double lastJde;

        public boolean addedLocalMin;

        public List<Conjunction> result = new ArrayList<>();

    }

}
