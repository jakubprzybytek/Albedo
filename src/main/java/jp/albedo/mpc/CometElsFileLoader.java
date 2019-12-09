package jp.albedo.mpc;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.common.Epoch;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.ephemeris.common.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElementsBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CometElsFileLoader {


    private static Log LOG = LogFactory.getLog(CometElsFileLoader.class);

    public static List<MPCORBRecord> load(File sourceFile) throws IOException {

        final Instant start = Instant.now();

        try (final Stream<String> stream = Files.lines(Paths.get(sourceFile.toURI()))) {
            final List<MPCORBRecord> cometRecords = stream.map(CometElsFileLoader::parseCometLine)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());

            LOG.info(String.format("Loaded %d orbit details from %s in %s", cometRecords.size(), sourceFile.getPath(), Duration.between(start, Instant.now())));

            return cometRecords;
        }
    }

    static Optional<MPCORBRecord> parseCometLine(String line) {

        final int anomalyEpochYear = Integer.parseInt(line.substring(14, 18));
        final int anomalyEpochMonth = Integer.parseInt(line.substring(19, 21));
        final double anomalyEpochDay = Double.parseDouble(line.substring(22, 29));

        final double perihelionDistance = Double.parseDouble(line.substring(30, 39));
        final double eccentricity = Double.parseDouble(line.substring(41, 49));

        final double argumentOfPerihelion = Double.parseDouble(line.substring(51, 59));
        final double longitudeOfAscendingNode = Double.parseDouble(line.substring(61, 69));
        final double inclination = Double.parseDouble(line.substring(71, 79));

        final double absoluteMagnitude = Double.parseDouble(line.substring(91, 95));
        final double slopeParameter = Double.parseDouble(line.substring(96, 100));

        final String name = line.substring(102, 158).trim();

        final OrbitElements orbitElements = new OrbitElementsBuilder()
                .orbitShapeUsingPerihelionDistance(eccentricity, perihelionDistance)
                .orbitPosition(Epoch.J2000, argumentOfPerihelion, longitudeOfAscendingNode, inclination)
                .bodyPosition(JulianDay.fromDate(anomalyEpochYear, anomalyEpochMonth, anomalyEpochDay), 0.0) // FixMe: expected TD but provided TT
                .build();

        final MagnitudeParameters magnitudeParameters = new MagnitudeParameters(absoluteMagnitude, slopeParameter);

        return Optional.of(new MPCORBRecord(new BodyDetails(name, BodyType.Comet), magnitudeParameters, orbitElements));
    }
}
