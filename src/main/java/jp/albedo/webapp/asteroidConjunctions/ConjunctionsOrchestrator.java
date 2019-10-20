package jp.albedo.webapp.asteroidConjunctions;


import jp.albedo.common.BodyType;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<Conjunction> compute(Double fromDate, Double toDate) {
        LOG.info(String.format("Computing conjunctions, params: [from=%s, to=%s]", fromDate, toDate));

        final Instant start = Instant.now();

        final List<ComputedEphemerides> ephemeridesList = this.ephemeridesOrchestrator.computeAll(BodyType.Planet, fromDate, toDate, PRELIMINARY_INTERVAL);

        final List<Pair<ComputedEphemerides, ComputedEphemerides>> bodyPairs = this.conjunctionsCalculator.mix(ephemeridesList);
        final List<Conjunction> preliminaryConjunctions = this.conjunctionsCalculator.calculate(bodyPairs);

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

        final List<Conjunction> detailedConjunctions = this.conjunctionsCalculator.calculate(closeEncounters);

        LOG.info(String.format("Found %d conjunctions in %s", closeEncounters.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

}
