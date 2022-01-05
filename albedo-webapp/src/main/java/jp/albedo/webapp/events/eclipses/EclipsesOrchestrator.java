package jp.albedo.webapp.events.eclipses;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.Radians;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.ephemeris.common.AngularSize;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.jpl.JplConstant;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.conjunctions.Conjunction2;
import jp.albedo.webapp.conjunctions.ConjunctionBetweenTwoBodiesFinder;
import jp.albedo.webapp.ephemeris.EphemeridesSolver;
import jp.albedo.webapp.ephemeris.EphemeridesSolverProvider;
import jp.albedo.webapp.ephemeris.EphemerisException;
import jp.albedo.webapp.events.eclipses.rest.EarthShadowInfo;
import jp.albedo.webapp.events.eclipses.rest.EclipseEvent;
import jp.albedo.webapp.events.eclipses.rest.EclipseObjectInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class EclipsesOrchestrator {

    private static final Log LOG = LogFactory.getLog(EclipsesOrchestrator.class);

    private static final double PRELIMINARY_INTERVAL = 1.0 / 24.0; // hour

    private static final double DETAILED_SPAN = 2.0; // days

    private static final double DETAILED_INTERVAL = 1.0 / 24.0 / 60.0; // 1 min

    private static final double SUN_ECLIPSE_MAX_SEPARATION = Math.toRadians(0.55);

    private static final double MOON_ECLIPSE_MAX_SEPARATION = Math.toRadians(1.6);

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

        LOG.info(String.format("Finding Sun and Moon eclipses, params: [from=%s, to=%s]", fromDate, toDate));

        final EphemeridesSolver ephemeridesSolver = this.ephemeridesSolverProvider.getEphemeridesForEarthSolver(ephemerisMethodPreference);

        final List<SimpleEphemeris> sunEphemerides = ephemeridesSolver.computeSimple(BodyDetails.SUN, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for Sun using %s", sunEphemerides.size(), ephemeridesSolver.getName()));

        final List<SimpleEphemeris> moonEphemerides = ephemeridesSolver.computeSimple(BodyDetails.MOON, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for Moon using %s", moonEphemerides.size(), ephemeridesSolver.getName()));

        final List<SimpleEphemeris> earthShadowEphemerides = ephemeridesSolver.computeSimple(BodyDetails.EARTH_SHADOW, fromDate, toDate, PRELIMINARY_INTERVAL, observerLocation);
        LOG.info(String.format("Computed %d ephemerides for Earth Shadow using %s", earthShadowEphemerides.size(), ephemeridesSolver.getName()));

        final Stream<EclipseEvent> sunEclipseConjunctions = compute(BodyDetails.SUN, sunEphemerides, BodyDetails.MOON, moonEphemerides, SUN_ECLIPSE_MAX_SEPARATION,ephemeridesSolver, observerLocation)
                .map(FunctionUtils.wrap(conjunction -> buildSunEclipseEvent(conjunction, ephemeridesSolver, observerLocation)));

        final Stream<EclipseEvent> moonEclipseConjunctions = compute(BodyDetails.MOON, moonEphemerides, BodyDetails.EARTH_SHADOW, earthShadowEphemerides, MOON_ECLIPSE_MAX_SEPARATION, ephemeridesSolver, observerLocation)
                .map(FunctionUtils.wrap(conjunction -> buildMoonEclipseEvent(conjunction, ephemeridesSolver, observerLocation)));

        final List<EclipseEvent> detailedConjunctions = Stream.concat(sunEclipseConjunctions, moonEclipseConjunctions)
                .sorted(Comparator.comparingDouble(AstronomicalEvent::getJde))
                .collect(Collectors.toList());

        LOG.info(String.format("Found %d eclipses in %s", detailedConjunctions.size(), Duration.between(start, Instant.now())));

        return detailedConjunctions;
    }

    private Stream<Conjunction2> compute(
            BodyDetails firstBody, List<SimpleEphemeris> firstBodyEphemerides,
            BodyDetails secondBody, List<SimpleEphemeris> secondBodyEphemerides,
            double maxSeparation,
            EphemeridesSolver ephemeridesSolver,
            ObserverLocation observerLocation) {

        final List<Conjunction2> preliminaryConjunctions = ConjunctionBetweenTwoBodiesFinder.findAll(firstBodyEphemerides, secondBodyEphemerides, maxSeparation * 1.2);

        LOG.info(String.format("Found %d preliminary conjunctions between %s and %s", preliminaryConjunctions.size(), firstBody.name, secondBody.name));

        final List<Pair<List<SimpleEphemeris>, List<SimpleEphemeris>>> detailedEphemerides = preliminaryConjunctions.stream()
                .map(conjunction -> conjunction.jde)
                .map(FunctionUtils.wrap(jde -> new Pair<>(
                        ephemeridesSolver.computeSimple(firstBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL, observerLocation),
                        ephemeridesSolver.computeSimple(secondBody, jde - DETAILED_SPAN / 2.0, jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL, observerLocation)
                )))
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d detailed ephemerides", detailedEphemerides.size() > 0 ? detailedEphemerides.size() * detailedEphemerides.get(0).getFirst().size() * 2 : 0));

        return detailedEphemerides.stream()
                .map(ephemeridesPair -> ConjunctionBetweenTwoBodiesFinder.findAll(ephemeridesPair.getFirst(), ephemeridesPair.getSecond(), maxSeparation))
                .flatMap(List<Conjunction2>::stream);
    }

    private EclipseEvent buildSunEclipseEvent(Conjunction2 conjunction, EphemeridesSolver ephemeridesSolver, ObserverLocation observerLocation) throws EphemerisException {
        final Ephemeris finalFirstBodyEphemeris = ephemeridesSolver.compute(BodyDetails.SUN, conjunction.jde, observerLocation);
        final Ephemeris finalSecondBodyEphemeris = ephemeridesSolver.compute(BodyDetails.MOON, conjunction.jde, observerLocation);

        final double positionAngle = Radians.positionAngle(finalFirstBodyEphemeris.coordinates, finalSecondBodyEphemeris.coordinates);

        final EclipseObjectInfo firstBodyInfo = new EclipseObjectInfo(BodyDetails.SUN, finalFirstBodyEphemeris);
        final EclipseObjectInfo secondBodyInfo = new EclipseObjectInfo(BodyDetails.MOON, finalSecondBodyEphemeris);

        return new EclipseEvent(conjunction.jde, firstBodyInfo, secondBodyInfo, conjunction.separation, positionAngle);
    }

    private EclipseEvent buildMoonEclipseEvent(Conjunction2 conjunction, EphemeridesSolver ephemeridesSolver, ObserverLocation observerLocation) throws EphemerisException {
        final Ephemeris moonEphemeris = ephemeridesSolver.compute(BodyDetails.MOON, conjunction.jde, observerLocation);
        final SimpleEphemeris sunEphemeris = ephemeridesSolver.computeSimple(BodyDetails.SUN, conjunction.jde, observerLocation);

        final double earthUmbraRadius = EarthShadow.umbra(moonEphemeris.distanceFromEarth, sunEphemeris.distanceToBody, BodyInformation.Earth.equatorialRadius, BodyInformation.Sun.equatorialRadius);
        final double earthPenumbraRadius = EarthShadow.penumbra(moonEphemeris.distanceFromEarth, sunEphemeris.distanceToBody, BodyInformation.Earth.equatorialRadius, BodyInformation.Sun.equatorialRadius);

        final EarthShadowInfo earthShadow = new EarthShadowInfo(
                earthUmbraRadius, AngularSize.fromRadiusAndDistance(earthUmbraRadius, moonEphemeris.distanceFromEarth * JplConstant.AU),
                earthPenumbraRadius, AngularSize.fromRadiusAndDistance(earthPenumbraRadius, moonEphemeris.distanceFromEarth * JplConstant.AU)
        );

        final double positionAngle = Radians.positionAngle(moonEphemeris.coordinates, conjunction.secondBodyEphemeris.coordinates);

        final EclipseObjectInfo moonInfo = new EclipseObjectInfo(BodyDetails.MOON, moonEphemeris);
        final EclipseObjectInfo earthShadowInfo = new EclipseObjectInfo(BodyDetails.EARTH_SHADOW, earthShadow);

        return new EclipseEvent(conjunction.jde, moonInfo, earthShadowInfo, conjunction.separation, positionAngle);
    }

}
