package jp.albedo.webapp.ephemeris;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.vsop87.VSOPException;
import jp.albedo.webapp.external.BodyRecord;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
public class EphemerisCalculator {

    private static Log LOG = LogFactory.getLog(EphemerisCalculator.class);

    public List<Ephemeris> compute(BodyRecord bodyRecord, LocalDate fromDate, LocalDate toDate, double interval) throws VSOPException {
        LOG.info(String.format("Starting calculations, params: [from=%s, to=%s, interval=%.2f]", fromDate, toDate, interval));

        Instant start = Instant.now();

        List<Double> JDEs = JulianDay.forRange(JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate), interval);
        final List<Ephemeris> ephemeris = EllipticMotion.compute(JDEs, bodyRecord.getMagnitudeParameters(), bodyRecord.getOrbitElements());

        LOG.info(String.format("Calculated %d ephemeris in %s", ephemeris.size(), Duration.between(start, Instant.now())));

        return ephemeris;
    }

}
