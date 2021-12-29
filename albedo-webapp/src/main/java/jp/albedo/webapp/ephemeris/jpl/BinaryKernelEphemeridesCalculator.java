package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.impl.SimpleEphemeridesForEarthCalculator;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.webapp.ephemeris.EphemeridesCalculator;
import jp.albedo.webapp.ephemeris.EphemerisException;
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

    public List<SimpleEphemeris> computeSimple(BodyDetails bodyDetails, Double fromDate, Double toDate, double interval) throws EphemerisException {
        try {
            Optional<JplBody> parsedBody = findBody(bodyDetails);

            if (parsedBody.isEmpty()) {
                throw new EphemerisException("Cannot find JLP body for " + bodyDetails);
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

            return ephemerides;
        } catch (IOException | JplException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    @Override
    public List<Ephemeris> compute(BodyDetails body, Double fromDate, Double toDate, double interval) throws EphemerisException {
        return null;
    }

    public Optional<JplBody> findBody(BodyDetails body) throws IOException, JplException {
        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        if (JplBody.Sun.name().equals(body.name)) {
            return Optional.of(JplBody.Sun);
        }

        return Stream.concat(supportedPlanets.stream(), supportedNaturalSatellites.stream())
                .filter(jplBody -> jplBody.name().equals(body.name) && jplBody.bodyType.equals(body.bodyType))
                .findFirst();
    }

    private void loadSupportedBodies() {
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
