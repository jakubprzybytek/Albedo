package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.EphemeridesCalculator;
import jp.albedo.jpl.ephemeris.EphemeridesCalculatorFactory;
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
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class JplEphemerisCalculator {

    private static final Log LOG = LogFactory.getLog(JplEphemerisCalculator.class);

    private static final List<JplBody> SUPPORTED_BODIES = Arrays.asList(JplBody.Sun, JplBody.Moon);

    private static final List<JplBody> SUPPORTED_PLANETS = Arrays.asList(JplBody.Mercury, JplBody.Venus, JplBody.Mars, JplBody.Jupiter, JplBody.Saturn, JplBody.Neptune, JplBody.Uranus);

    private static final List<JplBody> ALL_SUPPORTED_OBJECTS = Stream.concat(SUPPORTED_BODIES.stream(), SUPPORTED_PLANETS.stream())
            .collect(Collectors.toList());

    @Autowired
    private JplKernelsService jplKernelsService;

    /**
     * Tries to parse body name. Works only for bodies that this calculator can support.
     *
     * @param bodyName Body Name.
     * @return JplBody if parsed successfully.
     */
    public Optional<JplBody> parseBody(String bodyName) {
        return ALL_SUPPORTED_OBJECTS.stream()
                .filter(jplBody -> jplBody.name().equals(bodyName))
                .findFirst();
    }

    /**
     * Returns list of bodies of given type that this calculator supports.
     *
     * @param bodyType BodyType.
     * @return List of JplBody objects of given type supported by this calculator.
     */
    public List<JplBody> getSupportedBodiesByType(BodyType bodyType) {
        if (bodyType == BodyType.Planet) {
            return SUPPORTED_PLANETS;
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
     * @throws JplException
     */
    public List<Ephemeris> compute(JplBody body, Double fromDate, Double toDate, double interval) throws IOException, JplException {

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Starting calculations based on JPL's SPICE Kernels, params: [body: %s, from=%s, to=%s, interval=%.2f]", body.name(), fromDate, toDate, interval));
        }

        final Instant start = Instant.now();

        final EphemeridesCalculator ephemeridesCalculator = EphemeridesCalculatorFactory.getFor(body, this.jplKernelsService.getSpKernel());

        final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
        final List<Ephemeris> ephemeris = ephemeridesCalculator.computeFor(jdes);

        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Calculated %d ephemeris in %s", ephemeris.size(), Duration.between(start, Instant.now())));
        }

        return ephemeris;
    }

}
