package jp.albedo.webapp.events.eclipses;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.Radians;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.conjunctions.Conjunction2;
import jp.albedo.webapp.conjunctions.ConjunctionBetweenTwoBodiesFinder;
import jp.albedo.webapp.conjunctions.rest.ConjunctionEvent;
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

    private static final double MAX_SEPARATION = Math.toRadians(1.6);

    @Autowired
    private EphemeridesSolverProvider ephemeridesSolverProvider;

    /**
     * @param fromDate         Start instant of the period over which conjunctions should be looked for.
     * @param toDate           End of that period.
     * @param observerLocation Location (of the Earth) of the observer for which parallax correction should be made to the ephemerides.
     * @return List of conjunctions.
     */
    public List<EclipseEvent> compute(Double fromDate, Double toDate, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        final Instant start = Instant.now();

        LOG.info(String.format("Computing Sun and Moon eclipses, params: [from=%s, to=%s]", fromDate, toDate));

        final EphemeridesSolver ephemeridesSolver = this.ephemeridesSolverProvider.getEphemeridesForEarthSolver(ephemerisMethodPreference);

        final Stream<EclipseEvent> sunEclipseConjunctions = compute(ephemeridesSolver, BodyDetails.SUN, BodyDetails.MOON, fromDate, toDate, observerLocation)
                .map(FunctionUtils.wrap(conjunction -> buildEclipseEvent(conjunction, BodyDetails.SUN, BodyDetails.MOON, ephemeridesSolver, observerLocation)));

        final Stream<EclipseEvent> moonEclipseConjunctions = compute(ephemeridesSolver, BodyDetails.MOON, BodyDetails.EARTH_SHADOW, fromDate, toDate, observerLocation)
                .map(FunctionUtils.wrap(conjunction -> buildEclipseEvent(conjunction, BodyDetails.MOON, BodyDetails.EARTH_SHADOW, ephemeridesSolver, observerLocation)));

        final List<EclipseEvent> detailedConjunctions = Stream.concat(sunEclipseConjunctions, moonEclipseConjunctions)
                .collect(Collectors.toList());

        LOG.info(String.format("Found %d eclipses in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    private Stream<Conjunction2> compute(EphemeridesSolver ephemeridesSolver, BodyDetails firstBody, BodyDetails secondBody, Double fromDate, Double toDate, ObserverLocation observerLocation) throws Exception {

        final List<SimpleEphemeris> firstBodyEphemerides = ephemeridesSolver.computeSimple(firstBody, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);
        final List<SimpleEphemeris> secondBodyEphemerides = ephemeridesSolver.computeSimple(secondBody, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);

        LOG.info(String.format("Computed %d ephemerides for %s and %s", firstBodyEphemerides.size() * 2, firstBody.name, secondBody.name));

        final List<Conjunction2> preliminaryConjunctions = ConjunctionBetweenTwoBodiesFinder.findAll(firstBodyEphemerides, secondBodyEphemerides, MAX_SEPARATION * 1.2);

        LOG.info(String.format("Found %d preliminary conjunctions", preliminaryConjunctions.size()));

        final List<Pair<List<SimpleEphemeris>, List<SimpleEphemeris>>> detailedEphemerides = preliminaryConjunctions.stream()
                .map(conjunction -> conjunction.jde)
                .map(FunctionUtils.wrap(jde -> new Pair<>(
                                ephemeridesSolver.computeSimple(firstBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL, observerLocation),
                                ephemeridesSolver.computeSimple(secondBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL, observerLocation)
                )))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d detailed ephemerides", detailedEphemerides.size() > 0 ? detailedEphemerides.size() * detailedEphemerides.get(0).getFirst().size() * 2 : 0));

        return detailedEphemerides.stream()
                .map(ephemeridesPair -> ConjunctionBetweenTwoBodiesFinder.findAll(ephemeridesPair.getFirst(), ephemeridesPair.getSecond(), MAX_SEPARATION))
                .flatMap(List<Conjunction2>::stream);
    }

    private EclipseEvent buildEclipseEvent(Conjunction2 conjunction, BodyDetails firstBody, BodyDetails secondBody, EphemeridesSolver ephemeridesSolver, ObserverLocation observerLocation) throws EphemerisException {
        final Ephemeris finalFirstBodyEphemeris = ephemeridesSolver.compute(firstBody, conjunction.jde, observerLocation);
        final Ephemeris finalSecondBodyEphemeris = ephemeridesSolver.compute(secondBody, conjunction.jde, observerLocation);

        final double positionAngle = Radians.positionAngle(finalFirstBodyEphemeris.coordinates, finalSecondBodyEphemeris.coordinates);

        final EclipseBodyInfo firstBodyInfo = new EclipseBodyInfo(firstBody, finalFirstBodyEphemeris);
        final EclipseBodyInfo secondBodyInfo = new EclipseBodyInfo(secondBody, finalSecondBodyEphemeris);

        return new EclipseEvent(conjunction.jde, firstBodyInfo, secondBodyInfo, conjunction.separation, positionAngle);
    }

}
