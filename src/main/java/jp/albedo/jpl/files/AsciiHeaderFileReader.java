package jp.albedo.jpl.files;

import jp.albedo.jpl.Constant;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AsciiHeaderFileReader {

    private static Log LOG = LogFactory.getLog(AsciiHeaderFileReader.class);

    private Map<Constant, Double> constants;

    private List<AsciiFileBodyCoefficientDescriptor> contentDescriptor;

    /**
     * Loads ASCII formatted header file.
     *
     * @param file
     * @throws IOException
     */
    public void loadHeaderFile(File file) throws IOException {

        final Instant start = Instant.now();

        final FileReader fileReader = new FileReader(file);

        try (final BufferedReader bufferedReader = new BufferedReader(fileReader)) {
            String line;
            // skip to data
            while ((line = bufferedReader.readLine()) != null && !line.contains("GROUP   1041")) ;
            constants = parseConstants(bufferedReader);

            while ((line = bufferedReader.readLine()) != null && !line.contains("GROUP   1050")) ;
            this.contentDescriptor = parseContentDescriptor1050(bufferedReader);
        }

        LOG.info(String.format("Loaded %d coefficient descriptors from %s in %s", this.contentDescriptor.size(), file.getPath(), Duration.between(start, Instant.now())));
    }

    private Map<Constant, Double> parseConstants(BufferedReader bufferedReader) throws IOException {
        bufferedReader.readLine();
        bufferedReader.readLine();

        Map<Constant, Double> constants = new HashMap<>();

        DoublesBlockReader doublesBlockReader = new DoublesBlockReader(bufferedReader);
        doublesBlockReader.read(9);
        constants.put(Constant.AU, doublesBlockReader.read());
        constants.put(Constant.EarthMoonMassRatio, doublesBlockReader.read());

        return constants;
    }

    private List<AsciiFileBodyCoefficientDescriptor> parseContentDescriptor1050(BufferedReader bufferedReader) throws IOException {
        // skip empty line
        bufferedReader.readLine();

        String[] startIndexes = bufferedReader.readLine().trim().split("\\s+");
        String[] coefficientNumbers = bufferedReader.readLine().trim().split("\\s+");
        String[] setsNumbers = bufferedReader.readLine().trim().split("\\s+");

        List<AsciiFileBodyCoefficientDescriptor> contentDescriptor = new ArrayList<>(startIndexes.length);

        for (int i = 0; i < startIndexes.length; i++) {
            contentDescriptor.add(new AsciiFileBodyCoefficientDescriptor(
                    Integer.parseInt(startIndexes[i]),
                    Integer.parseInt(coefficientNumbers[i]),
                    Integer.parseInt(setsNumbers[i])
            ));
        }

        return contentDescriptor;
    }

    public Map<Constant, Double> getConstants() {
        return constants;
    }

    public List<AsciiFileBodyCoefficientDescriptor> getContentDescriptor() {
        return contentDescriptor;
    }
}
