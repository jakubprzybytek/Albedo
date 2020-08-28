package jp.albedo.webapp.altitude;

import jp.albedo.common.BodyInformation;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.altitude.rest.AltitudeSeries;
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
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AltitudeOrchestrator {

    private static final Log LOG = LogFactory.getLog(AltitudeOrchestrator.class);

    public static final double DAY_INTERVAL = 1.0;

    public static final double INTERDAY_INTERVAL = 1.0 / 24.0 / 4.0;

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    @Autowired
    private RiseTransitSetCalculator riseTransitSetCalculator;

    @Autowired
    private AltitudeCalculator altitudeCalculator;

    AltitudeResponse compute(List<String> bodyNames, double jde, ObserverLocation observerLocation) throws Exception {

        LOG.info(String.format("Computing altitudes, params: [bodies:%s, date=%s], observer location: %s", bodyNames, jde, observerLocation));

        final Instant start = Instant.now();

        final ComputedEphemeris computedEphemerisForSun = this.ephemeridesOrchestrator.compute(BodyInformation.Sun.name(), jde - DAY_INTERVAL, jde + 2 * DAY_INTERVAL, DAY_INTERVAL, observerLocation);
        final List<RiseTransitSetEvent> sunRiseTransitSetEvents = this.riseTransitSetCalculator.compute(BodyInformation.Sun.name(), computedEphemerisForSun, observerLocation.coords);

        final RiseTransitSetEvent settingEvent = sunRiseTransitSetEvents.stream()
                .filter(event -> RiseTransitSetEventType.Setting.equals(event.getEventType()))
                .findFirst()
                .get();

        final RiseTransitSetEvent risingEvent = sunRiseTransitSetEvents.stream()
                .filter(event -> event.getJde() > settingEvent.getJde())
                .filter(event -> RiseTransitSetEventType.Rising.equals(event.getEventType()))
                .findFirst()
                .get();

        final LocalDateTime settingOriginalDateTime = JulianDay.toDateTime(settingEvent.getJde());
        final LocalDateTime settingRoundedDateTime = settingOriginalDateTime.truncatedTo(ChronoUnit.HOURS).minusHours(1);
        final double startTime = JulianDay.fromDate(settingRoundedDateTime);

        final LocalDateTime risingOriginalDateTime = JulianDay.toDateTime(risingEvent.getJde());
        final LocalDateTime risingRoundedDateTime = risingOriginalDateTime.truncatedTo(ChronoUnit.HOURS).plusHours(2);
        final double endTime = JulianDay.fromDate(risingRoundedDateTime);

        final List<AltitudeSeries> altitudeSeriesList = new ArrayList<>();

        for (String bodyName : bodyNames) {
            ComputedEphemeris computedEphemeris = this.ephemeridesOrchestrator.compute(bodyName, startTime, endTime, INTERDAY_INTERVAL, observerLocation);
            altitudeSeriesList.add(new AltitudeSeries(
                    computedEphemeris.getBodyDetails(),
                    this.altitudeCalculator.compute(computedEphemeris.getEphemerisList(), observerLocation.coords)));
        }

        LOG.info(String.format("Calculated %d altitudes in %s", 5, Duration.between(start, Instant.now())));

        return new AltitudeResponse(
                sunRiseTransitSetEvents.stream()
                        .filter(event -> event.getJde() >= startTime && event.getJde() <= endTime)
                        .collect(Collectors.toList()),
                JulianDay.forRange(startTime, endTime, INTERDAY_INTERVAL),
                altitudeSeriesList
        );
    }

}