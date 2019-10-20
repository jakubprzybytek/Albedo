package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.BodyType;
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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class JplEphemerisCalculator {

    private static Log LOG = LogFactory.getLog(JplEphemerisCalculator.class);

    @Autowired
    private JplKernelsService jplKernelsService;

    /**
     * Tries to parse body name. Works only for bodies that this calculator can support.
     *
     * @param bodyName
     * @return
     */
    public Optional<Body> parseBody(String bodyName) {
        return Optional.ofNullable(EnumUtils.getEnum(Body.class, bodyName));
    }

    /**
     * Returns list of bodies of given type that this calculator supports.
     *
     * @param bodyType
     * @return
     */
    public List<Body> getSupportedBodiesByType(BodyType bodyType) {
        if (bodyType == BodyType.Planet) {
            return Arrays.asList(Body.Mercury, Body.Venus, Body.Mars, Body.Jupiter, Body.Saturn, Body.Neptune, Body.Uranus);
        }

        return Collections.emptyList();
    }

    /**
     * Computes ephemerides for given body and other parameters.
     *
     * @param body
     * @param fromDate
     * @param toDate
     * @param interval
     * @return
     * @throws IOException
     * @throws JPLException
     */
    public List<Ephemeris> compute(Body body, Double fromDate, Double toDate, double interval) throws IOException, JPLException {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Starting calculations based on JPL's SPICE Kernels, params: [body: %s, from=%s, to=%s, interval=%.2f]", body.name(), fromDate, toDate, interval));
        }

        final Instant start = Instant.now();

        final StateCalculator stateCalculator = new StateCalculator(this.jplKernelsService.getSpKernel());

        final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
        final List<Ephemeris> ephemeris = stateCalculator.computeEphemeridesForJds(body, jdes);

        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Calculated %d ephemeris in %s", ephemeris.size(), Duration.between(start, Instant.now())));
        }

        return ephemeris;
    }

}
