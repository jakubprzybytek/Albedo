package jp.albedo.jpl.files;

import jp.albedo.jpl.SPKernel;
import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;
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

public class DeAsciiFileReader {

    private static Log LOG = LogFactory.getLog(DeAsciiFileReader.class);

    protected List<BodyCoefficientDescriptor> contentDescriptor;

    protected Map<Integer, Map<TimeSpan, List<XYZCoefficients>>> coefficientsMap = new HashMap<>();

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
            while ((line = bufferedReader.readLine()) != null && !line.contains("GROUP   1050")) ;
            this.contentDescriptor = parseContentDescriptor1050(bufferedReader);
        }

        LOG.info(String.format("Loaded %d coefficient descriptors from %s in %s", this.contentDescriptor.size(), file.getPath(), Duration.between(start, Instant.now())));
    }

    private List<BodyCoefficientDescriptor> parseContentDescriptor1050(BufferedReader bufferedReader) throws IOException {
        // skip empty line
        bufferedReader.readLine();

        String[] startIndexes = bufferedReader.readLine().trim().split("\\s+");
        String[] coefficientNumbers = bufferedReader.readLine().trim().split("\\s+");
        String[] setsNumbers = bufferedReader.readLine().trim().split("\\s+");

        List<BodyCoefficientDescriptor> contentDescriptor = new ArrayList<>(startIndexes.length);

        for (int i = 0; i < startIndexes.length; i++) {
            contentDescriptor.add(new BodyCoefficientDescriptor(
                    Integer.parseInt(startIndexes[i]),
                    Integer.parseInt(coefficientNumbers[i]),
                    Integer.parseInt(setsNumbers[i])
            ));
        }

        return contentDescriptor;
    }

    /**
     * Loads ASCII formatted file with Chybyshev Polynomial Coefficients.
     *
     * @param file
     * @throws IOException
     */
    public void loadFile(File file) throws IOException {

        final Instant start = Instant.now();
        int blocksRead = 0;

        final FileReader fileReader = new FileReader(file);

        try (final BufferedReader bufferedReader = new BufferedReader(fileReader)) {
            String line;

            DoublesBlockReader blockReader = new DoublesBlockReader(bufferedReader);
            while ((line = bufferedReader.readLine()) != null && !line.isEmpty()) {
                // skip description
                final TimeSpan timeSpan = new TimeSpan(blockReader.readDouble(), blockReader.readDouble());

                for (int bodyIndex = 0; bodyIndex < this.contentDescriptor.size(); bodyIndex++) {

                    final BodyCoefficientDescriptor coefficientDescriptor = this.contentDescriptor.get(bodyIndex);

                    final List<XYZCoefficients> coefficientsSet = new ArrayList<>(coefficientDescriptor.getSetsNumber());
                    for (int setIndex = 0; setIndex < coefficientDescriptor.getSetsNumber(); setIndex++) {

                        if (bodyIndex != 12) {
                            final XYZCoefficients coefficients = new XYZCoefficients();
                            coefficients.x = blockReader.readDoubles(coefficientDescriptor.getCoefficientNumber());
                            coefficients.y = blockReader.readDoubles(coefficientDescriptor.getCoefficientNumber());
                            coefficients.z = blockReader.readDoubles(coefficientDescriptor.getCoefficientNumber());

                            coefficientsSet.add(coefficients);
                        } else {
                            // body 12 has two coefficients. ignoring for now
                            blockReader.readDoubles(coefficientDescriptor.getCoefficientNumber());
                            blockReader.readDoubles(coefficientDescriptor.getCoefficientNumber());
                        }
                    }

                    if (!this.coefficientsMap.containsKey(bodyIndex)) {
                        this.coefficientsMap.put(bodyIndex, new HashMap<>());
                    }

                    this.coefficientsMap.get(bodyIndex).put(timeSpan, coefficientsSet);
                }
                blocksRead++;
            }
        }

        LOG.info(String.format("Loaded %d blocks of coefficients for %d bodies from %s in %s", blocksRead, this.coefficientsMap.size(), file.getPath(), Duration.between(start, Instant.now())));
    }

    public SPKernel createSPKernel() {
        return new SPKernel(this.coefficientsMap);
    }

}
