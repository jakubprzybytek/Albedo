package jp.albedo.webapp.ephemeris.orbitbased;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.ephemeris.EllipticMotion;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.vsop87.VSOPException;
import jp.albedo.webapp.ephemeris.EphemeridesSolver;
import jp.albedo.webapp.ephemeris.EphemerisException;
import jp.albedo.webapp.ephemeris.EphemerisMethod;
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

@Component
public class OrbitBasedEphemerisSolver implements EphemeridesSolver {

    private static final Log LOG = LogFactory.getLog(OrbitBasedEphemerisSolver.class);

    private boolean supportedBodiesInitialised = false;

    private final Map<String, BodyDetails> byBodyName = new HashMap<>();

    private final Map<BodyDetails, OrbitingBodyRecord> byBodyDetails = new HashMap<>();

    private final Map<BodyType, List<BodyDetails>> byBodyType = Map.of(
            BodyType.Asteroid, new ArrayList<>(),
            BodyType.Comet, new ArrayList<>()
    );

    @Autowired
    private OrbitsService orbitsService;


    @Override
    public String getName() {
        return EphemerisMethod.JeanMeeus.description;
    }

    @Override
    public Optional<BodyDetails> parse(String bodyName) {
        if (!supportedBodiesInitialised) {
            loadSupportedBodyOrbits();
        }

        return Optional.ofNullable(byBodyName.get(bodyName));
    }

    @Override
    public List<BodyDetails> getBodiesByType(BodyType bodyType) {
        if (!supportedBodiesInitialised) {
            loadSupportedBodyOrbits();
        }

        return byBodyType.getOrDefault(bodyType, Collections.emptyList());
    }

    private Optional<OrbitingBodyRecord> findBody(BodyDetails bodyDetails) {
        if (!supportedBodiesInitialised) {
            loadSupportedBodyOrbits();
        }

        return Optional.ofNullable(byBodyDetails.get(bodyDetails));
    }

    @Override
    public SimpleEphemeris computeSimple(BodyDetails body, double jde, ObserverLocation observerLocation) throws EphemerisException {
        throw new UnsupportedOperationException("Not implemented yet!");
    }

    @Override
    public List<SimpleEphemeris> computeSimple(BodyDetails body, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException {
        throw new UnsupportedOperationException("Not implemented yet!");
    }

    @Override
    public Ephemeris compute(BodyDetails bodyDetails, double jde, ObserverLocation observerLocation) throws EphemerisException {
        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Solving ephemerides for observer on Earth based on orbit elements, params: [body: %s, jde=%s]", bodyDetails.name, jde));
        }

        final Instant start = Instant.now();

        final OrbitingBodyRecord orbitingBodyRecord = findBody(bodyDetails)
                .orElseThrow(() -> new EphemerisException("Cannot find orbit parameters for " + bodyDetails));

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Found orbit elements: %s", orbitingBodyRecord));
        }

        try {
            final Ephemeris ephemeris = EllipticMotion.compute(jde, orbitingBodyRecord.getMagnitudeParameters(), orbitingBodyRecord.getOrbitElements());

            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Calculated ephemeris in %s", Duration.between(start, Instant.now())));
            }

            return ephemeris;
        } catch (VSOPException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    @Override
    public List<Ephemeris> compute(BodyDetails bodyDetails, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException {
        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Solving ephemerides for observer on Earth based on orbit elements, params: [body: %s, from=%s, to=%s, interval=%.2f]", bodyDetails.name, fromDate, toDate, interval));
        }

        final Instant start = Instant.now();

        final OrbitingBodyRecord orbitingBodyRecord = findBody(bodyDetails)
                .orElseThrow(() -> new EphemerisException("Cannot find orbit parameters for " + bodyDetails));

        if (LOG.isDebugEnabled()) {
            LOG.debug(String.format("Found orbit elements: %s", orbitingBodyRecord));
        }

        try {
            final List<Double> JDEs = JulianDay.forRange(fromDate, toDate, interval);
            final List<Ephemeris> ephemerides = EllipticMotion.compute(JDEs, orbitingBodyRecord.getMagnitudeParameters(), orbitingBodyRecord.getOrbitElements());

            if (LOG.isDebugEnabled()) {
                LOG.debug(String.format("Calculated %d ephemerides in %s", ephemerides.size(), Duration.between(start, Instant.now())));
            }

            return ephemerides;
        } catch (NullPointerException | VSOPException e) {
            throw new EphemerisException("Cannot compute ephemeris for " + bodyDetails, e);
        }
    }

    private void loadSupportedBodyOrbits() {
        List.of(BodyType.Asteroid, BodyType.Comet)
                .forEach(bodyType ->
                        orbitsService.getByType(bodyType).stream()
                                .filter(orbitingBodyRecord -> orbitingBodyRecord.getOrbitElements().isOrbitElliptic())
                                .forEach(orbitingBodyRecord -> {
                                    byBodyName.put(orbitingBodyRecord.getBodyDetails().name, orbitingBodyRecord.getBodyDetails());
                                    byBodyDetails.put(orbitingBodyRecord.getBodyDetails(), orbitingBodyRecord);
                                    byBodyType.get(bodyType).add(orbitingBodyRecord.getBodyDetails());
                                })
                );

        supportedBodiesInitialised = true;
    }
}
