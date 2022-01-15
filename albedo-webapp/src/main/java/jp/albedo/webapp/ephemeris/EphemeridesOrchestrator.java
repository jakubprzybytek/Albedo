package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.FunctionUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EphemeridesOrchestrator {

    private static final Log LOG = LogFactory.getLog(EphemeridesOrchestrator.class);

    @Autowired
    private EphemeridesSolverProvider ephemeridesSolverProvider;

    public ComputedEphemeris<SimpleEphemeris> computeSimple(String bodyName, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws EphemerisException {
        if (LOG.isInfoEnabled()) {
            LOG.info(String.format("Computing simple ephemerides, params: [body: %s, fromDate=%s, toDate=%s, interval=%s, observer=%s]", bodyName, fromDate, toDate, interval, observerLocation));
        }

        final Instant start = Instant.now();

        final EphemeridesSolver ephemeridesSolver = ephemeridesSolverProvider.getForBodyName(bodyName);
        final BodyDetails bodyDetails = ephemeridesSolver.parse(bodyName)
                .orElseThrow(() -> new EphemerisException("Body not found: " + bodyName));

        final List<SimpleEphemeris> ephemerides = ephemeridesSolver.computeSimple(bodyDetails, fromDate, toDate, interval, observerLocation);

        if (LOG.isInfoEnabled()) {
            LOG.info(String.format("Computed %d simple ephemerides using '%s' method in %s", ephemerides.size(), ephemeridesSolver.getName(), Duration.between(start, Instant.now())));
        }

        // Fixme: Loosing information about orbit and magnitude parameters
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

        final Instant start = Instant.now();

        final EphemeridesSolver ephemeridesSolver = ephemeridesSolverProvider.getForBodyName(bodyName);
        final BodyDetails bodyDetails = ephemeridesSolver.parse(bodyName)
                .orElseThrow(() -> new EphemerisException("Body not found: " + bodyName));

        final List<Ephemeris> ephemerides = ephemeridesSolver.compute(bodyDetails, fromDate, toDate, interval, observerLocation);

        if (LOG.isInfoEnabled()) {
            LOG.info(String.format("Computed %d full ephemerides using '%s' method in %s", ephemerides.size(), ephemeridesSolver.getName(), Duration.between(start, Instant.now())));
        }

        // Fixme: Loosing information about orbit and magnitude parameters
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
    public List<ComputedEphemeris<Ephemeris>> computeAllByType(BodyType bodyType, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws EphemerisException {

        LOG.info(String.format("Computing full ephemerides for multiple bodies, params: [bodyType=%s, from=%s, to=%s, interval=%f]",
                bodyType, fromDate, toDate, interval));

        final Instant start = Instant.now();

        List<ComputedEphemeris<Ephemeris>> computedEphemerides = ephemeridesSolverProvider.getForBodyType(bodyType).parallelStream()
                .flatMap(ephemeridesSolver ->
                        ephemeridesSolver.getBodiesByType(bodyType).parallelStream()
                                .map(FunctionUtils.wrap(bodyDetails -> {
                                    List<Ephemeris> ephemerides = ephemeridesSolver.compute(bodyDetails, fromDate, toDate, interval, observerLocation);
                                    // Fixme: Loosing information about orbit and magnitude parameters
                                    return new ComputedEphemeris<>(bodyDetails, ephemerides, ephemeridesSolver.getName());
                                }))
                )
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d ephemerides for %d bodies in %s",
                computedEphemerides.size() > 0 ? computedEphemerides.size() * computedEphemerides.get(0).getEphemerisList().size() : 0,
                computedEphemerides.size(),
                Duration.between(start, Instant.now())));

        return computedEphemerides;
    }

}
