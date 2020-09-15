package jp.albedo.webapp.charts.visibility;

import jp.albedo.common.BodyInformation;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.altitude.AltitudeCalculator;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.risetransitset.RiseTransitSetCalculator;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEventType;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class VisibilityChartOrchestrator {

    private static final Log LOG = LogFactory.getLog(VisibilityChartOrchestrator.class);

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    private RiseTransitSetCalculator riseTransitSetCalculator;

    @Autowired
    private AltitudeCalculator altitudeCalculator;

    VisibilityChartResponse compute(List<String> bodyNames, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws Exception {

        LOG.info(String.format("Computing visibility chart data, params: [bodies:%s, from=%s, to=%s, interval=%s], observer location: %s", bodyNames, fromDate, toDate, interval, observerLocation));

        final Instant start = Instant.now();

        final ComputedEphemeris computedEphemerisForSun = this.ephemeridesOrchestrator.compute(BodyInformation.Sun.name(), fromDate, toDate, interval, observerLocation);
        final List<RiseTransitSetEvent> sunRiseTransitSetEvents = this.riseTransitSetCalculator.compute(BodyInformation.Sun.name(), computedEphemerisForSun, observerLocation.coords);

        final double firstSunSet = sunRiseTransitSetEvents.stream()
                .filter(rtsEvent -> RiseTransitSetEventType.Setting.equals(rtsEvent.getEventType()))
                .mapToDouble(RiseTransitSetEvent::getJde)
                .findFirst()
                .orElseThrow();

        final double lastSunRise = sunRiseTransitSetEvents.stream()
                .filter(rtsEvent -> RiseTransitSetEventType.Rising.equals(rtsEvent.getEventType()))
                .mapToDouble(RiseTransitSetEvent::getJde)
                .reduce((previousJde, newJde) -> newJde)
                .orElseThrow();

        final List<Double> sunSets = new LinkedList<>();
        final List<Double> sunCivilDusks = new LinkedList<>();
        final List<Double> sunNauticalDusks = new LinkedList<>();
        final List<Double> sunAstronomicalDusks = new LinkedList<>();
        final List<Double> sunAstronomicalDawns = new LinkedList<>();
        final List<Double> sunNauticalDawns = new LinkedList<>();
        final List<Double> sunCivilDawns = new LinkedList<>();
        final List<Double> sunRises = new LinkedList<>();

        sunRiseTransitSetEvents.stream()
                .filter(rtsEvent -> rtsEvent.getJde() >= firstSunSet && rtsEvent.getJde() <= lastSunRise)
                .forEach(rtsEvent -> {
                    switch (rtsEvent.getEventType()) {
                        case Setting:
                            sunSets.add(rtsEvent.getJde());
                            break;
                        case CivilDusk:
                            sunCivilDusks.add(rtsEvent.getJde());
                            break;
                        case NauticalDusk:
                            sunNauticalDusks.add(rtsEvent.getJde());
                            break;
                        case AstronomicalDusk:
                            sunAstronomicalDusks.add(rtsEvent.getJde());
                            break;
                        case AstronomicalDawn:
                            sunAstronomicalDawns.add(rtsEvent.getJde());
                            break;
                        case NauticalDawn:
                            sunNauticalDawns.add(rtsEvent.getJde());
                            break;
                        case CivilDawn:
                            sunCivilDawns.add(rtsEvent.getJde());
                            break;
                        case Rising:
                            sunRises.add(rtsEvent.getJde());
                            break;
                    }
                });

        List<BodyVisibility> bodiesVisibilityList = bodyNames.stream()
                .map(FunctionUtils.wrap(bodyName -> computeForBody(bodyName, fromDate, toDate, interval, observerLocation)))
                .collect(Collectors.toList());

        LOG.info(String.format("Calculated %d events in %s", sunRiseTransitSetEvents.size(), Duration.between(start, Instant.now())));

        return new VisibilityChartResponse(
                sunSets, sunCivilDusks, sunNauticalDusks, sunAstronomicalDusks, sunAstronomicalDawns, sunNauticalDawns, sunCivilDawns, sunRises, bodiesVisibilityList);
    }

    private BodyVisibility computeForBody(String bodyName, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws Exception {
        final ComputedEphemeris computedEphemerisForBody = this.ephemeridesOrchestrator.compute(bodyName, fromDate, toDate, interval, observerLocation);
        final List<RiseTransitSetEvent> bodyRiseTransitSetEvents = this.riseTransitSetCalculator.compute(bodyName, computedEphemerisForBody, observerLocation.coords);

        final List<Double> bodyRises = new LinkedList<>();
        final List<Double> bodyTransits = new LinkedList<>();
        final List<Double> bodySets = new LinkedList<>();

        bodyRiseTransitSetEvents.forEach(rtsEvent -> {
            switch (rtsEvent.getEventType()) {
                case Rising:
                    bodyRises.add(rtsEvent.getJde());
                    break;
                case Transit:
                    bodyTransits.add(rtsEvent.getJde());
                    break;
                case Setting:
                    bodySets.add(rtsEvent.getJde());
                    break;
            }
        });

        return new BodyVisibility(computedEphemerisForBody.getBodyDetails(), bodyRises, bodyTransits, bodySets);
    }

}