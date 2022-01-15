package jp.albedo.webapp.ephemeris.orbitbased;

import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.vsop87.VSOPException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Deprecated
@Component
public class OrbitBasedEphemerisCalculator {

    private static Log LOG = LogFactory.getLog(OrbitBasedEphemerisCalculator.class);

    @Autowired
    private OrbitsService orbitsService;

    public Optional<OrbitingBodyRecord> findBody(String bodyName) {
        return this.orbitsService.getByName(bodyName);
    }

    /**
     * Returns list of bodies of given type that this calculator supports.
     *
     * @param bodyType Body type.
     * @return Names of all bodies of given body type.
     */
    public List<OrbitingBodyRecord> getSupportedBodiesByType(BodyType bodyType) {
        switch (bodyType) {
            case Asteroid:
                return this.orbitsService.getByType(BodyType.Asteroid);
            case Comet:
                return this.orbitsService.getByType(BodyType.Comet);
        }
        return Collections.emptyList();
    }

    /**
     * Computes ephemeris for given body and given time moment.
     *
     * @param bodyRecord Body for which ephemeris should be computed.
     * @param jde        Moment for ephemeris [JD].
     * @return Ephemeris
     * @throws VSOPException
     */
    public Ephemeris compute(OrbitingBodyRecord bodyRecord, Double jde) throws VSOPException {
        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Starting calculations based on orbit elements, params: [body: %s, jde=%.2f]", bodyRecord.getBodyDetails().name, jde));
        }

        Instant start = Instant.now();

        final Ephemeris ephemeris = EllipticMotion.compute(jde, bodyRecord.getMagnitudeParameters(), bodyRecord.getOrbitElements());

        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Calculated ephemeris in %s", Duration.between(start, Instant.now())));
        }

        return ephemeris;
    }

    /**
     * Computes ephemeris for given body and given time span.
     *
     * @param bodyRecord Body for which ephemeris should be computed.
     * @param fromDate   Starting moment for the time span.
     * @param toDate     End moment for the time span.
     * @param interval   Interval indicating how the time span should be chopped.
     * @return List<Ephemeris>
     * @throws VSOPException
     */
    public List<Ephemeris> compute(OrbitingBodyRecord bodyRecord, Double fromDate, Double toDate, double interval) throws VSOPException {
        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Starting calculations based on orbit elements, params: [body: %s, from=%s, to=%s, interval=%.2f]", bodyRecord.getBodyDetails().name, fromDate, toDate, interval));
        }

        Instant start = Instant.now();

        List<Double> JDEs = JulianDay.forRange(fromDate, toDate, interval);
        final List<Ephemeris> ephemeris = EllipticMotion.compute(JDEs, bodyRecord.getMagnitudeParameters(), bodyRecord.getOrbitElements());

        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Calculated %d ephemeris in %s", ephemeris.size(), Duration.between(start, Instant.now())));
        }

        return ephemeris;
    }

}
