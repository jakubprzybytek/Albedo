package jp.albedo.webapp.asteroidConjunctions;

import jp.albedo.common.Angles;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.utils.MixListsSupplier;
import jp.albedo.utils.StreamUtils;
import jp.albedo.vsop87.VSOPException;
import jp.albedo.webapp.external.BodyRecord;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class AsteroidConjunctionsCalculator {

    private static Log LOG = LogFactory.getLog(AsteroidConjunctionsCalculator.class);

    public static final double PRELIMINARY_INTERVAL = 1.0; // days

    public static final double DETAILED_SPAN = 2.0; // days

    public static final double DETAILED_INTERVAL = 1.0 / 24.0 / 6.0; // 10 mins

    public List<Conjunction> calculate(List<BodyRecord> bodies, LocalDate fromDate, LocalDate toDate) {

        LOG.info(String.format("Starting calculations, user params: [from=%s, to=%s], " +
                        "system params: [preliminaryInterval=%.2f days, detailedSpan=%.2f days, detailedInterval=%.5f days]",
                fromDate, toDate, PRELIMINARY_INTERVAL, DETAILED_SPAN, DETAILED_INTERVAL));

        final double fromJde = JulianDay.fromDateTime(fromDate);
        final double toJde = JulianDay.fromDateTime(toDate);
        final List<Double> JDEs = JulianDay.forRange(fromJde, toJde, PRELIMINARY_INTERVAL);

        Instant beforeEphemeris = Instant.now();

        // Compute ephemeris
        final List<BodyData> bodyEphemeries = bodies.parallelStream()
                .map(BodyData::new)
                .peek(bodyData -> {
                    try {
                        bodyData.ephemerisList = EllipticMotion.compute(JDEs, bodyData.bodyRecord.getMagnitudeParameters(), bodyData.bodyRecord.getOrbitElements());
                    } catch (VSOPException e) {
                        throw new RuntimeException("Zonk!");
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Computed %d ephemeris in %s", bodyEphemeries.size(), Duration.between(beforeEphemeris, Instant.now())));

        Instant beforeConjunctions = Instant.now();

        // Mix body data and generate all possible pairs
        List<Pair<BodyData, BodyData>> bodiesToCompare = Stream.generate(new MixListsSupplier<>(bodyEphemeries))
                .limit(bodyEphemeries.size() * (bodyEphemeries.size() - 1) / 2)
                .collect(Collectors.toList());

        // Compare all bodies between each other
        List<Conjunction> bodiesWithSmallestSeparation = bodiesToCompare.parallelStream()
                .map(this::findConjunctions)
                .flatMap(List<Conjunction>::stream)
                .filter(bodiesPair -> bodiesPair.separation < Math.toRadians(0.02))
                .peek(conjunction -> {
                    if (LOG.isDebugEnabled()) {
                        LOG.debug(String.format("Separation between %s and %s on %.1fTD: %.4f°",
                                conjunction.first.bodyRecord.getBodyDetails().name, conjunction.second.bodyRecord.getBodyDetails().name, conjunction.jde,
                                Math.toDegrees(conjunction.separation)));
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Compared %d pairs of ephemeris, found %d conjunctions in %s", bodiesToCompare.size(), bodiesWithSmallestSeparation.size(), Duration.between(beforeConjunctions, Instant.now())));

        Instant beforeDetailedConjunctions = Instant.now();

        // Find better separation details using ephemeris with better resolution
        List<Conjunction> conjunctions = bodiesWithSmallestSeparation.stream().map(conjunction -> {
            final List<Double> localJDEs = JulianDay.forRange(conjunction.jde - DETAILED_SPAN / 2.0,
                    conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL);
            try {
                conjunction.first.ephemerisList = EllipticMotion.compute(localJDEs, conjunction.first.bodyRecord.getMagnitudeParameters(), conjunction.first.bodyRecord.getOrbitElements());
                conjunction.second.ephemerisList = EllipticMotion.compute(localJDEs, conjunction.second.bodyRecord.getMagnitudeParameters(), conjunction.second.bodyRecord.getOrbitElements());
                return new Pair<>(conjunction.first, conjunction.second);
            } catch (VSOPException e) {
                throw new RuntimeException("Zonk!");
            }
        })
                .map(this::findConjunctions)
                .flatMap(List<Conjunction>::stream)
                .sorted((c1, c2) -> Double.compare(c1.jde, c2.jde))
                .peek(bodiesPair -> {
                    if (LOG.isDebugEnabled()) {
                        LOG.debug(String.format("%s TD Conjunction between %s and %s with separation of: %.4f°%n",
                                JulianDay.toDateTime(bodiesPair.jde).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                                bodiesPair.first.bodyRecord.getBodyDetails().name, bodiesPair.second.bodyRecord.getBodyDetails().name,
                                Math.toDegrees(bodiesPair.separation)));
                    }
                })
                .collect(Collectors.toList());

        LOG.info(String.format("Detailed %d conjunctions in %s", bodiesWithSmallestSeparation.size(), Duration.between(beforeDetailedConjunctions, Instant.now())));

        return conjunctions;
    }

    protected List<Conjunction> findConjunctions(Pair<BodyData, BodyData> bodiesPair) {

        return StreamUtils
                .zip(
                        bodiesPair.getFirst().ephemerisList.stream(),
                        bodiesPair.getSecond().ephemerisList.stream(),
                        (leftEphemeris, rightEphemeris) -> new Pair<>(leftEphemeris, rightEphemeris))
                .collect(Collector.of(
                        () -> new ConjunctionFind(),
                        (findContext, ephemerisPair) -> {
                            final double separation = Angles.separation(ephemerisPair.getFirst().coordinates, ephemerisPair.getSecond().coordinates);
                            if (separation > findContext.lastMinSeparation) {
                                if (!findContext.addedLocalMin) {
                                    findContext.result.add(new Conjunction(
                                            findContext.lastJde,
                                            findContext.lastMinSeparation,
                                            bodiesPair.getFirst(),
                                            bodiesPair.getSecond()));

                                    findContext.addedLocalMin = true;
                                }
                            } else {
                                findContext.addedLocalMin = false;
                            }
                            findContext.lastMinSeparation = separation;
                            findContext.lastJde = ephemerisPair.getFirst().jde;
                        },
                        (findContext1, findContext2) -> {
                            throw new RuntimeException("Cannot collect concurrent results");
                        },
                        (findContext) -> findContext.result));
    }

    public static class BodyData {

        public BodyRecord bodyRecord;

        public List<Ephemeris> ephemerisList;

        public BodyData(BodyRecord bodyRecord) {
            this.bodyRecord = bodyRecord;
        }

        protected BodyData(List<Ephemeris> ephemerisList) {
            this.ephemerisList = ephemerisList;
        }
    }

    public static class Conjunction {

        final public double jde;

        final public double separation;

        final public BodyData first;

        final public BodyData second;

        public Conjunction(double jde, double separation, BodyData first, BodyData second) {
            this.jde = jde;
            this.separation = separation;
            this.first = first;
            this.second = second;
        }
    }

    private static class ConjunctionFind {

        public double lastMinSeparation = Double.MAX_VALUE;

        public double lastJde;

        public boolean addedLocalMin;

        public List<Conjunction> result = new ArrayList<>();

    }

}
