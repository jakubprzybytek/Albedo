package jp.albedo.webapp.ephemeris;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.vsop87.VSOPException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class EphemerisCalculator {

    private static Log LOG = LogFactory.getLog(EphemerisCalculator.class);

    public List<Ephemeris> compute(OrbitElements orbitElements, LocalDate fromDate, LocalDate toDate, double interval) throws VSOPException {
        LOG.info(String.format("Starting calculations, params: [from=%s, to=%s, interval=%.2f]", fromDate, toDate, interval));

        List<Double> JDEs = JulianDay.forRange(JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate), interval);
        return EllipticMotion.compute(JDEs, orbitElements);
    }

}
