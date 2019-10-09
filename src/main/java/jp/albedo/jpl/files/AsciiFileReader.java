package jp.albedo.jpl.files;

import jp.albedo.jpl.Constant;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AsciiFileReader {

    private static Log LOG = LogFactory.getLog(AsciiFileReader.class);

    protected Map<Constant, Double> constants;

    protected List<AsciiFileBodyCoefficientDescriptor> contentDescriptor;

    protected Map<Integer, Map<TimeSpan, XYZCoefficients>> coefficientsMap = new HashMap<>();

    public AsciiFileReader(List<AsciiFileBodyCoefficientDescriptor> contentDescriptor) {
        this.contentDescriptor = contentDescriptor;
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
                final TimeSpan blockTimeSpan = new TimeSpan(blockReader.read(), blockReader.read());

                for (int bodyIndex = 0; bodyIndex < this.contentDescriptor.size(); bodyIndex++) {

                    final AsciiFileBodyCoefficientDescriptor coefficientDescriptor = this.contentDescriptor.get(bodyIndex);

                    final List<TimeSpan> timeSpans = blockTimeSpan.splitTo(coefficientDescriptor.getSetsNumber());
                    for (TimeSpan timeSpan : timeSpans) {

                        if (bodyIndex != 12) {
                            final XYZCoefficients coefficients = new XYZCoefficients();
                            coefficients.x = blockReader.read(coefficientDescriptor.getCoefficientNumber());
                            coefficients.y = blockReader.read(coefficientDescriptor.getCoefficientNumber());
                            coefficients.z = blockReader.read(coefficientDescriptor.getCoefficientNumber());

                            if (!this.coefficientsMap.containsKey(bodyIndex)) {
                                this.coefficientsMap.put(bodyIndex, new HashMap<>());
                            }

                            this.coefficientsMap.get(bodyIndex).put(timeSpan, coefficients);
                        } else {
                            // body 12 has two coefficients. ignoring for now
                            blockReader.read(coefficientDescriptor.getCoefficientNumber());
                            blockReader.read(coefficientDescriptor.getCoefficientNumber());
                        }
                    }
                }
                blocksRead++;
            }
        }

        LOG.info(String.format("Loaded %d blocks of coefficients for %d bodies from %s in %s", blocksRead, this.coefficientsMap.size(), file.getPath(), Duration.between(start, Instant.now())));
    }

    public Map<TimeSpan, XYZCoefficients> getCoefficientsMapForIndex(int index) {
        return coefficientsMap.get(index);
    }

}
