package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.ephemeris.EphemeridesCalculator;
import jp.albedo.jpl.ephemeris.SimpleEphemeridesCalculator;
import jp.albedo.jpl.ephemeris.impl.EphemeridesForEarthCalculator;
import jp.albedo.jpl.ephemeris.impl.SimpleEphemeridesForEarthCalculator;
import jp.albedo.jpl.ephemeris.impl.SunEphemeridesForEarthCalculator;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.webapp.ephemeris.EphemeridesSolver;
import jp.albedo.webapp.ephemeris.EphemerisException;
import jp.albedo.webapp.ephemeris.ParallaxCorrection;
import jp.albedo.webapp.ephemeris.SimpleEphemerisParallaxCorrection;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class BinaryKernelEphemeridesSolver implements EphemeridesSolver {

    private static final Log LOG = LogFactory.getLog(BinaryKernelEphemeridesSolver.class);

    private boolean supportedBodiesInitialised = false;

    private List<JplBody> supportedPlanets;

    private List<JplBody> supportedNaturalSatellites;

    private final SpkKernelRepository kernelRepository;

    public BinaryKernelEphemeridesSolver(SpkKernelRepository kernelRepository) {
        this.kernelRepository = kernelRepository;
    }

    public List<SimpleEphemeris> computeSimple(BodyDetails bodyDetails, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException {
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

            final SimpleEphemeridesCalculator ephemeridesCalculator =
                    new SimpleEphemeridesForEarthCalculator(kernelRepository, body);

            final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
            final List<SimpleEphemeris> ephemerides = ephemeridesCalculator.computeFor(jdes).stream()
                    .map(SimpleEphemerisParallaxCorrection.correctFor(observerLocation))
                    .collect(Collectors.toList());

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated %d ephemerides in %s", ephemerides.size(), Duration.between(start, Instant.now())));
            }

            return ephemerides;
        } catch (IOException | JplException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    @Override
    public Ephemeris compute(BodyDetails bodyDetails, double jde, ObserverLocation observerLocation) throws EphemerisException {
        try {
            Optional<JplBody> parsedBody = findBody(bodyDetails);

            if (parsedBody.isEmpty()) {
                throw new EphemerisException("Cannot find JLP body for " + bodyDetails);
            }

            JplBody body = parsedBody.get();

            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Starting calculations based on JPL's SPICE Kernels, params: [body: %s, jde=%s]", body.name(), jde));
            }

            final Instant start = Instant.now();

            final EphemeridesCalculator ephemeridesCalculator = JplBody.Sun.equals(body) ?
                    new SunEphemeridesForEarthCalculator(kernelRepository) :
                    new EphemeridesForEarthCalculator(kernelRepository, body);

            final Ephemeris uncorrectedEphemeris = ephemeridesCalculator.computeFor(jde);
            final Ephemeris ephemeris = ParallaxCorrection.correctFor(observerLocation).apply(uncorrectedEphemeris);

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated ephemeris in %s", Duration.between(start, Instant.now())));
            }

            return ephemeris;
        } catch (IOException | JplException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    @Override
    public List<Ephemeris> compute(BodyDetails bodyDetails, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException {
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

            final EphemeridesCalculator ephemeridesCalculator =
                    new EphemeridesForEarthCalculator(kernelRepository, body);

            final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
            final List<Ephemeris> ephemerides = ephemeridesCalculator.computeFor(jdes).stream()
                    .map(ParallaxCorrection.correctFor(observerLocation))
                    .collect(Collectors.toList());

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated %d ephemerides in %s", ephemerides.size(), Duration.between(start, Instant.now())));
            }

            return ephemerides;
        } catch (IOException | JplException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
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