package jp.albedo.sandbox;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.math3.util.Pair;

import jp.albedo.common.Angles;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.mpc.MPCORBFileLoader;
import jp.albedo.mpc.MPCORBRecord;
import jp.albedo.utils.MixListsSupplier;
import jp.albedo.utils.StreamUtils;
import jp.albedo.vsop87.VSOPException;

public class AsteroidsConjunctionsCalculator {

  public static final double PRELIMINARY_INTERVAL = 1.0; // days

  public static final double DETAILED_SPAN = 2.0; // days

  public static final double DETAILED_INTERVAL = 1.0 / 24.0 / 6.0; // 10 mins

  public static List<Conjunction> calculate() throws VSOPException, IOException, URISyntaxException {
    final List<MPCORBRecord> orbits = MPCORBFileLoader.load(new File("d:/Workspace/Java/Albedo/misc/MPCORB.DAT"), 1000);

    final LocalDateTime fromUtc = LocalDateTime.now(ZoneId.of("UTC"));
    final LocalDateTime toUtc = fromUtc.plusYears(1);
    final double fromJde = JulianDay.fromDateTime(fromUtc);
    final double toJde = JulianDay.fromDateTime(toUtc);
    final List<Double> JDEs = JulianDay.forRange(fromJde, toJde, PRELIMINARY_INTERVAL);

    System.out.printf("Time period from %s (%.1f) to %s (%.1f)%n", fromUtc, fromJde, toUtc, toJde);
    System.out.printf("Used memory: %dMB%n",
        (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);

    long startTime = System.currentTimeMillis();

    // Compute ephemeris
    final List<BodyData> bodyEphemeries = orbits.parallelStream()
        .map(mpcorbRecord -> new BodyData(mpcorbRecord.bodyDetails, mpcorbRecord.orbitElements))
        .peek(bodyData -> {
          try {
            bodyData.ephemerisList = EllipticMotion.compute(JDEs, bodyData.orbitElements);
          } catch (VSOPException e) {
            throw new RuntimeException("Zonk!");
          }
        })
        .collect(Collectors.toList());

    System.out.printf("Used memory: %dMB%n",
        (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
    System.out.printf("Computed %d ephemeris, time since start: %.1fs%n", bodyEphemeries.size(),
        (System.currentTimeMillis() - startTime) / 1000.0);

    // Mix body data and generate all possible pairs
    List<Pair<BodyData, BodyData>> bodiesToCompare = Stream.generate(new MixListsSupplier<>(bodyEphemeries))
        .limit(bodyEphemeries.size() * (bodyEphemeries.size() - 1) / 2)
        .collect(Collectors.toList());

    // Compare all bodies between each other
    List<Conjunction> bodiesWithSmallestSeparation = bodiesToCompare.parallelStream()
        .map(AsteroidsConjunctionsCalculator::findConjunctions)
        .flatMap(List<Conjunction>::stream)
        .filter(bodiesPair -> bodiesPair.separation < Math.toRadians(0.02))
        .peek(conjunction -> System.out.printf("Separation between %s and %s on %.1fTD: %.4f°%n",
            conjunction.first.bodyDetails.name, conjunction.second.bodyDetails.name, conjunction.jde,
            Math.toDegrees(conjunction.separation)))
        .collect(Collectors.toList());

    System.out.printf("Used memory: %dMB%n",
        (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
    System.out.printf("Computed preliminary min separation for %d pairs of ehpemeris, time since start: %.1fs%n",
        bodiesToCompare.size(), (System.currentTimeMillis() - startTime) / 1000.0);

    // Find better separation details using ephemeris with better resolution
    List<Conjunction> conjunctions = bodiesWithSmallestSeparation.stream().map(conjunction -> {
      final List<Double> localJDEs = JulianDay.forRange(conjunction.jde - DETAILED_SPAN / 2.0,
          conjunction.jde + DETAILED_SPAN / 2.0, DETAILED_INTERVAL);
      try {
        conjunction.first.ephemerisList = EllipticMotion.compute(localJDEs, conjunction.first.orbitElements);
        conjunction.second.ephemerisList = EllipticMotion.compute(localJDEs, conjunction.second.orbitElements);
        return new Pair<>(conjunction.first, conjunction.second);
      } catch (VSOPException e) {
        throw new RuntimeException("Zonk!");
      }
    })
        .map(AsteroidsConjunctionsCalculator::findConjunctions)
        .flatMap(List<Conjunction>::stream)
        .sorted((c1, c2) -> Double.compare(c1.jde, c2.jde))
        .peek(bodiesPair -> System.out.printf("%s TD Conjunction between %s and %s with separation of: %.4f°%n",
            JulianDay.toDateTime(bodiesPair.jde).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            bodiesPair.first.bodyDetails.name, bodiesPair.second.bodyDetails.name,
            Math.toDegrees(bodiesPair.separation)))
        .collect(Collectors.toList());

    System.out.printf("Used memory: %dMB%n",
        (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / 1048576);
    System.out.printf("Computed detailed min separation for %d pairs of ehpemeris, time since start: %.1fs%n",
        bodiesWithSmallestSeparation.size(), (System.currentTimeMillis() - startTime) / 1000.0);

    return conjunctions;
  }

  protected static List<Conjunction> findConjunctions(Pair<BodyData, BodyData> bodiesPair) {

    return StreamUtils
        .zip(bodiesPair.getFirst().ephemerisList.stream(), bodiesPair.getSecond().ephemerisList.stream(),
            (leftEphemeris, rightEphemeris) -> new Pair<>(leftEphemeris, rightEphemeris))
        .collect(Collector.of(() -> new ConjunctionFind(), (findContext, ephemerisPair) -> {
          double separation = Angles.separation(ephemerisPair.getFirst().coordinates,
              ephemerisPair.getSecond().coordinates);
          if (separation > findContext.lastMinSeparation) {
            if (!findContext.addedLocalMin) {
              findContext.result.add(new Conjunction(findContext.lastJde, findContext.lastMinSeparation,
                  bodiesPair.getFirst(), bodiesPair.getSecond()));
              findContext.addedLocalMin = true;
            }
          } else {
            findContext.addedLocalMin = false;
          }
          findContext.lastMinSeparation = separation;
          findContext.lastJde = ephemerisPair.getFirst().jde;
        }, (findContext1, findContext2) -> {
          throw new RuntimeException("Cannot collect concurrent results");
        }, (findContext) -> findContext.result));
  }

  public static class BodyData {

    public BodyDetails bodyDetails;

    public OrbitElements orbitElements;

    public List<Ephemeris> ephemerisList;

    public BodyData(BodyDetails bodyDetails, OrbitElements orbitElements) {
      this.bodyDetails = bodyDetails;
      this.orbitElements = orbitElements;
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
