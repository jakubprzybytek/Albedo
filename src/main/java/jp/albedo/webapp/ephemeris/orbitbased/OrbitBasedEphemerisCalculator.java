package jp.albedo.webapp.ephemeris.orbitbased;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.vsop87.VSOPException;
import jp.albedo.webapp.services.OrbitingBodyRecord;
import jp.albedo.webapp.services.OrbitsService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
public class OrbitBasedEphemerisCalculator {

    private static Log LOG = LogFactory.getLog(OrbitBasedEphemerisCalculator.class);

    @Autowired
    private OrbitsService orbitsService;

    public Optional<OrbitingBodyRecord> findBody(String bodyName) throws IOException {
        return this.orbitsService.getByName(bodyName);
    }

    public List<Ephemeris> compute(OrbitingBodyRecord bodyRecord, LocalDate fromDate, LocalDate toDate, double interval) throws VSOPException {
        LOG.info(String.format("Starting calculations based on orbit elements, params: [body: %s, from=%s, to=%s, interval=%.2f]", bodyRecord.getBodyDetails().name, fromDate, toDate, interval));

        Instant start = Instant.now();

        List<Double> JDEs = JulianDay.forRange(JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate), interval);
        final List<Ephemeris> ephemeris = EllipticMotion.compute(JDEs, bodyRecord.getMagnitudeParameters(), bodyRecord.getOrbitElements());

        LOG.info(String.format("Calculated %d ephemeris in %s", ephemeris.size(), Duration.between(start, Instant.now())));

        return ephemeris;
    }

}
