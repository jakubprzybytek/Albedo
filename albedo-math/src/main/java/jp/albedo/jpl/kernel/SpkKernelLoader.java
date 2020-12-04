package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.SpkFileLoader;

import java.io.File;
import java.util.stream.Stream;

public class SpkKernelLoader {

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
        final SpkFileLoader loader = new SpkFileLoader(file);
        loader.loadAll(startJde, endJde)
                .forEach(kernel::registerSpkKernelRecord);
        return this;
    }

    public SpkKernelLoader load(Stream<SpkKernelRecord> spkRecords) {
        spkRecords.forEach(kernel::registerSpkKernelRecord);
        return this;
    }

    public SpkKernelRepository kernel() {
        return kernel;
    }

}
