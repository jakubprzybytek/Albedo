package jp.albedo.webapp.events.eclipses;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.Radians;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.jpl.JplBody;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.conjunctions.Conjunction;
import jp.albedo.webapp.conjunctions.Conjunction2;
import jp.albedo.webapp.conjunctions.ConjunctionBetweenTwoBodiesFinder;
import jp.albedo.webapp.conjunctions.ConjunctionFinder;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesCalculator;
import jp.albedo.webapp.ephemeris.EphemeridesCalculatorProvider;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.ephemeris.ParallaxCorrection;
import jp.albedo.webapp.ephemeris.SimpleEphemerisParallaxCorrection;
import jp.albedo.webapp.events.eclipses.rest.EclipseBodyInfo;
import jp.albedo.webapp.events.eclipses.rest.EclipseBodyInfoOld;
import jp.albedo.webapp.events.eclipses.rest.EclipseEvent;
import jp.albedo.webapp.events.eclipses.rest.EclipseEventOld;
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
public class EclipsesOrchestrator {

    private static final Log LOG = LogFactory.getLog(EclipsesOrchestrator.class);

    private static final double PRELIMINARY_INTERVAL = 1.0 / 24.0; // hour

    private static final double DETAILED_SPAN = 2.0; // days

    private static final double DETAILED_INTERVAL = 1.0 / 24.0 / 60.0; // 1 min

    private static final double MAX_SEPARATION = Math.toRadians(0.6);

