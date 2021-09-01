package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.impl.EarthEphemeridesCalculator;
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
public class JplBinaryKernelEphemerisCalculator {

    private static final Log LOG = LogFactory.getLog(JplBinaryKernelEphemerisCalculator.class);

    private boolean supportedBodiesInitialised = false;

    private List<JplBody> supportedPlanets;

    private List<JplBody> supportedNaturalSatellites;

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    /**
     * Tries to parse body name. Works only for bodies that this calculator can support.
     *
     * @param bodyName Body Name.
     * @return JplBody if parsed successfully.
     */
    public Optional<JplBody> parseBody(String bodyName) throws IOException, JplException {

        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        return Stream.concat(supportedPlanets.stream(), supportedNaturalSatellites.stream())
                .filter(jplBody -> jplBody.name().equals(bodyName))
                .findFirst();
    }

    /**
     * Returns list of bodies of given type that this calculator supports.
     *
     * @param bodyType BodyType.
     * @return List of JplBody objects of given type supported by this calculator.
     */
    public List<JplBody> getSupportedBodiesByType(BodyType bodyType) throws IOException, JplException {

        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        if (bodyType == BodyType.Planet) {
            return supportedPlanets;
        }

        if (bodyType == BodyType.NaturalSatellite) {
            return supportedNaturalSatellites;
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
        final EarthEphemeridesCalculator ephemeridesCalculator = new EarthEphemeridesCalculator(jplBinaryKernelsService.getSpKernel(), body);

        final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
        final List<Ephemeris> ephemeris = ephemeridesCalculator.computeFor(jdes);

        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Calculated %d ephemeris in %s", ephemeris.size(), Duration.between(start, Instant.now())));
        }

        return ephemeris;
    }

    private void loadSupportedBodies() throws IOException, JplException {
        supportedNaturalSatellites = jplBinaryKernelsService.getSpKernel().registeredBodiesStream()
                .filter(jplBody -> BodyType.NaturalSatellite == jplBody.bodyType)
                .collect(Collectors.toList());

        supportedPlanets = jplBinaryKernelsService.getSpKernel().registeredBodiesStream()
                .filter(jplBody -> BodyType.Planet == jplBody.bodyType)
                .collect(Collectors.toList());

        supportedBodiesInitialised = true;
    }

}
