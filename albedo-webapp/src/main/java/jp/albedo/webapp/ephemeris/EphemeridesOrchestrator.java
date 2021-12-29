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
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EphemeridesOrchestrator {

    private static final Log LOG = LogFactory.getLog(EphemeridesOrchestrator.class);

    @Autowired
    private JplEphemerisCalculator jplEphemerisCalculator;

    @Autowired
    private EphemeridesCalculatorProvider ephemeridesCalculatorProvider;

    @Autowired
    private JplBinaryKernelEphemerisCalculator jplBinaryKernelEphemerisCalculator;

    @Autowired
    private OrbitBasedEphemerisCalculator orbitBasedEphemerisCalculator;

    public ComputedEphemeris<SimpleEphemeris> computeSimple(String bodyName, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        EphemerisBodyParser ephemerisBodyParser = ephemeridesCalculatorProvider.getEphemerisBodyParser(ephemerisMethodPreference);
        Optional<BodyDetails> bodyDetailsOptional = ephemerisBodyParser.parse(bodyName);

        if (bodyDetailsOptional.isPresent()) {
            BodyDetails bodyDetails = bodyDetailsOptional.get();

            EphemeridesCalculator ephemeridesCalculator = ephemeridesCalculatorProvider.getEphemeridesCalculator(ephemerisMethodPreference);
            List<SimpleEphemeris> ephemerides = ephemeridesCalculator.computeSimple(bodyDetails, fromDate, toDate, interval);

            if (ephemerides.isEmpty()) {
                throw new EphemerisException("Calculator couldn't compute ephemeris for " + bodyDetails);
            }

            return new ComputedEphemeris<>(
                    bodyDetails,
                    ephemerides,
                    EphemerisMethod.binary440.description);
        }

        throw new EphemerisException("Body not found: " + bodyName);
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
    public ComputedEphemeris<Ephemeris> compute(String bodyName, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation, String ephemerisMethodPreference) throws Exception {

        if (EphemerisMethod.binary440.id.equals(ephemerisMethodPreference)) {
            final Optional<JplBody> jplSupportedBodyForBinarySpk = this.jplBinaryKernelEphemerisCalculator.parseBody(bodyName);
            if (jplSupportedBodyForBinarySpk.isPresent()) {
                final JplBody body = jplSupportedBodyForBinarySpk.get();

                LOG.info(String.format("Computing ephemerides for single body, params: [bodyName=%s, from=%s, to=%s, interval=%f], observer location: %s, ephemeris method: %s",
                        body, fromDate, toDate, interval, observerLocation, EphemerisMethod.binary440));

                return computeEphemerisUsingDe440(body, fromDate, toDate, interval, observerLocation);
            }
        }

        final Optional<JplBody> jplSupportedBody = this.jplEphemerisCalculator.parseBody(bodyName);
        if (jplSupportedBody.isPresent()) {
            final JplBody body = jplSupportedBody.get();

            LOG.info(String.format("Computing ephemerides for single body, params: [bodyName=%s, from=%s, to=%s, interval=%f], observer location: %s, ephemeris method: %s",
                    body, fromDate, toDate, interval, observerLocation, EphemerisMethod.ascii438));

            return computeEphemerisUsingAsciiSPK(body, fromDate, toDate, interval, observerLocation);
        }

        final Optional<OrbitingBodyRecord> orbitingBodyRecordOptional = this.orbitBasedEphemerisCalculator.findBody(bodyName);
        if (orbitingBodyRecordOptional.isPresent()) {
            final OrbitingBodyRecord orbitingBodyRecord = orbitingBodyRecordOptional.get();

            LOG.info(String.format("Computing ephemerides for single body, params: [bodyName=%s, from=%s, to=%s, interval=%f], observer location: %s, ephemeris method: %s",
                    orbitingBodyRecord.getBodyDetails().name, fromDate, toDate, interval, observerLocation, EphemerisMethod.JeanMeeus));

            return computeEphemerisUsingJeanMeeus(orbitingBodyRecord, fromDate, toDate, interval, observerLocation);
        }

        throw new EphemerisException("Body not found: " + bodyName);
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

    private ComputedEphemeris<Ephemeris> computeEphemerisUsingDe440(JplBody body, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation) throws IOException, JplException {
        final List<Ephemeris> ephemeris = this.jplBinaryKernelEphemerisCalculator.compute(body, fromDate, toDate, interval).parallelStream()
                .map(ParallaxCorrection.correctFor(observerLocation))
                .collect(Collectors.toList());

        return new ComputedEphemeris<>(body.toBodyDetails(), ephemeris, EphemerisMethod.binary440.description);
    }

    private ComputedEphemeris<Ephemeris> computeEphemerisUsingJeanMeeus(OrbitingBodyRecord orbitingBodyRecord, Double fromDate, Double toDate, double interval, ObserverLocation observerLocation) throws VSOPException {
        final List<Ephemeris> ephemeris = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval).parallelStream()
                .map(ParallaxCorrection.correctFor(observerLocation))
                .collect(Collectors.toList());
        return new ComputedEphemeris<>(orbitingBodyRecord.getBodyDetails(), ephemeris, orbitingBodyRecord.getOrbitElements(), orbitingBodyRecord.getMagnitudeParameters(), EphemerisMethod.JeanMeeus.description);
        //return new ComputedEphemeris(orbitingBodyRecord.getBodyDetails(), ephemerisList, ENGINE_JEAN_MEEUS);
    }
}
