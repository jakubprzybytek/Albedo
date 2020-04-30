package jp.albedo.vsop87.files;

import jp.albedo.vsop87.Coefficients;
import jp.albedo.vsop87.VSOP87Coefficients;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VSOP87FilesLoader {

    static private final Pattern variablePattern = Pattern.compile("VARIABLE (\\d)");

    static private final Pattern coefficientPattern = Pattern.compile("([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+) $");

    static public VSOP87Coefficients load(String fileName) throws URISyntaxException, IOException {

        final List<List<Coefficients>> longitudeCoefficients = new LinkedList<>();
        final List<List<Coefficients>> latitudeCoefficients = new LinkedList<>();
        final List<List<Coefficients>> distanceCoefficients = new LinkedList<>();

        final InputStream inputStream = VSOP87FilesLoader.class.getResourceAsStream(fileName);
        final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

        final List<Coefficients>[] currentCoefficients = new List[]{new LinkedList<>()};

        bufferedReader.lines().forEach((line) -> {
            if (isHeaderLine(line)) {
                Matcher matcher = variablePattern.matcher(line);
                if (matcher.find()) {
                    final String variableNumberString = matcher.group(1);

                    currentCoefficients[0] = new LinkedList<>();

                    switch (variableNumberString) {
                        case "1":
                            longitudeCoefficients.add(currentCoefficients[0]);
                            break;
                        case "2":
                            latitudeCoefficients.add(currentCoefficients[0]);
                            break;
                        case "3":
                            distanceCoefficients.add(currentCoefficients[0]);
                            break;
                    }
                }
            } else {
                Matcher matcher = coefficientPattern.matcher(line);
                if (matcher.find()) {
                    Coefficients coefficients = new Coefficients(
                            Double.parseDouble(matcher.group(1)),
                            Double.parseDouble(matcher.group(2)),
                            Double.parseDouble(matcher.group(3))
                    );
                    currentCoefficients[0].add(coefficients);
                }
            }
        });

        return new VSOP87Coefficients(longitudeCoefficients, latitudeCoefficients, distanceCoefficients);
    }

    static private boolean isHeaderLine(String line) {
        return line.contains("VSOP87");
    }
}
