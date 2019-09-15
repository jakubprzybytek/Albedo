package jp.albedo.sandbox;

import jp.albedo.common.Angles;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.mpc.MPCORBFileLoader;
import jp.albedo.mpc.MPCORBRecord;
import jp.albedo.utils.StreamUtils;
import jp.albedo.vsop87.VSOPException;
import org.apache.commons.math3.util.Pair;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AsteroidsConjunctions {

    public static final double PRELIMINARY_INTERVAL = 1.0; // days

    public static final double DETAILED_SPAN = 2.0; // days

    public static final double DETAILED_INTERVAL = 1.0 / 24.0 / 6.0; // 10 mins

    public static void main(String args[]) throws VSOPException, IOException, URISyntaxException {
        final List<MPCORBRecord> orbits = MPCORBFileLoader.load(new File("d:/Workspace/Java/Albedo/misc/MPCORB.DAT"), 100);

        final double from = JulianDay.fromDate(2010, 1, 1.0);
        final double to = JulianDay.fromDate(2030, 12, 31.0);
        final List<Double> JDEs = JulianDay.forRange(from, to, PRELIMINARY_INTERVAL);

        System.out.printf("Time period from %.1f to %.1f%n", from, to);
        System.out.printf("Used memory: %dMB%n", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);

        long startTime = System.currentTimeMillis();

        // Compute ephemeris
        final List<BodyData> bodies = orbits.parallelStream()
                .map(mpcorbRecord -> new BodyData(mpcorbRecord.bodyDetails, mpcorbRecord.orbitElements))
                .peek(bodyData -> {
                    try {
                        bodyData.ephemerisList = EllipticMotion.compute(JDEs, bodyData.orbitElements);
                    } catch (VSOPException e) {
                        throw new RuntimeException("Zonk!");
                    }
                })
                .collect(Collectors.toList());

        System.out.printf("Used memory: %dMB%n", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
        System.out.printf("Computed %d ephemeris, time since start: %.1fs%n", bodies.size(), (System.currentTimeMillis() - startTime) / 1000.0);

        // Prepare structure for comparing bodies between each other
        List<BodyPair> bodiesToCompare = new ArrayList<>(bodies.size() * (bodies.size() - 1) / 2);
        for (int i = 0; i < bodies.size(); i++) {
            for (int j = i + 1; j < bodies.size(); j++) {
                bodiesToCompare.add(new BodyPair(bodies.get(i), bodies.get(j)));
            }
        }

        // Compare all bodies between each other
        List<BodyPair> bodiesWithSmallestSeparation = bodiesToCompare.parallelStream()
                .peek(bodiesPair -> {
                    Pair<Double, Double> minSeparation = findSmallestSeparation(bodiesPair.first.ephemerisList, bodiesPair.second.ephemerisList);
                    bodiesPair.jde = minSeparation.getFirst();
                    bodiesPair.separation = Math.toDegrees(minSeparation.getSecond());
                })
                .filter(bodiesPair -> bodiesPair.separation < 0.02)
                .peek(bodiesPair -> System.out.printf("Separation between %s and %s on %.1fTD: %.4f°%n",
                        bodiesPair.first.bodyDetails.name,
                        bodiesPair.second.bodyDetails.name,
                        bodiesPair.jde,
                        bodiesPair.separation))
                .collect(Collectors.toList());

        System.out.printf("Used memory: %dMB%n", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
        System.out.printf("Computed preliminary min separation for %d pairs of ehpemeris, time since start: %.1fs%n", bodiesToCompare.size(), (System.currentTimeMillis() - startTime) / 1000.0);

        // Find better separation details using ephemeris with better resolution
        bodiesWithSmallestSeparation.stream()
                .peek(bodiesPair -> {
                    final List<Double> localJDEs = JulianDay.forRange(
                            bodiesPair.jde - DETAILED_SPAN / 2.0,
                            bodiesPair.jde + DETAILED_SPAN / 2.0,
                            DETAILED_INTERVAL);
                    try {
                        bodiesPair.first.ephemerisList = EllipticMotion.compute(localJDEs, bodiesPair.first.orbitElements);
                        bodiesPair.second.ephemerisList = EllipticMotion.compute(localJDEs, bodiesPair.second.orbitElements);
                    } catch (VSOPException e) {
                        throw new RuntimeException("Zonk!");
                    }
                })
                .peek(bodiesPair -> {
                    Pair<Double, Double> minSeparation = findSmallestSeparation(bodiesPair.first.ephemerisList, bodiesPair.second.ephemerisList);
                    bodiesPair.jde = minSeparation.getFirst();
                    bodiesPair.separation = Math.toDegrees(minSeparation.getSecond());
                })
                .forEach(bodiesPair -> System.out.printf("Separation between %s and %s on %s TD: %.4f°%n",
                        bodiesPair.first.bodyDetails.name,
                        bodiesPair.second.bodyDetails.name,
                        JulianDay.toDateTime(bodiesPair.jde).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                        bodiesPair.separation));

        System.out.printf("Used memory: %dMB%n", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
        System.out.printf("Computed detailed min separation for %d pairs of ehpemeris, time since start: %.1fs%n", bodiesWithSmallestSeparation.size(), (System.currentTimeMillis() - startTime) / 1000.0);
    }

    private static Pair<Double, Double> findSmallestSeparation(List<Ephemeris> first, List<Ephemeris> second) {
        return StreamUtils.zip(first.stream(), second.stream(),
                (left, right) -> new Pair<>(left.jde, Angles.separation(left.coordinates, right.coordinates)))
                .reduce(new Pair(0.0, Double.MAX_VALUE),
                        (localMin, separationPair) -> separationPair.getSecond() < localMin.getSecond() ? separationPair : localMin);
    }

    private static Pair<Double, Double> findSmallestSeparationPrint(List<Ephemeris> first, List<Ephemeris> second) {
        return StreamUtils.zip(first.stream(), second.stream(),
                (left, right) -> new Pair<>(left.jde, Angles.separation(left.coordinates, right.coordinates)))
                .peek(pair -> System.out.printf("%.3f %.4f%n", pair.getFirst(), Math.toDegrees(pair.getSecond())))
                .reduce(new Pair(0.0, Double.MAX_VALUE),
                        (localMin, separationPair) -> separationPair.getSecond() < localMin.getSecond() ? separationPair : localMin);
    }

    private static class BodyData {

        public BodyDetails bodyDetails;

        public OrbitElements orbitElements;

        public List<Ephemeris> ephemerisList;

        public BodyData(BodyDetails bodyDetails, OrbitElements orbitElements) {
            this.bodyDetails = bodyDetails;
            this.orbitElements = orbitElements;
        }
    }

    private static class BodyPair {

        final public BodyData first;

        final public BodyData second;

        public double jde;

        public double separation;

        public BodyPair(BodyData first, BodyData second) {
            this.first = first;
            this.second = second;
        }
    }

}
