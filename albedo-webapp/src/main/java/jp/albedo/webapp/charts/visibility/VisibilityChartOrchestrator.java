package jp.albedo.webapp.charts.visibility;

import jp.albedo.common.BodyInformation;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.altitude.AltitudeCalculator;
import jp.albedo.webapp.altitude.AltitudeResponse;
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

        LOG.info(String.format("Calculated %d altitudes in %s", 5, Duration.between(start, Instant.now())));

        return new VisibilityChartResponse(
                sunRiseTransitSetEvents
        );
    }

}