    @Autowired
    private EphemeridesCalculatorProvider ephemeridesCalculatorProvider;

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    /**
     * @param fromDate         Start instant of the period over which conjunctions should be looked for.
     * @param toDate           End of that period.
     * @param observerLocation Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    public List<EclipseEvent> compute(Double fromDate, Double toDate, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        LOG.info(String.format("Computing Sun eclipses, params: [from=%s, to=%s]", fromDate, toDate));

        final EphemeridesCalculator ephemeridesCalculator = this.ephemeridesCalculatorProvider.getEphemeridesCalculator(ephemerisMethodPreference);

        final Instant start = Instant.now();

        final List<SimpleEphemeris> sunEphemerides = ephemeridesCalculator.computeSimple(BodyDetails.SUN, fromDate, toDate, PRELIMINARY_INTERVAL).stream()
                .map(SimpleEphemerisParallaxCorrection.correctFor(observerLocation))
                .collect(Collectors.toList());
        final List<SimpleEphemeris> moonEphemerides = ephemeridesCalculator.computeSimple(BodyDetails.MOON, fromDate, toDate, PRELIMINARY_INTERVAL).stream()
                .map(SimpleEphemerisParallaxCorrection.correctFor(observerLocation))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d ephemerides for Sun and Moon", sunEphemerides.size() * 2));

        final List<Conjunction2> preliminaryConjunctions = ConjunctionBetweenTwoBodiesFinder.findAll(sunEphemerides, moonEphemerides, MAX_SEPARATION * 1.2);

        LOG.info(String.format("Found %d preliminary conjunctions", preliminaryConjunctions.size()));

        final List<Pair<List<SimpleEphemeris>, List<SimpleEphemeris>>> detailedEphemerides = preliminaryConjunctions.stream()
                .map(conjunction -> conjunction.jde)
                .map(FunctionUtils.wrap(jde -> new Pair<>(
                        ephemeridesCalculator.computeSimple(
                                BodyDetails.SUN,
                                jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL).stream()
                                    .map(SimpleEphemerisParallaxCorrection.correctFor(observerLocation))
                                    .collect(Collectors.toList()),
                        ephemeridesCalculator.computeSimple(
                                BodyDetails.MOON,
                                jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL).stream()
                                    .map(SimpleEphemerisParallaxCorrection.correctFor(observerLocation))
                                    .collect(Collectors.toList())
                )))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d detailed ephemerides", detailedEphemerides.size() * detailedEphemerides.get(0).getFirst().size() * 2));

        List<Conjunction2> detailedConjunctions = detailedEphemerides.stream()
                .map(ephemeridesPair -> ConjunctionBetweenTwoBodiesFinder.findAll(ephemeridesPair.getFirst(), ephemeridesPair.getSecond(), MAX_SEPARATION))
                .flatMap(List<Conjunction2>::stream)
                .collect(Collectors.toList());

        LOG.info(String.format("Found %d eclipses in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions.stream()
                .map(this::toEclipseEvent)
                .collect(Collectors.toList());
    }

    /**
     * @param fromDate         Start instant of the period over which conjunctions should be looked for.
     * @param toDate           End of that period.
     * @param observerLocation Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    public List<EclipseEventOld> computeOld(Double fromDate, Double toDate, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        LOG.info(String.format("Computing eclipses for Sun and Moon, params: [from=%s, to=%s]", fromDate, toDate));

        final Instant start = Instant.now();

        ComputedEphemeris<Ephemeris> sunEphemeris = this.ephemeridesOrchestrator.compute(BodyInformation.Sun.name(), fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation, ephemerisMethodPreference);
        ComputedEphemeris<Ephemeris> moonEphemeris = this.ephemeridesOrchestrator.compute(BodyInformation.Moon.name(), fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation, ephemerisMethodPreference);

        Pair<ComputedEphemeris<Ephemeris>, ComputedEphemeris<Ephemeris>> pair = new Pair<>(sunEphemeris, moonEphemeris);
        final List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions = ConjunctionFinder.forTwoBodies(pair, MAX_SEPARATION * 1.2);

        final List<Pair<ComputedEphemeris<Ephemeris>, ComputedEphemeris<Ephemeris>>> closeEncounters = getDetailedBodiesEphemerides(preliminaryConjunctions, observerLocation, ephemerisMethodPreference);
        LOG.info(String.format("Computed %d ephemerides for %d conjunctions", closeEncounters.size() * 2, closeEncounters.size()));

        final List<Conjunction<BodyDetails, BodyDetails>> detailedConjunctions = ConjunctionFinder.forTwoBodies(closeEncounters, MAX_SEPARATION);
        LOG.info(String.format("Found %d eclipses in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions.stream()
                .map(this::mapToEclipseEvent)
                .collect(Collectors.toList());
    }

    private List<Pair<ComputedEphemeris<Ephemeris>, ComputedEphemeris<Ephemeris>>> getDetailedBodiesEphemerides(List<Conjunction<BodyDetails, BodyDetails>> preliminaryConjunctions, ObserverLocation observerLocation, String ephemerisMethodPreference) {
        return preliminaryConjunctions.parallelStream()
                .map(FunctionUtils.wrap(conjunction -> new Pair<>(
                        this.ephemeridesOrchestrator.compute(conjunction.firstObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation, ephemerisMethodPreference),
                        this.ephemeridesOrchestrator.compute(conjunction.secondObject.name,
                                conjunction.jde - DETAILED_SPAN / 2.0, conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation, ephemerisMethodPreference))))
                .collect(Collectors.toList());
    }

    private EclipseEvent toEclipseEvent(Conjunction2 conjunction) {
        EclipseBodyInfo sunBodyInfo = new EclipseBodyInfo(BodyDetails.SUN, conjunction.firstBodyEphemeris);
        EclipseBodyInfo moonBodyInfo = new EclipseBodyInfo(BodyDetails.MOON, conjunction.secondBodyEphemeris);

        double positionAngle = Radians.positionAngle(conjunction.firstBodyEphemeris.coordinates, conjunction.secondBodyEphemeris.coordinates);

        return new EclipseEvent(conjunction.jde, sunBodyInfo, moonBodyInfo, conjunction.separation, positionAngle);
    }

    private EclipseEventOld mapToEclipseEvent(Conjunction<BodyDetails, BodyDetails> conjunction) {
        EclipseBodyInfoOld sunBodyInfo = new EclipseBodyInfoOld(conjunction.firstObject, conjunction.firstObjectEphemeris);
        EclipseBodyInfoOld moonBodyInfo = new EclipseBodyInfoOld(conjunction.secondObject, conjunction.secondObjectEphemeris);

        double positionAngle = Radians.positionAngle(conjunction.firstObjectEphemeris.coordinates, conjunction.secondObjectEphemeris.coordinates);

        return new EclipseEventOld(conjunction.jde, sunBodyInfo, moonBodyInfo, conjunction.separation, positionAngle);
    }

}
