package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyType;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.jpl.JplBody;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.ephemeris.jpl.JplEphemerisCalculator;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisCalculator;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitingBodyRecord;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EphemeridesOrchestrator {

    private static Log LOG = LogFactory.getLog(EphemeridesOrchestrator.class);

    @Autowired
    private JplEphemerisCalculator jplEphemerisCalculator;

    @Autowired
    private OrbitBasedEphemerisCalculator orbitBasedEphemerisCalculator;

    /**
     * Computes ephemerides for a singly body given by name.
     * <p>
     * Different backend ephemerides calculators can be chosen depending on which can handle given body.
     *
     * @param bodyName Name of body for which the ephemerides should be computed.
     * @param fromDate Start of the time period for which ephemerides should be computed in Julian days.
     * @param toDate End of the time period for which ephemerides should be computed in Julian days.
     * @param interval Interval for computations in Julian days.
     * @param observerLocation Location of observer for parallax correction.
     * @return
     * @throws Exception
     */
    public ComputedEphemerides compute(String bodyName, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation) throws Exception {

        final Optional<JplBody> jplSupportedBody = this.jplEphemerisCalculator.parseBody(bodyName);
        if (jplSupportedBody.isPresent()) {
            final JplBody body = jplSupportedBody.get();
            final List<Ephemeris> ephemerides = this.jplEphemerisCalculator.compute(body, fromDate, toDate, interval).parallelStream()
                    .map(ParallaxCorrection.correctFor(observerLocation))
                    .collect(Collectors.toList());

            return new ComputedEphemerides(body.toBodyDetails(), ephemerides);
        }

        final Optional<OrbitingBodyRecord> orbitingBodyRecordOptional = this.orbitBasedEphemerisCalculator.findBody(bodyName);

        if (orbitingBodyRecordOptional.isEmpty()) {
            throw new EphemerisException("Body not found: " + bodyName);
        }

        final OrbitingBodyRecord orbitingBodyRecord = orbitingBodyRecordOptional.get();
        final List<Ephemeris> ephemerides = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval).parallelStream()
                .map(ParallaxCorrection.correctFor(observerLocation))
                .collect(Collectors.toList());

        return new ComputedEphemerides(orbitingBodyRecord.getBodyDetails(), ephemerides, orbitingBodyRecord.getOrbitElements(), orbitingBodyRecord.getMagnitudeParameters());
    }

    /**
     * Computes ephemerides to all bodies of given type supported by known calculators.
     *
     * @param bodyType Body type that determines for which objects ephemeris will be computed.
     * @param fromDate Start of the time period for which ephemerides should be computed in Julian days.
     * @param toDate End of the time period for which ephemerides should be computed in Julian days.
     * @param interval Interval for computations in Julian days.
     * @param observerLocation Location of observer for parallax correction.
     * @return List of computed ephemerides.
     */
    public List<ComputedEphemerides> computeAllByType(BodyType bodyType, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation) throws IOException {

        LOG.info(String.format("Computing ephemerides for multiple bodies, params: [bodyType=%s, from=%s, to=%s, interval=%f]", bodyType, fromDate, toDate, interval));

        final Instant start = Instant.now();

        final List<ComputedEphemerides> ephemeridesList = new ArrayList<>();

        this.jplEphemerisCalculator.getSupportedBodiesByType(bodyType).parallelStream()
                .map(FunctionUtils.wrap(body -> {
                    final List<Ephemeris> ephemerides = this.jplEphemerisCalculator.compute(body, fromDate, toDate, interval).parallelStream()
                            .map(ParallaxCorrection.correctFor(observerLocation))
                            .collect(Collectors.toList());
                    return new ComputedEphemerides(body.toBodyDetails(), ephemerides);
                }))
                .forEachOrdered(ephemeridesList::add);

        this.orbitBasedEphemerisCalculator.getSupportedBodiesByType(bodyType).parallelStream()
                .map(FunctionUtils.wrap(orbitingBodyRecord -> {
                    final List<Ephemeris> ephemerides = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval).parallelStream()
                            .map(ParallaxCorrection.correctFor(observerLocation))
                            .collect(Collectors.toList());
                    return new ComputedEphemerides(orbitingBodyRecord.getBodyDetails(), ephemerides);
                }))
                .forEachOrdered(ephemeridesList::add);

        LOG.info(String.format("Computed %d ephemerides in %s", ephemeridesList.size(), Duration.between(start, Instant.now())));

        return ephemeridesList;
    }

}
