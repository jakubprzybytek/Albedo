package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.impl.SimpleEphemeridesForEarthCalculator;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.webapp.ephemeris.EphemeridesCalculator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class BinaryKernelEphemeridesCalculator implements EphemeridesCalculator {

    private static final Log LOG = LogFactory.getLog(BinaryKernelEphemeridesCalculator.class);

    private boolean supportedBodiesInitialised = false;

    private List<JplBody> supportedPlanets;

    private List<JplBody> supportedNaturalSatellites;

    private final SpkKernelRepository kernelRepository;

    public BinaryKernelEphemeridesCalculator(SpkKernelRepository kernelRepository) {
        this.kernelRepository = kernelRepository;
    }

    public Optional<JplBody> parseBody(String bodyName) throws IOException, JplException {
        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }
        return Stream.concat(supportedPlanets.stream(), supportedNaturalSatellites.stream())
                .filter(jplBody -> jplBody.name().equals(bodyName))
                .findFirst();
    }

    public Optional<List<SimpleEphemeris>> computeSimple(String bodyName, Double fromDate, Double toDate, double interval) throws JplException, IOException {

        Optional<JplBody> parsedBody = parseBody(bodyName);

        if (parsedBody.isEmpty()) {
            return Optional.empty();
        }

        JplBody body = parsedBody.get();

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Starting calculations based on JPL's SPICE Kernels, params: [body: %s, from=%s, to=%s, interval=%.2f]", body.name(), fromDate, toDate, interval));
        }

        final Instant start = Instant.now();
        final SimpleEphemeridesForEarthCalculator ephemeridesCalculator =
                new SimpleEphemeridesForEarthCalculator(kernelRepository, body);

        final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
        final List<SimpleEphemeris> ephemerides = ephemeridesCalculator.computeFor(jdes);

        if (LOG.isDebugEnabled()) {
            LOG.info(String.format("Calculated %d ephemeris in %s", ephemerides.size(), Duration.between(start, Instant.now())));
        }

        return Optional.of(ephemerides);
    }

    private void loadSupportedBodies() throws IOException, JplException {
        supportedNaturalSatellites = kernelRepository.registeredBodiesStream()
                .filter(jplBody -> BodyType.NaturalSatellite == jplBody.bodyType)
                .collect(Collectors.toList());

        supportedPlanets = kernelRepository.registeredBodiesStream()
                .filter(jplBody -> BodyType.Planet == jplBody.bodyType)
                .filter(jplBody -> JplBody.Earth != jplBody)
                .collect(Collectors.toList());

        supportedBodiesInitialised = true;
    }

}
