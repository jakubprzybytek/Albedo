package jp.albedo.sandbox;

import jp.albedo.common.Angles;
import jp.albedo.common.Epoch;
import jp.albedo.common.JulianDate;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.ephemeris.common.OrbitElementsBuilder;
import jp.albedo.mpc.MPCORBFileLoader;
import jp.albedo.utils.StreamUtils;
import jp.albedo.vsop87.VSOPException;
import org.apache.commons.math3.util.Pair;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AsteroidsConjunctions {

    public static void main(String args[]) throws VSOPException, IOException, URISyntaxException {
        List<OrbitElements> orbits = MPCORBFileLoader.load(new File("d:/Workspace/Java/Albedo/misc/MPCORB.DAT"), 1000);

        final double from = JulianDate.fromDate(2010, 1, 1.0);
        final double to = JulianDate.fromDate(2030, 12, 31.0);
        List<Double> JDEs = JulianDate.forRange(from, to, 10.0);

        System.out.printf("Time period from %.1f to %.1f%n", from, to);

        System.out.printf("Used memory: %dMB%n", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);

        long startTime = System.currentTimeMillis();

        //List<List<Ephemeris>> ephemerisLists = new ArrayList<>();

//        for (OrbitElements orbitElements : orbits) {
//            List<Ephemeris> ephemerisList = EllipticMotion.compute(JDEs, orbitElements);
//            ephemerisLists.add(ephemerisList);
//        }

        //VSOP87Calculator.getEarthEclipticSphericalCoefficientsJ2000();

        final List<List<Ephemeris>> ephemerisLists = orbits.parallelStream()
                .map(orbitElements -> {
                    try {
                        return EllipticMotion.compute(JDEs, orbitElements);
                    } catch (VSOPException e) {
                        throw new RuntimeException("Zonk!");
                    }
                })
                .collect(Collectors.toList());

        System.out.printf("Used memory: %dMB%n", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
        System.out.printf("Time elapsed: %.1fs%n", (System.currentTimeMillis() - startTime) / 1000.0);

        List<Pair<List<Ephemeris>, List<Ephemeris>>> ephemerisToCompare = new ArrayList<>(ephemerisLists.size() * (ephemerisLists.size() - 1) / 2);

        for (int i = 0; i < ephemerisLists.size(); i++) {
            for (int j = i + 1; j < ephemerisLists.size(); j++) {
                ephemerisToCompare.add(new Pair<>(ephemerisLists.get(i), ephemerisLists.get(j)));
            }
        }

        ephemerisToCompare.parallelStream()
                .map(pair -> StreamUtils.zip(
                        pair.getFirst().stream(),
                        pair.getSecond().stream(),
                        (left, right) -> Angles.separation(left.coordinates, right.coordinates))
                        .reduce(Double.MAX_VALUE, (localMin, separation) -> Double.min(localMin, separation)))
                .map(Math::toDegrees)
                .filter(minSeparation -> minSeparation < 0.01)
                .peek(minSeparation -> System.out.printf("Separation: %.4f°%n", minSeparation))
                .collect(Collectors.toList());



        /*for (int i = 0; i < orbits.size(); i++) {
            for (int j = i + 1; j < orbits.size(); j++) {
                double minSeparation = StreamUtils.zip(
                        ephemerisLists.get(i).stream(),
                        ephemerisLists.get(j).stream(),
                        (left, right) -> Angles.separation(left.coordinates, right.coordinates))
                        .reduce(Double.MAX_VALUE, (localMin, separation) -> Double.min(localMin, separation));

                if (minSeparation < Math.toRadians(0.01)) {
                    System.out.printf("Minimal separtion between %d and %d: %.4f°%n", i, j, Math.toDegrees(minSeparation));
                }
            }
        }*/

        System.out.printf("Used memory: %dMB%n", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
        System.out.printf("Time elapsed: %.1fs%n", (System.currentTimeMillis() - startTime) / 1000.0);
    }

    public static void main2(String args[]) throws VSOPException {
        // https://www.minorplanetcenter.net/data
        OrbitElements ceresOrbitElementsMPC = new OrbitElementsBuilder()
                .orbitShape(0.0760091, 2.7691652, 0.21388522)
                .orbitPosition(Epoch.J2000, 73.59764, 80.30553, 10.59407)
                .bodyPosition(JulianDate.fromDate(2019, 4, 27.0), 77.37215)
                .build();

        OrbitElements junoOrbitElementsMPC = new OrbitElementsBuilder()
                .orbitShape(0.2569423, 2.6691496, 0.22601887)
                .orbitPosition(Epoch.J2000, 248.13861, 169.85274, 12.98892)
                .bodyPosition(JulianDate.fromDate(2019, 4, 27.0), 34.92503)
                .build();

        List<Double> JDEs = JulianDate.forRange(
                JulianDate.fromDate(2010, 1, 1.0),
                JulianDate.fromDate(2030, 12, 31.0),
                10.0);

        List<Ephemeris> ceresEphemerisList = EllipticMotion.compute(JDEs, ceresOrbitElementsMPC);
        List<Ephemeris> junoEphemerisList = EllipticMotion.compute(JDEs, junoOrbitElementsMPC);

        for (int i = 0; i < ceresEphemerisList.size(); i++) {
            Ephemeris ceresEphemeris = ceresEphemerisList.get(i);
            Ephemeris junoEphemeris = junoEphemerisList.get(i);
            double separation = Math.toDegrees(Angles.separation(ceresEphemeris.coordinates, junoEphemeris.coordinates));
            System.out.println(String.format("T=%.1f, Ceres:%s, Juno:%s, separation=%.4f°",
                    ceresEphemeris.jde, ceresEphemeris.coordinates, junoEphemeris.coordinates, separation));
        }
    }


}
