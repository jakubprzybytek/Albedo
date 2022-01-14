package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.vsop87.VSOPException;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelEphemerisCalculator;
import jp.albedo.webapp.ephemeris.jpl.JplEphemerisCalculator;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisCalculator;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitingBodyRecord;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EphemeridesOrchestrator {

    private static final Log LOG = LogFactory.getLog(EphemeridesOrchestrator.class);

    @Autowired
    private JplEphemerisCalculator jplEphemerisCalculator;

    @Autowired
    private EphemeridesSolverProvider ephemeridesSolverProvider;

    @Autowired
    private JplBinaryKernelEphemerisCalculator jplBinaryKernelEphemerisCalculator;

    @Autowired
    private OrbitBasedEphemerisCalculator orbitBasedEphemerisCalculator;

    public ComputedEphemeris<SimpleEphemeris> computeSimple(String bodyName, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws EphemerisException {
        if (LOG.isInfoEnabled()) {
            LOG.info(String.format("Computing simple ephemerides, params: [body: %s, fromDate=%s, toDate=%s, interval=%s, observer=%s]", bodyName, fromDate, toDate, interval, observerLocation));
        }

        final EphemeridesSolver ephemeridesSolver = ephemeridesSolverProvider.getForBodyName(bodyName);
        final BodyDetails bodyDetails = ephemeridesSolver.parse(bodyName)
                .orElseThrow(() -> new EphemerisException("Body not found: " + bodyName));

        final List<SimpleEphemeris> ephemerides = ephemeridesSolver.computeSimple(bodyDetails, fromDate, toDate, interval, observerLocation);

        if (LOG.isInfoEnabled()) {
            LOG.info(String.format("Computed %d simple ephemerides using '%s' method", ephemerides.size(), ephemeridesSolver.getName()));
        }

        return new ComputedEphemeris<>(bodyDetails, ephemerides, ephemeridesSolver.getName());
    }

    /**
     * Computes ephemerides for a singly body given by name.
     * <p>
     * Different backend ephemerides calculators can be chosen depending on which can handle given body.
     *
     * @param bodyName         Name of body for which the ephemerides should be computed.
     * @param fromDate         Start of the time period for which ephemerides should be computed in Julian days.
     * @param toDate           End of the time period for which ephemerides should be computed in Julian days.
     * @param interval         Interval for computations in Julian days.
     * @param observerLocation Location of observer for parallax correction.
     */
    public ComputedEphemeris<Ephemeris> compute(String bodyName, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws EphemerisException {
        if (LOG.isInfoEnabled()) {
            LOG.info(String.format("Computing full ephemerides, params: [body: %s, fromDate=%s, toDate=%s, interval=%s, observer=%s]", bodyName, fromDate, toDate, interval, observerLocation));
        }

        final EphemeridesSolver ephemeridesSolver = ephemeridesSolverProvider.getForBodyName(bodyName);
        final BodyDetails bodyDetails = ephemeridesSolver.parse(bodyName)
                .orElseThrow(() -> new EphemerisException("Body not found: " + bodyName));

        final List<Ephemeris> ephemerides = ephemeridesSolver.compute(bodyDetails, fromDate, toDate, interval, observerLocation);

        if (LOG.isInfoEnabled()) {
            LOG.info(String.format("Computed %d full ephemerides using '%s' method", ephemerides.size(), ephemeridesSolver.getName()));
        }

        return new ComputedEphemeris<>(bodyDetails, ephemerides, ephemeridesSolver.getName());
    }

    /**
     * Computes ephemerides to all bodies of given type supported by known calculators.
     *
     * @param bodyType         Body type that determines for which objects ephemeris will be computed.
     * @param fromDate         Start of the time period for which ephemerides should be computed in Julian days.
     * @param toDate           End of the time period for which ephemerides should be computed in Julian days.
     * @param interval         Interval for computations in Julian days.
     * @param observerLocation Location of observer for parallax correction.
     * @return List of computed ephemerides.
     */
    public List<ComputedEphemeris<Ephemeris>> computeAllByType(BodyType bodyType, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws IOException, JplException {

        LOG.info(String.format("Computing ephemerides for multiple bodies, params: [bodyType=%s, from=%s, to=%s, interval=%f], ephemeris method preference: %s",
                bodyType, fromDate, toDate, interval, ephemerisMethodPreference));

        final Instant start = Instant.now();

        final List<ComputedEphemeris<Ephemeris>> ephemeridesList = new ArrayList<>();

        if (EphemerisMethod.binary440.id.equals(ephemerisMethodPreference)) {
            this.jplBinaryKernelEphemerisCalculator.getSupportedBodiesByType(bodyType).parallelStream()
                    .map(FunctionUtils.wrap(body -> computeEphemerisUsingAsciiSPK(body, fromDate, toDate, interval, observerLocation)))
                    .forEachOrdered(ephemeridesList::add);
        } else {
            this.jplEphemerisCalculator.getSupportedBodiesByType(bodyType).parallelStream()
                    .map(FunctionUtils.wrap(body -> computeEphemerisUsingAsciiSPK(body, fromDate, toDate, interval, observerLocation)))
                    .forEachOrdered(ephemeridesList::add);
        }

        this.orbitBasedEphemerisCalculator.getSupportedBodiesByType(bodyType).parallelStream()
                .filter(orbitingBodyRecord -> orbitingBodyRecord.getOrbitElements().isOrbitElliptic())
                .map(FunctionUtils.wrap(orbitingBodyRecord -> computeEphemerisUsingJeanMeeus(orbitingBodyRecord, fromDate, toDate, interval, observerLocation)))
                .forEachOrdered(ephemeridesList::add);

        LOG.info(String.format("Computed %d ephemerides in %s", ephemeridesList.size(), Duration.between(start, Instant.now())));

        return ephemeridesList;
    }

    private ComputedEphemeris<Ephemeris> computeEphemerisUsingAsciiSPK(JplBody body, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation) throws IOException, JplException {
        final List<Ephemeris> ephemeris = this.jplEphemerisCalculator.compute(body, fromDate, toDate, interval).parallelStream()
                .map(ParallaxCorrection.correctFor(observerLocation))
                .collect(Collectors.toList());

        return new ComputedEphemeris<>(body.toBodyDetails(), ephemeris, EphemerisMethod.ascii438.description);
    }

    private ComputedEphemeris<Ephemeris> computeEphemerisUsingJeanMeeus(OrbitingBodyRecord orbitingBodyRecord, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation) throws VSOPException {
        final List<Ephemeris> ephemeris = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval).parallelStream()
                .map(ParallaxCorrection.correctFor(observerLocation))
                .collect(Collectors.toList());
        return new ComputedEphemeris<>(orbitingBodyRecord.getBodyDetails(), ephemeris, orbitingBodyRecord.getOrbitElements(), orbitingBodyRecord.getMagnitudeParameters(), EphemerisMethod.JeanMeeus.description);
        //return new ComputedEphemeris(orbitingBodyRecord.getBodyDetails(), ephemerisList, ENGINE_JEAN_MEEUS);
    }
}
