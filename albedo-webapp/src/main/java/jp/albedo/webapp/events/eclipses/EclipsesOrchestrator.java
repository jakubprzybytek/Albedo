package jp.albedo.webapp.events.eclipses;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.Radians;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.conjunctions.Conjunction2;
import jp.albedo.webapp.conjunctions.ConjunctionBetweenTwoBodiesFinder;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.ephemeris.EphemeridesSolver;
import jp.albedo.webapp.ephemeris.EphemeridesSolverProvider;
import jp.albedo.webapp.ephemeris.EphemerisException;
import jp.albedo.webapp.events.eclipses.rest.EclipseBodyInfo;
import jp.albedo.webapp.events.eclipses.rest.EclipseEvent;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class EclipsesOrchestrator {

    private static final Log LOG = LogFactory.getLog(EclipsesOrchestrator.class);

    private static final double PRELIMINARY_INTERVAL = 1.0 / 24.0; // hour

    private static final double DETAILED_SPAN = 2.0; // days

    private static final double DETAILED_INTERVAL = 1.0 / 24.0 / 60.0; // 1 min

    private static final double MAX_SEPARATION = Math.toRadians(0.6);

    @Autowired
    private EphemeridesSolverProvider ephemeridesSolverProvider;

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    /**
     * @param fromDate         Start instant of the period over which conjunctions should be looked for.
     * @param toDate           End of that period.
     * @param observerLocation Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    public List<EclipseEvent> compute(Double fromDate, Double toDate, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        final Instant start = Instant.now();

        LOG.info(String.format("Computing Sun and Moon eclipses, params: [from=%s, to=%s]", fromDate, toDate));

        final EphemeridesSolver ephemeridesForEarthSolver = this.ephemeridesSolverProvider.getEphemeridesForEarthSolver(ephemerisMethodPreference);
        final EphemeridesSolver ephemeridesForSunSolver = this.ephemeridesSolverProvider.getEphemeridesForSunSolver(ephemerisMethodPreference);

        Stream<Conjunction2> sunEclipseConjunctions = compute(ephemeridesForEarthSolver, BodyDetails.SUN, BodyDetails.MOON, fromDate, toDate, Optional.of(observerLocation));
        Stream<Conjunction2> moonEclipseConjunctions = compute(ephemeridesForSunSolver, BodyDetails.EARTH, BodyDetails.MOON, fromDate, toDate, Optional.empty());

        Stream.concat(sunEclipseConjunctions, moonEclipseConjunctions)
                .map(FunctionUtils.wrap(conjunction -> buildEclipseEvent(conjunction, ephemeridesForEarthSolver, observerLocation)))
                .collect(Collectors.toList());

        LOG.info(String.format("Found %d eclipses in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions.stream()
                .map(FunctionUtils.wrap(conjunction -> buildEclipseEvent(conjunction, ephemeridesForEarthSolver, observerLocation)))
                .collect(Collectors.toList());
    }

    public List<EclipseEvent> computeOld(Double fromDate, Double toDate, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        LOG.info(String.format("Computing Sun eclipses, params: [from=%s, to=%s]", fromDate, toDate));

        final EphemeridesSolver ephemeridesSolver = this.ephemeridesSolverProvider.getEphemeridesForEarthSolver(ephemerisMethodPreference);

        final Instant start = Instant.now();

        final List<SimpleEphemeris> sunEphemerides = ephemeridesSolver.computeSimple(BodyDetails.SUN, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);
        final List<SimpleEphemeris> moonEphemerides = ephemeridesSolver.computeSimple(BodyDetails.MOON, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);

        LOG.info(String.format("Computed %d ephemerides for Sun and Moon", sunEphemerides.size() * 2));

        final List<Conjunction2> preliminaryConjunctions = ConjunctionBetweenTwoBodiesFinder.findAll(sunEphemerides, moonEphemerides, MAX_SEPARATION * 1.2);

        LOG.info(String.format("Found %d preliminary conjunctions", preliminaryConjunctions.size()));

        final List<Pair<List<SimpleEphemeris>, List<SimpleEphemeris>>> detailedEphemerides = preliminaryConjunctions.stream()
                .map(conjunction -> conjunction.jde)
                .map(FunctionUtils.wrap(jde -> new Pair<>(
                        ephemeridesSolver.computeSimple(
                                BodyDetails.SUN,
                                jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation),
                        ephemeridesSolver.computeSimple(
                                BodyDetails.MOON,
                                jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL,
                                observerLocation)
                )))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d detailed ephemerides", detailedEphemerides.size() * detailedEphemerides.get(0).getFirst().size() * 2));

        final List<Conjunction2> detailedConjunctions = detailedEphemerides.stream()
                .map(ephemeridesPair -> ConjunctionBetweenTwoBodiesFinder.findAll(ephemeridesPair.getFirst(), ephemeridesPair.getSecond(), MAX_SEPARATION))
                .flatMap(List<Conjunction2>::stream)
                .collect(Collectors.toList());

        LOG.info(String.format("Found %d eclipses in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions.stream()
                .map(FunctionUtils.wrap(conjunction -> buildEclipseEvent(conjunction, ephemeridesSolver, observerLocation)))
                .collect(Collectors.toList());
    }

    private Stream<Conjunction2> compute(EphemeridesSolver ephemeridesSolver, BodyDetails firstBody, BodyDetails secondBody, Double fromDate, Double toDate, Optional<ObserverLocation> observerLocation) throws Exception {

        final List<SimpleEphemeris> firstBodyEphemerides = observerLocation.isPresent() ?
                ephemeridesSolver.computeSimple(firstBody, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation.get()) :
                ephemeridesSolver.computeSimple(firstBody, fromDate, toDate, PRELIMINARY_INTERVAL);
        final List<SimpleEphemeris> secondBodyEphemerides = observerLocation.isPresent() ?
                ephemeridesSolver.computeSimple(secondBody, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation.get()) :
                ephemeridesSolver.computeSimple(secondBody, fromDate, toDate, PRELIMINARY_INTERVAL);

        LOG.info(String.format("Computed %d ephemerides for %s and %s", firstBodyEphemerides.size() * 2, firstBody.name, secondBody.name));

        final List<Conjunction2> preliminaryConjunctions = ConjunctionBetweenTwoBodiesFinder.findAll(firstBodyEphemerides, secondBodyEphemerides, MAX_SEPARATION * 1.2);

        LOG.info(String.format("Found %d preliminary conjunctions", preliminaryConjunctions.size()));

        final List<Pair<List<SimpleEphemeris>, List<SimpleEphemeris>>> detailedEphemerides = preliminaryConjunctions.stream()
                .map(conjunction -> conjunction.jde)
                .map(FunctionUtils.wrap(jde -> new Pair<>(
                        observerLocation.isPresent() ?
                                ephemeridesSolver.computeSimple(firstBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL, observerLocation.get()) :
                                ephemeridesSolver.computeSimple(firstBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL),
                        observerLocation.isPresent() ?
                                ephemeridesSolver.computeSimple(secondBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL, observerLocation.get()) :
                                ephemeridesSolver.computeSimple(secondBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL)
                )))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d detailed ephemerides", detailedEphemerides.size() * detailedEphemerides.get(0).getFirst().size() * 2));

        return detailedEphemerides.stream()
                .map(ephemeridesPair -> ConjunctionBetweenTwoBodiesFinder.findAll(ephemeridesPair.getFirst(), ephemeridesPair.getSecond(), MAX_SEPARATION))
                .flatMap(List<Conjunction2>::stream);
    }

    private EclipseEvent buildEclipseEvent(Conjunction2 conjunction, EphemeridesSolver ephemeridesSolver, ObserverLocation observerLocation) throws EphemerisException {
        final Ephemeris finalSunEphemeris = ephemeridesSolver.compute(BodyDetails.SUN, conjunction.jde, observerLocation);
        final Ephemeris finalMoonEphemeris = ephemeridesSolver.compute(BodyDetails.MOON, conjunction.jde, observerLocation);

        final double positionAngle = Radians.positionAngle(finalSunEphemeris.coordinates, finalMoonEphemeris.coordinates);

        final EclipseBodyInfo sunBodyInfo = new EclipseBodyInfo(BodyDetails.SUN, finalSunEphemeris);
        final EclipseBodyInfo moonBodyInfo = new EclipseBodyInfo(BodyDetails.MOON, finalMoonEphemeris);

        return new EclipseEvent(conjunction.jde, sunBodyInfo, moonBodyInfo, conjunction.separation, positionAngle);
    }

}
