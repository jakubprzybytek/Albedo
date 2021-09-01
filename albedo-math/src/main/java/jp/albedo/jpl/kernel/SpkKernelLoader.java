package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.SpkFileLoader;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

public class SpkKernelLoader {

    private static final Log LOG = LogFactory.getLog(SpkKernelLoader.class);

    private final SpkKernelRepository kernel = new SpkKernelRepository();

    private Double startJde;

    private Double endJde;

    /**
     * Defines date range for which SPK records will be read from SPK files.
     *
     * @param startJde Start date (TDB)
     * @param endJde   End date (TDB)
     * @return this loader.
     */
    public SpkKernelLoader forDateRange(double startJde, double endJde) {
        this.startJde = startJde;
        this.endJde = endJde;
        return this;
    }

    /**
     * Loads SPK Kernel Records from provided binary SPK file.
     * Only records that overlap with requested time span will be loaded.
     *
     * @param file File to load from. It needs to be binary SPK file.
     * @throws JplException If any error during file load occur.
     */
    public SpkKernelLoader load(File file) throws JplException {
        return load(file, Collections.emptyList());
    }

    /**
     * Loads SPK Kernel Records from provided binary SPK file.
     * Only records that overlap with requested time span will be loaded.
     *
     * @param file File to load from. It needs to be binary SPK file.
     * @throws JplException If any error during file load occur.
     */
    public SpkKernelLoader load(File file, List<JplBody> bodiesToLoad) throws JplException {

        LOG.info(String.format("Loading binary SPK kernel from file: '%s'", file));

        new SpkFileLoader(file).load(startJde, endJde, bodiesToLoad)
                .forEach(kernel::registerSpkKernelRecord);
        return this;
    }

    public SpkKernelLoader load(Stream<SpkKernelCollection> spkRecords) {
        spkRecords.forEach(kernel::registerSpkKernelRecord);
        return this;
    }

    public SpkKernelRepository kernel() {
        return kernel;
    }

}
