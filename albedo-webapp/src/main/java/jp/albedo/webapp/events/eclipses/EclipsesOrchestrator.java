package jp.albedo.webapp.events.eclipses;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueName;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.BodyType;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.utils.MixListSupplier;
import jp.albedo.utils.MixTwoListsSupplier;
import jp.albedo.webapp.catalogue.DsoCatalogueRepository;
import jp.albedo.webapp.conjunctions.Conjunction;
import jp.albedo.webapp.conjunctions.ConjunctionFinder;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
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
public class EclipsesOrchestrator {

    private static final Log LOG = LogFactory.getLog(EclipsesOrchestrator.class);

    private static final double PRELIMINARY_INTERVAL = 1.0 / 24.0; // hour

    private static final double DETAILED_SPAN = 2.0; // days

    private static final double DETAILED_INTERVAL = 1.0 / 24.0 / 60.0; // 1 min

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    /**
     *
     * @param fromDate           Start instant of the period over which conjunctions should be looked for.
     * @param toDate             End of that period.
     * @param observerLocation   Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    public List<Conjunction<BodyDetails, BodyDetails>> compute(Double fromDate, Double toDate, ObserverLocation observerLocation) throws Exception {

        LOG.info(String.format("Computing eclipses for Sun and Moon, params: [from=%s, to=%s]", fromDate, toDate));

        final Instant start = Instant.now();

        ComputedEphemeris sunEphemeris = this.ephemeridesOrchestrator.compute(BodyInformation.Sun.name(), fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);
        ComputedEphemeris moonEphemeris = this.ephemeridesOrchestrator.compute(BodyInformation.Moon.name(), fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);

        Pair<ComputedEphemeris, ComputedEphemeris> pair = new Pair<>(sunEphemeris, moonEphemeris);
        final List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions = ConjunctionFinder.forTwoBodies(pair);

        final List<Pair<ComputedEphemeris, ComputedEphemeris>> closeEncounters = getDetailedBodiesEphemerides(preliminaryConjunctions, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size() * 2, closeEncounters.size()));

        final List<Conjunction<BodyDetails, BodyDetails>> detailedConjunctions = ConjunctionFinder.forTwoBodies(closeEncounters);
        LOG.info(String.format("Found %d eclipses in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
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

}