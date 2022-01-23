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
import jp.albedo.jpl.ephemeris.impl.EphemeridesForEarthShadowCalculator;
import jp.albedo.jpl.ephemeris.impl.SimpleEphemeridesForEarthShadowCalculator;
import jp.albedo.jpl.ephemeris.impl.EphemeridesForSolarSystemBodiesCalculator;
import jp.albedo.jpl.ephemeris.impl.SimpleEphemeridesForSolarSystemBodiesCalculator;
import jp.albedo.jpl.ephemeris.impl.EphemeridesForSunCalculator;
import jp.albedo.webapp.ephemeris.EphemeridesSolver;
import jp.albedo.webapp.ephemeris.EphemerisException;
import jp.albedo.webapp.ephemeris.EphemerisMethod;
import jp.albedo.webapp.ephemeris.ParallaxCorrection;
import jp.albedo.webapp.ephemeris.SimpleEphemerisParallaxCorrection;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class BinaryKernelEphemeridesSolver implements EphemeridesSolver {

    private static final Log LOG = LogFactory.getLog(BinaryKernelEphemeridesSolver.class);

    private boolean supportedBodiesInitialised = false;

    private final Map<String, BodyDetails> byBodyName = new HashMap<>();

    private final Map<BodyDetails, JplBody> byBodyDetails = new HashMap<>();

    private final Map<BodyType, List<BodyDetails>> byBodyType = Map.of(
            BodyType.Planet, new ArrayList<>(),
            BodyType.NaturalSatellite, new ArrayList<>()
    );

    @Autowired
    private BinaryKernelsService binaryKernelsService;

    @Override
    public String getName() {
        return EphemerisMethod.binary440.description;
    }

    @Override
    public Optional<BodyDetails> parse(String bodyName) {
        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        return Optional.ofNullable(byBodyName.get(bodyName));
    }

    @Override
    public List<BodyDetails> getBodiesByType(BodyType bodyType) {
        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        return byBodyType.getOrDefault(bodyType, Collections.emptyList());
    }

    private Optional<JplBody> findBody(BodyDetails bodyDetails) {
        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        return Optional.ofNullable(byBodyDetails.get(bodyDetails));
    }

    @Override
    public SimpleEphemeris computeSimple(BodyDetails bodyDetails, double jde, ObserverLocation observerLocation) throws EphemerisException {
        try {
            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Solving ephemerides for observer on Earth, params: [body: %s, jde=%s]", bodyDetails.name, jde));
            }

            final Instant start = Instant.now();

            final EphemeridesCalculator<SimpleEphemeris> ephemeridesCalculator;
            if (BodyDetails.EARTH_SHADOW.equals(bodyDetails)) {
                ephemeridesCalculator = new SimpleEphemeridesForEarthShadowCalculator(binaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new SimpleEphemeridesForSolarSystemBodiesCalculator(binaryKernelsService.getSpKernel(), body);
            }

            final SimpleEphemeris ephemeris = SimpleEphemerisParallaxCorrection.correctFor(observerLocation)
                    .apply(ephemeridesCalculator.computeFor(jde));

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated ephemeris in %s", Duration.between(start, Instant.now())));
            }

            return ephemeris;
        } catch (JplException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    @Override
    public List<SimpleEphemeris> computeSimple(BodyDetails bodyDetails, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException {
        try {
            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Solving ephemerides for observer on Earth, params: [body: %s, from=%s, to=%s, interval=%.2f]", bodyDetails.name, fromDate, toDate, interval));
            }

            final Instant start = Instant.now();

            final EphemeridesCalculator<SimpleEphemeris> ephemeridesCalculator;
            if (BodyDetails.EARTH_SHADOW.equals(bodyDetails)) {
                ephemeridesCalculator = new SimpleEphemeridesForEarthShadowCalculator(binaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new SimpleEphemeridesForSolarSystemBodiesCalculator(binaryKernelsService.getSpKernel(), body);
            }

            final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
            final List<SimpleEphemeris> ephemerides = ephemeridesCalculator.computeFor(jdes).stream()
                    .map(SimpleEphemerisParallaxCorrection.correctFor(observerLocation))
                    .collect(Collectors.toList());

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated %d ephemerides in %s", ephemerides.size(), Duration.between(start, Instant.now())));
            }

            return ephemerides;
        } catch (JplException e) {
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
                ephemeridesCalculator = new EphemeridesForEarthShadowCalculator(binaryKernelsService.getSpKernel());
            } else if (BodyDetails.SUN.equals(bodyDetails)) {
                ephemeridesCalculator = new EphemeridesForSunCalculator(binaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new EphemeridesForSolarSystemBodiesCalculator(binaryKernelsService.getSpKernel(), body);
            }

            final Ephemeris uncorrectedEphemeris = ephemeridesCalculator.computeFor(jde);
            final Ephemeris ephemeris = ParallaxCorrection.correctFor(observerLocation).apply(uncorrectedEphemeris);

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated ephemeris in %s", Duration.between(start, Instant.now())));
            }

            return ephemeris;
        } catch (JplException e) {
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
                ephemeridesCalculator = new EphemeridesForEarthShadowCalculator(binaryKernelsService.getSpKernel());
            } else if (BodyDetails.SUN.equals(bodyDetails)) {
                ephemeridesCalculator = new EphemeridesForSunCalculator(binaryKernelsService.getSpKernel());
            } else {
                final JplBody body = findBody(bodyDetails).orElseThrow(() -> new EphemerisException("Cannot find JLP body for " + bodyDetails));
                ephemeridesCalculator = new EphemeridesForSolarSystemBodiesCalculator(binaryKernelsService.getSpKernel(), body);
            }

            final List<Double> jdes = JulianDay.forRange(fromDate, toDate, interval);
            final List<Ephemeris> ephemerides = ephemeridesCalculator.computeFor(jdes).stream()
                    .map(ParallaxCorrection.correctFor(observerLocation))
                    .collect(Collectors.toList());

            if (LOG.isDebugEnabled()) {
                LOG.info(String.format("Calculated %d ephemerides in %s", ephemerides.size(), Duration.between(start, Instant.now())));
            }

            return ephemerides;
        } catch (JplException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    private void loadSupportedBodies() {
        binaryKernelsService.getSpKernel().registeredBodiesStream()
                .filter(jplBody -> BodyType.NaturalSatellite == jplBody.bodyType || BodyType.Planet == jplBody.bodyType)
                .filter(jplBody -> JplBody.Earth != jplBody)
                .forEach(jplBody -> {
                    byBodyName.put(jplBody.name(), jplBody.toBodyDetails());
                    byBodyDetails.put(jplBody.toBodyDetails(), jplBody);
                    byBodyType.get(jplBody.bodyType).add(jplBody.toBodyDetails());
                });

        byBodyName.put(JplBody.Sun.name(), JplBody.Sun.toBodyDetails());
        byBodyDetails.put(JplBody.Sun.toBodyDetails(), JplBody.Sun);

        supportedBodiesInitialised = true;
    }

}
