package jp.albedo.mpc;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.Epoch;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.ephemeris.common.OrbitElementsBuilder;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MPCORBFileLoader {

    final private static Pattern orbitPattern = Pattern.compile("^(\\w+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)\\s+([\\w.]+)(\\s+[\\w.\\-()]+){11}\\s+(\\w+)");

    public static List<MPCORBRecord> load(File sourceFile, int orbitsToLoad) throws IOException {

        final FileReader fileReader = new FileReader(sourceFile);

        int orbitRead = 0;
        List<MPCORBRecord> records = new ArrayList<>(orbitsToLoad);

        try (BufferedReader bufferedReader = new BufferedReader(fileReader)) {
            String line;
            // skip to data
            while ((line = bufferedReader.readLine()) != null && !line.contains("-----")) ;

            while (orbitRead < orbitsToLoad && (line = bufferedReader.readLine()) != null) {

                Optional<MPCORBRecord> recordOptional = parseOrbitLine(line);
                if (recordOptional.isPresent()) {
                    records.add(recordOptional.get());
                    orbitRead++;
                }
            }
        }

        return records;
    }

    protected static Optional<MPCORBRecord> parseOrbitLine(String line) {
        Matcher matcher = orbitPattern.matcher(line);

        if (matcher.find()) {
            final double meanAnomalyEpoch = unpackDate(matcher.group(4));
            final double meanAnomalyAtEpoch = Double.parseDouble(matcher.group(5));

            final double argumentOfPerihelion = Double.parseDouble(matcher.group(6));
            final double longitudeOfAscendingNode = Double.parseDouble(matcher.group(7));
            final double inclination = Double.parseDouble(matcher.group(8));

            final double eccentricity = Double.parseDouble(matcher.group(9));
            final double meanMotion = Double.parseDouble(matcher.group(10));
            final double semiMajorAxis = Double.parseDouble(matcher.group(11));

            final String bodyName = matcher.group(13);

            final OrbitElements orbitElements = new OrbitElementsBuilder()
                    .orbitShape(eccentricity, semiMajorAxis, meanMotion)
                    .orbitPosition(Epoch.J2000, argumentOfPerihelion, longitudeOfAscendingNode, inclination)
                    .bodyPosition(meanAnomalyEpoch, meanAnomalyAtEpoch)
                    .build();

            return Optional.of(new MPCORBRecord(new BodyDetails(bodyName), orbitElements));
        }

        return Optional.empty();
    }

    /**
     * Converts date in MCP's packed format into Julian day
     * See: https://www.minorplanetcenter.net/iau/info/PackedDates.html
     *
     * @param dateString
     * @return
     */
    protected static double unpackDate(String dateString) {
        final int year = (dateString.charAt(0) - 55) * 100 + Integer.parseInt(dateString.substring(1, 3));
        final char monthChar = dateString.charAt(3);
        final int month = monthChar - (monthChar < 58 ? 48 : 55);
        final char dayChar = dateString.charAt(4);
        final int day = dayChar - (dayChar < 58 ? 48 : 55);

        return JulianDay.fromDate(year, month, day);
    }

}