package jp.albedo.vsop87.files;

import jp.albedo.vsop87.Coefficients;
import jp.albedo.vsop87.VSOP87Coefficients;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VSOP87FilesLoader {

    static private Pattern variablePattern = Pattern.compile("VARIABLE (\\d)");

    static private Pattern coefficientPattern = Pattern.compile("([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+) $");

    //TODO: change param type to File
    static public VSOP87Coefficients load(String fileName) throws URISyntaxException, IOException {
        final URL coefficientsFileULR = VSOP87FilesLoader.class.getClassLoader().getResource(fileName);
        final Path coefficientFilePath = Paths.get(coefficientsFileULR.toURI());

        final List<List<Coefficients>> longitudeCoefficients = new LinkedList<>();
        final List<List<Coefficients>> latitudeCoefficients = new LinkedList<>();
        final List<List<Coefficients>> distanceCoefficients = new LinkedList<>();

        List<Coefficients> currentCoefficients = new LinkedList<>();

        final List<String> lines = Files.readAllLines(coefficientFilePath);

        for (String line : lines) {

            if (isHeaderLine(line)) {
                Matcher matcher = variablePattern.matcher(line);
                if (matcher.find()) {
                    final String variableNumberString = matcher.group(1);

                    currentCoefficients = new LinkedList<>();

                    switch (variableNumberString) {
                        case "1":
                            longitudeCoefficients.add(currentCoefficients);
                            break;
                        case "2":
                            latitudeCoefficients.add(currentCoefficients);
                            break;
                        case "3":
                            distanceCoefficients.add(currentCoefficients);
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
                    currentCoefficients.add(coefficients);
                }
            }
        }

        return new VSOP87Coefficients(longitudeCoefficients, latitudeCoefficients, distanceCoefficients);
    }

    static private boolean isHeaderLine(String line) {
        return line.contains("VSOP87");
    }
}
