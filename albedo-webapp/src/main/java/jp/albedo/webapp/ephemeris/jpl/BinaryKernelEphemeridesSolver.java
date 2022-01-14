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
import jp.albedo.jpl.ephemeris.impl.EarthShadowEphemeridesForEarthCalculator;
import jp.albedo.jpl.ephemeris.impl.EarthShadowSimpleEphemeridesForEarthCalculator;
import jp.albedo.jpl.ephemeris.impl.EphemeridesForEarthCalculator;
import jp.albedo.jpl.ephemeris.impl.SimpleEphemeridesForEarthCalculator;
import jp.albedo.jpl.ephemeris.impl.SunEphemeridesForEarthCalculator;
import jp.albedo.webapp.ephemeris.EphemeridesSolver;
import jp.albedo.webapp.ephemeris.EphemerisException;
import jp.albedo.webapp.ephemeris.EphemerisMethod;
import jp.albedo.webapp.ephemeris.ParallaxCorrection;
import jp.albedo.webapp.ephemeris.SimpleEphemerisParallaxCorrection;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class BinaryKernelEphemeridesSolver implements EphemeridesSolver {

    private static final Log LOG = LogFactory.getLog(BinaryKernelEphemeridesSolver.class);

    private boolean supportedBodiesInitialised = false;

    private List<JplBody> supportedPlanets;

    private List<JplBody> supportedNaturalSatellites;

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    @Override
    public String getName() {
        return EphemerisMethod.binary440.description;
    }

    @Override
    public Optional<BodyDetails> parse(String bodyName) {
        if (BodyDetails.SUN.name.equals(bodyName)) {
            return Optional.of(BodyDetails.SUN);
        }

        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        return Stream.concat(supportedPlanets.stream(), supportedNaturalSatellites.stream())
                .filter(jplBody -> jplBody.name().equals(bodyName))
                .findFirst()
                .map(jplBody -> new BodyDetails(jplBody.name(), jplBody.bodyType));
    }

    private Optional<JplBody> findBody(BodyDetails body) throws IOException, JplException {
        if (JplBody.Sun.name().equals(body.name)) {
            return Optional.of(JplBody.Sun);
        }

        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        return Stream.concat(supportedPlanets.stream(), supportedNaturalSatellites.stream())
                .filter(jplBody -> jplBody.name().equals(body.name) && jplBody.bodyType.equals(body.bodyType))
                .findFirst();
    }

    public SimpleEphemeris computeSimple(BodyDetails bodyDetails, double jde, ObserverLocation observerLocation) throws EphemerisException {
        try {
            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Solving ephemerides for observer on Earth, params: [body: %s, jde=%s]", bodyDetails.name, jde));
            }

            final Instant start = Instant.now();

            final EphemeridesCalculator<SimpleEphemeris> ephemeridesCalculator;
            if (BodyDetails.EARTH_SHADOW.equals(bodyDetails)) {
                ephemeridesCalculator = new EarthShadowSimpleEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new SimpleEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel(), body);
            }

            final SimpleEphemeris ephemeris = SimpleEphemerisParallaxCorrection.correctFor(observerLocation)
                    .apply(ephemeridesCalculator.computeFor(jde));

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated ephemeris in %s", Duration.between(start, Instant.now())));
            }

            return ephemeris;
        } catch (IOException | JplException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    public List<SimpleEphemeris> computeSimple(BodyDetails bodyDetails, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException {
        try {
            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Solving ephemerides for observer on Earth, params: [body: %s, from=%s, to=%s, interval=%.2f]", bodyDetails.name, fromDate, toDate, interval));
            }

            final Instant start = Instant.now();

            final EphemeridesCalculator<SimpleEphemeris> ephemeridesCalculator;
            if (BodyDetails.EARTH_SHADOW.equals(bodyDetails)) {
                ephemeridesCalculator = new EarthShadowSimpleEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new SimpleEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel(), body);
            }

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
            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Solving ephemerides for observer on Earth, params: [body: %s, jde=%s]", bodyDetails.name, jde));
            }

            final Instant start = Instant.now();

            EphemeridesCalculator<Ephemeris> ephemeridesCalculator;
            if (BodyDetails.EARTH_SHADOW.equals(bodyDetails)) {
                ephemeridesCalculator = new EarthShadowEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel());
            } else if (BodyDetails.SUN.equals(bodyDetails)) {
                ephemeridesCalculator = new SunEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new EphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel(), body);
            }

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
            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Solving ephemerides for observer on Earth, params: [body: %s, from=%s, to=%s, interval=%.2f]", bodyDetails.name, fromDate, toDate, interval));
            }

            final Instant start = Instant.now();

            EphemeridesCalculator<Ephemeris> ephemeridesCalculator;
            if (BodyDetails.EARTH_SHADOW.equals(bodyDetails)) {
                ephemeridesCalculator = new EarthShadowEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel());
            } else if (BodyDetails.SUN.equals(bodyDetails)) {
                ephemeridesCalculator = new SunEphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new EphemeridesForEarthCalculator(jplBinaryKernelsService.getSpKernel(), body);
            }

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

    private void loadSupportedBodies() {
        supportedNaturalSatellites = jplBinaryKernelsService.getSpKernel().registeredBodiesStream()
                .filter(jplBody -> BodyType.NaturalSatellite == jplBody.bodyType)
                .collect(Collectors.toList());

        supportedPlanets = jplBinaryKernelsService.getSpKernel().registeredBodiesStream()
                .filter(jplBody -> BodyType.Planet == jplBody.bodyType)
                .filter(jplBody -> JplBody.Earth != jplBody)
                .collect(Collectors.toList());

        supportedBodiesInitialised = true;
    }

}
