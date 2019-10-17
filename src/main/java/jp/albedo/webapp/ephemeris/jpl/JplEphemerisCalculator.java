package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jpl.Body;
import jp.albedo.jpl.JPLException;
import jp.albedo.jpl.StateCalculator;
import jp.albedo.webapp.services.JplKernelsService;
import org.apache.commons.lang3.EnumUtils;
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
public class JplEphemerisCalculator {

    private static Log LOG = LogFactory.getLog(JplEphemerisCalculator.class);

    @Autowired
    private JplKernelsService jplKernelsService;

    public Optional<Body> parseBody(String bodyName) {
        return Optional.ofNullable(EnumUtils.getEnum(Body.class, bodyName));
    }

    public List<Ephemeris> compute(Body body, LocalDate fromDate, LocalDate toDate, double interval) throws IOException, JPLException {
        LOG.info(String.format("Starting calculations based on JPL's SPICE Kernels, params: [body: %s, from=%s, to=%s, interval=%.2f]", body.name(), fromDate, toDate, interval));

        final Instant start = Instant.now();

        final StateCalculator stateCalculator = new StateCalculator(this.jplKernelsService.getSpKernel());

        final List<Double> jdes = JulianDay.forRange(JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate), interval);
        final List<Ephemeris> ephemeris = stateCalculator.computeEphemeridesForJds(body, jdes);

        LOG.info(String.format("Calculated %d ephemeris in %s", ephemeris.size(), Duration.between(start, Instant.now())));

        return ephemeris;
    }

}
