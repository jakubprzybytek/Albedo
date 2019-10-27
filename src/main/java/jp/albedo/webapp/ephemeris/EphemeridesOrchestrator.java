package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyType;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.vsop87.VSOPException;
import jp.albedo.webapp.ephemeris.jpl.JplEphemerisCalculator;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisCalculator;
import jp.albedo.webapp.services.OrbitingBodyRecord;
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
     * @param bodyName
     * @param fromDate
     * @param toDate
     * @param interval
     * @return
     * @throws Exception
     */
    public ComputedEphemerides compute(String bodyName, Double fromDate, Double toDate, double interval) throws Exception {

        final Optional<JplBody> jplSupportedBody = this.jplEphemerisCalculator.parseBody(bodyName);
        if (jplSupportedBody.isPresent()) {
            final JplBody body = jplSupportedBody.get();
            final List<Ephemeris> ephemerides = this.jplEphemerisCalculator.compute(body, fromDate, toDate, interval);

            return new ComputedEphemerides(body.toBodyDetails(), ephemerides);
        }

        final Optional<OrbitingBodyRecord> orbitingBodyRecordOptional = this.orbitBasedEphemerisCalculator.findBody(bodyName);

        if (!orbitingBodyRecordOptional.isPresent()) {
            throw new Exception("Body not found: " + bodyName);
        }

        final OrbitingBodyRecord orbitingBodyRecord = orbitingBodyRecordOptional.get();
        final List<Ephemeris> ephemerides = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval);

        return new ComputedEphemerides(orbitingBodyRecord.getBodyDetails(), ephemerides, orbitingBodyRecord.getOrbitElements(), orbitingBodyRecord.getMagnitudeParameters());
    }

    /**
     * Computes ephemerides to all bodies of given type supported by known calculators.
     *
     * @param bodyType
     * @param fromDate
     * @param toDate
     * @param interval
     * @return
     */
    public List<ComputedEphemerides> computeAll(BodyType bodyType, Double fromDate, Double toDate, double interval) throws IOException {

        LOG.info(String.format("Computing ephemerides for multiple bodies, params: [bodyType=%s, from=%s, to=%s, interval=%f]", bodyType, fromDate, toDate, interval));

        final Instant start = Instant.now();

        final List<ComputedEphemerides> ephemeridesList = new ArrayList<>();

        this.jplEphemerisCalculator.getSupportedBodiesByType(bodyType).parallelStream()
                .map(body -> {
                    try {
                        final List<Ephemeris> ephemerides = this.jplEphemerisCalculator.compute(body, fromDate, toDate, interval);
                        return new ComputedEphemerides(body.toBodyDetails(), ephemerides);
                    } catch (Exception e) {
                        throw new RuntimeException(e); // FixMe
                    }
                })
                .forEachOrdered(ephemeridesList::add);

        this.orbitBasedEphemerisCalculator.getSupportedBodiesByType(bodyType).parallelStream()
                .map(orbitingBodyRecord -> {
                    try {
                        final List<Ephemeris> ephemerides = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval);
                        return new ComputedEphemerides(orbitingBodyRecord.getBodyDetails(), ephemerides);
                    } catch (VSOPException e) {
                        throw new RuntimeException(e); // FixMe
                    }
                })
                .forEachOrdered(ephemeridesList::add);

        LOG.info(String.format("Computed %d ephemerides in %s", ephemeridesList.size(), Duration.between(start, Instant.now())));

        return ephemeridesList;
    }

}
